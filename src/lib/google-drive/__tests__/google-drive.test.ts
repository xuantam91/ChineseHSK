import { describe, it, expect } from 'vitest';
import { parseGoogleDriveUrl } from '../index';

describe('Google Drive URL Parser & SSRF Protection', () => {
  it('parses valid /file/d/{id}/view URLs', () => {
    const url = 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing';
    const result = parseGoogleDriveUrl(url);

    expect(result.valid).toBe(true);
    expect(result.fileId).toBe('1A2B3C4D5E6F7G8H9I0J');
    expect(result.previewUrl).toBe('https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/preview');
  });

  it('parses valid open?id= URLs', () => {
    const url = 'https://drive.google.com/open?id=9Z8Y7X6W5V4U3T2S1R';
    const result = parseGoogleDriveUrl(url);

    expect(result.valid).toBe(true);
    expect(result.fileId).toBe('9Z8Y7X6W5V4U3T2S1R');
  });

  it('parses Google Docs URLs', () => {
    const url = 'https://docs.google.com/document/d/1DocIdSample123456/edit';
    const result = parseGoogleDriveUrl(url);

    expect(result.valid).toBe(true);
    expect(result.fileId).toBe('1DocIdSample123456');
    expect(result.mimeTypeGuess).toBe('application/vnd.google-apps.document');
  });

  it('extracts resourceKey if present in query parameter', () => {
    const url = 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?resourcekey=0-AbCdEfGhIj';
    const result = parseGoogleDriveUrl(url);

    expect(result.valid).toBe(true);
    expect(result.resourceKey).toBe('0-AbCdEfGhIj');
    expect(result.previewUrl).toContain('resourcekey=0-AbCdEfGhIj');
  });

  it('strictly rejects non-Google domains (SSRF attack mitigation)', () => {
    expect(parseGoogleDriveUrl('http://169.254.169.254/latest/meta-data').valid).toBe(false);
    expect(parseGoogleDriveUrl('http://localhost:3000/internal-secrets').valid).toBe(false);
    expect(parseGoogleDriveUrl('https://evil-attacker.com/fake-drive/file/d/123').valid).toBe(false);
    expect(parseGoogleDriveUrl('https://drive.google.com.attacker.com/file/d/123').valid).toBe(false);
    expect(parseGoogleDriveUrl('not-a-valid-url').valid).toBe(false);
  });
});
