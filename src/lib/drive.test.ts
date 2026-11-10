import { describe, it, expect } from 'vitest';
import { extractDriveFileId, sanitizeDriveUrl } from './drive';

describe('Google Drive URL Sanitizer & Extractor', () => {
  it('extracts file ID from standard /file/d/{id}/view URLs', () => {
    const url = 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing';
    expect(extractDriveFileId(url)).toBe('1A2B3C4D5E6F7G8H9I0J');
  });

  it('extracts file ID from ?id={id} query param', () => {
    const url = 'https://drive.google.com/open?id=1A2B3C4D5E6F7G8H9I0J';
    expect(extractDriveFileId(url)).toBe('1A2B3C4D5E6F7G8H9I0J');
  });

  it('extracts file ID from docs.google.com/document/d/{id}', () => {
    const url = 'https://docs.google.com/document/d/1A2B3C4D5E6F7G8H9I0J/edit';
    expect(extractDriveFileId(url)).toBe('1A2B3C4D5E6F7G8H9I0J');
  });

  it('rejects malicious or invalid URLs', () => {
    expect(extractDriveFileId('javascript:alert(1)')).toBeNull();
    expect(extractDriveFileId('https://evil-phishing-site.com/file/d/123456789012345')).toBeNull();
    expect(extractDriveFileId('')).toBeNull();
  });

  it('generates secure embed and download URLs for valid Google Drive files', () => {
    const result = sanitizeDriveUrl('https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view');
    expect(result.isValidDrive).toBe(true);
    expect(result.fileId).toBe('1A2B3C4D5E6F7G8H9I0J');
    expect(result.embedUrl).toBe('https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/preview');
    expect(result.downloadUrl).toBe('https://drive.google.com/uc?export=download&id=1A2B3C4D5E6F7G8H9I0J');
  });

  it('sanitizes javascript: links to # for non-drive URLs', () => {
    const result = sanitizeDriveUrl('javascript:alert(1)');
    expect(result.isValidDrive).toBe(false);
    expect(result.viewUrl).toBe('#');
  });
});
