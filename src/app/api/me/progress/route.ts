import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireUser } from '@/lib/auth';
import { mockStore } from '@/lib/db/mock-store';
import { ProgressResponse } from '@/types/api';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const enrollment = await db.getEnrollmentByUserId(user.id);

    if (!enrollment) {
      return jsonError(404, 'ENROLLMENT_NOT_FOUND', 'Người dùng chưa có lộ trình học nào.');
    }

    const todayOverview = await db.getTodayOverview(enrollment);

    // Retrieve quiz attempts history for this enrollment
    const attempts = Array.from(mockStore.quizAttempts.values()).filter(
      (a) => a.enrollment_id === enrollment.id
    );

    const quizHistory = attempts.map((a) => {
      const quiz = mockStore.quizzes.get(a.quiz_id);
      const lesson = quiz && quiz.lesson_id ? mockStore.lessons.get(quiz.lesson_id) : null;
      return {
        quiz_id: a.quiz_id,
        quiz_title: quiz?.title || 'Bài kiểm tra',
        lesson_title: lesson?.title || 'Bài học',
        attempt_no: a.attempt_no,
        score: a.score,
        passed: a.passed,
        submitted_at: a.submitted_at,
      };
    });

    const response: ProgressResponse = {
      enrollment,
      total_required_lessons: todayOverview.stats.total_required_lessons,
      completed_lessons: todayOverview.stats.completed_lessons,
      completion_percentage: todayOverview.stats.completion_percentage,
      quiz_history: quizHistory,
      streak: todayOverview.streak,
      backlog_count: todayOverview.overdue_days.length,
    };

    return jsonSuccess(response);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi tải tiến độ học.');
  }
}
