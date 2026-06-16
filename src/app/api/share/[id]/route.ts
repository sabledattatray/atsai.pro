import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sql = getSQL();
    const { id } = await params;
    const rows = await sql`
      SELECT data FROM shared_reports WHERE id = ${id} LIMIT 1
    `;

    if (rows[0]) {
      return NextResponse.json(rows[0].data);
    }
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Share GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
