import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';
import { mockStore } from '@/lib/db/mock-store';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const publishedVersion = await db.getPublishedProgramVersion();
    const allVersions = await db.getProgramVersions();
    const assets = await db.getAssets();
    const enrollments = await db.getAllEnrollments();
    const lessonsCount = mockStore.lessons.size;
    const daysCount = mockStore.curriculumDays.size;

    const brokenAssets = assets.filter(
      (a) => a.status === 'broken' || a.status === 'restricted'
    );

    return jsonSuccess({
      total_lessons: lessonsCount,
      total_days: daysCount,
      published_version: publishedVersion?.version_number ? String(publishedVersion.version_number) : 'Chưa xuất bản',
      total_versions: allVersions.length,
      total_assets: assets.length,
      broken_links_count: brokenAssets.length,
      active_students_count: enrollments.filter((e) => e.status === 'active').length,
      recent_import_jobs_count: mockStore.importJobs.size,
    });
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi tải thống kê quản trị.');
  }
}
