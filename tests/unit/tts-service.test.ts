import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  TTS_PERSONAS,
  DEFAULT_TTS_SETTINGS,
  TTSVoicePersona,
} from '@/lib/tts/types';
import {
  getStoredTTSSettings,
  saveTTSSettings,
  findBestVoiceForPersona,
  getAvailableChineseVoices,
  speakChinese,
  stopChineseSpeech,
  isSpeaking,
} from '@/lib/tts/tts-service';

describe('TTS Engine & Voice Personas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stopChineseSpeech();
  });

  afterEach(() => {
    stopChineseSpeech();
  });

  it('defines all 4 required personas with valid Chinese speech parameters', () => {
    const requiredPersonas: TTSVoicePersona[] = ['female', 'male', 'adult', 'child'];

    for (const persona of requiredPersonas) {
      const config = TTS_PERSONAS[persona];
      expect(config).toBeDefined();
      expect(config.id).toBe(persona);
      expect(config.nameVi).toBeTruthy();
      expect(config.descriptionVi).toBeTruthy();
      expect(config.sampleSentenceZh).toBeTruthy();
      expect(config.defaultPitch).toBeGreaterThan(0);
      expect(config.defaultRate).toBeGreaterThan(0);
    }

    // Child pitch should be elevated for youthful tone
    expect(TTS_PERSONAS.child.defaultPitch).toBeGreaterThan(TTS_PERSONAS.female.defaultPitch);

    // Male pitch should be lower for deep resonance
    expect(TTS_PERSONAS.male.defaultPitch).toBeLessThan(TTS_PERSONAS.female.defaultPitch);

    // Adult rate should be slower and deliberate for pedagogy
    expect(TTS_PERSONAS.adult.defaultRate).toBeLessThanOrEqual(TTS_PERSONAS.female.defaultRate);
  });

  it('has default TTS settings initialized cleanly', () => {
    expect(DEFAULT_TTS_SETTINGS.persona).toBe('female');
    expect(DEFAULT_TTS_SETTINGS.speedRate).toBe(0.88);
    expect(DEFAULT_TTS_SETTINGS.volume).toBe(1.0);
  });

  it('safely handles non-browser (Node.js) environment without crashing', () => {
    // In node environment, getStoredTTSSettings returns DEFAULT_TTS_SETTINGS
    const settings = getStoredTTSSettings();
    expect(settings).toEqual(DEFAULT_TTS_SETTINGS);

    // getAvailableChineseVoices returns empty array without throwing
    const voices = getAvailableChineseVoices();
    expect(Array.isArray(voices)).toBe(true);

    // findBestVoiceForPersona returns null without throwing
    const best = findBestVoiceForPersona('male');
    expect(best).toBeNull();

    // stopChineseSpeech runs cleanly
    expect(() => stopChineseSpeech()).not.toThrow();
    expect(isSpeaking()).toBe(false);
  });

  it('triggers graceful callbacks when Web Speech API is unavailable', async () => {
    let ended = false;
    let errorReceived = false;

    speakChinese('你好', {
      onEnd: () => {
        ended = true;
      },
      onError: () => {
        errorReceived = true;
      },
    });

    // In node environment without window.speechSynthesis, onError is called immediately
    expect(errorReceived).toBe(true);
  });
});
