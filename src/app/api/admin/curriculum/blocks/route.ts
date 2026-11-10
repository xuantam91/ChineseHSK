import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';
import { AdminBlockSchema } from '@/lib/validations';
import { LessonBlock } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    const validation = AdminBlockSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Thông tin khối nội dung không hợp lệ.', validation.error.flatten());
    }

    const { id, lesson_id, type, payload_jsonb, sort_order, is_required, estimated_minutes } =
      validation.data;

    const blockRecord: LessonBlock = {
      id: id || `blk-${Date.now().toString(36)}-${sort_order}`,
      lesson_id,
      type,
      payload_jsonb,
      sort_order: sort_order ?? 1,
      is_required: is_required ?? true,
      estimated_minutes: estimated_minutes ?? 5,
    };

    const saved = await db.upsertBlock(blockRecord);
    return jsonSuccess(saved, id ? 200 : 201);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi lưu khối nội dung bài học.');
  }
}
