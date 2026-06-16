import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserByUid, upsertUser } from '@/lib/users';

/**
 * GET /api/user/profile
 * Retrieves the profile (including current credits) of the logged-in user from Neon.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const sessionUser = await verifyToken(authHeader);

    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing session token.' },
        { status: 401 }
      );
    }

    let user = await getUserByUid(sessionUser.uid);
    
    // Auto-create user profile in PostgreSQL if they exist in Firebase but not in DB yet
    if (!user) {
      user = await upsertUser({
        uid: sessionUser.uid,
        email: sessionUser.email,
        displayName: sessionUser.email.split('@')[0] || 'User',
        providerId: 'password',
        emailVerified: false,
        credits: 3 // Default sign-up credits
      });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    console.error('Error fetching user profile:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/user/profile
 * Explicitly syncs/upserts user profile details (e.g. displayName, emailVerified)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get('authorization');
    const sessionUser = await verifyToken(authHeader, body);

    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing session token.' },
        { status: 401 }
      );
    }

    const { uid, email, displayName, providerId, emailVerified, createdAt, credits } = body;

    // Ensure users can only modify their own profile
    if (sessionUser.uid !== uid) {
      return NextResponse.json(
        { error: 'Forbidden: Cannot modify another user profile.' },
        { status: 403 }
      );
    }

    const updated = await upsertUser({
      uid,
      email,
      displayName,
      providerId,
      emailVerified,
      createdAt,
      credits
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Error syncing user profile:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
