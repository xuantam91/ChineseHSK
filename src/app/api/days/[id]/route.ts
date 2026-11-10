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

    const dayDetail = await db.getDayDetailForStudent(id, enrollment);

    if (!dayDetail) {
      // Day is either not found or locked by schedule!
      const rawDay = await db.getDay(id);
      if (rawDay) {
        return jsonError(
          403,
          'DAY_LOCKED',
          `Ngày học này chưa được mở khóa theo lịch trình cá nhân của bạn (Ngày mở dự kiến: offset ${rawDay.unlock_offset_days} ngày).`
        );
      }
      return jsonError(404, 'DAY_NOT_FOUND', 'Không tìm thấy ngày học yêu cầu.');
    }

    return jsonSuccess(dayDetail);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi tải chi tiết ngày học.');
  }
}
