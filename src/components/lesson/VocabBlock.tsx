'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VocabBlockData, VocabItem } from '@/types';
import {
  Volume2,
  Check,
  Copy,
  PenTool,
  Eraser,
  X,
  Play,
  Square,
  SkipBack,
  SkipForward,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VocabVisualIcon } from '@/components/ui/VocabVisualIcon';
import { speakChinese, speakVietnamese, stopChineseSpeech } from '@/lib/tts';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';

export interface VocabBlockProps {
  data: VocabBlockData;
}

type SeqPhase =
  | 'word-1'
  | 'word-2'
  | 'word-3'
  | 'meaning-1'
  | 'example-1'
  | 'example-2'
  | 'example-meaning-1'
  | null;

function getPhaseLabelVi(phase: SeqPhase): string {
  switch (phase) {
    case 'word-1':
      return 'Từ tiếng Trung (Lần 1/3)';
    case 'word-2':
      return 'Từ tiếng Trung (Lần 2/3)';
    case 'word-3':
      return 'Từ tiếng Trung (Lần 3/3)';
    case 'meaning-1':
      return 'Nghĩa từ tiếng Việt (1 lần)';
    case 'example-1':
      return 'Câu tiếng Trung (Lần 1/2)';
    case 'example-2':
      return 'Câu tiếng Trung (Lần 2/2)';
    case 'example-meaning-1':
      return 'Nghĩa câu tiếng Việt (1 lần)';
    default:
      return '';
  }
}

export function VocabBlock({ data }: VocabBlockProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [writingItem, setWritingItem] = useState<VocabItem | null>(null);
  const [activeCharIdx, setActiveCharIdx] = useState(0);

  // Auto-Sequential 3-1-3 Player State
  const [isSeqPlaying, setIsSeqPlaying] = useState(false);
  const [seqItemIndex, setSeqItemIndex] = useState<number>(0);
  const [seqPhase, setSeqPhase] = useState<SeqPhase>(null);

  const runIdRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const stopSequentialPlay = useCallback(() => {
    runIdRef.current += 1;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopChineseSpeech();
    setIsSeqPlaying(false);
    setSeqPhase(null);
    setPlayingId(null);
  }, []);

  // Promise helpers for sequential playback
  const waitMs = (ms: number, runId: number): Promise<boolean> =>
    new Promise((resolve) => {
      if (runIdRef.current !== runId) {
        resolve(false);
        return;
      }
      timerRef.current = setTimeout(() => {
        resolve(runIdRef.current === runId);
      }, ms);
    });

  const speakZhOnce = (text: string, runId: number, speedRate = 0.8): Promise<boolean> =>
    new Promise((resolve) => {
      if (runIdRef.current !== runId) {
        resolve(false);
        return;
      }
      speakChinese(text, {
        speedRate,
        onEnd: () => resolve(runIdRef.current === runId),
        onError: () => resolve(runIdRef.current === runId),
      });
    });

  const speakViOnce = (text: string, runId: number): Promise<boolean> =>
    new Promise((resolve) => {
      if (runIdRef.current !== runId) {
        resolve(false);
        return;
      }
      speakVietnamese(text, {
        speedRate: 0.95,
        onEnd: () => resolve(runIdRef.current === runId),
      });
    });

  // Core 3-1-3 Sequential Runner
  const startSequentialPlay = useCallback(
    async (startIndex = 0) => {
      const items = data.items || [];
      if (items.length === 0) return;

      stopSequentialPlay();
      const myRunId = runIdRef.current + 1;
      runIdRef.current = myRunId;
      setIsSeqPlaying(true);

      for (let i = startIndex; i < items.length; i++) {
        if (runIdRef.current !== myRunId) return;
        const item = items[i];
        setSeqItemIndex(i);
        setPlayingId(item.id);

        // Smooth scroll card into view
        const el = cardRefs.current[item.id];
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // 1. Speak Chinese word 3 times
        const wordPhases: SeqPhase[] = ['word-1', 'word-2', 'word-3'];
        for (const wp of wordPhases) {
          if (runIdRef.current !== myRunId) return;
          setSeqPhase(wp);
          const ok = await speakZhOnce(item.hanzi, myRunId, 0.86);
          if (!ok) return;
          const waited = await waitMs(480, myRunId);
          if (!waited) return;
        }

        // 2. Speak Vietnamese meaning 1 time
        if (runIdRef.current !== myRunId) return;
        setSeqPhase('meaning-1');
        const okVi = await speakViOnce(item.meaningVi, myRunId);
        if (!okVi) return;
        const waitedVi = await waitMs(520, myRunId);
        if (!waitedVi) return;

        // 3. Speak Chinese example sentence 2 times + Vietnamese sentence meaning 1 time
        if (item.exampleSentence) {
          const exPhases: SeqPhase[] = ['example-1', 'example-2'];
          for (const ep of exPhases) {
            if (runIdRef.current !== myRunId) return;
            setSeqPhase(ep);
            const okEx = await speakZhOnce(item.exampleSentence, myRunId, 0.85);
            if (!okEx) return;
            const waitedEx = await waitMs(540, myRunId);
            if (!waitedEx) return;
          }

          if (item.exampleTranslation) {
            if (runIdRef.current !== myRunId) return;
            setSeqPhase('example-meaning-1');
            const okExVi = await speakViOnce(item.exampleTranslation, myRunId);
            if (!okExVi) return;
            const waitedExVi = await waitMs(520, myRunId);
            if (!waitedExVi) return;
          }
        }

        // Brief pause before moving to next word
        const waitedNext = await waitMs(750, myRunId);
        if (!waitedNext) return;
      }

      if (runIdRef.current === myRunId) {
        setIsSeqPlaying(false);
        setSeqPhase(null);
        setPlayingId(null);
      }
    },
    [data.items, stopSequentialPlay]
  );

  // Stop sequential playback if user leaves or changes lesson without auto-playing on entry
  useEffect(() => {
    return () => {
      stopSequentialPlay();
    };
  }, [data.items, stopSequentialPlay]);

  // Single play handlers (when user clicks a single word or sentence speaker icon)
  const playSingleWord = (item: VocabItem) => {
    stopSequentialPlay();
    setPlayingId(item.id);
    speakChinese(item.hanzi, {
      speedRate: 0.86,
      onEnd: () => setPlayingId((prev) => (prev === item.id ? null : prev)),
      onError: () => setPlayingId((prev) => (prev === item.id ? null : prev)),
    });
  };

  const playSingleSentence = async (item: VocabItem, id: string) => {
    if (!item.exampleSentence) return;
    stopSequentialPlay();
    const myRunId = runIdRef.current + 1;
    runIdRef.current = myRunId;
    setPlayingId(id);

    for (let rep = 0; rep < 2; rep++) {
      if (runIdRef.current !== myRunId) return;
      const ok = await speakZhOnce(item.exampleSentence, myRunId, 0.85);
      if (!ok) return;
      const waited = await waitMs(450, myRunId);
      if (!waited) return;
    }

    if (item.exampleTranslation) {
      if (runIdRef.current !== myRunId) return;
      await speakViOnce(item.exampleTranslation, myRunId);
    }

    if (runIdRef.current === myRunId) {
      setPlayingId((prev) => (prev === id ? null : prev));
    }
  };

  const copyToClipboard = (item: VocabItem) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(item.hanzi);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  // Initialize or clear writing canvas with Mizige grid + watermark character
  const initCanvas = (char: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);

    ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
    ctx.font = `bold ${Math.round(size * 0.72)}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, size / 2, size / 2 + size * 0.03);
  };

  useEffect(() => {
    if (writingItem) {
      const chars = Array.from(writingItem.hanzi);
      const targetChar = chars[activeCharIdx] || chars[0] || '';
      setTimeout(() => initCanvas(targetChar), 30);
    }
  }, [writingItem, activeCharIdx]);

  const getPointerPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const { x, y } = getPointerPos(e);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPointerPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const currentSeqItem = data.items[seqItemIndex] || data.items[0];

  return (
    <div className="space-y-4">
      {/* Header & Voice Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {data.title ? (
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">{data.title}</h3>
            {data.description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{data.description}</p>
            )}
          </div>
        ) : (
          <div />
        )}
        <div className="self-end sm:self-auto">
          <TTSVoiceSelector variant="dropdown" />
        </div>
      </div>

      {/* AUTO-SEQUENTIAL 3-1-3 PLAYER BAR */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-emerald-50/90 p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chế độ đọc Từ 3–1 & Câu 2–1</span>
            </span>
            <span className="text-xs font-semibold text-emerald-800">
              Từ Trung ×3 → Nghĩa Việt ×1 → Câu Trung ×2 → Nghĩa câu Việt ×1
            </span>
          </div>

          {isSeqPlaying && currentSeqItem ? (
            <div className="text-xs sm:text-sm font-bold text-slate-900 flex flex-wrap items-center gap-2 pt-0.5">
              <span className="text-emerald-700">
                Đang phát Từ {seqItemIndex + 1}/{data.items.length}:
              </span>
              <span className="font-chinese text-base font-extrabold bg-white px-2 py-0.5 rounded border border-emerald-200">
                {currentSeqItem.hanzi} ({currentSeqItem.pinyin})
              </span>
              {seqPhase && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-xs font-extrabold animate-pulse">
                  🔊 {getPhaseLabelVi(seqPhase)}
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-600">
              Bấm &ldquo;Phát lần lượt toàn bộ&rdquo; hoặc bấm nút &ldquo;Đọc 3-1-2-1&rdquo; trên từng thẻ từ vựng.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={seqItemIndex <= 0}
            onClick={() => startSequentialPlay(Math.max(0, seqItemIndex - 1))}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            title="Từ trước"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {isSeqPlaying ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={stopSequentialPlay}
              leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4"
            >
              Tạm dừng đọc
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => startSequentialPlay(0)}
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4"
            >
              Phát lần lượt toàn bộ (3-1-2-1)
            </Button>
          )}

          <button
            type="button"
            disabled={seqItemIndex >= data.items.length - 1}
            onClick={() =>
              startSequentialPlay(Math.min(data.items.length - 1, seqItemIndex + 1))
            }
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            title="Từ tiếp theo"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {data.items.map((item, idx) => {
          const isThisSeqActive = isSeqPlaying && seqItemIndex === idx;
          const isPlayingWord =
            playingId === item.id &&
            (!isThisSeqActive ||
              seqPhase === 'word-1' ||
              seqPhase === 'word-2' ||
              seqPhase === 'word-3');
          const isPlayingMeaning = isThisSeqActive && seqPhase === 'meaning-1';
          const isPlayingExample =
            playingId === `${item.id}-ex` ||
            (isThisSeqActive &&
              (seqPhase === 'example-1' ||
                seqPhase === 'example-2' ||
                seqPhase === 'example-meaning-1'));
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[item.id] = el;
              }}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4 md:p-5 transition-all duration-200 ${
                isThisSeqActive
                  ? 'border-2 border-emerald-600 bg-emerald-50/20 shadow-md ring-2 ring-emerald-200'
                  : 'border-slate-200 bg-white shadow-2xs hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Active phase indicator on card */}
                {isThisSeqActive && seqPhase && (
                  <div className="mb-2.5 flex items-center justify-between text-xs font-extrabold text-emerald-900 bg-emerald-100/80 px-3 py-1 rounded-lg border border-emerald-200">
                    <span>🔊 {getPhaseLabelVi(seqPhase)}</span>
                    <span>
                      Từ {idx + 1}/{data.items.length}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <button
                    type="button"
                    onClick={() => playSingleWord(item)}
                    className="flex items-center gap-3 text-left group/word"
                    title="Bấm để nghe phát âm từ"
                  >
                    <VocabVisualIcon hanzi={item.hanzi} pinyin={item.pinyin} size="md" />
                    <div>
                      <div
                        className={`flex items-baseline gap-2.5 flex-wrap px-2 py-0.5 rounded-lg transition-colors ${
                          isPlayingWord ? 'bg-amber-100 ring-1 ring-amber-300' : ''
                        }`}
                      >
                        <span className="font-chinese text-2xl md:text-3xl font-extrabold text-slate-900 group-hover/word:text-emerald-700 transition-colors tracking-tight">
                          {item.hanzi}
                        </span>
                        <span className="text-sm md:text-base font-bold text-emerald-700 tracking-wide">
                          {item.pinyin}
                        </span>
                      </div>

                      <div
                        className={`text-sm font-bold text-slate-800 mt-1 px-2 py-0.5 rounded-lg transition-colors ${
                          isPlayingMeaning
                            ? 'bg-amber-100 text-amber-950 ring-1 ring-amber-300'
                            : ''
                        }`}
                      >
                        {item.meaningVi}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Play 3-1-2-1 from this word */}
                    <button
                      type="button"
                      onClick={() => startSequentialPlay(idx)}
                      title="Đọc 3 lần từ + 1 lần nghĩa + 2 lần câu Trung + 1 lần nghĩa câu Việt"
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border ${
                        isThisSeqActive
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>3-1-2-1</span>
                    </button>

                    {/* Practice Writing Button */}
                    <button
                      type="button"
                      onClick={() => {
                        stopSequentialPlay();
                        setWritingItem(item);
                        setActiveCharIdx(0);
                      }}
                      title="Tập viết nét chữ Hán"
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 transition-colors flex items-center gap-1"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Viết</span>
                    </button>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item)}
                      title="Sao chép chữ Hán"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      aria-label="Sao chép"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Example Sentence with Audio */}
              {item.exampleSentence && (
                <div
                  className={`mt-2 pt-2.5 border-t rounded-xl p-3 text-xs flex items-start justify-between gap-2 transition-colors ${
                    isPlayingExample
                      ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div>
                    <div className="font-chinese text-sm font-bold text-slate-900 mb-0.5">
                      {item.exampleSentence}
                    </div>
                    {item.examplePinyin && (
                      <div className="text-xs font-semibold text-emerald-700 mb-0.5 tracking-wide">
                        {item.examplePinyin}
                      </div>
                    )}
                    {item.exampleTranslation && (
                      <div className="text-slate-600">{item.exampleTranslation}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => playSingleSentence(item, `${item.id}-ex`)}
                    title="Nghe 2 lần câu tiếng Trung + 1 lần nghĩa tiếng Việt"
                    className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                      isPlayingExample
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-white text-slate-600 hover:text-emerald-700 border border-slate-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Hanzi Writing Modal (Mizige Grid) */}
      {writingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Luyện viết chữ Hán (Ô chữ Mễ 米字格)
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {writingItem.hanzi} ({writingItem.pinyin}) — {writingItem.meaningVi}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setWritingItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {Array.from(writingItem.hanzi).length > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {Array.from(writingItem.hanzi).map((ch, idx) => {
                  const charList = Array.from(writingItem.hanzi);
                  const pyTokens = (writingItem.pinyin || '').trim().split(/\s+/);
                  const charPy = pyTokens.length === charList.length ? pyTokens[idx] : '';
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveCharIdx(idx)}
                      className={`min-w-[48px] px-2 py-1.5 rounded-xl border transition-all flex flex-col items-center justify-center ${
                        activeCharIdx === idx
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-chinese text-xl font-bold leading-none">{ch}</span>
                      {charPy && (
                        <span className="text-[11px] font-semibold text-emerald-700 mt-1 leading-none">
                          {charPy}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={260}
                height={260}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] rounded-xl cursor-crosshair touch-none shadow-inner"
              />
              <p className="text-xs text-slate-500 mt-2">
                Dùng chuột hoặc ngón tay tô theo nét chữ mờ trong ô vuông.
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const chars = Array.from(writingItem.hanzi);
                    initCanvas(chars[activeCharIdx] || chars[0] || '');
                  }}
                  leftIcon={<Eraser className="w-3.5 h-3.5" />}
                  className="text-xs font-semibold"
                >
                  Viết lại
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => playSingleWord(writingItem)}
                  leftIcon={<Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
                  className="text-xs font-semibold"
                >
                  Nghe âm
                </Button>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setWritingItem(null)}
                className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Xong
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
