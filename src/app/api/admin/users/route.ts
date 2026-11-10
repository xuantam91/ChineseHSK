import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';
import { mockStore } from '@/lib/db/mock-store';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const enrollments = await db.getAllEnrollments();

    const anonymizedUsers = await Promise.all(
      enrollments.map(async (e) => {
        const profile = await db.getProfile(e.user_id);
        const todayOverview = await db.getTodayOverview(e);

        return {
          enrollment_id: e.id,
          user_id_short: `${e.user_id.substring(0, 8)}...`,
          age_group: profile?.age_group || 'adults',
          enrollment_date: e.start_date,
          status: e.status,
          target_minutes: e.target_minutes_per_day,
          completed_lessons: todayOverview.stats.completed_lessons,
          total_lessons: todayOverview.stats.total_required_lessons,
          completion_percentage: todayOverview.stats.completion_percentage,
          streak: todayOverview.streak,
        };
      })
    );

    return jsonSuccess(anonymizedUsers);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi tải danh sách học viên.');
  }
}
