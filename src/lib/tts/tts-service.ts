'use client';

import {
  TTSVoicePersona,
  TTSSettings,
  DEFAULT_TTS_SETTINGS,
  TTS_PERSONAS,
  TTSPersonaConfig,
} from './types';
import { PERSONA_ACOUSTIC_PROFILES, createPersonaShiftedBuffer } from './pitch-shifter';

const STORAGE_KEY_TTS = 'chinese_journey_tts_settings';
export const TTS_SETTINGS_EVENT = 'tts_settings_changed';

// In-memory cached voices & synthesized audio cache
let cachedVoices: SpeechSynthesisVoice[] = [];
let isCurrentlySpeaking = false;
let currentSafetyTimeout: ReturnType<typeof setTimeout> | null = null;
let activeAudioElement: HTMLAudioElement | null = null;
let activeBufferSource: AudioBufferSourceNode | null = null;
let sharedAudioCtx: AudioContext | null = null;
let activeAbortController: AbortController | null = null;
let activePlaybackToken = 0;
let charSequenceCancelled = false;
let charSequenceTimeout: ReturnType<typeof setTimeout> | null = null;

const MAX_AUDIO_CACHE_SIZE = 80;
const audioBlobUrlCache = new Map<string, string>();
const rawArrayBufferCache = new Map<string, ArrayBuffer>();
const shiftedAudioBufferCache = new Map<string, AudioBuffer>();

function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedAudioCtx) {
    try {
      sharedAudioCtx = new Ctor();
    } catch {
      return null;
    }
  }
  return sharedAudioCtx;
}

function setBoundedCache<T>(map: Map<string, T>, key: string, val: T) {
  if (map.size >= MAX_AUDIO_CACHE_SIZE) {
    const oldestKey = map.keys().next().value;
    if (oldestKey) map.delete(oldestKey);
  }
  map.set(key, val);
}

function setCachedAudioUrl(cacheKey: string, blobUrl: string) {
  if (audioBlobUrlCache.size >= MAX_AUDIO_CACHE_SIZE) {
    const oldestKey = audioBlobUrlCache.keys().next().value;
    if (oldestKey) {
      const oldUrl = audioBlobUrlCache.get(oldestKey);
      if (oldUrl && typeof URL !== 'undefined') {
        try {
          URL.revokeObjectURL(oldUrl);
        } catch {
          // ignore
        }
      }
      audioBlobUrlCache.delete(oldestKey);
    }
  }
  audioBlobUrlCache.set(cacheKey, blobUrl);
}

/**
 * Initializes and fetches available system voices (used for Settings inspection and offline fallback).
 */
export function initTTSVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }

  return new Promise((resolve) => {
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        cachedVoices = voices;
        resolve(voices);
        return true;
      }
      return false;
    };

    if (checkVoices()) return;

    window.speechSynthesis.onvoiceschanged = () => {
      checkVoices();
    };

    setTimeout(() => {
      checkVoices();
      resolve(cachedVoices);
    }, 500);
  });
}

/**
 * Returns all Chinese (Mandarin/Standard Chinese) voices available in browser.
 */
export function getAvailableChineseVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  return voices.filter((v) => {
    const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
    return (
      lang.startsWith('zh') ||
      lang.startsWith('cmn') ||
      v.name.toLowerCase().includes('chinese') ||
      v.name.includes('普通话') ||
      v.name.includes('国语')
    );
  });
}

/**
 * Selects best matching SpeechSynthesisVoice for a given persona.
 */
export function findBestVoiceForPersona(
  persona: TTSVoicePersona,
  preferredURI?: string
): SpeechSynthesisVoice | null {
  const chineseVoices = getAvailableChineseVoices();
  if (chineseVoices.length === 0) return null;

  if (preferredURI) {
    const match = chineseVoices.find((v) => v.voiceURI === preferredURI);
    if (match) return match;
  }

  const femaleKeywords = [
    'tingting',
    'ting-ting',
    'huihui',
    'xiaoxiao',
    'xiaoyi',
    'meijia',
    'sinji',
    'female',
    'woman',
    'zhimin',
    'google 普通话',
  ];
  const maleKeywords = ['kangkang', 'yunxi', 'yunyang', 'yunjian', 'limu', 'danny', 'male', 'man'];
  const childKeywords = ['yaoyao', 'yushu', 'child', 'kid', 'young'];

  if (persona === 'child') {
    const childMatch = chineseVoices.find((v) =>
      childKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (childMatch) return childMatch;
  } else if (persona === 'male') {
    const maleMatch = chineseVoices.find((v) =>
      maleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (maleMatch) return maleMatch;
  } else if (persona === 'female' || persona === 'adult') {
    const femaleMatch = chineseVoices.find((v) =>
      femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (femaleMatch) return femaleMatch;
  }

  const zhCnVoice = chineseVoices.find((v) => {
    const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
    return lang === 'zh-cn' || lang === 'cmn-hans-cn';
  });

  return zhCnVoice || chineseVoices[0] || null;
}

/**
 * Reads TTS Settings from localStorage.
 */
export function getStoredTTSSettings(): TTSSettings {
  if (typeof window === 'undefined') return DEFAULT_TTS_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TTS);
    if (!raw) return DEFAULT_TTS_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      persona: parsed.persona || DEFAULT_TTS_SETTINGS.persona,
      speedRate: typeof parsed.speedRate === 'number' ? parsed.speedRate : DEFAULT_TTS_SETTINGS.speedRate,
      volume: typeof parsed.volume === 'number' ? parsed.volume : DEFAULT_TTS_SETTINGS.volume,
      preferredVoiceURI: parsed.preferredVoiceURI,
    };
  } catch {
    return DEFAULT_TTS_SETTINGS;
  }
}

/**
 * Saves TTS Settings to localStorage and dispatches event.
 */
export function saveTTSSettings(settings: Partial<TTSSettings>): TTSSettings {
  const current = getStoredTTSSettings();
  const updated: TTSSettings = { ...current, ...settings };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_TTS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(TTS_SETTINGS_EVENT, { detail: updated }));
    } catch (e) {
      console.warn('Failed to save TTS settings', e);
    }
  }

  return updated;
}

export interface SpeakOptions {
  persona?: TTSVoicePersona;
  speedRate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

function stopCurrentPlaybackInternal() {
  activePlaybackToken += 1;

  if (activeAbortController) {
    try {
      activeAbortController.abort();
    } catch {
      // ignore
    }
    activeAbortController = null;
  }

  if (activeBufferSource) {
    try {
      activeBufferSource.onended = null;
      activeBufferSource.stop();
      activeBufferSource.disconnect();
    } catch {
      // ignore
    }
    activeBufferSource = null;
  }

  if (activeAudioElement) {
    try {
      activeAudioElement.onended = null;
      activeAudioElement.onerror = null;
      activeAudioElement.onplay = null;
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch {
      // ignore
    }
    activeAudioElement = null;
  }

  if (currentSafetyTimeout) {
    clearTimeout(currentSafetyTimeout);
    currentSafetyTimeout = null;
  }

  isCurrentlySpeaking = false;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Stops any active speech playback immediately.
 */
export function stopChineseSpeech(): void {
  charSequenceCancelled = true;
  if (charSequenceTimeout) {
    clearTimeout(charSequenceTimeout);
    charSequenceTimeout = null;
  }
  stopCurrentPlaybackInternal();
}

/**
 * Checks if Speech Synthesis or Neural Audio is currently speaking.
 */
export function isSpeaking(): boolean {
  return isCurrentlySpeaking;
}

/**
 * Splits long text for Web Speech fallback so Chrome doesn't silently truncate >180 char sentences.
 */
function splitFallbackUtterances(text: string, maxLen = 140): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  if (clean.length <= maxLen) return [clean];

  const parts = clean
    .split(/(?<=[。！？；，、.!?;,:])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  let buf = '';
  for (const part of parts) {
    if (!buf) {
      buf = part;
    } else if (buf.length + 1 + part.length <= maxLen) {
      buf = `${buf} ${part}`;
    } else {
      out.push(buf);
      buf = part;
    }
  }
  if (buf) out.push(buf);
  return out;
}

function speakViaWebSpeechFallback(
  text: string,
  lang: 'zh-CN' | 'vi-VN',
  rate: number,
  pitch: number,
  volume: number,
  persona: TTSVoicePersona,
  preferredURI: string | undefined,
  token: number,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    isCurrentlySpeaking = false;
    onError?.(new Error('Speech playback unavailable'));
    onEnd?.();
    return;
  }

  const segments = splitFallbackUtterances(text, 140);
  if (segments.length === 0) {
    isCurrentlySpeaking = false;
    onEnd?.();
    return;
  }

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const matchedVoice =
    lang === 'zh-CN'
      ? findBestVoiceForPersona(persona, preferredURI)
      : voices.find((v) => {
          const vl = (v.lang || '').toLowerCase();
          const vn = (v.name || '').toLowerCase();
          return vl.startsWith('vi') || vn.includes('viet') || vn.includes('hoaimy') || vn.includes('namminh') || vn.includes('linh');
        }) || null;

  let started = false;

  const speakSegment = (idx: number) => {
    if (token !== activePlaybackToken) return;
    if (idx >= segments.length) {
      isCurrentlySpeaking = false;
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(segments[idx]);
    utterance.lang = matchedVoice?.lang || lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    let finishedSeg = false;
    const next = (isErr = false, err?: any) => {
      if (finishedSeg) return;
      finishedSeg = true;
      if (currentSafetyTimeout) {
        clearTimeout(currentSafetyTimeout);
        currentSafetyTimeout = null;
      }
      if (token !== activePlaybackToken) return;
      if (isErr) {
        isCurrentlySpeaking = false;
        onError?.(err);
        onEnd?.();
        return;
      }
      speakSegment(idx + 1);
    };

    utterance.onstart = () => {
      if (token !== activePlaybackToken) return;
      isCurrentlySpeaking = true;
      if (!started) {
        started = true;
        onStart?.();
      }
    };
    utterance.onend = () => next(false);
    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') {
        isCurrentlySpeaking = false;
        return;
      }
      next(true, e);
    };

    const estMs = Math.max(3000, (segments[idx].length * 360) / Math.max(0.5, rate) + 1800);
    currentSafetyTimeout = setTimeout(() => next(false), estMs);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      next(true, err);
    }
  };

  speakSegment(0);
}

/**
 * Plays Neural TTS MP3 via /api/tts (works identically across Mac, Windows, Linux & locked corporate PCs),
 * falling back to chunked browser SpeechSynthesis only if network or Audio playback fails.
 */
async function playUniversalNeuralTTS(params: {
  text: string;
  lang: 'zh-CN' | 'vi';
  serverSpeed: number;
  playbackRate: number;
  pitch: number;
  volume: number;
  persona: TTSVoicePersona;
  preferredURI?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}) {
  const token = activePlaybackToken;
  const { text, lang, serverSpeed, playbackRate, pitch, volume, persona, preferredURI, onStart, onEnd, onError } = params;

  const fallbackLang = lang === 'vi' ? 'vi-VN' : 'zh-CN';

  // If browser cannot construct Audio or fetch, fall back cleanly
  if (typeof window === 'undefined' || typeof Audio === 'undefined' || typeof fetch === 'undefined') {
    speakViaWebSpeechFallback(
      text,
      fallbackLang,
      playbackRate,
      pitch,
      volume,
      persona,
      preferredURI,
      token,
      onStart,
      onEnd,
      onError
    );
    return;
  }

  const rawCacheKey = `${lang}:${serverSpeed.toFixed(2)}:${text}`;
  const shiftedCacheKey = `${lang}:${persona}:${serverSpeed.toFixed(2)}:${text}`;

  try {
    let rawBytes = rawArrayBufferCache.get(rawCacheKey);

    if (!rawBytes) {
      const controller = new AbortController();
      activeAbortController = controller;
      const fetchTimeout = setTimeout(() => controller.abort(), 9000);

      const useGet = text.length <= 400;
      const res = useGet
        ? await fetch(
            `/api/tts?lang=${encodeURIComponent(lang)}&speed=${encodeURIComponent(serverSpeed.toFixed(2))}&text=${encodeURIComponent(text)}`,
            { signal: controller.signal }
          )
        : await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang, speed: serverSpeed }),
            signal: controller.signal,
          });

      clearTimeout(fetchTimeout);
      if (activeAbortController === controller) {
        activeAbortController = null;
      }

      if (token !== activePlaybackToken) return;
      if (!res.ok) {
        throw new Error(`TTS API HTTP ${res.status}`);
      }

      const arr = await res.arrayBuffer();
      if (arr.byteLength < 100) {
        throw new Error('Empty TTS audio received');
      }
      rawBytes = arr;
      setBoundedCache(rawArrayBufferCache, rawCacheKey, rawBytes);
    }

    if (token !== activePlaybackToken) return;

    // For Chinese: synthesize distinct persona timbre (Female / Male / Adult Teacher / Child)
    // via Web Audio API WSOLA pitch-shift + 3-band vocal formant EQ while keeping exact tempo.
    const ctx = lang === 'zh-CN' ? getOrCreateAudioContext() : null;
    if (ctx && lang === 'zh-CN') {
      try {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        if (token !== activePlaybackToken) return;

        const profile = PERSONA_ACOUSTIC_PROFILES[persona] || PERSONA_ACOUSTIC_PROFILES.female;
        let playBuffer = shiftedAudioBufferCache.get(shiftedCacheKey);
        if (!playBuffer) {
          const decoded = await ctx.decodeAudioData(rawBytes.slice(0));
          if (token !== activePlaybackToken) return;
          playBuffer = createPersonaShiftedBuffer(ctx, decoded, profile.pitchFactor);
          setBoundedCache(shiftedAudioBufferCache, shiftedCacheKey, playBuffer);
        }

        if (token !== activePlaybackToken) return;

        const source = ctx.createBufferSource();
        source.buffer = playBuffer;
        source.playbackRate.value = Math.max(0.55, Math.min(1.65, profile.pitchFactor * playbackRate));

        const lowShelf = ctx.createBiquadFilter();
        lowShelf.type = 'lowshelf';
        lowShelf.frequency.value = 160;
        lowShelf.gain.value = profile.lowShelfDb;

        const midPeak = ctx.createBiquadFilter();
        midPeak.type = 'peaking';
        midPeak.frequency.value = profile.midPeakFreq;
        midPeak.Q.value = 1.1;
        midPeak.gain.value = profile.midPeakDb;

        const highShelf = ctx.createBiquadFilter();
        highShelf.type = 'highshelf';
        highShelf.frequency.value = 3200;
        highShelf.gain.value = profile.highShelfDb;

        const gainNode = ctx.createGain();
        gainNode.gain.value = Math.max(0, Math.min(1, volume));

        source.connect(lowShelf);
        lowShelf.connect(midPeak);
        midPeak.connect(highShelf);
        highShelf.connect(gainNode);
        gainNode.connect(ctx.destination);

        activeBufferSource = source;

        let ended = false;
        const finishWebAudio = () => {
          if (ended) return;
          ended = true;
          if (currentSafetyTimeout) {
            clearTimeout(currentSafetyTimeout);
            currentSafetyTimeout = null;
          }
          if (activeBufferSource === source) {
            activeBufferSource = null;
          }
          try {
            source.disconnect();
            lowShelf.disconnect();
            midPeak.disconnect();
            highShelf.disconnect();
            gainNode.disconnect();
          } catch {
            // ignore
          }
          if (token === activePlaybackToken) {
            isCurrentlySpeaking = false;
            onEnd?.();
          }
        };

        source.onended = finishWebAudio;
        const estDurationMs = (playBuffer.duration / source.playbackRate.value) * 1000;
        currentSafetyTimeout = setTimeout(finishWebAudio, Math.max(3500, estDurationMs + 2500));

        isCurrentlySpeaking = true;
        onStart?.();
        source.start(0);
        return;
      } catch {
        // Fall through seamlessly to HTMLAudioElement if Web Audio decode/resume fails
      }
    }

    if (token !== activePlaybackToken) return;

    let objectUrl = audioBlobUrlCache.get(rawCacheKey);
    if (!objectUrl) {
      const blob = new Blob([rawBytes], { type: 'audio/mpeg' });
      objectUrl = URL.createObjectURL(blob);
      setCachedAudioUrl(rawCacheKey, objectUrl);
    }

    const audio = new Audio(objectUrl);
    activeAudioElement = audio;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.playbackRate = Math.max(0.65, Math.min(1.4, playbackRate));
    if ('preservesPitch' in audio) {
      (audio as any).preservesPitch = true;
    }

    let ended = false;
    const finishAudio = () => {
      if (ended) return;
      ended = true;
      if (currentSafetyTimeout) {
        clearTimeout(currentSafetyTimeout);
        currentSafetyTimeout = null;
      }
      if (activeAudioElement === audio) {
        activeAudioElement = null;
      }
      if (token === activePlaybackToken) {
        isCurrentlySpeaking = false;
        onEnd?.();
      }
    };

    audio.onplay = () => {
      if (token !== activePlaybackToken) return;
      isCurrentlySpeaking = true;
      onStart?.();
    };
    audio.onended = finishAudio;
    audio.onerror = () => {
      if (token !== activePlaybackToken) return;
      if (activeAudioElement === audio) activeAudioElement = null;
      speakViaWebSpeechFallback(
        text,
        fallbackLang,
        playbackRate,
        pitch,
        volume,
        persona,
        preferredURI,
        token,
        onStart,
        onEnd,
        onError
      );
    };

    const maxWaitMs = Math.max(5000, text.length * 260 + 4000);
    currentSafetyTimeout = setTimeout(finishAudio, maxWaitMs);

    await audio.play();
  } catch {
    if (token !== activePlaybackToken) return;
    speakViaWebSpeechFallback(
      text,
      fallbackLang,
      playbackRate,
      pitch,
      volume,
      persona,
      preferredURI,
      token,
      onStart,
      onEnd,
      onError
    );
  }
}

/**
 * Strips parenthetical Pinyin/Latin annotations (e.g. "好（hào）" or "(Nǐ hǎo)")
 * so Chinese TTS only speaks authentic Chinese characters cleanly.
 */
export function cleanChineseTextForTTS(text: string): string {
  const withoutParens = text.replace(/[（(][^）)]*[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ][^）)]*[）)]/g, '');
  return withoutParens.replace(/\s+/g, ' ').trim();
}

/**
 * Core Chinese TTS speaking function: uses OS-independent Neural MP3 (/api/tts)
 * with local browser fallback so every machine pronounces clearly.
 */
export function speakChinese(text: string, options: SpeakOptions = {}): () => void {
  if (typeof window === 'undefined' || (!('speechSynthesis' in window) && typeof Audio === 'undefined')) {
    options.onError?.(new Error('Audio synthesis is not supported in this environment.'));
    setTimeout(() => {
      options.onEnd?.();
    }, 1000);
    return () => {};
  }

  const cleanText = cleanChineseTextForTTS(text);
  if (!cleanText) {
    options.onEnd?.();
    return () => {};
  }

  stopCurrentPlaybackInternal();

  const settings = getStoredTTSSettings();
  const activePersonaId = options.persona || settings.persona;
  const personaConfig: TTSPersonaConfig = TTS_PERSONAS[activePersonaId] || TTS_PERSONAS.female;

  const baseSpeed = options.speedRate !== undefined ? options.speedRate : settings.speedRate;
  const personaRateFactor = personaConfig.defaultRate / 0.88;
  const effectiveRate = Math.max(0.7, Math.min(1.25, baseSpeed * personaRateFactor));
  const effectivePitch = options.pitch !== undefined ? options.pitch : personaConfig.defaultPitch;
  const effectiveVolume = options.volume !== undefined ? options.volume : settings.volume;

  // Always prefer universal server Neural MP3 (/api/tts) at studio speed=1.0
  // with smooth client playbackRate scaling so Chinese never gets misread as Pinyin.
  void playUniversalNeuralTTS({
    text: cleanText,
    lang: 'zh-CN',
    serverSpeed: 1.0,
    playbackRate: effectiveRate,
    pitch: effectivePitch,
    volume: effectiveVolume,
    persona: activePersonaId,
    preferredURI: settings.preferredVoiceURI,
    onStart: options.onStart,
    onEnd: options.onEnd,
    onError: options.onError,
  });

  return () => {
    stopChineseSpeech();
  };
}

export interface CharByCharOptions {
  pauseMs?: number;
  speedRate?: number;
  onCharIndex?: (idx: number | null) => void;
  onEnd?: () => void;
}

/**
 * Speaks a Chinese string character-by-character with a clear pause between each syllable.
 */
export function speakChineseCharByChar(
  text: string,
  options: CharByCharOptions = {}
): () => void {
  const chars = Array.from(text.replace(/\s+/g, ''));
  if (chars.length === 0) {
    options.onEnd?.();
    return () => {};
  }

  stopChineseSpeech();
  charSequenceCancelled = false;

  const pauseMs = options.pauseMs ?? 450;
  const speedRate = options.speedRate ?? 0.72;
  const punctuationRegex = /^[，。！？、；：“”‘’（）,.!?;:()"\-—…]+$/;

  const speakAtIndex = (index: number) => {
    if (charSequenceCancelled || index >= chars.length) {
      options.onCharIndex?.(null);
      options.onEnd?.();
      return;
    }

    const ch = chars[index];
    options.onCharIndex?.(index);

    if (punctuationRegex.test(ch)) {
      charSequenceTimeout = setTimeout(() => {
        speakAtIndex(index + 1);
      }, 220);
      return;
    }

    speakChinese(ch, {
      speedRate,
      onEnd: () => {
        if (charSequenceCancelled) {
          options.onCharIndex?.(null);
          return;
        }
        charSequenceTimeout = setTimeout(() => {
          speakAtIndex(index + 1);
        }, pauseMs);
      },
      onError: () => {
        if (charSequenceCancelled) {
          options.onCharIndex?.(null);
          return;
        }
        charSequenceTimeout = setTimeout(() => {
          speakAtIndex(index + 1);
        }, pauseMs);
      },
    });
  };

  speakAtIndex(0);

  return () => {
    stopChineseSpeech();
    options.onCharIndex?.(null);
  };
}

/**
 * Speaks Vietnamese text cleanly for any sentence length using Neural TTS MP3 (/api/tts)
 * with chunked Web Speech fallback.
 */
export function speakVietnamese(
  text: string,
  options: { speedRate?: number; onStart?: () => void; onEnd?: () => void } = {}
): () => void {
  if (typeof window === 'undefined' || (!('speechSynthesis' in window) && typeof Audio === 'undefined')) {
    setTimeout(() => {
      options.onEnd?.();
    }, 600);
    return () => {};
  }

  const cleanText = text.trim();
  if (!cleanText) {
    options.onEnd?.();
    return () => {};
  }

  stopCurrentPlaybackInternal();

  const settings = getStoredTTSSettings();
  const viRate = options.speedRate ?? 0.96;

  void playUniversalNeuralTTS({
    text: cleanText,
    lang: 'vi',
    serverSpeed: 1.0,
    playbackRate: viRate,
    pitch: 1.0,
    volume: settings.volume,
    persona: settings.persona,
    onStart: options.onStart,
    onEnd: options.onEnd,
  });

  return () => {
    stopChineseSpeech();
  };
}
