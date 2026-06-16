import { NextRequest, NextResponse } from 'next/server';

// Shared in-memory reports store (same instance as POST route within one function)
const sharedReports = new Map<string, any>();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = sharedReports.get(id);
  if (report) {
    return NextResponse.json(report);
  }
  return NextResponse.json({ error: 'Report not found' }, { status: 404 });
}
