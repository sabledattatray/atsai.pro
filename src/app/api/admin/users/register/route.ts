import { NextRequest, NextResponse } from 'next/server';
import { upsertUser, verifyToken, isAdmin } from '@/lib/users';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get('authorization');
    const sessionUser = await verifyToken(authHeader, body);

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing session token.' }, { status: 401 });
    }

    const { uid, email, displayName, providerId, emailVerified, createdAt, credits } = body;

    // Ensure users can only register/update their own profile unless admin
    if (sessionUser.uid !== uid && !isAdmin(sessionUser.email)) {
      return NextResponse.json({ error: 'Forbidden: Cannot modify another user profile.' }, { status: 403 });
    }

    if (!uid || !email) {
      return NextResponse.json({ error: 'UID and Email are required.' }, { status: 400 });
    }

    const updated = upsertUser({ uid, email, displayName, providerId, emailVerified, createdAt, credits });
    return NextResponse.json({ success: true, message: 'User synchronized successfully', user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
