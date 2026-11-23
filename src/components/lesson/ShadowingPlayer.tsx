'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  Mic,
  Eye,
  EyeOff,
  Sparkles,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Gauge,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { evaluateSpeech, EvaluationResult } from '@/lib/speech/evaluator';
import { speakChinese, speakChineseCharByChar, stopChineseSpeech } from '@/lib/tts';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';

export interface ShadowingSentence {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  audioUrl?: string;
  speaker?: string;
  focusToneSandhi?: string;
}

export interface ShadowingPlayerProps {
  title?: string;
  description?: string;
  sentences: ShadowingSentence[];
  defaultSpeed?: number;
  pauseDurationSeconds?: number;
  onSentenceComplete?: (index: number) => void;
  onAllCompleted?: () => void;
  className?: string;
}

const SPEED_OPTIONS = [
  { value: 0.55, label: '0.55x Rất chậm' },
  { value: 0.75, label: '0.75x Chậm rõ' },
  { value: 0.9, label: '0.9x Vừa' },
  { value: 1.0, label: '1.0x Tự nhiên' },
];

export function ShadowingPlayer({
  title = 'Luyện Nhại Âm Phản Xạ (Shadowing)',
  description = 'Bước 1: Nghe mẫu hoặc đọc tách từng chữ • Bước 2: Đọc nhại theo và bấm Micro để kiểm tra độ trôi chảy.',
  sentences,
  defaultSpeed = 0.75,
  pauseDurationSeconds = 10,
  onSentenceComplete,
  onAllCompleted,
  className = '',
}: ShadowingPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMode, setPlayingMode] = useState<'normal' | 'slow' | 'char' | null>(null);
  const [highlightedCharIdx, setHighlightedCharIdx] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(defaultSpeed);
  const [isLoopCurrent, setIsLoopCurrent] = useState(false);
  // Default to manual user-paced progression so the learner is NEVER rushed!
  const [autoAdvance, setAutoAdvance] = useState(false);

  // Track which sentences the learner has practiced
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [readyToRepeat, setReadyToRepeat] = useState(false);

  // Visibility toggles
  const [showPinyin, setShowPinyin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);

  // Countdown timer state (only when autoAdvance is explicitly turned ON)
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Student mic practice
  const [isRecordingStudent, setIsRecordingStudent] = useState(false);
  const [studentTranscript, setStudentTranscript] = useState('');
  const [speechEvaluation, setSpeechEvaluation] = useState<EvaluationResult | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentSentence = sentences[currentIndex] || sentences[0];
  const isLastSentence = currentIndex === sentences.length - 1;

  useEffect(() => {
    return () => {
      stopPlayback();
      clearCountdown();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const clearCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setPlayingMode(null);
    setHighlightedCharIdx(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopChineseSpeech();
  };

  const selectSentence = (idx: number) => {
    stopPlayback();
    clearCountdown();
    setReadyToRepeat(false);
    setSpeechEvaluation(null);
    setStudentTranscript('');
    setCurrentIndex(idx);
  };

  // Play sentence at selected speed
  const playSentenceWithSpeed = (speed: number, mode: 'normal' | 'slow') => {
    clearCountdown();
    stopPlayback();
    if (!currentSentence) return;

    setIsPlaying(true);
    setPlayingMode(mode);
    setReadyToRepeat(false);

    speakChinese(currentSentence.hanzi, {
      speedRate: speed,
      onEnd: () => {
        setIsPlaying(false);
        setPlayingMode(null);
        handleAudioFinished();
      },
      onError: () => {
        setIsPlaying(false);
        setPlayingMode(null);
      },
    });
  };

  // Play character-by-character with highlight so student can follow every syllable
  const playCharByChar = () => {
    clearCountdown();
    if (playingMode === 'char') {
      stopPlayback();
      return;
    }
    stopPlayback();
    if (!currentSentence) return;

    setIsPlaying(true);
    setPlayingMode('char');
    setReadyToRepeat(false);

    speakChineseCharByChar(currentSentence.hanzi, {
      pauseMs: 520,
      speedRate: 0.65,
      onCharIndex: (idx) => setHighlightedCharIdx(idx),
      onEnd: () => {
        setIsPlaying(false);
        setPlayingMode(null);
        setHighlightedCharIdx(null);
        setReadyToRepeat(true);
      },
    });
  };

  // Play single character when clicked
  const playSingleChar = (ch: string, idx: number) => {
    clearCountdown();
    stopPlayback();
    setHighlightedCharIdx(idx);
    speakChinese(ch, {
      speedRate: 0.65,
      onEnd: () => setHighlightedCharIdx(null),
      onError: () => setHighlightedCharIdx(null),
    });
  };

  const markCurrentDone = () => {
    if (!currentSentence) return;
    setCompletedIds((prev) => {
      const next = { ...prev, [currentSentence.id]: true };
      if (Object.keys(next).length >= sentences.length) {
        onAllCompleted?.();
      }
      return next;
    });
    onSentenceComplete?.(currentIndex);
  };

  const handleAudioFinished = () => {
    setReadyToRepeat(true);
    markCurrentDone();

    if (isLoopCurrent) {
      setTimeout(() => {
        playSentenceWithSpeed(playbackSpeed, 'normal');
      }, 900);
      return;
    }

    if (autoAdvance) {
      startCountdownTimer();
    }
  };

  const startCountdownTimer = () => {
    clearCountdown();
    let timeLeft = pauseDurationSeconds;
    setCountdown(timeLeft);

    countdownTimerRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearCountdown();
        if (currentIndex < sentences.length - 1) {
          selectSentence(currentIndex + 1);
        } else {
          onAllCompleted?.();
        }
      } else {
        setCountdown(timeLeft);
      }
    }, 1000);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      selectSentence(currentIndex - 1);
    }
  };

  const handleNext = () => {
    markCurrentDone();
    if (currentIndex < sentences.length - 1) {
      selectSentence(currentIndex + 1);
    } else {
      onAllCompleted?.();
    }
  };

  // Record student shadowing voice (Always accessible, pauses any countdown!)
  const handleQuickSpeechRecord = () => {
    clearCountdown(); // Never interrupt student while recording!
    stopPlayback();

    if (isRecordingStudent) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecordingStudent(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = true;

      let finalRecognized = '';
      let latestInterim = '';

      recognition.onstart = () => {
        setIsRecordingStudent(true);
        setStudentTranscript('');
        setSpeechEvaluation(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalRecognized = item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }
        latestInterim = interim;
        setStudentTranscript(finalRecognized || interim);
      };

      recognition.onerror = () => {
        setIsRecordingStudent(false);
      };

      recognition.onend = () => {
        setIsRecordingStudent(false);
        const textToEval = finalRecognized.trim() || latestInterim.trim();
        if (textToEval && currentSentence) {
          const evalResult = evaluateSpeech({
            expectedHanzi: currentSentence.hanzi,
            expectedPinyin: currentSentence.pinyin,
            receivedText: textToEval,
          });
          setSpeechEvaluation(evalResult);
          markCurrentDone();
        }
      };

      recognition.start();
    } catch {
      setIsRecordingStudent(false);
    }
  };

  // Split characters & Pinyin syllables for easy visual tracking
  const rawChars = Array.from((currentSentence?.hanzi || '').replace(/\s+/g, ''));
  const rawPinyinTokens = (currentSentence?.pinyin || '')
    .replace(/[，。！？、；：“”‘’（）,.!?;:()"]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const isPunctuation = (ch: string) =>
    /^[，。！？、；：“”‘’（）,.!?;:()"\-—…]+$/.test(ch);

  let pinyinCursor = 0;
  const alignedChars = rawChars.map((ch, idx) => {
    if (isPunctuation(ch)) {
      return { ch, py: '', idx, isPunct: true };
    }
    const py = rawPinyinTokens[pinyinCursor] || '';
    pinyinCursor++;
    return { ch, py, idx, isPunct: false };
  });

  const completedCount = Object.keys(completedIds).length;

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xs space-y-5 ${className}`}
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              <Headphones className="w-3.5 h-3.5 text-emerald-600" />
              Nhại âm phản xạ ({currentIndex + 1}/{sentences.length})
            </span>
            <Badge variant="outline" size="sm">
              Đã tập: {completedCount}/{sentences.length} câu
            </Badge>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{description}</p>
        </div>

        {/* View toggles & Voice Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <TTSVoiceSelector variant="dropdown" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPinyin(!showPinyin)}
            leftIcon={showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            {showPinyin ? 'Pinyin' : 'Ẩn Pinyin'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowMeaning(!showMeaning)}
            leftIcon={showMeaning ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            {showMeaning ? 'Nghĩa' : 'Ẩn nghĩa'}
          </Button>
        </div>
      </div>

      {/* Quick Sentence Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {sentences.map((s, idx) => {
          const isActive = idx === currentIndex;
          const isDone = !!completedIds[s.id];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => selectSentence(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isDone && (
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-600'}`}
                />
              )}
              <span>
                Câu {idx + 1}: {s.hanzi.length > 7 ? `${s.hanzi.slice(0, 7)}…` : s.hanzi}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Sentence Focus Card */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/30 to-white p-5 sm:p-7 text-center space-y-5">
        {/* 3 Guided Listening Buttons (Normal / Slow / Word-by-Word) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => playSentenceWithSpeed(playbackSpeed, 'normal')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              playingMode === 'normal'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-800 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 shadow-2xs'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${playingMode === 'normal' ? 'animate-bounce' : 'text-emerald-700'}`} />
            <span>1. Nghe cả câu ({playbackSpeed}x)</span>
          </button>

          <button
            type="button"
            onClick={() => playSentenceWithSpeed(0.55, 'slow')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              playingMode === 'slow'
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-800 border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 shadow-2xs'
            }`}
          >
            <Gauge className="w-4 h-4 text-amber-600" />
            <span>2. Nghe thật chậm (0.55x)</span>
          </button>

          <button
            type="button"
            onClick={playCharByChar}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              playingMode === 'char'
                ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                : 'bg-white text-slate-800 border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 shadow-2xs'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{playingMode === 'char' ? 'Đang đọc tách chữ...' : '3. Đọc tách từng chữ'}</span>
          </button>
        </div>

        {/* Character-by-Character Aligned Display (Pinyin directly above each Hanzi) */}
        <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-3 py-2">
          {alignedChars.map((item) => {
            const isHighlighted = highlightedCharIdx === item.idx;
            if (item.isPunct) {
              return (
                <span
                  key={item.idx}
                  className="font-chinese text-2xl sm:text-3xl font-bold text-slate-400 pb-2"
                >
                  {item.ch}
                </span>
              );
            }
            return (
              <button
                key={item.idx}
                type="button"
                onClick={() => playSingleChar(item.ch, item.idx)}
                title={`Bấm để nghe chữ "${item.ch}"`}
                className={`flex flex-col items-center px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-amber-100 border-amber-400 scale-110 shadow-md ring-2 ring-amber-300'
                    : 'bg-white border-slate-200 hover:border-emerald-400 shadow-2xs'
                }`}
              >
                {showPinyin && (
                  <span
                    className={`text-xs sm:text-sm font-bold mb-1 ${
                      isHighlighted ? 'text-amber-900' : 'text-emerald-700'
                    }`}
                  >
                    {item.py}
                  </span>
                )}
                <span className="font-chinese text-2xl sm:text-4xl font-extrabold text-slate-900">
                  {item.ch}
                </span>
              </button>
            );
          })}
        </div>

        {/* Full Pinyin & Meaning in Vietnamese */}
        <div className="space-y-1.5">
          {showPinyin && (
            <p className="text-sm sm:text-base font-bold text-emerald-800">
              {currentSentence?.pinyin}
            </p>
          )}
          {showMeaning && (
            <p className="text-sm sm:text-base text-slate-700 font-semibold max-w-xl mx-auto">
              Nghĩa: &ldquo;{currentSentence?.meaningVi}&rdquo;
            </p>
          )}
          {currentSentence?.focusToneSandhi && (
            <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg inline-block mt-1">
              💡 Lưu ý ngữ âm: {currentSentence.focusToneSandhi}
            </p>
          )}
        </div>

        {/* ALWAYS-VISIBLE SHADOWING RECORDING & REPEAT SECTION */}
        <div className="pt-4 border-t border-emerald-100 flex flex-col items-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleQuickSpeechRecord}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                isRecordingStudent
                  ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse scale-105'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>
                {isRecordingStudent
                  ? 'Đang thu âm... (Bấm để dừng & chấm điểm)'
                  : 'Bấm Micro để nhại lại & chấm điểm AI'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 transition-colors shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isLastSentence ? 'Đã nhại xong câu cuối' : 'Đã tự nhại theo (Qua câu tiếp)'}</span>
            </button>

            {countdown !== null && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <span>Tự chuyển câu sau: {countdown}s</span>
                <button
                  type="button"
                  onClick={clearCountdown}
                  className="underline text-amber-800 hover:text-amber-950 ml-1"
                >
                  Giữ lại câu này
                </button>
              </div>
            )}
          </div>

          {readyToRepeat && !isRecordingStudent && !speechEvaluation && (
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              ✨ Tới lượt bạn! Hãy đọc to câu trên 2–3 lần theo nhịp độ của bạn rồi bấm Micro kiểm tra nhé.
            </p>
          )}

          {studentTranscript && (
            <div className="text-xs sm:text-sm text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200">
              Bạn vừa đọc: <strong className="font-chinese text-slate-900">{studentTranscript}</strong>
            </div>
          )}

          {speechEvaluation && (
            <div
              className={`w-full max-w-md rounded-xl p-3.5 border text-xs sm:text-sm font-medium ${
                speechEvaluation.score >= 75
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="font-bold text-sm mb-0.5">
                Điểm nhại âm: {speechEvaluation.score}% —{' '}
                {speechEvaluation.score >= 80 ? 'Rất trôi chảy!' : 'Hãy nghe chậm và thử lại nhé!'}
              </div>
              <div>{speechEvaluation.feedback}</div>
            </div>
          )}
        </div>
      </div>

      {/* Speed & Auto-Advance Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        {/* Speed Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Tốc độ mặc định:</span>
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPlaybackSpeed(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                playbackSpeed === opt.value
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Loop & Auto-Advance Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLoopCurrent(!isLoopCurrent)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isLoopCurrent
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{isLoopCurrent ? 'Lặp lại 1 câu: BẬT' : 'Lặp lại 1 câu'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !autoAdvance;
              setAutoAdvance(next);
              if (!next) clearCountdown();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              autoAdvance
                ? 'bg-teal-100 border-teal-300 text-teal-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{autoAdvance ? 'Tự chuyển câu (10s): BẬT' : 'Tự chuyển câu: TẮT'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Sentence Navigation */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentIndex === 0}
          onClick={handlePrev}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          className="text-xs font-semibold"
        >
          Câu trước
        </Button>

        <span className="text-xs font-bold text-slate-500">
          Câu {currentIndex + 1} / {sentences.length}
        </span>

        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={isLastSentence}
          onClick={handleNext}
          rightIcon={<ChevronRight className="w-4 h-4" />}
          className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
        >
          Câu nhại âm tiếp theo
        </Button>
      </div>
    </div>
  );
}
