import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const published = await db.getPublishedProgramVersion();
    const versionId = req.nextUrl.searchParams.get('version_id') || published?.id;

    if (!versionId) {
      return jsonError(404, 'VERSION_NOT_FOUND', 'Không tìm thấy phiên bản chương trình.');
    }

    const months = await db.getMonths(versionId);
    const tree = await Promise.all(
      months.map(async (m) => {
        const weeks = await db.getWeeks(m.id);
        const weeksWithDays = await Promise.all(
          weeks.map(async (w) => {
            const days = await db.getDays(w.id);
            const daysWithLessons = await Promise.all(
              days.map(async (d) => {
                const lessons = await db.getLessons(d.id);
                const lessonsWithBlocks = await Promise.all(
                  lessons.map(async (l) => {
                    const blocks = await db.getLessonBlocks(l.id);
                    return {
                      ...l,
                      blocks,
                    };
                  })
                );
                return {
                  ...d,
                  lessons: lessonsWithBlocks,
                };
              })
            );
            return {
              ...w,
              days: daysWithLessons,
            };
          })
        );
        return {
          ...m,
          weeks: weeksWithDays,
        };
      })
    );

    return jsonSuccess({
      version_id: versionId,
      months: tree,
    });
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi tải cây giáo trình.');
  }
}
