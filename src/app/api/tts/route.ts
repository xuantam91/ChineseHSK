import { NextRequest, NextResponse } from 'next/server';
import { splitTextIntoTTSChunks, TTS_CHUNK_CHAR_LIMIT } from '@/lib/tts/chunker';

const MAX_TEXT_LENGTH = 1500;
const CHUNK_CHAR_LIMIT = TTS_CHUNK_CHAR_LIMIT;

/**
 * Strips ID3v2 header from subsequent MP3 chunks so concatenated MP3 frames play seamlessly.
 */
function stripId3Header(buf: Buffer): Buffer {
  if (buf.length > 10 && buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) {
    const size =
      ((buf[6] & 0x7f) << 21) |
      ((buf[7] & 0x7f) << 14) |
      ((buf[8] & 0x7f) << 7) |
      (buf[9] & 0x7f);
    const offset = 10 + size;
    if (offset < buf.length) {
      return buf.subarray(offset);
    }
  }
  return buf;
}

async function fetchChunkMp3(chunk: string, lang: 'vi' | 'zh-CN', speed: number): Promise<Buffer> {
  const encoded = encodeURIComponent(chunk);
  const ttsSpeed = Math.max(0.4, Math.min(1.2, speed)).toFixed(2);
  const endpoints = [
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${lang}&ttsspeed=${ttsSpeed}&q=${encoded}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&ttsspeed=${ttsSpeed}&q=${encoded}`,
  ];

  let lastError: unknown = null;
  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const arr = await res.arrayBuffer();
        if (arr.byteLength > 100) {
          return Buffer.from(arr);
        }
      }
      lastError = new Error(`Upstream TTS HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to synthesize TTS audio');
}

async function handleTTS(text: string, rawLang: string | null, rawSpeed: string | null) {
  const cleanText = text.replace(/[\x00-\x1F\x7F]/g, ' ').trim();
  if (!cleanText) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
  }
  if (cleanText.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: `Text too long (max ${MAX_TEXT_LENGTH} chars)` }, { status: 400 });
  }

  const lang: 'vi' | 'zh-CN' = rawLang === 'vi' ? 'vi' : 'zh-CN';
  const parsedSpeed = Number(rawSpeed);
  const speed = Number.isFinite(parsedSpeed) ? parsedSpeed : lang === 'vi' ? 0.96 : 0.88;

  const chunks = splitTextIntoTTSChunks(cleanText, CHUNK_CHAR_LIMIT);
  const buffers: Buffer[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const mp3 = await fetchChunkMp3(chunks[i], lang, speed);
    buffers.push(i === 0 ? mp3 : stripId3Header(mp3));
  }

  const combined = Buffer.concat(buffers);
  return new NextResponse(combined, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(combined.byteLength),
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const text = searchParams.get('text') || '';
    const lang = searchParams.get('lang');
    const speed = searchParams.get('speed');
    return await handleTTS(text, lang, speed);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'TTS synthesis failed' },
      { status: 502 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    return await handleTTS(
      typeof body.text === 'string' ? body.text : '',
      typeof body.lang === 'string' ? body.lang : null,
      body.speed !== undefined ? String(body.speed) : null
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'TTS synthesis failed' },
      { status: 502 }
    );
  }
}
