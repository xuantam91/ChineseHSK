'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TTSVoicePersona,
  TTSSettings,
  DEFAULT_TTS_SETTINGS,
  TTS_PERSONAS,
  TTSPersonaConfig,
} from './types';
import {
  getStoredTTSSettings,
  saveTTSSettings,
  speakChinese,
  stopChineseSpeech,
  initTTSVoices,
  getAvailableChineseVoices,
  TTS_SETTINGS_EVENT,
  SpeakOptions,
} from './tts-service';

export function useTTS() {
  const [settings, setSettings] = useState<TTSSettings>(DEFAULT_TTS_SETTINGS);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load initial settings and voices
  useEffect(() => {
    setSettings(getStoredTTSSettings());
    setIsReady(true);

    initTTSVoices().then((voices) => {
      setAvailableVoices(getAvailableChineseVoices());
    });

    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<TTSSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(getStoredTTSSettings());
      }
    };

    window.addEventListener(TTS_SETTINGS_EVENT, handleSettingsChange);
    return () => {
      window.removeEventListener(TTS_SETTINGS_EVENT, handleSettingsChange);
    };
  }, []);

  const updatePersona = useCallback((persona: TTSVoicePersona) => {
    const updated = saveTTSSettings({ persona });
    setSettings(updated);
  }, []);

  const updateSpeedRate = useCallback((speedRate: number) => {
    const updated = saveTTSSettings({ speedRate });
    setSettings(updated);
  }, []);

  const updatePreferredVoice = useCallback((preferredVoiceURI: string) => {
    const updated = saveTTSSettings({ preferredVoiceURI });
    setSettings(updated);
  }, []);

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      setIsSpeaking(true);

      return speakChinese(text, {
        ...options,
        onStart: () => {
          setIsSpeaking(true);
          options.onStart?.();
        },
        onEnd: () => {
          setIsSpeaking(false);
          options.onEnd?.();
        },
        onError: (err) => {
          setIsSpeaking(false);
          options.onError?.(err);
        },
      });
    },
    []
  );

  const stop = useCallback(() => {
    stopChineseSpeech();
    setIsSpeaking(false);
  }, []);

  const currentPersonaConfig: TTSPersonaConfig =
    TTS_PERSONAS[settings.persona] || TTS_PERSONAS.female;

  return {
    settings,
    currentPersonaConfig,
    isSpeaking,
    isReady,
    availableVoices,
    updatePersona,
    updateSpeedRate,
    updatePreferredVoice,
    speak,
    stop,
  };
}
