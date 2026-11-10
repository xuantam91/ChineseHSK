import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireUser } from '@/lib/auth';
import { EnrollmentSchema } from '@/lib/validations';
import { Enrollment } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();

    const validation = EnrollmentSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Thông tin đăng ký không hợp lệ.', validation.error.flatten());
    }

    const { program_version_id, start_date, timezone, target_minutes_per_day } = validation.data;

    // Check if user already has an active enrollment
    const existing = await db.getEnrollmentByUserId(user.id);

    const enrollment: Enrollment = {
      id: existing ? existing.id : `enr-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      user_id: user.id,
      program_version_id,
      start_date,
      timezone: timezone || 'Asia/Ho_Chi_Minh',
      status: 'active',
      target_minutes_per_day: target_minutes_per_day || 30,
      paused_at: existing ? existing.paused_at : null,
      pause_total_days: existing ? existing.pause_total_days : 0,
      created_at: existing ? existing.created_at : new Date().toISOString(),
    };

    const saved = await db.upsertEnrollment(enrollment);
    return jsonSuccess(saved, 201);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi tạo lộ trình học.');
  }
}
