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
  fileId: string | null;
  embedUrl: string | null;
  downloadUrl: string | null;
  viewUrl: string;
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
      if (/^[a-zA-Z0-9_-]{15,60}$/.test(candidate)) {
        return candidate;
      }
    }

    // Pattern 2: ?id={id}
    const idParam = parsed.searchParams.get('id');
    if (idParam && /^[a-zA-Z0-9_-]{15,60}$/.test(idParam)) {
      return idParam;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validates and safely normalizes any Google Drive link.
 */
export function sanitizeDriveUrl(rawUrl: string): DriveParsedAsset {
  const fileId = extractDriveFileId(rawUrl);

  if (!fileId) {
    // If not a valid Google Drive file ID, sanitize against javascript: or invalid schemes
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
      fileId: null,
      embedUrl: null,
      downloadUrl: null,
      viewUrl: safeUrl,
    };
  }

  return {
    isValidDrive: true,
    fileId,
    embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    viewUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
  };
}
