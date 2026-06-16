// users.ts — Neon PostgreSQL-backed user store
// All operations are async and go directly to Neon via the HTTP transport.

import { getSQL } from '@/lib/db';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  providerId: string;
  emailVerified: boolean;
  createdAt: string;
  credits: number;
}

// -----------------------------------------------------------------
// Internal row → AppUser mapper
// -----------------------------------------------------------------
function rowToUser(row: Record<string, unknown>): AppUser {
  return {
    uid: row.uid as string,
    email: row.email as string,
    displayName: (row.display_name as string) || 'Unnamed User',
    providerId: (row.provider_id as string) || 'password',
    emailVerified: Boolean(row.email_verified),
    createdAt: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at),
    credits: Number(row.credits ?? 3),
  };
}

// -----------------------------------------------------------------
// CRUD helpers
// -----------------------------------------------------------------

export async function getAllUsers(): Promise<AppUser[]> {
  const sql = getSQL();
  const rows = await sql`SELECT * FROM users ORDER BY created_at DESC`;
  return rows.map(rowToUser);
}

export async function getUserByUid(uid: string): Promise<AppUser | undefined> {
  const sql = getSQL();
  const rows = await sql`SELECT * FROM users WHERE uid = ${uid} LIMIT 1`;
  return rows[0] ? rowToUser(rows[0]) : undefined;
}

export async function upsertUser(
  user: Partial<AppUser> & { uid: string; email: string }
): Promise<AppUser> {
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO users (uid, email, display_name, provider_id, email_verified, created_at, credits)
    VALUES (
      ${user.uid},
      ${user.email},
      ${user.displayName || 'Unnamed User'},
      ${user.providerId || 'password'},
      ${user.emailVerified ?? false},
      ${user.createdAt ? new Date(user.createdAt) : new Date()},
      ${user.credits ?? 3}
    )
    ON CONFLICT (uid) DO UPDATE SET
      email          = EXCLUDED.email,
      display_name   = COALESCE(EXCLUDED.display_name, users.display_name),
      provider_id    = COALESCE(EXCLUDED.provider_id, users.provider_id),
      email_verified = EXCLUDED.email_verified,
      credits        = CASE
                         WHEN EXCLUDED.credits IS NOT NULL THEN EXCLUDED.credits
                         ELSE users.credits
                       END
    RETURNING *
  `;
  return rowToUser(rows[0]);
}

export async function updateCredits(uid: string, credits: number): Promise<AppUser | null> {
  const sql = getSQL();
  const rows = await sql`
    UPDATE users SET credits = ${credits} WHERE uid = ${uid} RETURNING *
  `;
  return rows[0] ? rowToUser(rows[0]) : null;
}

export async function decrementCredits(uid: string, amount = 1): Promise<AppUser | null> {
  const sql = getSQL();
  const rows = await sql`
    UPDATE users
    SET credits = GREATEST(0, credits - ${amount})
    WHERE uid = ${uid}
    RETURNING *
  `;
  return rows[0] ? rowToUser(rows[0]) : null;
}

// -----------------------------------------------------------------
// Token verification helper (reusable across API routes)
// -----------------------------------------------------------------
export async function verifyToken(
  authHeader: string | null,
  body: Record<string, unknown> = {}
): Promise<{ uid: string; email: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const mockEmail = body?.email as string | undefined;

  // Fallback: If Firebase is not configured or in local mock testing
  const isMockBypass =
    (!authHeader && mockEmail && process.env.NODE_ENV !== 'production') ||
    (!apiKey || apiKey === '' || (apiKey as string).startsWith('your_'));

  if (isMockBypass) {
    return {
      uid: (body?.uid as string) || 'mock-uid',
      email: String(mockEmail || 'seeker@example.com'),
    };
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!response.ok) return null;

    const data = (await response.json()) as { users?: { localId: string; email: string }[] };
    const user = data.users?.[0];
    if (!user) return null;

    return { uid: user.localId, email: user.email || '' };
  } catch (err) {
    console.error('Token verification error:', err);
    return null;
  }
}

export function isAdmin(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || 'seeker@example.com')
    .split(',')
    .map(e => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}
