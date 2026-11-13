'use client';

import React, { useState } from 'react';
import { FlashcardBlockData, FlashcardItem } from '@/types';
import { RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Shuffle, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VocabVisualIcon } from '@/components/ui/VocabVisualIcon';

export interface FlashcardBlockProps {
  data: FlashcardBlockData;
}

export function FlashcardBlock({ data }: FlashcardBlockProps) {
  const [cards, setCards] = useState<FlashcardItem[]>(data.cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Record<string, boolean>>({});

  if (!cards || cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentIndex];
  const isMastered = !!masteredIds[currentCard.id];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const toggleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMasteredIds((prev) => ({
      ...prev,
      [currentCard.id]: !prev[currentCard.id],
    }));
  };

  const shuffleCards = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const playPronunciation = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const masteredCount = Object.values(masteredIds).filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            {data.title || 'Flashcard Ôn tập Từ vựng'}
          </h3>
          <p className="text-xs text-gray-500">
            Đã thuộc: <span className="font-bold text-emerald-700">{masteredCount}/{cards.length}</span> thẻ
          </p>
        </div>

        <button
          onClick={shuffleCards}
          title="Xáo trộn thẻ"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Xáo trộn</span>
        </button>
      </div>

      {/* Flip Card Container */}
      <div className="w-full max-w-md mx-auto my-4 perspective-1000">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-72 sm:h-80 cursor-pointer transition-transform duration-500 rounded-3xl p-6 shadow-lg border select-none ${
            isFlipped
              ? 'bg-emerald-900 text-white border-emerald-800'
              : 'bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 text-gray-900 border-emerald-100'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Card Status & Actions Bar */}
          <div className="flex items-center justify-between w-full mb-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isFlipped ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Thẻ {currentIndex + 1} / {cards.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => playPronunciation(e, currentCard.front)}
                title="Nghe phát âm"
                className={`p-1.5 rounded-full transition-colors ${
                  isFlipped ? 'bg-emerald-800 text-white hover:bg-emerald-700' : 'bg-white shadow-xs text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={toggleMastered}
                title={isMastered ? 'Bỏ đánh dấu đã thuộc' : 'Đánh dấu đã thuộc'}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                  isMastered
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : isFlipped
                    ? 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-800'
                    : 'bg-white/80 text-gray-600 hover:bg-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isMastered ? 'Đã thuộc' : 'Chưa thuộc'}</span>
              </button>
            </div>
          </div>

          {/* Card Body */}
          {!isFlipped ? (
            /* Front of Card */
            <div className="flex flex-col items-center justify-center h-[calc(100%-48px)] text-center">
              <VocabVisualIcon hanzi={currentCard.front} pinyin={currentCard.pinyin} size="lg" className="mb-2 shadow-sm" />
              <span className="font-chinese text-4xl sm:text-5xl font-black text-gray-900 mb-2 tracking-wide">
                {currentCard.front}
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-700 tracking-wider">
                {currentCard.pinyin}
              </span>
              <p className="text-[11px] text-gray-400 mt-4 flex items-center gap-1">
                <RotateCw className="w-3 h-3" /> Chạm để lật xem nghĩa
              </p>
            </div>
          ) : (
            /* Back of Card */
            <div className="flex flex-col items-center justify-center h-[calc(100%-48px)] text-center px-2">
              <VocabVisualIcon hanzi={currentCard.front} pinyin={currentCard.pinyin} size="md" className="mb-2 bg-emerald-800/80 border-emerald-700 text-white" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-1">
                Ý nghĩa tiếng Việt
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-4">
                {currentCard.back}
              </h4>
              {currentCard.example && (
                <div className="bg-emerald-950/60 p-3 rounded-2xl w-full text-xs text-emerald-100 border border-emerald-800">
                  <p className="font-chinese text-sm font-semibold mb-0.5 text-white">
                    {currentCard.example}
                  </p>
                  {currentCard.exampleTranslation && (
                    <p className="text-emerald-300 opacity-90">{currentCard.exampleTranslation}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Trước
        </Button>
        <span className="text-xs font-semibold text-gray-500">
          {currentIndex + 1} / {cards.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
}
