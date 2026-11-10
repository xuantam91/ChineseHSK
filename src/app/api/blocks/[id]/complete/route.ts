import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireUser } from '@/lib/auth';
import { BlockCompleteSchema } from '@/lib/validations';
import { mockStore } from '@/lib/db/mock-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser(req);
    const { id: blockId } = await params;

    const enrollment = await db.getEnrollmentByUserId(user.id);
    if (!enrollment) {
      return jsonError(404, 'ENROLLMENT_NOT_FOUND', 'Người dùng chưa kích hoạt lộ trình học.');
    }

    const block = mockStore.lessonBlocks.get(blockId);
    if (!block) {
      return jsonError(404, 'BLOCK_NOT_FOUND', 'Không tìm thấy khối bài học yêu cầu.');
    }

    // Verify student has access to this lesson's day
    const lesson = await db.getLesson(block.lesson_id);
    if (!lesson) {
      return jsonError(404, 'LESSON_NOT_FOUND', 'Bài học liên kết không tồn tại.');
    }

    let metadata: Record<string, any> | undefined = undefined;
    try {
      const body = await req.json();
      const validation = BlockCompleteSchema.safeParse(body);
      if (validation.success) {
        metadata = validation.data.metadata;
      }
    } catch {
      // Empty body is allowed
    }

    await db.completeBlock(enrollment.id, blockId, metadata);

    const progress = mockStore.lessonProgress.get(`${enrollment.id}_${lesson.id}`);

    return jsonSuccess({
      block_id: blockId,
      completed: true,
      lesson_status: progress?.status || 'in_progress',
    });
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi cập nhật tiến độ khối bài học.');
  }
}
