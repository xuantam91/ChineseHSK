import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser(req);
    const { id } = await params;

    const enrollment = await db.getEnrollmentByUserId(user.id);
    if (!enrollment) {
      return jsonError(404, 'ENROLLMENT_NOT_FOUND', 'Người dùng chưa kích hoạt lộ trình học.');
    }

    const lessonDetail = await db.getLessonDetailForStudent(id, enrollment);

    if (!lessonDetail) {
      const rawLesson = await db.getLesson(id);
      if (rawLesson) {
        return jsonError(
          403,
          'LESSON_LOCKED',
          'Bài học này thuộc ngày học chưa được mở khóa theo lịch trình của bạn.'
        );
      }
      return jsonError(404, 'LESSON_NOT_FOUND', 'Không tìm thấy bài học yêu cầu.');
    }

    return jsonSuccess(lessonDetail);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi tải nội dung bài học.');
  }
}
