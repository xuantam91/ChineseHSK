/**
 * Safe Google Drive & External Asset URL Handler
 * Sanitizes URLs to prevent SSRF, XSS, and javascript: protocols.
 */

const ALLOWED_DRIVE_HOSTNAMES = [
  'drive.google.com',
  'docs.google.com',
  'drive.usercontent.google.com',
];

export interface DriveParsedAsset {
  isValidDrive: boolean;
  isFolder?: boolean;
  fileId: string | null;
  embedUrl: string | null;
  downloadUrl: string | null;
  viewUrl: string;
}

// Fallback verified Google Drive folders when placeholder/demo IDs are encountered
const VERIFIED_FALLBACK_DRIVES = {
  video: '133NFHUSD1o1zUzg4mf_vHSu7Py5_dz3I', // Link video học phát âm pinyin
  audio: '12_7dgZXgNMDqnOT7vGVT5PgbX7nxjcVr', // Sách & MP3 học phát âm
  textbook: '1AlTr1FMUONPdt5znHh5HbB9OJqW7-E_5', // Trọn bộ HSK tiêu chuẩn
  vocab: '151ZqT-kjt_91dMCwJJBqgnpLFVpxWmVI', // Kho từ vựng trọn bộ
};

/**
 * Extracts Google Drive folder ID from URLs like:
 * - https://drive.google.com/drive/folders/{FOLDER_ID}
 * - https://drive.google.com/embeddedfolderview?id={FOLDER_ID}
 */
export function extractDriveFolderId(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  try {
    const parsed = new URL(rawUrl.trim());
    if (!ALLOWED_DRIVE_HOSTNAMES.includes(parsed.hostname)) {
      return null;
    }

    const folderMatch = parsed.pathname.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch && /^[a-zA-Z0-9_-]{10,65}$/.test(folderMatch[1])) {
      return folderMatch[1];
    }

    if (parsed.pathname.includes('embeddedfolderview')) {
      const idParam = parsed.searchParams.get('id');
      if (idParam && /^[a-zA-Z0-9_-]{10,65}$/.test(idParam)) {
        return idParam;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extracts Google Drive file ID from standard Google Drive URLs:
 * - https://drive.google.com/file/d/{FILE_ID}/view
 * - https://drive.google.com/open?id={FILE_ID}
 * - https://docs.google.com/document/d/{FILE_ID}
 * - https://docs.google.com/presentation/d/{FILE_ID}
 * - https://docs.google.com/spreadsheets/d/{FILE_ID}
 */
export function extractDriveFileId(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  try {
    const parsed = new URL(rawUrl.trim());
    if (!ALLOWED_DRIVE_HOSTNAMES.includes(parsed.hostname)) {
      return null;
    }

    // Pattern 1: /d/{id} or /file/d/{id}
    const pathSegments = parsed.pathname.split('/');
    const dIndex = pathSegments.indexOf('d');
    if (dIndex !== -1 && pathSegments[dIndex + 1]) {
      const candidate = pathSegments[dIndex + 1];
      // File ID is typically alphanumeric plus dashes/underscores
      if (/^[a-zA-Z0-9_-]{10,65}$/.test(candidate)) {
        return candidate;
      }
    }

    // Pattern 2: ?id={id}
    const idParam = parsed.searchParams.get('id');
    if (idParam && /^[a-zA-Z0-9_-]{10,65}$/.test(idParam)) {
      return idParam;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validates and safely normalizes any Google Drive link (files and folders).
 */
export function sanitizeDriveUrl(rawUrl: string): DriveParsedAsset {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      isValidDrive: false,
      isFolder: false,
      fileId: null,
      embedUrl: null,
      downloadUrl: null,
      viewUrl: '#',
    };
  }

  // 1. Check if it is a Google Drive Folder
  const folderId = extractDriveFolderId(rawUrl);
  if (folderId) {
    return {
      isValidDrive: true,
      isFolder: true,
      fileId: folderId,
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
      downloadUrl: null,
      viewUrl: `https://drive.google.com/drive/folders/${folderId}?usp=sharing`,
    };
  }

  // 2. Check if it is a Google Drive File
  let fileId = extractDriveFileId(rawUrl);

  // Fallback for placeholder / mock IDs to prevent Google "File does not exist" 404
  if (fileId && (fileId.toLowerCase().includes('demo') || fileId.toLowerCase().includes('mock'))) {
    let resolvedFolder = VERIFIED_FALLBACK_DRIVES.textbook;
    if (fileId.toLowerCase().includes('video')) {
      resolvedFolder = VERIFIED_FALLBACK_DRIVES.video;
    } else if (fileId.toLowerCase().includes('audio') || fileId.toLowerCase().includes('pinyin')) {
      resolvedFolder = VERIFIED_FALLBACK_DRIVES.audio;
    } else if (fileId.toLowerCase().includes('vocab')) {
      resolvedFolder = VERIFIED_FALLBACK_DRIVES.vocab;
    }
    return {
      isValidDrive: true,
      isFolder: true,
      fileId: resolvedFolder,
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${resolvedFolder}#grid`,
      downloadUrl: null,
      viewUrl: `https://drive.google.com/drive/folders/${resolvedFolder}?usp=sharing`,
    };
  }

  if (!fileId) {
    // If not a valid Google Drive file/folder ID, sanitize against javascript: or invalid schemes
    let safeUrl = '#';
    try {
      const parsed = new URL(rawUrl);
      if (['http:', 'https:'].includes(parsed.protocol)) {
        safeUrl = parsed.toString();
      }
    } catch {
      safeUrl = '#';
    }

    return {
      isValidDrive: false,
      isFolder: false,
      fileId: null,
      embedUrl: null,
      downloadUrl: null,
      viewUrl: safeUrl,
    };
  }

  return {
    isValidDrive: true,
    isFolder: false,
    fileId,
    embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    viewUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
  };
}
