import { describe, it, expect } from 'vitest';
import {
  parseGoogleDriveUrl,
  GoogleDriveAssetProvider,
  googleDriveProvider,
} from '@/lib/google-drive';

describe('Google Drive URL Parser & Security', () => {
  it('correctly parses standard Google Drive file/view URLs', () => {
    const url = 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz_12345/view?usp=sharing';
    const result = parseGoogleDriveUrl(url);

    expect(result.valid).toBe(true);
    expect(result.fileId).toBe('1AbCdEfGhIjKlMnOpQrStUvWxYz_12345');
    expect(result.kind).toBe('file');
    expect(result.previewUrl).toContain('/preview');
    expect(result.webViewUrl).toContain('/view');
  });

  it('correctly parses open?id= and uc?id= Google Drive URLs', () => {
    const url1 = 'https://drive.google.com/open?id=1234567890abcdefABCDEF';
    const res1 = parseGoogleDriveUrl(url1);
    expect(res1.valid).toBe(true);
    expect(res1.fileId).toBe('1234567890abcdefABCDEF');

    const url2 = 'https://drive.google.com/uc?id=9876543210fedcbaFEDCBA';
    const res2 = parseGoogleDriveUrl(url2);
    expect(res2.valid).toBe(true);
    expect(res2.fileId).toBe('9876543210fedcbaFEDCBA');
  });

  it('correctly parses Google Drive folder URLs', () => {
    const url = 'https://drive.google.com/drive/folders/1folderId1234567890';
    const result = parseGoogleDriveUrl(url);

    expect(result.valid).toBe(true);
    expect(result.fileId).toBe('1folderId1234567890');
    expect(result.kind).toBe('folder');
    expect(result.isFolder).toBe(true);
  });

  it('correctly parses Google Docs, Sheets, and Slides URLs', () => {
    const docUrl = 'https://docs.google.com/document/d/1docId1234567890abc/edit';
    const docRes = parseGoogleDriveUrl(docUrl);
    expect(docRes.valid).toBe(true);
    expect(docRes.fileId).toBe('1docId1234567890abc');
    expect(docRes.kind).toBe('doc');

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1sheetId1234567890abc/edit#gid=0';
    const sheetRes = parseGoogleDriveUrl(sheetUrl);
    expect(sheetRes.valid).toBe(true);
    expect(sheetRes.fileId).toBe('1sheetId1234567890abc');
    expect(sheetRes.kind).toBe('sheet');

    const slideUrl = 'https://docs.google.com/presentation/d/1slideId1234567890abc/edit';
    const slideRes = parseGoogleDriveUrl(slideUrl);
    expect(slideRes.valid).toBe(true);
    expect(slideRes.fileId).toBe('1slideId1234567890abc');
    expect(slideRes.kind).toBe('slide');
  });

  it('correctly extracts and appends resourceKey parameters', () => {
    const url = 'https://drive.google.com/file/d/1fileWithKey1234567/view?resourcekey=0-SecretKeyXYZ';
    const result = parseGoogleDriveUrl(url);

    expect(result.valid).toBe(true);
    expect(result.fileId).toBe('1fileWithKey1234567');
    expect(result.resourceKey).toBe('0-SecretKeyXYZ');
    expect(result.previewUrl).toContain('resourcekey=0-SecretKeyXYZ');
    expect(result.webViewUrl).toContain('resourcekey=0-SecretKeyXYZ');
  });

  it('strictly blocks SSRF attempts and malicious domains', () => {
    const evilUrls = [
      'https://evil.com/file/d/12345678901234567890',
      'https://drive.google.com.attacker.com/file/d/12345678901234567890',
      'http://169.254.169.254/latest/meta-data/',
      'http://localhost:3000/api/admin',
      'http://127.0.0.1:8080/internal',
    ];

    for (const evilUrl of evilUrls) {
      const res = parseGoogleDriveUrl(evilUrl);
      expect(res.valid).toBe(false);
      expect(res.error).toBeDefined();
    }
  });

  it('strictly rejects non-http/https schemes (javascript:, data:, file:)', () => {
    const maliciousSchemes = [
      'javascript:alert(document.cookie)',
      'data:text/html,<script>alert(1)</script>',
      'file:///etc/passwd',
      'blob:https://drive.google.com/12345',
      'vbscript:msgbox("test")',
    ];

    for (const malUrl of maliciousSchemes) {
      const res = parseGoogleDriveUrl(malUrl);
      expect(res.valid).toBe(false);
    }
  });

  it('handles empty, null, or malformed inputs safely without throwing', () => {
    expect(parseGoogleDriveUrl('')).toEqual({ valid: false, isValid: false, error: 'Empty or non-string URL' });
    expect(parseGoogleDriveUrl(null as any).valid).toBe(false);
    expect(parseGoogleDriveUrl(undefined as any).valid).toBe(false);
    expect(parseGoogleDriveUrl('not-a-valid-url').valid).toBe(false);
  });
});

describe('Google Drive Asset Provider', () => {
  it('generates correct viewer and embed URLs', () => {
    const provider = new GoogleDriveAssetProvider();
    const viewerUrl = provider.getViewerUrl('file-1234567890', 'key-xyz');
    const embedUrl = provider.getEmbedUrl('file-1234567890', 'key-xyz');

    expect(viewerUrl).toBe('https://drive.google.com/file/d/file-1234567890/view?resourcekey=key-xyz');
    expect(embedUrl).toBe('https://drive.google.com/file/d/file-1234567890/preview?resourcekey=key-xyz');
  });

  it('provides deterministic mock fallback status when credentials are not set', async () => {
    const provider = new GoogleDriveAssetProvider();

    const accessible = await provider.checkAccess('valid-file-12345');
    expect(accessible).toBe('accessible');

    const notFound = await provider.checkAccess('file-notfound-123');
    expect(notFound).toBe('not_found');

    const restricted = await provider.checkAccess('file-restricted-123');
    expect(restricted).toBe('restricted');
  });

  it('resolves valid URL into full asset metadata', async () => {
    const resolved = await googleDriveProvider.resolveFromUrl(
      'https://drive.google.com/file/d/1TestAudioAsset12345/view.mp3'
    );

    expect(resolved).not.toBeNull();
    expect(resolved?.fileId).toBe('1TestAudioAsset12345');
    expect(resolved?.kind).toBe('file');
    expect(resolved?.status).toBe('accessible');
    expect(resolved?.embedUrl).toContain('/preview');
  });
});
