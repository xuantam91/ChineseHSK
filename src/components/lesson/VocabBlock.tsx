'use client';

import React, { useState } from 'react';
import { VocabBlockData, VocabItem } from '@/types';
import { Volume2, Check, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { VocabVisualIcon } from '@/components/ui/VocabVisualIcon';
import { speakChinese } from '@/lib/tts';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';

export interface VocabBlockProps {
  data: VocabBlockData;
}

export function VocabBlock({ data }: VocabBlockProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const playAudio = (item: VocabItem) => {
    if (typeof window === 'undefined') return;

    setPlayingId(item.id);

    // If an audio file URL is provided, play it
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => {
        fallbackSpeechSynthesis(item.hanzi);
      };
      audio.play().catch(() => fallbackSpeechSynthesis(item.hanzi));
    } else {
      fallbackSpeechSynthesis(item.hanzi);
    }
  };

  const fallbackSpeechSynthesis = (text: string) => {
    speakChinese(text, {
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  const copyToClipboard = (item: VocabItem) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(item.hanzi);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        {data.title ? (
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">{data.title}</h3>
            {data.description && (
              <p className="text-sm text-gray-500 mt-0.5">{data.description}</p>
            )}
          </div>
        ) : (
          <div />
        )}
        <div className="self-end sm:self-auto">
          <TTSVoiceSelector variant="dropdown" />
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        {data.items.map((item) => {
          const isPlaying = playingId === item.id;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 md:p-5 shadow-xs transition-all duration-200 hover:border-emerald-200 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <VocabVisualIcon hanzi={item.hanzi} pinyin={item.pinyin} size="md" />
                    <div>
                      <div className="flex items-baseline gap-2">
                        {/* Hanzi */}
                        <span className="font-chinese text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                          {item.hanzi}
                        </span>
                        {/* Pinyin */}
                        <span className="text-sm md:text-base font-semibold text-emerald-700 tracking-wide">
                          {item.pinyin}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {item.hskLevel && (
                      <Badge variant="outline" size="sm">
                        HSK {item.hskLevel}
                      </Badge>
                    )}

                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(item)}
                      title="Sao chép chữ Hán"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label="Sao chép"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Audio Pronunciation Button */}
                    <button
                      onClick={() => playAudio(item)}
                      title="Nghe phát âm chuẩn"
                      className={`p-2 rounded-xl transition-all ${
                        isPlaying
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                      aria-label="Phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Meaning */}
                <div className="text-sm font-semibold text-gray-800 mb-2.5">
                  <span className="text-xs uppercase font-bold text-gray-400 mr-1.5">Nghĩa:</span>
                  {item.meaningVi}
                </div>
              </div>

              {/* Example */}
              {item.exampleSentence && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-50 rounded-lg bg-gray-50/70 p-2.5 text-xs">
                  <div className="font-chinese text-sm font-medium text-gray-900 mb-0.5">
                    {item.exampleSentence}
                  </div>
                  {item.exampleTranslation && (
                    <div className="text-gray-500 italic">
                      {item.exampleTranslation}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
