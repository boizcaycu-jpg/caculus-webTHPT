import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getExams, createExam, updateExam, deleteExam, saveQuestionsForModule, saveQuestionGroupsForModule } from '@/lib/db';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Hàm tự động Push lên GitHub để Vercel tự động build & deploy
async function autoGitSync(examTitle: string) {
  try {
    const cwd = process.cwd();
    const cleanTitle = examTitle.replace(/["'`\\]/g, '');
    const cmd = `git add . && git commit -m "feat(exams): auto-sync exam [${cleanTitle}] via Admin Editor" && git push origin main`;
    const { stdout } = await execPromise(cmd, { cwd });
    return { pushed: true, stdout };
  } catch (err: any) {
    console.warn('Auto git push info/skipped (might be offline or no git remote):', err.message);
    return { pushed: false, message: err.message };
  }
}

export async function GET(req: NextRequest) {
  const exams = getExams();
  return NextResponse.json({ exams });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newId = body.id || 'exam-' + Date.now();
    const isPub = body.isPublished ?? true;
    const stat = body.status || (isPub ? 'ĐÃ UPDATE' : 'CHƯA UPDATE');

    const newExam = createExam({
      id: newId,
      title: body.title,
      description: body.description || '',
      isFree: body.isFree ?? true,
      isDemoExam: body.isDemoExam ?? false,
      isPublished: isPub,
      category: body.category || 'THỰC CHIẾN',
      subCategory: body.subCategory || 'math',
      status: stat,
      price: body.price || 0,
      modules: body.modules || [],
      createdAt: new Date().toISOString(),
    });

    // Lưu các câu hỏi đi kèm nếu có
    if (body.modules?.[0]?.id && Array.isArray(body.questions)) {
      saveQuestionsForModule(body.modules[0].id, body.questions);
    }

    revalidatePath('/exams');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/exams');
    revalidatePath('/admin/exams');

    // Tự động Push lên GitHub & Vercel
    const syncResult = await autoGitSync(body.title || 'THPTQG Math Exam');

    return NextResponse.json({
      success: true,
      exam: newExam,
      gitSync: syncResult,
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ error: 'Lỗi tạo đề thi' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, moduleId, questions, questionGroups, ...updates } = body;

    let updatedExam = null;
    if (id) {
      updatedExam = updateExam(id, updates);
    }

    if (moduleId && Array.isArray(questions)) {
      saveQuestionsForModule(moduleId, questions);
    }

    if (moduleId && Array.isArray(questionGroups)) {
      saveQuestionGroupsForModule(moduleId, questionGroups);
    }

    revalidatePath('/exams');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/exams');
    revalidatePath('/admin/exams');
    if (id) {
      revalidatePath(`/exams/${id}`);
      revalidatePath(`/exams/${id}/room`);
    }

    // Tự động Push lên GitHub & Vercel
    const syncResult = await autoGitSync(updatedExam?.title || 'Updated Exam');

    return NextResponse.json({
      success: true,
      exam: updatedExam,
      gitSync: syncResult,
    });
  } catch (error) {
    console.error('Error updating exam/questions:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật đề thi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Thiếu ID bài thi' }, { status: 400 });
  }

  const success = deleteExam(id);

  revalidatePath('/exams');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/exams');
  revalidatePath('/admin/exams');

  // Tự động Push lên GitHub & Vercel
  await autoGitSync(`Deleted Exam ${id}`);

  return NextResponse.json({ success });
}
