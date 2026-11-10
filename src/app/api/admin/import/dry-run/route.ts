import { NextRequest } from 'next/server';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';
import { NotionImportSchema } from '@/lib/validations';
import { runDryRunValidation } from '@/lib/notion-import';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    const validation = NotionImportSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'Nội dung import không hợp lệ.', validation.error.flatten());
    }

    const summary = runDryRunValidation(validation.data.raw_content);
    return jsonSuccess(summary);
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi kiểm tra dữ liệu import.');
  }
}
