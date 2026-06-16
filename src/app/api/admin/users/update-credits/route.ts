import { NextRequest, NextResponse } from 'next/server';
import { updateCredits, verifyToken, isAdmin } from '@/lib/users';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get('authorization');
    const sessionUser = await verifyToken(authHeader, body);

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing session token.' }, { status: 401 });
    }

    if (!isAdmin(sessionUser.email)) {
      return NextResponse.json({ error: 'Forbidden: Admin privilege required.' }, { status: 403 });
    }

    const { uid, credits } = body;
    if (!uid || credits === undefined) {
      return NextResponse.json({ error: 'UID and credits are required.' }, { status: 400 });
    }

    const updated = updateCredits(uid, parseInt(credits, 10));
    if (updated) {
      return NextResponse.json({ success: true, message: 'Credits updated successfully', user: updated });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
