'use client';

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Check,
  User,
  Sparkles,
  ChevronDown,
  Settings2,
} from 'lucide-react';
import { useTTS } from '@/lib/tts/useTTS';
import { TTSVoicePersona, TTS_PERSONAS } from '@/lib/tts/types';

interface TTSVoiceSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
  showSpeedControl?: boolean;
}

export function TTSVoiceSelector({
  variant = 'compact',
  className = '',
  showSpeedControl = true,
}: TTSVoiceSelectorProps) {
  const {
    settings,
    currentPersonaConfig,
    isSpeaking,
    updatePersona,
    updateSpeedRate,
    speak,
    stop,
    availableVoices,
  } = useTTS();

  const [testingPersona, setTestingPersona] = useState<TTSVoicePersona | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTestVoice = (e: React.MouseEvent, persona: TTSVoicePersona) => {
    e.stopPropagation();
    if (isSpeaking && testingPersona === persona) {
      stop();
      setTestingPersona(null);
      return;
    }

    setTestingPersona(persona);
    const cfg = TTS_PERSONAS[persona];
    speak(cfg.sampleSentenceZh, {
      persona,
      onEnd: () => setTestingPersona(null),
      onError: () => setTestingPersona(null),
    });
  };

  // 1. DROPDOWN COMPACT VARIANT (Great for floating / toolbars in lessons)
  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-colors"
          title="Chọn giọng đọc tiếng Trung"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>{currentPersonaConfig.nameVi.split(' ')[1] || currentPersonaConfig.nameVi}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {settings.speedRate === 0.75 ? '0.75x' : settings.speedRate === 1.0 ? '1.0x' : '0.88x'}
          </span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-white border border-slate-200 shadow-lg p-3 z-50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Chọn giọng đọc tiếng Trung</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                  Chuẩn Bắc Kinh
                </span>
              </div>

              {/* Persona Options */}
              <div className="space-y-1.5">
                {(['female', 'male', 'adult', 'child'] as TTSVoicePersona[]).map((pKey) => {
                  const cfg = TTS_PERSONAS[pKey];
                  const isSelected = settings.persona === pKey;
                  const isTestingThis = isSpeaking && testingPersona === pKey;

                  return (
                    <div
                      key={pKey}
                      onClick={() => {
                        updatePersona(pKey);
                      }}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{cfg.nameVi}</div>
                          <div className="text-[10px] text-slate-500">{cfg.subtitleVi}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleTestVoice(e, pKey)}
                        className={`p-1.5 rounded-md border text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                          isTestingThis
                            ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                            : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="Nghe thử giọng mẫu"
                      >
                        {isTestingThis ? (
                          <>
                            <Square className="w-2.5 h-2.5 fill-current" />
                            <span>Dừng</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Thử</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Speed selector */}
              {showSpeedControl && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Tốc độ phát âm:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { rate: 0.75, label: '0.75x Chậm' },
                      { rate: 0.88, label: '0.88x Chuẩn' },
                      { rate: 1.0, label: '1.0x Nhanh' },
                    ].map((spd) => (
                      <button
                        key={spd.rate}
                        type="button"
                        onClick={() => updateSpeedRate(spd.rate)}
                        className={`py-1 text-center rounded border text-xs font-semibold transition-colors ${
                          settings.speedRate === spd.rate
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {spd.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // 2. COMPACT SEGMENTED BUTTON BAR (Great for toolbar / flashcards / pinyin)
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['female', 'male', 'adult', 'child'] as TTSVoicePersona[]).map((pKey) => {
            const cfg = TTS_PERSONAS[pKey];
            const isSelected = settings.persona === pKey;
            const shortName = pKey === 'female' ? 'Nữ' : pKey === 'male' ? 'Nam' : pKey === 'adult' ? 'Người lớn' : 'Trẻ em';

            return (
              <button
                key={pKey}
                type="button"
                onClick={() => updatePersona(pKey)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                  isSelected
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Speed button pills */}
        {showSpeedControl && (
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {[
              { rate: 0.75, label: '0.75x' },
              { rate: 0.88, label: '0.88x' },
              { rate: 1.0, label: '1.0x' },
            ].map((spd) => (
              <button
                key={spd.rate}
                type="button"
                onClick={() => updateSpeedRate(spd.rate)}
                className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
                  settings.speedRate === spd.rate
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title={`Tốc độ đọc: ${spd.label}`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        )}

        {/* Test voice button */}
        <button
          type="button"
          onClick={(e) => handleTestVoice(e, settings.persona)}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            isSpeaking && testingPersona === settings.persona
              ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
          title="Nghe thử giọng đang chọn"
        >
          {isSpeaking && testingPersona === settings.persona ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span>Dừng</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Nghe thử</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // 3. FULL DETAIL CARDS VARIANT (Ideal for Settings Page & Onboarding)
  return (
    <div className={`space-y-4 ${className}`}>
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(['female', 'male', 'adult', 'child'] as TTSVoicePersona[]).map((pKey) => {
          const cfg = TTS_PERSONAS[pKey];
          const isSelected = settings.persona === pKey;
          const isTestingThis = isSpeaking && testingPersona === pKey;

          return (
            <div
              key={pKey}
              onClick={() => updatePersona(pKey)}
              className={`rounded-xl p-4 border transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-2xs ring-1 ring-emerald-600'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-700 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{cfg.nameVi}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {cfg.badge}
                  </span>
                </div>

                <div className="text-xs font-medium text-emerald-700 mb-1">
                  {cfg.subtitleVi}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {cfg.descriptionVi}
                </p>

                {/* Sample Sentence Preview Box */}
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs">
                  <div className="font-bold text-slate-900 font-sans">{cfg.sampleSentenceZh}</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-0.5">{cfg.sampleSentencePinyin}</div>
                  <div className="text-slate-600 italic text-[11px] mt-0.5">{cfg.sampleSentenceVi}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {isSelected ? 'Đang chọn làm giọng mặc định' : 'Nhấn để chọn giọng này'}
                </span>

                <button
                  type="button"
                  onClick={(e) => handleTestVoice(e, pKey)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    isTestingThis
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs animate-pulse'
                      : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800 shadow-2xs'
                  }`}
                  title="Nghe thử câu thoại mẫu"
                >
                  {isTestingThis ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      <span>Dừng phát</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Nghe thử mẫu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Speed Rate Controller */}
      {showSpeedControl && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Tốc độ phát âm chuẩn hóa (Playback Speed)
              </span>
              <span className="text-xs text-slate-500">
                Tự động tối ưu nhịp điệu khi luyện nghe từ vựng, hội thoại và kiểm tra bài nói.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {[
                { rate: 0.75, label: '0.75x', title: 'Chậm (Luyện âm & Pinyin)' },
                { rate: 0.88, label: '0.88x (Chuẩn)', title: 'Chuẩn sư phạm HSK' },
                { rate: 1.0, label: '1.0x', title: 'Tự nhiên (Đàm thoại thực tế)' },
              ].map((spd) => {
                const isSelected = settings.speedRate === spd.rate;
                return (
                  <button
                    key={spd.rate}
                    type="button"
                    onClick={() => updateSpeedRate(spd.rate)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={spd.title}
                  >
                    {spd.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
