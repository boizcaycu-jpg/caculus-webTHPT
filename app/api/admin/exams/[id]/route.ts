import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getExamById, updateExam, saveQuestionsForModule, getQuestionsByModule } from '@/lib/db';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function autoGitSync(examId: string, examTitle: string) {
  try {
    const cwd = process.cwd();
    const cleanTitle = examTitle.replace(/["'`\\]/g, '');
    const cmd = `git add . && git commit -m "feat(exams): auto-sync exam [${examId}] - ${cleanTitle} via Admin Editor" && git push origin main`;
    const { stdout } = await execPromise(cmd, { cwd });
    return { pushed: true, stdout };
  } catch (err: any) {
    console.warn('Auto git push info/skipped:', err.message);
    return { pushed: false, message: err.message };
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const exam = getExamById(id);
  if (!exam) {
    return NextResponse.json({ error: 'Không tìm thấy đề thi' }, { status: 404 });
  }

  const moduleId = exam.modules?.[0]?.id || `mod-${id}`;
  const questions = getQuestionsByModule(moduleId);

  return NextResponse.json({ exam, questions });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { moduleId, questions, ...updates } = body;

    const updatedExam = updateExam(id, updates);

    const modId = moduleId || updatedExam?.modules?.[0]?.id || `mod-${id}`;
    if (modId && Array.isArray(questions)) {
      saveQuestionsForModule(modId, questions);
    }

    // Aggressive Cache Busting
    revalidatePath('/exams');
    revalidatePath('/dashboard');
    revalidatePath('/admin/exams/editor');
    revalidatePath(`/exams/${id}`);
    revalidatePath(`/exams/${id}/room`);

    // Tự động Push lên GitHub & Vercel
    const syncResult = await autoGitSync(id, updatedExam?.title || body.title || id);

    return NextResponse.json({ success: true, exam: updatedExam, gitSync: syncResult });
  } catch (error) {
    console.error('Error updating exam/questions:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật đề thi' }, { status: 500 });
  }
}
