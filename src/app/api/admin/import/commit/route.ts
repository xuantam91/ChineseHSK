import { NextRequest } from 'next/server';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';
import { NotionImportSchema } from '@/lib/validations';
import { commitNotionImport } from '@/lib/notion-import';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();

    const validation = NotionImportSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Dữ liệu xác nhận import không hợp lệ.', validation.error.flatten());
    }

    const { raw_content, program_id, version_label } = validation.data;
    const result = await commitNotionImport(raw_content, program_id, version_label);

    return jsonSuccess({
      message: 'Import giáo trình thành công vào phiên bản dự thảo (Draft).',
      version: result.version,
      summary: result.summary,
    }, 201);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi lưu giáo trình import.');
  }
}
