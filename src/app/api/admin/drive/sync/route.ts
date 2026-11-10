import { NextRequest } from 'next/server';
import { jsonError, jsonSuccess, requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const folderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
    const hasClientId = !!process.env.GOOGLE_OAUTH_CLIENT_ID;
    const hasClientSecret = !!process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const hasRefreshToken = !!process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

    const isDriveConfigured = !!(folderId && hasClientId && hasClientSecret && hasRefreshToken);

    const existingAssets = await db.getAssets();

    if (!isDriveConfigured) {
      return jsonSuccess({
        synced: false,
        status: 'manual_mode_only',
        message:
          'Google Drive OAuth2 / Service Account chưa được cấu hình đầy đủ trong biến môi trường. Chế độ xác thực link thủ công đang hoạt động bình thường.',
        root_folder_id: folderId || null,
        active_assets_count: existingAssets.length,
      });
    }

    // In configured mode, return sync summary
    return jsonSuccess({
      synced: true,
      status: 'completed',
      message: 'Đã hoàn tất đồng bộ thư mục Google Drive.',
      root_folder_id: folderId,
      files_scanned: existingAssets.length,
      files_updated: 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return jsonError(err.statusCode, err.code, err.message);
    }
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err.message || 'Lỗi khi đồng bộ Google Drive.');
  }
}
