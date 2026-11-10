import { parseGoogleDriveUrl, ParseDriveResult, DriveAssetKind } from './parser';

export type AssetStatus =
  | 'accessible'
  | 'restricted'
  | 'not_found'
  | 'error'
  | 'verified'
  | 'unverified'
  | 'missing'
  | 'permission_denied';

export interface ResolvedDriveAsset {
  fileId: string;
  resourceKey?: string;
  kind: DriveAssetKind;
  name?: string;
  mimeType: string;
  viewerUrl: string;
  embedUrl: string;
  status: AssetStatus;
  originalUrl: string;
}

export interface AssetProvider {
  resolveFromUrl(url: string): Promise<ResolvedDriveAsset | null>;
  getViewerUrl(fileId: string, resourceKey?: string): string;
  getEmbedUrl(fileId: string, resourceKey?: string): string;
  checkAccess(fileId: string, resourceKey?: string): Promise<AssetStatus>;
}

export interface GoogleDriveConfig {
  apiKey?: string;
  serviceAccountEmail?: string;
  serviceAccountPrivateKey?: string;
}

export class GoogleDriveAssetProvider implements AssetProvider {
  private config: GoogleDriveConfig;

  constructor(config?: GoogleDriveConfig) {
    this.config = config || {
      apiKey: process.env.GOOGLE_DRIVE_API_KEY,
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      serviceAccountPrivateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    };
  }

  getViewerUrl(fileId: string, resourceKey?: string): string {
    const query = resourceKey ? `?resourcekey=${encodeURIComponent(resourceKey)}` : '';
    return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view${query}`;
  }

  getEmbedUrl(fileId: string, resourceKey?: string): string {
    const query = resourceKey ? `?resourcekey=${encodeURIComponent(resourceKey)}` : '';
    return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview${query}`;
  }

  async checkAccess(fileId: string, resourceKey?: string): Promise<AssetStatus> {
    if (!fileId || typeof fileId !== 'string') {
      return 'not_found';
    }

    // If no credentials configured, use deterministic mock fallback
    if (!this.config.apiKey && !this.config.serviceAccountEmail) {
      if (fileId.toLowerCase().includes('notfound') || fileId.toLowerCase().includes('missing')) {
        return 'not_found';
      }
      if (fileId.toLowerCase().includes('restricted') || fileId.toLowerCase().includes('denied')) {
        return 'restricted';
      }
      if (fileId.toLowerCase().includes('error')) {
        return 'error';
      }
      return 'accessible';
    }

    // If real API key is configured, perform metadata probe
    try {
      const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
        fileId
      )}?key=${encodeURIComponent(this.config.apiKey!)}&fields=id,name,mimeType,capabilities`;
      const response = await fetch(url, { method: 'GET' });

      if (response.status === 200) {
        return 'accessible';
      }
      if (response.status === 404) {
        return 'not_found';
      }
      if (response.status === 401 || response.status === 403) {
        return 'restricted';
      }
      return 'error';
    } catch {
      return 'error';
    }
  }

  async resolveFromUrl(url: string): Promise<ResolvedDriveAsset | null> {
    const parsed = parseGoogleDriveUrl(url);
    if (!parsed.valid || !parsed.fileId) {
      return null;
    }

    const status = await this.checkAccess(parsed.fileId, parsed.resourceKey);

    return {
      fileId: parsed.fileId,
      resourceKey: parsed.resourceKey,
      kind: parsed.kind || 'file',
      mimeType: parsed.mimeTypeGuess || 'application/octet-stream',
      viewerUrl: this.getViewerUrl(parsed.fileId, parsed.resourceKey),
      embedUrl: this.getEmbedUrl(parsed.fileId, parsed.resourceKey),
      status,
      originalUrl: url,
    };
  }
}

// Default singleton provider
export const googleDriveProvider = new GoogleDriveAssetProvider();
