export const TTS_CHUNK_CHAR_LIMIT = 160;

/**
 * Splits long Vietnamese or Chinese text into natural, punctuation-aware chunks
 * so upstream neural TTS endpoints never reject or truncate long sentences.
 */
export function splitTextIntoTTSChunks(
  text: string,
  maxChars: number = TTS_CHUNK_CHAR_LIMIT
): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const chunks: string[] = [];
  const rawSegments = normalized
    .split(/(?<=[。！？；，、.!?;,:])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  let current = '';
  for (const seg of rawSegments) {
    if (seg.length <= maxChars) {
      if (!current) {
        current = seg;
      } else if (current.length + 1 + seg.length <= maxChars) {
        current = `${current} ${seg}`;
      } else {
        chunks.push(current);
        current = seg;
      }
      continue;
    }

    if (current) {
      chunks.push(current);
      current = '';
    }

    const hasSpaces = /\s/.test(seg);
    if (hasSpaces) {
      const words = seg.split(' ');
      let buf = '';
      for (const word of words) {
        if (!buf) {
          buf = word.slice(0, maxChars);
        } else if (buf.length + 1 + word.length <= maxChars) {
          buf = `${buf} ${word}`;
        } else {
          chunks.push(buf);
          buf = word.slice(0, maxChars);
        }
      }
      if (buf) current = buf;
    } else {
      for (let i = 0; i < seg.length; i += maxChars) {
        chunks.push(seg.slice(i, i + maxChars));
      }
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}
