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
  speakVietnamese,
  stopChineseSpeech,
  isSpeaking,
  cleanChineseTextForTTS,
} from '@/lib/tts/tts-service';
import { splitTextIntoTTSChunks } from '@/lib/tts/chunker';
import {
  PERSONA_ACOUSTIC_PROFILES,
  transformVoiceTDPSOLA,
} from '@/lib/tts/pitch-shifter';

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

  it('splits long Vietnamese and Chinese sentences into chunks <= 160 chars cleanly', () => {
    const longVi =
      'Xin chào các bạn học viên thân mến, hôm nay chúng ta sẽ cùng luyện tập phát âm tiếng Trung chuẩn Bắc Kinh với bốn thanh điệu cơ bản, quy tắc biến điệu thanh ba đi liền nhau, và các mẫu câu giao tiếp thực tế dùng hàng ngày trong cuộc sống và công việc tại văn phòng.';
    const chunks = splitTextIntoTTSChunks(longVi, 160);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(160);
      expect(c.length).toBeGreaterThan(0);
    }
    expect(chunks.join(' ')).toContain('bốn thanh điệu cơ bản');
  });

  it('handles speakVietnamese cleanly in non-browser environment', () => {
    expect(() => speakVietnamese('Xin chào, đây là câu tiếng Việt thử nghiệm.')).not.toThrow();
  });

  it('strips parenthetical Pinyin and Latin annotations cleanly for Chinese TTS', () => {
    expect(cleanChineseTextForTTS('好（hào）读书')).toBe('好读书');
    expect(cleanChineseTextForTTS('你好 (nǐ hǎo)')).toBe('你好');
    expect(cleanChineseTextForTTS('银行 (háng) / 行为 (xíng)')).toBe('银行 / 行为');
    expect(cleanChineseTextForTTS('我们一起学习汉语。')).toBe('我们一起学习汉语。');
  });

  it('defines distinct acoustic pitch and formant profiles for female, male, adult, and child voices', () => {
    expect(PERSONA_ACOUSTIC_PROFILES.male.pitchRatio).toBeLessThan(0.6);
    expect(PERSONA_ACOUSTIC_PROFILES.male.formantRatio).toBeGreaterThan(0.8);
    expect(PERSONA_ACOUSTIC_PROFILES.adult.pitchRatio).toBeGreaterThan(
      PERSONA_ACOUSTIC_PROFILES.male.pitchRatio
    );
    expect(PERSONA_ACOUSTIC_PROFILES.adult.pitchRatio).toBeLessThan(
      PERSONA_ACOUSTIC_PROFILES.female.pitchRatio
    );
    expect(PERSONA_ACOUSTIC_PROFILES.child.pitchRatio).toBeGreaterThan(1.2);
  });

  it('defaults showPinyin to true and preserves toggle changes cleanly', () => {
    const defaults = getStoredTTSSettings();
    expect(defaults.showPinyin).toBe(true);
    const hidden = saveTTSSettings({ showPinyin: false });
    expect(hidden.showPinyin).toBe(false);
    const restored = saveTTSSettings({ showPinyin: true });
    expect(restored.showPinyin).toBe(true);
  });

  it('transforms pitch & formants via TD-PSOLA while preserving duration and non-zero energy', () => {
    const sampleRate = 24000;
    const len = 12000; // 0.5s periodic harmonic speech-like wave (~240Hz)
    const input = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      input[i] =
        0.5 * Math.sin((2 * Math.PI * 240 * i) / sampleRate) +
        0.25 * Math.sin((2 * Math.PI * 480 * i) / sampleRate);
    }

    const maleBuf = transformVoiceTDPSOLA(
      input,
      sampleRate,
      PERSONA_ACOUSTIC_PROFILES.male.pitchRatio,
      PERSONA_ACOUSTIC_PROFILES.male.formantRatio
    );
    const childBuf = transformVoiceTDPSOLA(
      input,
      sampleRate,
      PERSONA_ACOUSTIC_PROFILES.child.pitchRatio,
      PERSONA_ACOUSTIC_PROFILES.child.formantRatio
    );

    expect(maleBuf.length).toBe(input.length);
    expect(childBuf.length).toBe(input.length);

    let maleEnergy = 0;
    for (let i = 0; i < maleBuf.length; i++) {
      expect(Number.isFinite(maleBuf[i])).toBe(true);
      maleEnergy += Math.abs(maleBuf[i]);
    }
    expect(maleEnergy).toBeGreaterThan(100);
  });
});
