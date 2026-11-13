/**
 * Media Sanitizer and Link Cleaner
 * Safely normalizes YouTube videos, channels, playlists, and Google Drive links.
 * Strips tracking parameters (e.g., fbclid) and unwraps social redirects (e.g. l.facebook.com).
 */

export interface SanitizedMediaInfo {
  safeUrl: string;
  mediaType: 'youtube_video' | 'youtube_playlist' | 'youtube_channel' | 'drive_folder' | 'drive_file' | 'external';
  videoId?: string;
  playlistId?: string;
  embedUrl?: string;
  isEmbeddable: boolean;
}

/**
 * Strips Facebook interstitial redirects and tracking parameters.
 */
export function cleanRedirectUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let urlStr = rawUrl.trim();

  // If it's a Facebook redirect link
  if (urlStr.includes('facebook.com/l.php') && urlStr.includes('u=')) {
    try {
      const parsed = new URL(urlStr);
      const targetParam = parsed.searchParams.get('u');
      if (targetParam) {
        urlStr = decodeURIComponent(targetParam);
      }
    } catch {
      // If parsing fails, continue with original
    }
  }

  // Remove tracking parameters
  try {
    const parsed = new URL(urlStr);
    parsed.searchParams.delete('fbclid');
    parsed.searchParams.delete('__tn__');
    parsed.searchParams.delete('c[0]');
    parsed.searchParams.delete('h');
    urlStr = parsed.toString();
  } catch {
    // If not a full URL, return cleaned string
  }

  return urlStr;
}

/**
 * Extracts YouTube Video ID if present.
 */
export function extractYouTubeVideoId(url: string): string | null {
  const cleaned = cleanRedirectUrl(url);
  try {
    const parsed = new URL(cleaned);
    const host = parsed.hostname.toLowerCase();

    if (host === 'youtu.be') {
      const id = parsed.pathname.replace(/^\//, '').split('/')[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host.includes('youtube.com')) {
      // Format 1: /watch?v=VIDEO_ID
      const v = parsed.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      // Format 2: /embed/VIDEO_ID or /v/VIDEO_ID
      const parts = parsed.pathname.split('/');
      const embedIdx = parts.findIndex((p) => p === 'embed' || p === 'v');
      if (embedIdx !== -1 && parts[embedIdx + 1]) {
        const candidate = parts[embedIdx + 1];
        if (/^[a-zA-Z0-9_-]{11}$/.test(candidate)) return candidate;
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Extracts YouTube Playlist ID if present.
 */
export function extractYouTubePlaylistId(url: string): string | null {
  const cleaned = cleanRedirectUrl(url);
  try {
    const parsed = new URL(cleaned);
    if (parsed.hostname.includes('youtube.com') || parsed.hostname === 'youtu.be') {
      const list = parsed.searchParams.get('list');
      if (list && /^[a-zA-Z0-9_-]{10,50}$/.test(list)) {
        return list;
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Extracts Google Drive Folder ID if present.
 */
export function extractDriveFolderId(url: string): string | null {
  const cleaned = cleanRedirectUrl(url);
  try {
    const parsed = new URL(cleaned);
    if (parsed.hostname === 'drive.google.com') {
      const parts = parsed.pathname.split('/');
      const folderIdx = parts.indexOf('folders');
      if (folderIdx !== -1 && parts[folderIdx + 1]) {
        const id = parts[folderIdx + 1];
        if (/^[a-zA-Z0-9_-]{15,60}$/.test(id)) return id;
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Safely parses and normalizes any multimedia asset URL.
 */
export function sanitizeMediaResource(rawUrl: string): SanitizedMediaInfo {
  const safeUrl = cleanRedirectUrl(rawUrl);

  // Security guard against javascript: or data:
  if (/^(javascript|data|vbscript):/i.test(safeUrl)) {
    return {
      safeUrl: '#',
      mediaType: 'external',
      isEmbeddable: false,
    };
  }

  // Check YouTube Video
  const videoId = extractYouTubeVideoId(safeUrl);
  if (videoId) {
    return {
      safeUrl,
      mediaType: 'youtube_video',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
      isEmbeddable: true,
    };
  }

  // Check YouTube Playlist
  const playlistId = extractYouTubePlaylistId(safeUrl);
  if (playlistId) {
    return {
      safeUrl,
      mediaType: 'youtube_playlist',
      playlistId,
      embedUrl: `https://www.youtube.com/embed/videoseries?list=${playlistId}`,
      isEmbeddable: true,
    };
  }

  // Check YouTube Channel
  if (safeUrl.includes('youtube.com/') && (safeUrl.includes('/@') || safeUrl.includes('/user/') || safeUrl.includes('/c/'))) {
    return {
      safeUrl,
      mediaType: 'youtube_channel',
      isEmbeddable: false,
    };
  }

  // Check Google Drive Folder
  const folderId = extractDriveFolderId(safeUrl);
  if (folderId) {
    return {
      safeUrl: `https://drive.google.com/drive/folders/${folderId}?usp=sharing`,
      mediaType: 'drive_folder',
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
      isEmbeddable: true,
    };
  }

  // Google Drive File
  if (safeUrl.includes('drive.google.com/file/d/')) {
    return {
      safeUrl,
      mediaType: 'drive_file',
      isEmbeddable: false,
    };
  }

  return {
    safeUrl,
    mediaType: 'external',
    isEmbeddable: false,
  };
}
