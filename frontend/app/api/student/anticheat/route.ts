import { NextRequest, NextResponse } from 'next/server';
import { logAntiCheatViolation } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('caculus_token')?.value;
    const user = token ? verifyToken(token) : null;

    const { examId, moduleId, eventType, details } = await req.json();

    const newLog = logAntiCheatViolation({
      id: 'ac-' + Date.now(),
      userId: user?.userId || 'anonymous',
      userName: user?.name || 'Thí sinh',
      studentId: user?.studentId || 'N/A',
      examId: examId || 'unknown',
      moduleId: moduleId || 'unknown',
      eventType: eventType || 'tab_switch',
      timestamp: new Date().toISOString(),
      details: details || 'Chuyển tab hoặc rời màn hình bài thi',
    });

    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    console.error('Anti-cheat log error:', error);
    return NextResponse.json({ error: 'Không thể ghi nhận vi phạm' }, { status: 500 });
  }
}
