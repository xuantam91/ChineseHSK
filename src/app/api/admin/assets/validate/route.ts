import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';
import { AssetValidateSchema } from '@/lib/validations';
import { parseGoogleDriveUrl } from '@/lib/google-drive';
import { Asset } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    const validation = AssetValidateSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(400, 'VALIDATION_ERROR', 'URL không đúng định dạng.', validation.error.flatten());
    }

    const { url, name } = validation.data;
    const parsed = parseGoogleDriveUrl(url);

    if (!parsed || !parsed.isValid || !parsed.fileId) {
      return jsonError(
        422,
        'INVALID_DRIVE_URL',
        'URL Google Drive không hợp lệ hoặc không thuộc tên miền được phép (drive.google.com / docs.google.com).'
      );
    }

    // Register or update asset record
    const assetId = `ast-${parsed.fileId.substring(0, 16)}`;
    const assetRecord: Asset = {
      id: assetId,
      provider: 'google_drive',
      drive_file_id: parsed.fileId,
      name: name || `Tài liệu Drive ${parsed.fileId.substring(0, 8)}`,
      mime_type: parsed.mimeTypeGuess,
      web_view_link: parsed.webViewUrl,
      resource_key: parsed.resourceKey || null,
      access_mode: 'anyone_with_link',
      status: 'verified',
      last_checked_at: new Date().toISOString(),
      source_url: parsed.originalUrl,
      metadata_jsonb: {},
    };

    const saved = await db.upsertAsset(assetRecord);

    return jsonSuccess({
      asset: saved,
      parsed_details: {
        file_id: parsed.fileId,
        mime_type: parsed.mimeTypeGuess,
        is_folder: parsed.isFolder,
        preview_url: parsed.previewUrl,
        web_view_url: parsed.webViewUrl,
        access_status: 'verified',
      },
    });
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi kiểm tra link Google Drive.');
  }
}
