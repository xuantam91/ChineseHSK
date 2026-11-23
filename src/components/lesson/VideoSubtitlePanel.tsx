'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Subtitles,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Languages,
  Sparkles,
} from 'lucide-react';
import type { HSKLesson } from '@/lib/curriculum/hsk1-3-data';
import { getVideoSubtitleScript, VideoSubtitleCue } from '@/lib/curriculum/video-subtitles';
import { useTTS } from '@/lib/tts';

export type SubtitleLanguageMode = 'vi' | 'en' | 'both';

export interface ThematicWordCueInput {
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

interface VideoSubtitlePanelProps {
  videoId: string | null;
  hskLesson?: HSKLesson;
  thematicWords?: ThematicWordCueInput[];
  title?: string;
}

export const VideoSubtitlePanel: React.FC<VideoSubtitlePanelProps> = ({
  videoId,
  hskLesson,
  thematicWords,
  title,
}) => {
  const { speak, stop } = useTTS();
  const [langMode, setLangMode] = useState<SubtitleLanguageMode>('both');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoStepping, setIsAutoStepping] = useState<boolean>(false);

  const script = videoId ? getVideoSubtitleScript(videoId) : undefined;

  // Build rich bilingual cues: video-specific cues + lesson dialogue/vocab cues
  const cues: VideoSubtitleCue[] = useMemo(() => {
    const merged: VideoSubtitleCue[] = [];
    const seenHanzi = new Set<string>();

    if (script?.cues) {
      for (const c of script.cues) {
        const key = c.hanzi.trim();
        if (key && !seenHanzi.has(key)) {
          seenHanzi.add(key);
          merged.push(c);
        }
      }
    }

    if (hskLesson?.dialogue) {
      hskLesson.dialogue.forEach((d, idx) => {
        const key = d.hanzi.trim();
        if (key && !seenHanzi.has(key)) {
          seenHanzi.add(key);
          merged.push({
            id: `dlg-${d.id || idx}`,
            hanzi: d.hanzi,
            pinyin: d.pinyin,
            subVi: `${d.speakerName}: ${d.vietnamese}`,
            subEn: `${hskLesson.level} Dialogue ${idx + 1} (${d.pinyin})`,
          });
        }
      });
    }

    if (hskLesson?.vocabulary) {
      hskLesson.vocabulary.slice(0, 5).forEach((v, idx) => {
        const key = (v.exampleSentence || v.hanzi).trim();
        if (key && !seenHanzi.has(key)) {
          seenHanzi.add(key);
          merged.push({
            id: `voc-${v.id || idx}`,
            hanzi: v.exampleSentence || v.hanzi,
            pinyin: v.examplePinyin || v.pinyin,
            subVi: v.exampleVi ? `${v.hanzi}: ${v.meaningVi} — ${v.exampleVi}` : `${v.hanzi}: ${v.meaningVi}`,
            subEn: `Keyword "${v.hanzi}" (${v.pinyin})`,
          });
        }
      });
    }

    if (thematicWords) {
      thematicWords.forEach((w, idx) => {
        const hanziText = (w.exampleSentence || w.hanzi).trim();
        if (hanziText && !seenHanzi.has(hanziText)) {
          seenHanzi.add(hanziText);
          merged.push({
            id: `thm-${idx}`,
            hanzi: hanziText,
            pinyin: w.pinyin,
            subVi: w.exampleTranslation
              ? `${w.hanzi} (${w.vietnamese}): ${w.exampleTranslation}`
              : `${w.hanzi}: ${w.vietnamese}`,
            subEn: `Flashcard "${w.hanzi}" (${w.pinyin})`,
          });
        }
      });
    }

    return merged;
  }, [script, hskLesson, thematicWords]);

  useEffect(() => {
    setActiveIndex(0);
    setIsAutoStepping(false);
  }, [videoId, hskLesson?.id]);

  // Optional auto-step timer (cycles cues every 4.5s so kids can follow along cleanly)
  useEffect(() => {
    if (!isAutoStepping || cues.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cues.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoStepping, cues.length]);

  if (cues.length === 0) return null;

  const currentCue = cues[activeIndex] || cues[0];

  const handleSelectCue = (idx: number) => {
    setActiveIndex(idx);
    const cue = cues[idx];
    if (cue) {
      stop();
      speak(cue.hanzi, { speedRate: 0.72 });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-4 sm:p-5 space-y-4 text-white">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
            <Subtitles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>Phụ đề Song ngữ Việt – Anh – Trung</span>
              {script?.hasBuiltInYouTubeCC && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  YouTube CC Bật sẵn
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {script?.topicVi || title || 'Theo dõi lời thoại dễ hiểu kèm phát âm chậm từng câu'}
            </p>
          </div>
        </div>

        {/* Language Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 hidden sm:inline" />
          {(
            [
              { id: 'both', label: 'Việt + Anh' },
              { id: 'vi', label: 'Tiếng Việt' },
              { id: 'en', label: 'English' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setLangMode(mode.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                langMode === mode.id
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Cinema Subtitle Display Box */}
      <div className="rounded-xl bg-black/80 border border-slate-700/80 p-4 text-center space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Câu {activeIndex + 1}/{cues.length}
            {currentCue.timeLabel ? ` • Mốc ${currentCue.timeLabel}` : ''}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAutoStepping((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                isAutoStepping
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Tự động chuyển phụ đề từng câu"
            >
              {isAutoStepping ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoStepping ? 'Dừng tự chạy' : 'Tự chạy phụ đề'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                stop();
                speak(currentCue.hanzi, { speedRate: 0.72 });
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-extrabold transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe chậm</span>
            </button>
          </div>
        </div>

        {/* Chinese + Pinyin */}
        <div className="pt-1 space-y-1">
          <div className="text-xl sm:text-2xl font-black text-white tracking-wide font-chinese">
            {currentCue.hanzi}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-amber-300 font-mono">
            {currentCue.pinyin}
          </div>
        </div>

        {/* Vietnamese & English Subtitles */}
        <div className="space-y-1 pt-1 border-t border-slate-800/90">
          {(langMode === 'vi' || langMode === 'both') && (
            <div className="text-sm sm:text-base font-bold text-emerald-300">
              🇻🇳 {currentCue.subVi}
            </div>
          )}
          {(langMode === 'en' || langMode === 'both') && (
            <div className="text-xs sm:text-sm font-medium text-sky-200">
              🇬🇧 {currentCue.subEn}
            </div>
          )}
        </div>

        {/* Prev / Next Cue Controls */}
        {cues.length > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                handleSelectCue((activeIndex - 1 + cues.length) % cues.length)
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Câu trước</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCue((activeIndex + 1) % cues.length)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Clickable Full Transcript */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pb-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Toàn bộ phụ đề video (Bấm vào từng dòng để nghe phát âm chậm):</span>
        </div>
        {cues.map((cue, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={cue.id}
              type="button"
              onClick={() => handleSelectCue(idx)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                isActive
                  ? 'bg-emerald-950/80 border-emerald-500/70'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/70'
              }`}
            >
              <div className="space-y-0.5 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  {cue.timeLabel && (
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">
                      {cue.timeLabel}
                    </span>
                  )}
                  <span className="text-sm font-bold text-white font-chinese">
                    {cue.hanzi}
                  </span>
                  <span className="text-xs text-amber-200/90 font-mono">
                    {cue.pinyin}
                  </span>
                </div>
                {(langMode === 'vi' || langMode === 'both') && (
                  <div className="text-xs text-emerald-300 font-medium">
                    🇻🇳 {cue.subVi}
                  </div>
                )}
                {(langMode === 'en' || langMode === 'both') && (
                  <div className="text-[11px] text-sky-200/90">
                    🇬🇧 {cue.subEn}
                  </div>
                )}
              </div>
              <Volume2
                className={`w-4 h-4 shrink-0 mt-1 ${
                  isActive ? 'text-amber-300' : 'text-slate-500'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
