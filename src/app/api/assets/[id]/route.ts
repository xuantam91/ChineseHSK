import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, jsonSuccess, requireUser } from '@/lib/auth';
import { parseGoogleDriveUrl } from '@/lib/google-drive';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireUser(req);
    const { id } = await params;

    const asset = await db.getAsset(id);
    if (!asset) {
      return jsonError(404, 'ASSET_NOT_FOUND', 'Không tìm thấy tài nguyên yêu cầu.');
    }

    const driveInfo = asset.web_view_link ? parseGoogleDriveUrl(asset.web_view_link) : null;

    return jsonSuccess({
      id: asset.id,
      name: asset.name,
      mime_type: asset.mime_type,
      access_mode: asset.access_mode,
      status: asset.status,
      viewer_url: driveInfo ? driveInfo.previewUrl : asset.web_view_link,
      web_view_url: driveInfo ? driveInfo.webViewUrl : asset.web_view_link,
      is_folder: driveInfo ? driveInfo.isFolder : false,
      last_checked_at: asset.last_checked_at,
    });
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi tải thông tin tài nguyên.');
  }
}
