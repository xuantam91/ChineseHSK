import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';
import { AdminLessonSchema } from '@/lib/validations';
import { Lesson } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    const validation = AdminLessonSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Thông tin bài học không hợp lệ.', validation.error.flatten());
    }

    const { id, curriculum_day_id, title, description, estimated_minutes, is_required, sort_order } =
      validation.data;

    const lessonRecord: Lesson = {
      id: id || `les-${Date.now().toString(36)}-${sort_order}`,
      curriculum_day_id,
      title,
      description: description || '',
      estimated_minutes: estimated_minutes ?? 20,
      is_required: is_required ?? true,
      sort_order: sort_order ?? 1,
    };

    const saved = await db.upsertLesson(lessonRecord);
    return jsonSuccess(saved, id ? 200 : 201);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi lưu bài học.');
  }
}
