import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';
import { AdminDaySchema } from '@/lib/validations';
import { CurriculumDay } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    const validation = AdminDaySchema.safeParse(body);
    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Thông tin ngày học không hợp lệ.', validation.error.flatten());
    }

    const { id, curriculum_week_id, day_index, day_type, title, estimated_minutes, unlock_offset_days, is_required, sort_order } =
      validation.data;

    const dayRecord: CurriculumDay = {
      id: id || `day-${Date.now().toString(36)}-${day_index}`,
      curriculum_week_id,
      day_index,
      day_type,
      title,
      estimated_minutes: estimated_minutes ?? 30,
      unlock_offset_days,
      is_required: is_required ?? true,
      sort_order: sort_order ?? day_index,
    };

    const saved = await db.upsertDay(dayRecord);
    return jsonSuccess(saved, id ? 200 : 201);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi lưu ngày học.');
  }
}
