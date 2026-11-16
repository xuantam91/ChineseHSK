'use client';

import {
  TTSVoicePersona,
  TTSSettings,
  DEFAULT_TTS_SETTINGS,
  TTS_PERSONAS,
  TTSPersonaConfig,
} from './types';

const STORAGE_KEY_TTS = 'chinese_journey_tts_settings';
export const TTS_SETTINGS_EVENT = 'tts_settings_changed';

// In-memory cached voices
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;
let isCurrentlySpeaking = false;
let currentSafetyTimeout: ReturnType<typeof setTimeout> | null = null;
let charSequenceCancelled = false;
let charSequenceTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Initializes and fetches available system voices.
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
        voicesLoaded = true;
        resolve(voices);
        return true;
      }
      return false;
    };

    if (checkVoices()) return;

    // Listen to async voice change event (needed for Chrome, Safari, Edge)
    window.speechSynthesis.onvoiceschanged = () => {
      checkVoices();
    };

    // Fallback timer if event never triggers
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

  // 1. Check if user has explicitly saved preferred voice URI
  if (preferredURI) {
    const match = chineseVoices.find((v) => v.voiceURI === preferredURI);
    if (match) return match;
  }

  // Helper matchers
  const femaleKeywords = ['tingting', 'ting-ting', 'huihui', 'xiaoxiao', 'xiaoyi', 'meijia', 'sinji', 'female', 'woman', 'zhimin', 'google 普通话'];
  const maleKeywords = ['kangkang', 'yunxi', 'yunyang', 'yunjian', 'limu', 'danny', 'male', 'man'];
  const childKeywords = ['yaoyao', 'yushu', 'child', 'kid', 'young'];

  if (persona === 'child') {
    const childMatch = chineseVoices.find((v) => {
      const name = v.name.toLowerCase();
      return childKeywords.some((k) => name.includes(k));
    });
    if (childMatch) return childMatch;
  } else if (persona === 'male') {
    const maleMatch = chineseVoices.find((v) => {
      const name = v.name.toLowerCase();
      return maleKeywords.some((k) => name.includes(k));
    });
    if (maleMatch) return maleMatch;
  } else if (persona === 'female' || persona === 'adult') {
    const femaleMatch = chineseVoices.find((v) => {
      const name = v.name.toLowerCase();
      return femaleKeywords.some((k) => name.includes(k));
    });
    if (femaleMatch) return femaleMatch;
  }

  // Prioritize Mainland Mandarin (zh-CN) over others
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
  speedRate?: number; // Override speed
  pitch?: number; // Override pitch
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Stops any active Chinese speech playback immediately.
 */
export function stopChineseSpeech(): void {
  charSequenceCancelled = true;
  if (charSequenceTimeout) {
    clearTimeout(charSequenceTimeout);
    charSequenceTimeout = null;
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
 * Checks if Speech Synthesis is currently speaking.
 */
export function isSpeaking(): boolean {
  return isCurrentlySpeaking;
}

/**
 * Core Chinese TTS speaking function with native persona optimization.
 */
export function speakChinese(text: string, options: SpeakOptions = {}): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onError?.(new Error('Web Speech API is not supported in this browser.'));
    // Graceful callback
    setTimeout(() => {
      options.onEnd?.();
    }, 1000);
    return () => {};
  }

  const cleanText = text.trim();
  if (!cleanText) {
    options.onEnd?.();
    return () => {};
  }

  // Cancel prior speech
  stopChineseSpeech();

  const settings = getStoredTTSSettings();
  const activePersonaId = options.persona || settings.persona;
  const personaConfig: TTSPersonaConfig = TTS_PERSONAS[activePersonaId] || TTS_PERSONAS.female;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Set Chinese language tag
  utterance.lang = 'zh-CN';

  // Calculate speed: combine user speedRate setting with persona defaultRate
  const baseSpeed = options.speedRate !== undefined ? options.speedRate : settings.speedRate;
  const personaRateFactor = personaConfig.defaultRate / 0.88; // relative adjustment
  utterance.rate = Math.max(0.5, Math.min(1.5, baseSpeed * personaRateFactor));

  // Calculate pitch
  utterance.pitch = options.pitch !== undefined ? options.pitch : personaConfig.defaultPitch;

  // Calculate volume
  utterance.volume = options.volume !== undefined ? options.volume : settings.volume;

  // Match optimal Chinese voice
  const matchingVoice = findBestVoiceForPersona(activePersonaId, settings.preferredVoiceURI);
  if (matchingVoice) {
    utterance.voice = matchingVoice;
    // Align language tag with voice's exact tag if zh
    if (matchingVoice.lang) {
      utterance.lang = matchingVoice.lang;
    }
  }

  let hasEnded = false;
  const finish = (isError = false, errorObj?: any) => {
    if (hasEnded) return;
    hasEnded = true;
    isCurrentlySpeaking = false;
    if (currentSafetyTimeout) {
      clearTimeout(currentSafetyTimeout);
      currentSafetyTimeout = null;
    }

    if (isError) {
      options.onError?.(errorObj);
    }
    options.onEnd?.();
  };

  utterance.onstart = () => {
    isCurrentlySpeaking = true;
    options.onStart?.();
  };

  utterance.onend = () => {
    finish(false);
  };

  utterance.onerror = (e) => {
    // Interrupted speech is normal on quick user clicking, not a critical error
    if (e.error === 'interrupted' || e.error === 'canceled') {
      finish(false);
    } else {
      finish(true, e);
    }
  };

  // Safety fallback timeout: estimate duration based on character count
  // (~250ms per Chinese character at standard speed)
  const estimatedDurationMs = Math.max(2500, (cleanText.length * 350) / utterance.rate + 1500);
  currentSafetyTimeout = setTimeout(() => {
    if (isCurrentlySpeaking && !hasEnded) {
      finish(false);
    }
  }, estimatedDurationMs);

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    finish(true, err);
  }

  // Return cancel function
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
 * Speaks a Chinese string character-by-character with a clear pause between each syllable,
 * calling onCharIndex(idx) so UI can highlight each character for the learner to follow.
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
  const speedRate = options.speedRate ?? 0.68;
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
