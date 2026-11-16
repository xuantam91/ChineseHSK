'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VocabBlockData, VocabItem } from '@/types';
import { Volume2, Check, Copy, PenTool, Eraser, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VocabVisualIcon } from '@/components/ui/VocabVisualIcon';
import { speakChinese } from '@/lib/tts';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';

export interface VocabBlockProps {
  data: VocabBlockData;
}

export function VocabBlock({ data }: VocabBlockProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [writingItem, setWritingItem] = useState<VocabItem | null>(null);
  const [activeCharIdx, setActiveCharIdx] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const playAudio = (item: VocabItem) => {
    if (typeof window === 'undefined') return;
    setPlayingId(item.id);

    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => fallbackSpeechSynthesis(item.hanzi, item.id);
      audio.play().catch(() => fallbackSpeechSynthesis(item.hanzi, item.id));
    } else {
      fallbackSpeechSynthesis(item.hanzi, item.id);
    }
  };

  const playSentenceAudio = (sentence: string, id: string) => {
    if (typeof window === 'undefined') return;
    setPlayingId(id);
    fallbackSpeechSynthesis(sentence, id);
  };

  const fallbackSpeechSynthesis = (text: string, id: string) => {
    speakChinese(text, {
      onEnd: () => setPlayingId((prev) => (prev === id ? null : prev)),
      onError: () => setPlayingId((prev) => (prev === id ? null : prev)),
    });
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

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Mizige dashed lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    // Horizontal & Vertical center
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    // Diagonals
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size);
    ctx.stroke();
    ctx.setLineDash([]);

    // Outer border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);

    // Watermark guide character
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
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

      <div className="grid gap-3.5 sm:grid-cols-2">
        {data.items.map((item) => {
          const isPlaying = playingId === item.id;
          const isPlayingSentence = playingId === `${item.id}-ex`;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-2xs transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <button
                    type="button"
                    onClick={() => playAudio(item)}
                    className="flex items-center gap-3 text-left group/word"
                    title="Bấm để nghe phát âm"
                  >
                    <VocabVisualIcon hanzi={item.hanzi} pinyin={item.pinyin} size="md" />
                    <div>
                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span className="font-chinese text-2xl md:text-3xl font-extrabold text-slate-900 group-hover/word:text-emerald-700 transition-colors tracking-tight">
                          {item.hanzi}
                        </span>
                        <span className="text-sm md:text-base font-bold text-emerald-700 tracking-wide">
                          {item.pinyin}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-800 mt-1">
                        {item.meaningVi}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Practice Writing Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setWritingItem(item);
                        setActiveCharIdx(0);
                      }}
                      title="Tập viết nét chữ Hán"
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 transition-colors flex items-center gap-1"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tập viết</span>
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

                    {/* Audio Pronunciation Button */}
                    <button
                      type="button"
                      onClick={() => playAudio(item)}
                      title="Nghe phát âm từ vựng"
                      className={`p-2.5 rounded-xl transition-all ${
                        isPlaying
                          ? 'bg-emerald-600 text-white animate-pulse shadow-xs'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                      }`}
                      aria-label="Phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Example Sentence with Audio */}
              {item.exampleSentence && (
                <div className="mt-2 pt-2.5 border-t border-slate-100 rounded-xl bg-slate-50 p-3 text-xs flex items-start justify-between gap-2">
                  <div>
                    <div className="font-chinese text-sm font-bold text-slate-900 mb-0.5">
                      {item.exampleSentence}
                    </div>
                    {item.exampleTranslation && (
                      <div className="text-slate-600">
                        {item.exampleTranslation}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      playSentenceAudio(item.exampleSentence!, `${item.id}-ex`)
                    }
                    title="Nghe câu ví dụ"
                    className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                      isPlayingSentence
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

            {/* Character selector if word has multiple characters */}
            {Array.from(writingItem.hanzi).length > 1 && (
              <div className="flex items-center justify-center gap-2">
                {Array.from(writingItem.hanzi).map((ch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveCharIdx(idx)}
                    className={`w-11 h-11 rounded-xl font-chinese text-xl font-bold border transition-all ${
                      activeCharIdx === idx
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            )}

            {/* Canvas */}
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

            {/* Modal Actions */}
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
                  onClick={() => playAudio(writingItem)}
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
