import { NextRequest, NextResponse } from 'next/server';
import { getExams, getQuestionsByModule, getQuestionGroupsByModule, getSubmissions } from '@/lib/db';
import { verifyJoseToken, verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get('moduleId');

  const token = req.cookies.get('caculus_token')?.value;
  let user = token ? await verifyJoseToken(token) : null;
  if (!user && token) {
    user = verifyToken(token);
  }

  const exams = getExams();
  const submissions = user ? getSubmissions(user.userId) : [];

  if (moduleId) {
    // Enforcement for trial account: max 1 exam & only the free trial exam
    if (user?.isTrial) {
      if (submissions.length >= (user.maxExams || 1)) {
        return NextResponse.json({
          exams,
          submissions,
          questions: [],
          questionGroups: [],
          error: 'Tài khoản dùng thử đã hoàn thành lượt thi miễn phí duy nhất',
          trialEnded: true,
        }, { status: 403 });
      }

      if (!moduleId.includes('de-thuc-chien-01')) {
        return NextResponse.json({
          exams,
          submissions,
          questions: [],
          questionGroups: [],
          error: 'Đề thi này yêu cầu tài khoản VIP. Bạn chỉ có thể làm Đề Thi Thử Miễn Phí.',
          isVipRequired: true,
        }, { status: 403 });
      }
    }

    const questions = getQuestionsByModule(moduleId);
    const questionGroups = getQuestionGroupsByModule(moduleId);

    return NextResponse.json({
      exams,
      submissions,
      questions,
      questionGroups,
    });
  }

  return NextResponse.json({
    exams,
    submissions,
  });
}
