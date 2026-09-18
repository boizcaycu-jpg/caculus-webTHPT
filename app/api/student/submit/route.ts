import { NextRequest, NextResponse } from 'next/server';
import { getQuestionsByModule, createSubmission } from '@/lib/db';
import { verifyJoseToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { examId, moduleId, userAnswersMap = {} } = body;

    const token = req.cookies.get('caculus_token')?.value;
    const userPayload = token ? await verifyJoseToken(token) : null;

    const questions = getQuestionsByModule(moduleId);
    let totalScore = 0;
    let correctCount = 0;

    questions.forEach((q) => {
      const userAns = userAnswersMap[q.id];

      // PHẦN I: Trắc nghiệm 4 lựa chọn (12 câu x 0.25đ = 3.0 điểm)
      if (q.partType === 'part1' || q.number <= 12) {
        const correctOpt = q.correctOptionId || 'opt-a';
        if (userAns === correctOpt || (typeof userAns === 'string' && userAns.toLowerCase() === correctOpt.toLowerCase())) {
          totalScore += 0.25;
          correctCount++;
        }
      }

      // PHẦN II: Trắc nghiệm Đúng/Sai (4 câu x 1.0đ = 4.0 điểm)
      else if (q.partType === 'part2' || (q.number >= 13 && q.number <= 16)) {
        if (typeof userAns === 'object' && userAns !== null) {
          let matchedStatements = 0;
          const tfItems = q.trueFalseItems || [
            { id: 'a', isTrue: true },
            { id: 'b', isTrue: false },
            { id: 'c', isTrue: true },
            { id: 'd', isTrue: false },
          ];

          tfItems.forEach((item) => {
            if (userAns[item.id] === item.isTrue) {
              matchedStatements++;
            }
          });

          // Thang điểm Bộ GD&ĐT quy định:
          // Đúng 1 ý: 0.1đ | Đúng 2 ý: 0.25đ | Đúng 3 ý: 0.5đ | Đúng 4 ý: 1.0đ
          if (matchedStatements === 1) totalScore += 0.1;
          else if (matchedStatements === 2) totalScore += 0.25;
          else if (matchedStatements === 3) totalScore += 0.5;
          else if (matchedStatements === 4) {
            totalScore += 1.0;
            correctCount++;
          }
        }
      }

      // PHẦN III: Trả lời ngắn / Điền số (6 câu x 0.5đ = 3.0 điểm)
      else if (q.partType === 'part3' || q.number >= 17) {
        if (typeof userAns === 'string' && userAns.trim() !== '') {
          const cleanUserAns = userAns.trim().replace(',', '.');
          const acceptableAnswers = (q.fillBlankAnswers || []).map((a) => a.trim().replace(',', '.'));

          if (acceptableAnswers.includes(cleanUserAns)) {
            totalScore += 0.5;
            correctCount++;
          }
        }
      }
    });

    const finalScore = Math.round(totalScore * 100) / 100;

    const submission = createSubmission({
      id: `sub-${Date.now()}`,
      examId,
      moduleId,
      userId: userPayload?.userId || 'guest-user',
      userName: userPayload?.name || userPayload?.realName || 'Thí sinh',
      studentId: userPayload?.studentId || 'THPTQG_2026',
      score: finalScore,
      totalQuestions: questions.length || 22,
      correctCount,
      answers: body.answers || [],
      submittedAt: new Date().toISOString(),
      antiCheatViolationCount: 0,
    });

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (e) {
    console.error('Submission error:', e);
    return NextResponse.json({ error: 'Lỗi chấm điểm hệ thống' }, { status: 500 });
  }
}
