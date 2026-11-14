'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  ExternalLink,
  Volume2,
  BookOpen,
  Music,
  Video,
  FileText,
  RotateCw,
  Eye,
  Tv,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { CuratedMediaItem } from '@/lib/curriculum/media-resources';
import { ThematicFlashcardSet, ThematicFlashcardWord } from '@/lib/curriculum/topic-flashcards';
import { speakChinese } from '@/lib/tts';

export interface SupplementaryMediaBlockProps {
  lessonId: string;
  supplementaryMedia?: CuratedMediaItem[];
  thematicFlashcardSet?: ThematicFlashcardSet;
}

export function SupplementaryMediaBlock({
  lessonId,
  supplementaryMedia = [],
  thematicFlashcardSet,
}: SupplementaryMediaBlockProps) {
  const [activeMediaModal, setActiveMediaModal] = useState<CuratedMediaItem | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);
  const [isPlayingWordAudio, setIsPlayingWordAudio] = useState(false);

  const hasContent = !!thematicFlashcardSet || supplementaryMedia.length > 0;
  if (!hasContent) return null;

  const playPronunciation = (text: string) => {
    setIsPlayingWordAudio(true);
    speakChinese(text, {
      onEnd: () => setIsPlayingWordAudio(false),
      onError: () => setIsPlayingWordAudio(false),
    });
  };

  const currentFlashcardWord: ThematicFlashcardWord | undefined =
    thematicFlashcardSet?.words[selectedWordIndex];

  return (
    <div className="space-y-6 pt-4 border-t border-gray-200/80 my-8">
      {/* Block Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
              Tài Nguyên Học Liệu Đa Phương Tiện Mở Rộng
            </h2>
            <p className="text-xs text-gray-500">
              Nguồn học liệu từ các kênh giáo dục chuẩn HSK, Flashcard trực quan & bài hát sinh động.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="w-fit border-amber-300 text-amber-800 bg-amber-50/50">
          Tài nguyên chuẩn lọc
        </Badge>
      </div>

      {/* 1. Thematic Flashcards Section */}
      {thematicFlashcardSet && (
        <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-amber-50/30 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-emerald-600 text-white font-bold">
                  {thematicFlashcardSet.relatedHskLevel}
                </Badge>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {thematicFlashcardSet.topic}
                </h3>
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                {thematicFlashcardSet.descriptionVi}
              </p>
            </div>
            <a
              href={thematicFlashcardSet.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-100/70 hover:bg-emerald-200/70 px-3 py-1.5 rounded-xl transition-colors w-fit"
            >
              <Tv className="w-3.5 h-3.5 text-emerald-700" />
              <span>Xem trên YouTube</span>
              <ExternalLink className="w-3 h-3 text-emerald-700" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Embedded YouTube Thematic Video */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-emerald-200 bg-black shadow-sm">
                <iframe
                  src={`https://www.youtube.com/embed/${thematicFlashcardSet.videoId}?rel=0`}
                  title={thematicFlashcardSet.topic}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-2 flex items-center justify-between">
                <span>Nguồn video: GamelearnChinese & A Little Chinese</span>
                <span className="font-semibold text-emerald-700">Bộ từ vựng tương tác</span>
              </p>
            </div>

            {/* Interactive Flashcard Card & Word Selector */}
            <div className="lg:col-span-5 space-y-4">
              {currentFlashcardWord && (
                <div className="rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      Từ {selectedWordIndex + 1}/{thematicFlashcardSet.words.length}
                    </span>
                    <button
                      onClick={() => playPronunciation(currentFlashcardWord.hanzi)}
                      className={`p-2 rounded-xl transition-all ${
                        isPlayingWordAudio
                          ? 'bg-emerald-600 text-white scale-110'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif tracking-wide">
                      {currentFlashcardWord.hanzi}
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-emerald-700 mt-1 font-mono">
                      {currentFlashcardWord.pinyin}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mt-1">
                      {currentFlashcardWord.vietnamese}
                    </div>
                  </div>

                  {currentFlashcardWord.exampleSentence && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                      <div className="font-semibold text-gray-900 flex items-center justify-between">
                        <span>{currentFlashcardWord.exampleSentence}</span>
                        <button
                          onClick={() => playPronunciation(currentFlashcardWord.exampleSentence!)}
                          className="text-gray-400 hover:text-emerald-700"
                          title="Đọc câu ví dụ"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-emerald-700 font-mono text-[11px]">
                        {currentFlashcardWord.examplePinyin}
                      </div>
                      <div className="text-gray-500 italic text-[11px]">
                        {currentFlashcardWord.exampleVi}
                      </div>
                    </div>
                  )}

                  {/* Word Selector Chips */}
                  <div className="pt-2">
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Chọn nhanh từ vựng:
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                      {thematicFlashcardSet.words.map((word, idx) => {
                        const isSelected = idx === selectedWordIndex;
                        return (
                          <button
                            key={word.id}
                            onClick={() => setSelectedWordIndex(idx)}
                            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                              isSelected
                                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {word.hanzi}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Supplementary Media Cards Grid */}
      {supplementaryMedia.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-600" />
              <span>Video bài hát, phát âm & câu chuyện liên quan bài học</span>
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              {supplementaryMedia.length} học liệu liên kết
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplementaryMedia.map((media) => {
              const isEmbed = media.sanitizedInfo.isEmbeddable;

              return (
                <div
                  key={media.id}
                  className="rounded-2xl border border-gray-200/90 bg-white p-4.5 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="info"
                        size="sm"
                        className="text-[10px] font-bold uppercase tracking-wider"
                      >
                        {media.category}
                      </Badge>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {media.hskLevel}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                      {media.title}
                    </h4>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {media.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {media.recommendedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-medium truncate max-w-[140px]">
                      {media.channelOrAuthor || 'Tài nguyên chuẩn'}
                    </span>

                    {isEmbed ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setActiveMediaModal(media)}
                        leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                        className="text-xs py-1 px-3"
                      >
                        Phát ngay
                      </Button>
                    ) : (
                      <a
                        href={media.sanitizedInfo.safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <span>Mở liên kết</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Embedded Video Dialog Modal */}
      {activeMediaModal && (
        <Dialog
          isOpen={!!activeMediaModal}
          onClose={() => setActiveMediaModal(null)}
          title={activeMediaModal.title}
          description={activeMediaModal.description}
          className="max-w-3xl"
        >
          <div className="py-2 space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={activeMediaModal.sanitizedInfo.embedUrl}
                title={activeMediaModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Kênh:</span>
                <span>{activeMediaModal.channelOrAuthor || 'Kênh chuẩn'}</span>
              </div>
              <a
                href={activeMediaModal.sanitizedInfo.safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>Mở trong tab mới</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
