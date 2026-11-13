import { describe, it, expect } from 'vitest';
import {
  cleanRedirectUrl,
  extractYouTubeVideoId,
  extractYouTubePlaylistId,
  extractDriveFolderId,
  sanitizeMediaResource,
} from '@/lib/media-sanitizer';

describe('Media Sanitizer & URL Normalizer', () => {
  it('strips facebook redirect and fbclid tracking parameter', () => {
    const fbUrl =
      'https://l.facebook.com/l.php?u=https%3A%2F%2Fyoutu.be%2FumGf6u4Oj7E%3Ffbclid%3DIwAR0LsaVPci0l_D6ltFFS4woF08tahNvH47FsIjSKCD0Z2IDxhmIDgvkiJ5Y&h=AT15TXtK2Rzcfx_PNhFdLMwm61BSlNE5I00RbN2t47XBnL8slpA2';
    const cleaned = cleanRedirectUrl(fbUrl);
    expect(cleaned).toContain('youtu.be/umGf6u4Oj7E');
    expect(cleaned).not.toContain('fbclid');
    expect(cleaned).not.toContain('l.facebook.com');
  });

  it('extracts YouTube Video ID from various formats', () => {
    expect(extractYouTubeVideoId('https://youtu.be/WmzZ_xI5ceM?fbclid=xyz')).toBe('WmzZ_xI5ceM');
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=yjeSGzZzc-g')).toBe('yjeSGzZzc-g');
    expect(extractYouTubeVideoId('https://www.youtube.com/embed/2eBi5q5JyDQ')).toBe('2eBi5q5JyDQ');
    expect(extractYouTubeVideoId('https://not-youtube.com/watch?v=123')).toBeNull();
  });

  it('extracts YouTube Playlist ID correctly', () => {
    const playlistUrl =
      'https://www.youtube.com/watch?v=-fzPzZiKBRQ&list=PLZ27m2K2W5n6M_BAtO0Ze-Yvvvj_E5ojM&fbclid=abc';
    expect(extractYouTubePlaylistId(playlistUrl)).toBe('PLZ27m2K2W5n6M_BAtO0Ze-Yvvvj_E5ojM');
  });

  it('extracts Google Drive Folder ID', () => {
    const driveFolder =
      'https://drive.google.com/drive/folders/133NFHUSD1o1zUzg4mf_vHSu7Py5_dz3I?usp=sharing';
    expect(extractDriveFolderId(driveFolder)).toBe('133NFHUSD1o1zUzg4mf_vHSu7Py5_dz3I');
  });

  it('generates safe embed URLs and prevents XSS', () => {
    const result = sanitizeMediaResource('javascript:alert(1)');
    expect(result.safeUrl).toBe('#');
    expect(result.isEmbeddable).toBe(false);

    const videoResult = sanitizeMediaResource('https://youtu.be/PVnybNwHQis');
    expect(videoResult.mediaType).toBe('youtube_video');
    expect(videoResult.embedUrl).toBe('https://www.youtube.com/embed/PVnybNwHQis?rel=0');
    expect(videoResult.isEmbeddable).toBe(true);

    const folderResult = sanitizeMediaResource(
      'https://drive.google.com/drive/folders/1xtKHA7mUF343e9VDwOO_g65BEldbbFec?usp=sharing'
    );
    expect(folderResult.mediaType).toBe('drive_folder');
    expect(folderResult.embedUrl).toContain('1xtKHA7mUF343e9VDwOO_g65BEldbbFec');
    expect(folderResult.isEmbeddable).toBe(true);
  });
});
