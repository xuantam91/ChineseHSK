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
  timeStretchFloat32,
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

  it('defines distinct acoustic pitch profiles for female, male, adult, and child voices', () => {
    expect(PERSONA_ACOUSTIC_PROFILES.male.pitchFactor).toBeLessThan(0.8);
    expect(PERSONA_ACOUSTIC_PROFILES.adult.pitchFactor).toBeGreaterThan(
      PERSONA_ACOUSTIC_PROFILES.male.pitchFactor
    );
    expect(PERSONA_ACOUSTIC_PROFILES.adult.pitchFactor).toBeLessThan(
      PERSONA_ACOUSTIC_PROFILES.female.pitchFactor
    );
    expect(PERSONA_ACOUSTIC_PROFILES.child.pitchFactor).toBeGreaterThan(1.2);
  });

  it('time-stretches audio cleanly via WSOLA without NaN or zeroed output', () => {
    const sampleRate = 24000;
    const len = 12000; // 0.5s sine wave at 220Hz
    const input = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      input[i] = Math.sin((2 * Math.PI * 220 * i) / sampleRate) * 0.5;
    }

    const maleBuf = timeStretchFloat32(input, sampleRate, PERSONA_ACOUSTIC_PROFILES.male.pitchFactor);
    const childBuf = timeStretchFloat32(input, sampleRate, PERSONA_ACOUSTIC_PROFILES.child.pitchFactor);

    expect(maleBuf.length).toBeLessThan(input.length);
    expect(childBuf.length).toBeGreaterThan(input.length);

    let maleEnergy = 0;
    for (let i = 0; i < maleBuf.length; i++) {
      expect(Number.isFinite(maleBuf[i])).toBe(true);
      maleEnergy += Math.abs(maleBuf[i]);
    }
    expect(maleEnergy).toBeGreaterThan(100);
  });
});
