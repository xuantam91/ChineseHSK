export type DriveAssetKind = 'file' | 'folder' | 'doc' | 'sheet' | 'slide';

export interface ParseDriveResult {
  valid: boolean;
  isValid?: boolean; // compatibility
  fileId?: string;
  resourceKey?: string;
  kind?: DriveAssetKind;
  error?: string;
  mimeTypeGuess?: string;
  previewUrl?: string;
  webViewUrl?: string;
  isFolder?: boolean;
  originalUrl?: string;
}

const ALLOWED_HOSTNAMES = new Set([
  'drive.google.com',
  'docs.google.com',
]);

const FILE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * Strictly parses and validates a Google Drive / Google Docs URL.
 * Rejects non-Google domains, javascript:, data: URIs, SSRF IP addresses, and invalid protocols.
 */
export function parseGoogleDriveUrl(rawUrl?: string | null): ParseDriveResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, isValid: false, error: 'Empty or non-string URL' };
  }

  const trimmed = rawUrl.trim();

  // Reject malicious schemes immediately
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('blob:')
  ) {
    return { valid: false, isValid: false, error: 'Prohibited URL scheme' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, isValid: false, error: 'Malformed URL' };
  }

  // Must be http: or https:
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, isValid: false, error: 'Invalid URL protocol' };
  }

  // Strict hostname checking
  const hostname = parsed.hostname.toLowerCase();
  if (!ALLOWED_HOSTNAMES.has(hostname)) {
    return {
      valid: false,
      isValid: false,
      error: `Disallowed hostname "${hostname}". Only drive.google.com and docs.google.com are permitted.`,
    };
  }

  const pathname = parsed.pathname;
  let fileId: string | undefined;
  let kind: DriveAssetKind = 'file';
  let mimeTypeGuess = 'application/octet-stream';

  // 1. /drive/folders/{id}
  const folderMatch = pathname.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    fileId = folderMatch[1];
    kind = 'folder';
    mimeTypeGuess = 'application/vnd.google-apps.folder';
  }

  // 2. /file/d/{id}/...
  if (!fileId) {
    const fileDMatch = pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch) {
      fileId = fileDMatch[1];
      kind = 'file';
    }
  }

  // 3. /document/d/{id}
  if (!fileId) {
    const docMatch = pathname.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch) {
      fileId = docMatch[1];
      kind = 'doc';
      mimeTypeGuess = 'application/vnd.google-apps.document';
    }
  }

  // 4. /spreadsheets/d/{id}
  if (!fileId) {
    const sheetMatch = pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (sheetMatch) {
      fileId = sheetMatch[1];
      kind = 'sheet';
      mimeTypeGuess = 'application/vnd.google-apps.spreadsheet';
    }
  }

  // 5. /presentation/d/{id}
  if (!fileId) {
    const slideMatch = pathname.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (slideMatch) {
      fileId = slideMatch[1];
      kind = 'slide';
      mimeTypeGuess = 'application/vnd.google-apps.presentation';
    }
  }

  // 6. /open?id={id} or /uc?id={id}
  if (!fileId && parsed.searchParams.has('id')) {
    const idParam = parsed.searchParams.get('id');
    if (idParam) {
      fileId = idParam;
      kind = 'file';
    }
  }

  if (!fileId || !FILE_ID_REGEX.test(fileId)) {
    return {
      valid: false,
      isValid: false,
      error: 'Could not extract a valid Google Drive file/folder ID',
    };
  }

  const resourceKey = parsed.searchParams.get('resourcekey') || undefined;

  // Infer MIME type hints from extension/URL
  if (kind === 'file') {
    if (lower.includes('.pdf') || lower.includes('pdf')) {
      mimeTypeGuess = 'application/pdf';
    } else if (lower.includes('.mp3') || lower.includes('audio')) {
      mimeTypeGuess = 'audio/mpeg';
    } else if (lower.includes('.mp4') || lower.includes('video')) {
      mimeTypeGuess = 'video/mp4';
    }
  }

  const resourceKeyQuery = resourceKey ? `?resourcekey=${encodeURIComponent(resourceKey)}` : '';
  const previewUrl =
    kind === 'folder'
      ? `https://drive.google.com/embeddedfolderview?id=${fileId}#grid`
      : `https://drive.google.com/file/d/${fileId}/preview${resourceKeyQuery}`;
  const webViewUrl =
    kind === 'folder'
      ? `https://drive.google.com/drive/folders/${fileId}?usp=sharing`
      : `https://drive.google.com/file/d/${fileId}/view${resourceKeyQuery}`;

  return {
    valid: true,
    isValid: true,
    fileId,
    resourceKey,
    kind,
    mimeTypeGuess,
    previewUrl,
    webViewUrl,
    isFolder: kind === 'folder',
    originalUrl: trimmed,
  };
}
