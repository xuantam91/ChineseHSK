'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { evaluateSpeech, EvaluationResult } from '@/lib/speech/evaluator';
import { speakChinese, speakChineseCharByChar, stopChineseSpeech } from '@/lib/tts';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';

export interface SpeechDrillItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  tip?: string;
  audioUrl?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  category?: 'word' | 'sentence';
}

export interface SpeechPracticeProps {
  hanzi?: string;
  pinyin?: string;
  meaningVi?: string;
  audioUrl?: string;
  prompt?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  items?: SpeechDrillItem[];
  hskLevel?: number | string;
  passingThreshold?: number;
  onCompleted?: (result: EvaluationResult) => void;
  className?: string;
}

export function SpeechPractice({
  hanzi = '你好',
  pinyin = 'nǐ hǎo',
  meaningVi = 'Xin chào',
  audioUrl,
  prompt,
  exampleSentence,
  exampleTranslation,
  items,
  hskLevel,
  passingThreshold = 70,
  onCompleted,
  className = '',
}: SpeechPracticeProps) {
  // Normalize into a multi-drill list
  const drills: SpeechDrillItem[] =
    items && items.length > 0
      ? items
      : [
          {
            id: 'drill-0',
            hanzi,
            pinyin,
            meaningVi,
            tip: prompt,
            audioUrl,
            exampleSentence,
            exampleTranslation,
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [passedIds, setPassedIds] = useState<Record<string, number>>({});

  const currentDrill = drills[currentIndex] || drills[0];

  // Recognition & Recording states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [speechApiSupported, setSpeechApiSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Playback states
  const [playingMode, setPlayingMode] = useState<'normal' | 'slow' | 'char' | null>(null);
  const [highlightedCharIndex, setHighlightedCharIndex] = useState<number | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Fallback manual input mode if mic is unavailable or blocked
  const [manualInput, setManualInput] = useState('');
  const [showManualFallback, setShowManualFallback] = useState(false);

  // Refs
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Check browser speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechApiSupported(false);
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      stopChineseSpeech();
    };
  }, []);

  // Reset state when switching drill item
  const selectDrillIndex = (idx: number) => {
    stopListening();
    stopChineseSpeech();
    setPlayingMode(null);
    setHighlightedCharIndex(null);
    setEvaluation(null);
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage(null);
    setManualInput('');
    setCurrentIndex(idx);
  };

  // Split Pinyin tokens for character alignment display
  const pinyinTokens = (currentDrill.pinyin || '').trim().split(/\s+/);
  const hanziCharacters = Array.from((currentDrill.hanzi || '').replace(/\s+/g, ''));

  // 1. Play standard clear speed (0.78x)
  const playNormalAudio = () => {
    if (typeof window === 'undefined') return;
    stopChineseSpeech();
    setHighlightedCharIndex(null);
    setPlayingMode('normal');

    speakChinese(currentDrill.hanzi, {
      speedRate: 0.78,
      onEnd: () => setPlayingMode(null),
      onError: () => setPlayingMode(null),
    });
  };

  // 2. Play slow speed (0.55x) so learner can catch every tone
  const playSlowAudio = () => {
    if (typeof window === 'undefined') return;
    stopChineseSpeech();
    setHighlightedCharIndex(null);
    setPlayingMode('slow');

    speakChinese(currentDrill.hanzi, {
      speedRate: 0.55,
      onEnd: () => setPlayingMode(null),
      onError: () => setPlayingMode(null),
    });
  };

  // 3. Play character-by-character with visual highlight and pause
  const playCharByCharAudio = () => {
    if (typeof window === 'undefined') return;
    if (playingMode === 'char') {
      stopChineseSpeech();
      setPlayingMode(null);
      setHighlightedCharIndex(null);
      return;
    }

    setPlayingMode('char');
    speakChineseCharByChar(currentDrill.hanzi, {
      pauseMs: 550,
      speedRate: 0.65,
      onCharIndex: (idx) => setHighlightedCharIndex(idx),
      onEnd: () => {
        setPlayingMode(null);
        setHighlightedCharIndex(null);
      },
    });
  };

  // Play single character when user clicks its box
  const playSingleCharacter = (char: string, idx: number) => {
    stopChineseSpeech();
    setHighlightedCharIndex(idx);
    speakChinese(char, {
      speedRate: 0.65,
      onEnd: () => setHighlightedCharIndex(null),
      onError: () => setHighlightedCharIndex(null),
    });
  };

  const handleEvaluationSuccess = (result: EvaluationResult) => {
    setEvaluation(result);
    if (result.isPassed) {
      const nextPassed = { ...passedIds, [currentDrill.id]: result.score };
      setPassedIds(nextPassed);
      onCompleted?.(result);
    }
  };

  // Start Speech Recognition and Audio Recording
  const startListening = async () => {
    stopChineseSpeech();
    setPlayingMode(null);
    setHighlightedCharIndex(null);
    setErrorMessage(null);
    setTranscript('');
    setInterimTranscript('');
    setEvaluation(null);

    // 1. Setup MediaRecorder for voice playback
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        audioChunksRef.current = [];

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const mimeType = mediaRecorder.mimeType || 'audio/mp4';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          if (recordedAudioUrl) {
            URL.revokeObjectURL(recordedAudioUrl);
          }
          const newUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(newUrl);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
      } catch (err: any) {
        console.warn('Microphone recording error:', err);
      }
    }

    // 2. Setup Web Speech Recognition API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setShowManualFallback(true);
      setErrorMessage('Trình duyệt của bạn chưa hỗ trợ Web Speech API. Bạn có thể nhập Pinyin hoặc chữ Hán bên dưới để kiểm tra.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let finalRecognized = '';
      let latestInterim = '';

      recognition.onstart = () => {
        setIsListening(true);
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
        setInterimTranscript(interim);
        if (finalRecognized) {
          setTranscript(finalRecognized);
        }
      };

      recognition.onerror = (event: any) => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        if (event.error === 'not-allowed') {
          setErrorMessage(
            'Vui lòng cấp quyền Microphone trong Cài đặt Hệ thống (Quyền riêng tư -> Micro & Nhận diện giọng nói) hoặc dùng nút tự đọc bên dưới.'
          );
          setShowManualFallback(true);
        } else if (event.error === 'service-not-allowed') {
          setErrorMessage(
            'Dịch vụ nhận diện giọng nói trên thiết bị chưa được bật (Cài đặt Mac -> Bàn phím -> Đọc chính tả, hoặc Cài đặt -> Quyền riêng tư -> Nhận diện giọng nói). Bạn vẫn có thể bấm nút "Đã tự đọc to rõ" bên dưới.'
          );
          setShowManualFallback(true);
        } else if (event.error === 'no-speech') {
          setErrorMessage('Chưa nghe rõ giọng của bạn. Hãy nghe lại mẫu chậm rồi bấm Micro nói to, rõ từng chữ nhé.');
        } else {
          setErrorMessage(`Lỗi nhận diện âm thanh: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }

        const evaluatedText = finalRecognized.trim() || latestInterim.trim();
        if (evaluatedText) {
          setTranscript(evaluatedText);
          const result = evaluateSpeech({
            expectedHanzi: currentDrill.hanzi,
            expectedPinyin: currentDrill.pinyin,
            receivedText: evaluatedText,
            passingThreshold,
          });
          handleEvaluationSuccess(result);
        }
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorMessage('Không thể khởi động bộ nhận diện giọng nói.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const handleToggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTogglePlayRecorded = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecorded && recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      if (!recordedAudioRef.current) {
        recordedAudioRef.current = new Audio(recordedAudioUrl);
        recordedAudioRef.current.onended = () => setIsPlayingRecorded(false);
      } else {
        recordedAudioRef.current.src = recordedAudioUrl;
      }
      setIsPlayingRecorded(true);
      recordedAudioRef.current.play().catch(() => setIsPlayingRecorded(false));
    }
  };

  const handleManualEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) return;

    setTranscript(manualInput.trim());
    const result = evaluateSpeech({
      expectedHanzi: currentDrill.hanzi,
      expectedPinyin: currentDrill.pinyin,
      receivedText: manualInput.trim(),
      passingThreshold,
    });
    handleEvaluationSuccess(result);
  };

  const handleReset = () => {
    setEvaluation(null);
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage(null);
    setManualInput('');
  };

  const passedCount = Object.keys(passedIds).length;

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xs transition-all space-y-5 ${className}`}
    >
      {/* Top Header & Voice Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Luyện nói từng bước ({currentIndex + 1}/{drills.length})
            </span>
            {drills.length > 1 && (
              <Badge variant="outline" size="sm">
                Đã đạt: {passedCount}/{drills.length} câu
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bước 1: Bấm nghe mẫu chuẩn hoặc đọc tách từng chữ • Bước 2: Bấm Micro và đọc theo theo tốc độ của bạn.
          </p>
        </div>

        <div className="self-start sm:self-center">
          <TTSVoiceSelector variant="dropdown" />
        </div>
      </div>

      {/* Multi-Drill Selector Pills (When multiple drills exist) */}
      {drills.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {drills.map((d, idx) => {
            const isActive = idx === currentIndex;
            const isPassed = passedIds[d.id] !== undefined;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => selectDrillIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : isPassed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isPassed && (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-600'}`}
                  />
                )}
                <span>
                  {idx + 1}. {d.hanzi.length > 6 ? `${d.hanzi.slice(0, 6)}…` : d.hanzi}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Pronunciation Display Card */}
      <div className="text-center py-6 px-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-4">
        {/* 3 Speed & Guided Listening Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={playNormalAudio}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              playingMode === 'normal'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-800 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 shadow-2xs'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${playingMode === 'normal' ? 'animate-bounce' : 'text-emerald-700'}`} />
            <span>1. Nghe mẫu chuẩn</span>
          </button>

          <button
            type="button"
            onClick={playSlowAudio}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              playingMode === 'slow'
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-800 border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 shadow-2xs'
            }`}
          >
            <Gauge className="w-4 h-4 text-amber-600" />
            <span>2. Nghe chậm (0.55x)</span>
          </button>

          <button
            type="button"
            onClick={playCharByCharAudio}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              playingMode === 'char'
                ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                : 'bg-white text-slate-800 border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 shadow-2xs'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{playingMode === 'char' ? 'Đang đọc từng chữ...' : '3. Đọc tách từng chữ'}</span>
          </button>
        </div>

        {/* Clickable Syllable-by-Syllable Hanzi + Pinyin Boxes */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-2">
          {hanziCharacters.map((char, index) => {
            const charPinyin = pinyinTokens[index] || '';
            const isMatched = evaluation?.matchedChars?.[index];
            const hasEvaluated = evaluation !== null;
            const isHighlighted = highlightedCharIndex === index;

            return (
              <button
                key={index}
                type="button"
                onClick={() => playSingleCharacter(char, index)}
                title={`Bấm để nghe riêng chữ "${char}"`}
                className={`flex flex-col items-center justify-center min-w-[64px] p-3 rounded-2xl border transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-amber-100 border-amber-400 text-slate-900 scale-110 shadow-md ring-2 ring-amber-300'
                    : !hasEvaluated
                    ? 'bg-white border-slate-200 hover:border-emerald-400 shadow-2xs'
                    : isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs scale-105'
                    : 'bg-rose-50 border-rose-300 text-rose-900 shadow-2xs'
                }`}
              >
                <span
                  className={`text-sm sm:text-base font-bold tracking-wide ${
                    isHighlighted
                      ? 'text-amber-900'
                      : !hasEvaluated
                      ? 'text-emerald-700'
                      : isMatched
                      ? 'text-emerald-800'
                      : 'text-rose-700'
                  }`}
                >
                  {charPinyin}
                </span>

                <span className="font-chinese text-3xl sm:text-4xl font-extrabold tracking-tight my-1">
                  {char}
                </span>

                {hasEvaluated && (
                  <div className="mt-0.5 flex items-center justify-center">
                    {isMatched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400">
          (Mẹo: Bạn có thể bấm trực tiếp vào từng ô chữ Hán ở trên để nghe phát âm lẻ của chữ đó)
        </p>

        {/* Meaning in Vietnamese */}
        <div className="pt-1">
          <p className="text-base sm:text-lg text-slate-800 font-bold">
            Nghĩa: {currentDrill.meaningVi}
          </p>
          {currentDrill.tip && (
            <p className="text-xs sm:text-sm text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-xl inline-block mt-2">
              💡 <strong>Hướng dẫn khẩu hình:</strong> {currentDrill.tip}
            </p>
          )}
        </div>
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Big Animated Microphone Section */}
      <div className="flex flex-col items-center justify-center py-2 space-y-3">
        <div className="relative flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-24 h-24 rounded-full bg-rose-400/30 animate-ping pointer-events-none" />
              <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-pulse pointer-events-none" />
            </>
          )}

          <button
            type="button"
            onClick={handleToggleListen}
            aria-label={isListening ? 'Dừng ghi âm' : 'Bắt đầu nói'}
            className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300 transform active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white shadow-rose-300 ring-4 ring-rose-200 scale-110'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-200 hover:scale-105'
            }`}
          >
            <Mic className={`h-9 w-9 ${isListening ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        <p className="text-sm font-bold text-slate-700 text-center">
          {isListening ? (
            <span className="text-rose-600 flex items-center gap-1.5 justify-center">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              Đang nghe... Hãy đọc to câu trên (Bấm lại Micro để kết thúc)
            </span>
          ) : evaluation ? (
            'Bấm Micro nếu muốn nói lại, hoặc bấm "Câu tiếp theo" bên dưới'
          ) : (
            'Khi đã sẵn sàng, bấm vào Micro để nói'
          )}
        </p>

        {/* Live speech transcription display */}
        <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center min-h-[48px] flex items-center justify-center">
          {isListening ? (
            <p className="text-sm font-bold text-emerald-800 animate-pulse">
              {interimTranscript || transcript || 'Đang lắng nghe...'}
            </p>
          ) : transcript ? (
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Hệ thống nghe được:</span>
              <p className="text-base font-bold text-slate-900 font-chinese">{transcript}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Không giới hạn thời gian — bạn cứ nghe kỹ rồi nói thoải mái.
            </p>
          )}
        </div>

        {/* 1-Click Self-Check Button for Quiet Environment / No-Mic Users */}
        {!isListening && (
          <button
            type="button"
            onClick={() => {
              const simulated = evaluateSpeech({
                expectedHanzi: currentDrill.hanzi,
                expectedPinyin: currentDrill.pinyin,
                receivedText: currentDrill.hanzi,
                passingThreshold,
              });
              handleEvaluationSuccess(simulated);
              if (currentIndex < drills.length - 1) {
                setTimeout(() => selectDrillIndex(currentIndex + 1), 650);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đã tự đọc to rõ (Qua câu tiếp 1-chạm)</span>
          </button>
        )}
      </div>

      {/* Instant Accuracy Score & Detailed Feedback Card */}
      {evaluation && (
        <div
          className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            evaluation.score >= 85
              ? 'bg-emerald-50/70 border-emerald-200'
              : evaluation.score >= 70
              ? 'bg-teal-50/70 border-teal-200'
              : evaluation.score >= 50
              ? 'bg-amber-50/70 border-amber-200'
              : 'bg-rose-50/70 border-rose-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl font-black text-xl text-white shadow-sm ${
                  evaluation.score >= 85
                    ? 'bg-emerald-600'
                    : evaluation.score >= 70
                    ? 'bg-teal-600'
                    : evaluation.score >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              >
                {evaluation.score}%
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {evaluation.score >= 90
                    ? 'Phát âm rất chuẩn!'
                    : evaluation.score >= 70
                    ? 'Đạt yêu cầu!'
                    : 'Hãy nghe chậm và thử lại nhé!'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">{evaluation.feedback}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {recordedAudioUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTogglePlayRecorded}
                  leftIcon={
                    isPlayingRecorded ? (
                      <Pause className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-emerald-700" />
                    )
                  }
                  className="text-xs font-semibold"
                >
                  {isPlayingRecorded ? 'Tạm dừng' : 'Nghe lại giọng bạn'}
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Thử lại
              </Button>

              {evaluation.isPassed && currentIndex < drills.length - 1 && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => selectDrillIndex(currentIndex + 1)}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  Câu tiếp theo
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {passedCount === drills.length && drills.length > 1 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                Hoàn thành xuất sắc cả {drills.length}/{drills.length} câu luyện nói!
              </h4>
              <p className="text-xs text-slate-600">
                Bạn đã nắm vững phát âm của bài học này. Hãy bấm &ldquo;Tiếp tục&rdquo; ở bên dưới để sang bước kế tiếp.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fallback Manual Text Input */}
      {(showManualFallback || !speechApiSupported) && (
        <form onSubmit={handleManualEvaluate} className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Chế độ nhập Pinyin hoặc Chữ Hán (khi không dùng Micro):
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder={`Nhập "${currentDrill.pinyin}" hoặc "${currentDrill.hanzi}"`}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <Button type="submit" variant="primary" size="sm" className="font-bold text-xs">
              Kiểm tra
            </Button>
          </div>
        </form>
      )}

      {/* Prev / Next Drill Navigation Footer */}
      {drills.length > 1 && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => selectDrillIndex(currentIndex - 1)}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="text-xs font-semibold"
          >
            Câu trước ({currentIndex}/{drills.length})
          </Button>

          <span className="text-xs font-bold text-slate-500">
            Câu {currentIndex + 1} / {drills.length}
          </span>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={currentIndex === drills.length - 1}
            onClick={() => selectDrillIndex(currentIndex + 1)}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            Câu luyện nói tiếp theo
          </Button>
        </div>
      )}
    </div>
  );
}
