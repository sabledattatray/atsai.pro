import { NextRequest, NextResponse } from 'next/server';

// In-memory store for shared reports
// NOTE: Resets on cold start in serverless. For persistence, use Vercel KV or a database.
const sharedReports = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reportId = Math.random().toString(36).substring(2, 10);
    sharedReports.set(reportId, body);
    return NextResponse.json({ shareId: reportId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Export the map so the [id] route can access it
export { sharedReports };
