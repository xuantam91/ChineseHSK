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
  RotateCcw,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { evaluateSpeech, EvaluationResult } from '@/lib/speech/evaluator';

export interface ShadowingSentence {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  audioUrl?: string;
  speaker?: string;
}

export interface ShadowingPlayerProps {
  title?: string;
  description?: string;
  sentences: ShadowingSentence[];
  defaultSpeed?: number;
  pauseDurationSeconds?: number; // Countdown duration in seconds after each sentence (default: 4)
  onSentenceComplete?: (index: number) => void;
  onAllCompleted?: () => void;
  className?: string;
}

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25];

export function ShadowingPlayer({
  title = 'Luyện Shadowing (Nghe & Nhại Lại)',
  description = 'Kỹ thuật Shadowing giúp cải thiện phản xạ ngữ điệu, thanh điệu và độ trôi chảy khi nói tiếng Trung.',
  sentences,
  defaultSpeed = 1.0,
  pauseDurationSeconds = 4,
  onSentenceComplete,
  onAllCompleted,
  className = '',
}: ShadowingPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(defaultSpeed);
  const [isLoopCurrent, setIsLoopCurrent] = useState(false);
  const [isShadowingMode, setIsShadowingMode] = useState(true);

  // Visibility toggles
  const [showPinyin, setShowPinyin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);

  // Countdown timer state for student shadowing
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Optional quick mic practice during shadowing pause
  const [isRecordingStudent, setIsRecordingStudent] = useState(false);
  const [studentTranscript, setStudentTranscript] = useState('');
  const [speechEvaluation, setSpeechEvaluation] = useState<EvaluationResult | null>(null);

  // Audio & Speech refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentSentence = sentences[currentIndex] || sentences[0];
  const isLastSentence = currentIndex === sentences.length - 1;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
      clearCountdown();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Play audio for current sentence
  const playCurrentSentence = () => {
    clearCountdown();
    setSpeechEvaluation(null);
    setStudentTranscript('');
    stopPlayback();

    if (!currentSentence) return;
    setIsPlaying(true);

    if (currentSentence.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentSentence.audioUrl);
      } else {
        audioRef.current.src = currentSentence.audioUrl;
      }
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.onended = handleAudioFinished;
      audioRef.current.onerror = () => speakWithTTS(currentSentence.hanzi);
      audioRef.current.play().catch(() => speakWithTTS(currentSentence.hanzi));
    } else {
      speakWithTTS(currentSentence.hanzi);
    }
  };

  // Fallback to Web Speech Synthesis
  const speakWithTTS = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = playbackSpeed * 0.9;
      utterance.onend = handleAudioFinished;
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(handleAudioFinished, 1800);
    }
  };

  // When current sentence audio finishes playing
  const handleAudioFinished = () => {
    setIsPlaying(false);
    onSentenceComplete?.(currentIndex);

    // If Loop current sentence is enabled
    if (isLoopCurrent) {
      setTimeout(() => {
        playCurrentSentence();
      }, 500);
      return;
    }

    // If Shadowing mode is enabled, trigger repeat countdown
    if (isShadowingMode) {
      startCountdownTimer();
    } else {
      // Normal playback mode: automatically proceed to next sentence if available
      if (!isLastSentence) {
        setCurrentIndex((prev) => prev + 1);
        setTimeout(() => {
          playCurrentSentence();
        }, 600);
      } else {
        onAllCompleted?.();
      }
    }
  };

  // Start countdown for student to repeat aloud
  const startCountdownTimer = () => {
    let timeLeft = pauseDurationSeconds;
    setCountdown(timeLeft);

    countdownTimerRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearCountdown();
        // Advance to next sentence
        if (!isLastSentence) {
          setCurrentIndex((prev) => prev + 1);
          setTimeout(() => {
            playCurrentSentence();
          }, 400);
        } else {
          onAllCompleted?.();
        }
      } else {
        setCountdown(timeLeft);
      }
    }, 1000);
  };

  // Handle Play/Pause button
  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
      clearCountdown();
    } else {
      playCurrentSentence();
    }
  };

  // Go to previous sentence
  const handlePrev = () => {
    stopPlayback();
    clearCountdown();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Go to next sentence
  const handleNext = () => {
    stopPlayback();
    clearCountdown();
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Change playback speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Quick speech recording to verify shadowing accuracy during pause
  const handleQuickSpeechRecord = () => {
    if (isRecordingStudent) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
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
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecordingStudent(true);
        setStudentTranscript('');
      };

      recognition.onresult = (event: any) => {
        const transcriptText = event.results[0][0].transcript;
        setStudentTranscript(transcriptText);

        const evalResult = evaluateSpeech({
          expectedHanzi: currentSentence.hanzi,
          expectedPinyin: currentSentence.pinyin,
          receivedText: transcriptText,
        });
        setSpeechEvaluation(evalResult);
      };

      recognition.onerror = () => {
        setIsRecordingStudent(false);
      };

      recognition.onend = () => {
        setIsRecordingStudent(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecordingStudent(false);
    }
  };

  return (
    <div
      className={`rounded-3xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm space-y-6 ${className}`}
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              <Headphones className="w-3.5 h-3.5 text-emerald-600" />
              Kỹ thuật Shadowing
            </span>
            <Badge variant="outline" size="sm">
              Câu {currentIndex + 1} / {sentences.length}
            </Badge>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{description}</p>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
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

      {/* Main Sentence Focus Card */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-[#f7fcf9] to-[#ffffff] p-6 sm:p-8 text-center shadow-xs">
        {/* Speaker Label */}
        {currentSentence?.speaker && (
          <div className="mb-3 inline-block rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-800">
            {currentSentence.speaker}
          </div>
        )}

        {/* Pinyin */}
        {showPinyin && (
          <p className="text-base sm:text-xl font-semibold text-emerald-700 tracking-wide mb-2 transition-all">
            {currentSentence?.pinyin}
          </p>
        )}

        {/* Hanzi */}
        <h2 className="font-chinese text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-relaxed mb-3">
          {currentSentence?.hanzi}
        </h2>

        {/* Meaning in Vietnamese */}
        {showMeaning && (
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto italic transition-all">
            &ldquo;{currentSentence?.meaningVi}&rdquo;
          </p>
        )}

        {/* Playing equalizer animation indicator */}
        {isPlaying && (
          <div className="mt-4 flex items-center justify-center gap-1">
            <span className="w-1 h-4 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-6 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-8 bg-emerald-500 rounded-full animate-bounce" />
            <span className="w-1 h-5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.35s]" />
          </div>
        )}

        {/* Shadowing Countdown Banner */}
        {countdown !== null && (
          <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-4 max-w-md mx-auto animate-pulse">
            <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Đến lượt bạn nhại lại!</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white font-extrabold text-sm">
                {countdown}s
              </span>
            </div>

            {/* Quick Mic recording test button during repetition */}
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleQuickSpeechRecord}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                  isRecordingStudent
                    ? 'bg-rose-600 text-white ring-2 ring-rose-200 animate-pulse'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecordingStudent ? 'Đang chấm điểm...' : 'Thu âm để AI chấm'}</span>
              </button>
            </div>

            {/* Quick score result if student spoke */}
            {speechEvaluation && (
              <div className="mt-2 text-xs font-medium text-emerald-800 bg-white/80 rounded-xl p-2 border border-emerald-200">
                AI Chấm: <strong>{speechEvaluation.score}%</strong> - {speechEvaluation.feedback}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Playback Controls & Speed Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
        {/* Navigation & Play/Pause Controls */}
        <div className="flex items-center gap-3">
          {/* Prev Sentence */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-700 shadow-xs hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-all"
            title="Câu trước"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Primary Play/Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-md transition-all active:scale-95 ${
              isPlaying
                ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title={isPlaying ? 'Tạm dừng' : 'Phát âm thanh'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>

          {/* Next Sentence */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === sentences.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-700 shadow-xs hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition-all"
            title="Câu tiếp theo"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Loop current sentence toggle */}
          <button
            type="button"
            onClick={() => setIsLoopCurrent(!isLoopCurrent)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs transition-all ${
              isLoopCurrent
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
            }`}
            title="Lặp lại câu này (A-B Loop)"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 px-2 uppercase">Tốc độ:</span>
          {SPEED_OPTIONS.map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => handleSpeedChange(speed)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                playbackSpeed === speed
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Shadowing Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsShadowingMode(!isShadowingMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isShadowingMode
                ? 'bg-teal-50 border-teal-200 text-teal-900 shadow-xs'
                : 'bg-white border-gray-200 text-gray-500'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isShadowingMode ? 'bg-teal-600 animate-pulse' : 'bg-gray-400'
              }`}
            />
            {isShadowingMode ? 'Dừng để nhắc lại: BẬT' : 'Dừng để nhắc lại: TẮT'}
          </button>
        </div>
      </div>

      {/* Sentence Navigation List Preview */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Danh sách câu trong bài ({sentences.length})
        </h4>
        <div className="grid gap-2 max-h-52 overflow-y-auto pr-1">
          {sentences.map((sentence, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={sentence.id}
                type="button"
                onClick={() => {
                  stopPlayback();
                  clearCountdown();
                  setCurrentIndex(idx);
                }}
                className={`flex items-center justify-between p-3 rounded-2xl text-left border transition-all ${
                  isActive
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300 shadow-xs'
                    : 'bg-white border-gray-150 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-chinese font-bold text-sm sm:text-base text-gray-900 mr-2">
                      {sentence.hanzi}
                    </span>
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      {sentence.meaningVi}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <Badge variant="success" size="sm">
                    Đang chọn
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
