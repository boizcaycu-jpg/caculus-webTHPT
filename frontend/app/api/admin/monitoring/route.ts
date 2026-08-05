import { NextRequest, NextResponse } from 'next/server';
import { getAntiCheatLogs, getSubmissions } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('caculus_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }

  const user = verifyToken(token);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền truy cập Admin' }, { status: 403 });
  }

  const antiCheatLogs = getAntiCheatLogs();
  const submissions = getSubmissions();

  return NextResponse.json({ antiCheatLogs, submissions });
}
