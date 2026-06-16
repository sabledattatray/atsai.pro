import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, verifyToken, isAdmin } from '@/lib/users';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = await verifyToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing session token.' }, { status: 401 });
    }

    if (!isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden: Admin privilege required.' }, { status: 403 });
    }

    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
