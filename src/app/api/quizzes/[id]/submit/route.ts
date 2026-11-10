import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireUser } from '@/lib/auth';
import { QuizSubmitSchema } from '@/lib/validations';
import { mockStore } from '@/lib/db/mock-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser(req);
    const { id: quizId } = await params;

    const enrollment = await db.getEnrollmentByUserId(user.id);
    if (!enrollment) {
      return jsonError(404, 'ENROLLMENT_NOT_FOUND', 'Người dùng chưa kích hoạt lộ trình học.');
    }

    const quiz = mockStore.quizzes.get(quizId);
    if (!quiz) {
      return jsonError(404, 'QUIZ_NOT_FOUND', 'Không tìm thấy bài kiểm tra.');
    }

    // Verify day is unlocked
    if (quiz.lesson_id) {
      const lesson = quiz.lesson_id ? await db.getLesson(quiz.lesson_id) : null;
      if (lesson) {
        const dayDetail = await db.getDayDetailForStudent(lesson.curriculum_day_id, enrollment);
        if (!dayDetail) {
          return jsonError(403, 'QUIZ_LOCKED', 'Bài kiểm tra này thuộc ngày học chưa được mở khóa.');
        }
      }
    }

    const body = await req.json();
    const validation = QuizSubmitSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Dữ liệu câu trả lời không hợp lệ.', validation.error.flatten());
    }

    const result = await db.gradeAndSubmitQuiz(enrollment.id, quizId, validation.data.answers);

    return jsonSuccess(result);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi chấm bài kiểm tra.');
  }
}
