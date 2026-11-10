import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const enrollment = await db.getEnrollmentByUserId(user.id);

    if (!enrollment) {
      return jsonError(404, 'ENROLLMENT_NOT_FOUND', 'Người dùng chưa kích hoạt lộ trình học nào.');
    }

    const todayOverview = await db.getTodayOverview(enrollment);
    return jsonSuccess(todayOverview);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi hệ thống khi tải bài học hôm nay.');
  }
}
