// users.ts — In-memory user store (for local dev)
// TODO: Replace with Neon PostgreSQL + Prisma for production
// On Vercel serverless, this map resets on every cold start.
// For a persistent solution, use: https://neon.tech (free tier)

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  providerId: string;
  emailVerified: boolean;
  createdAt: string;
  credits: number;
}

// Default mock users for development
const defaultUsers: AppUser[] = [
  {
    uid: "mock-uid-1",
    email: "seeker@example.com",
    displayName: "Datta Sable",
    providerId: "password",
    emailVerified: true,
    createdAt: "2026-06-10T12:00:00Z",
    credits: 999
  },
  {
    uid: "mock-uid-2",
    email: "sarah.connor@gmail.com",
    displayName: "Sarah Connor",
    providerId: "google.com",
    emailVerified: true,
    createdAt: "2026-06-12T08:30:00Z",
    credits: 3
  },
  {
    uid: "mock-uid-3",
    email: "dev.john@github.com",
    displayName: "John Developer",
    providerId: "github.com",
    emailVerified: false,
    createdAt: "2026-06-14T14:45:00Z",
    credits: 10
  }
];

// In-memory store (persists within a single server instance lifecycle)
const usersStore = new Map<string, AppUser>(
  defaultUsers.map(u => [u.uid, u])
);

export function getAllUsers(): AppUser[] {
  return Array.from(usersStore.values());
}

export function getUserByUid(uid: string): AppUser | undefined {
  return usersStore.get(uid);
}

export function upsertUser(user: Partial<AppUser> & { uid: string; email: string }): AppUser {
  const existing = usersStore.get(user.uid);
  const updated: AppUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || existing?.displayName || 'Unnamed User',
    providerId: user.providerId || existing?.providerId || 'password',
    emailVerified: user.emailVerified !== undefined ? user.emailVerified : existing?.emailVerified ?? false,
    createdAt: existing?.createdAt || user.createdAt || new Date().toISOString(),
    credits: user.credits !== undefined ? user.credits : existing?.credits ?? 3,
  };
  usersStore.set(user.uid, updated);
  return updated;
}

export function updateCredits(uid: string, credits: number): AppUser | null {
  const user = usersStore.get(uid);
  if (!user) return null;
  const updated = { ...user, credits };
  usersStore.set(uid, updated);
  return updated;
}

// Token verification helper (reusable across API routes)
export async function verifyToken(
  authHeader: string | null,
  body: any = {}
): Promise<{ uid: string; email: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const mockEmail = body?.email;

  // Fallback: If Firebase is not configured or in local mock testing
  const isMockBypass =
    (!authHeader && mockEmail && process.env.NODE_ENV !== 'production') ||
    (!apiKey || apiKey === '' || apiKey.startsWith('your_'));

  if (isMockBypass) {
    return {
      uid: body?.uid || 'mock-uid',
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

    const data = (await response.json()) as any;
    const user = data.users?.[0];
    if (!user) return null;

    return { uid: user.localId, email: user.email || '' };
  } catch (err) {
    console.error('Token verification error:', err);
    return null;
  }
}

export function isAdmin(email: string): boolean {
  const e = email.toLowerCase();
  return e.includes('admin') || e === 'seeker@example.com';
}
