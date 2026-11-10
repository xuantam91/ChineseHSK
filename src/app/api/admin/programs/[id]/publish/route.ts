import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id: versionId } = await params;

    const publishedVersion = await db.publishProgramVersion(versionId);

    if (!publishedVersion) {
      return jsonError(404, 'VERSION_NOT_FOUND', 'Không tìm thấy phiên bản chương trình để xuất bản.');
    }

    return jsonSuccess({
      message: `Đã xuất bản thành công phiên bản ${publishedVersion.version_number}.`,
      version: publishedVersion,
    });
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi xuất bản phiên bản chương trình.');
  }
}
