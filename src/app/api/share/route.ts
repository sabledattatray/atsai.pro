import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const sql = getSQL();
    const body = await req.json();
    const reportId = Math.random().toString(36).substring(2, 10);

    await sql`
      INSERT INTO shared_reports (id, data)
      VALUES (${reportId}, ${JSON.stringify(body)})
    `;

    return NextResponse.json({ shareId: reportId });
  } catch (error: any) {
    console.error('Share POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
