'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { evaluateSpeech, EvaluationResult } from '@/lib/speech/evaluator';
import { speakChinese } from '@/lib/tts';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';

export interface SpeechPracticeProps {
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  audioUrl?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  hskLevel?: number | string;
  passingThreshold?: number;
  onCompleted?: (result: EvaluationResult) => void;
  className?: string;
}

export function SpeechPractice({
  hanzi,
  pinyin,
  meaningVi,
  audioUrl,
  exampleSentence,
  exampleTranslation,
  hskLevel,
  passingThreshold = 70,
  onCompleted,
  className = '',
}: SpeechPracticeProps) {
  // Recognition & Recording states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [speechApiSupported, setSpeechApiSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Playback states (Reference audio & User recorded voice)
  const [isPlayingReference, setIsPlayingReference] = useState(false);
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
      // Cleanup audio stream and URLs
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Split Pinyin tokens for character alignment display
  const pinyinTokens = pinyin.trim().split(/\s+/);
  const hanziCharacters = Array.from(hanzi.replace(/\s+/g, ''));

  // Play native reference audio
  const playReferenceAudio = () => {
    if (typeof window === 'undefined') return;

    setIsPlayingReference(true);

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingReference(false);
      audio.onerror = () => fallbackSpeechSynthesis();
      audio.play().catch(() => fallbackSpeechSynthesis());
    } else {
      fallbackSpeechSynthesis();
    }
  };

  const fallbackSpeechSynthesis = () => {
    speakChinese(hanzi, {
      onEnd: () => setIsPlayingReference(false),
      onError: () => setIsPlayingReference(false),
    });
  };

  // Start Speech Recognition and Audio Recording
  const startListening = async () => {
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
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (recordedAudioUrl) {
            URL.revokeObjectURL(recordedAudioUrl);
          }
          const newUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(newUrl);

          // Stop mic tracks to free system resource
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
      setErrorMessage('Trình duyệt của bạn chưa hỗ trợ Web Speech API. Bạn có thể nhập text để kiểm tra.');
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

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalRecognized += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }
        setInterimTranscript(interim);
        if (finalRecognized) {
          setTranscript(finalRecognized);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Vui lòng cấp quyền truy cập Microphone trong trình duyệt để sử dụng tính năng này.');
          setShowManualFallback(true);
        } else if (event.error === 'no-speech') {
          setErrorMessage('Không nhận diện được giọng nói. Bạn hãy thử nói lại gần micro hơn nhé.');
        } else {
          setErrorMessage(`Lỗi nhận diện âm thanh: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Stop media recorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }

        // Evaluate transcript if available
        const evaluatedText = finalRecognized.trim() || interimTranscript.trim();
        if (evaluatedText) {
          setTranscript(evaluatedText);
          const result = evaluateSpeech({
            expectedHanzi: hanzi,
            expectedPinyin: pinyin,
            receivedText: evaluatedText,
            passingThreshold,
          });
          setEvaluation(result);
          onCompleted?.(result);
        }
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setErrorMessage('Không thể khởi động bộ nhận diện giọng nói.');
    }
  };

  // Stop listening manually
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  // Toggle listening button
  const handleToggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Play/pause user's recorded audio
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

  // Evaluate manual fallback text
  const handleManualEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) return;

    setTranscript(manualInput.trim());
    const result = evaluateSpeech({
      expectedHanzi: hanzi,
      expectedPinyin: pinyin,
      receivedText: manualInput.trim(),
      passingThreshold,
    });
    setEvaluation(result);
    onCompleted?.(result);
  };

  // Reset practice
  const handleReset = () => {
    setEvaluation(null);
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage(null);
    setManualInput('');
  };

  return (
    <div
      className={`rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm transition-all ${className}`}
    >
      {/* Top Header & HSK Badge & Voice Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Luyện phát âm & AI chấm điểm
          </span>
          {hskLevel && (
            <Badge variant="outline" size="sm">
              HSK {hskLevel}
            </Badge>
          )}
        </div>

        {/* Voice Selector & Reference Audio Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <TTSVoiceSelector variant="dropdown" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={playReferenceAudio}
            leftIcon={<Volume2 className={`w-4 h-4 ${isPlayingReference ? 'animate-bounce text-emerald-600' : ''}`} />}
            className="text-xs font-semibold"
          >
            {isPlayingReference ? 'Đang phát...' : 'Nghe mẫu'}
          </Button>
        </div>
      </div>

      {/* Main Pronunciation Display (Hanzi & Pinyin) */}
      <div className="text-center py-5 border-y border-gray-100 my-4 bg-[#faf9f6] rounded-2xl p-4">
        {/* Syllable-by-syllable feedback layout */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-2">
          {hanziCharacters.map((char, index) => {
            const charPinyin = pinyinTokens[index] || '';
            const isMatched = evaluation?.matchedChars?.[index];
            const hasEvaluated = evaluation !== null;

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all ${
                  !hasEvaluated
                    ? 'bg-white border-gray-200 shadow-xs'
                    : isMatched
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-xs scale-105'
                    : 'bg-rose-50/80 border-rose-300 text-rose-900 shadow-xs'
                }`}
              >
                {/* Pinyin Syllable */}
                <span
                  className={`text-sm sm:text-base font-semibold tracking-wide ${
                    !hasEvaluated
                      ? 'text-emerald-700'
                      : isMatched
                      ? 'text-emerald-800'
                      : 'text-rose-700'
                  }`}
                >
                  {charPinyin}
                </span>

                {/* Hanzi Character */}
                <span className="font-chinese text-3xl sm:text-4xl font-extrabold tracking-tight my-0.5">
                  {char}
                </span>

                {/* Match indicator */}
                {hasEvaluated && (
                  <div className="mt-1 flex items-center justify-center">
                    {isMatched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Meaning in Vietnamese */}
        <p className="text-base sm:text-lg text-gray-700 font-medium mt-3">
          {meaningVi}
        </p>

        {/* Optional Example Sentence */}
        {exampleSentence && (
          <div className="mt-3 text-xs sm:text-sm text-gray-500 bg-white/80 p-2.5 rounded-xl border border-gray-150 inline-block max-w-lg">
            <span className="font-chinese font-bold text-gray-800">{exampleSentence}</span>
            {exampleTranslation && <span className="block text-gray-500 text-xs mt-0.5">{exampleTranslation}</span>}
          </div>
        )}
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Big Animated Microphone Section */}
      <div className="flex flex-col items-center justify-center py-4 space-y-4">
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring animation when listening */}
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
            {isListening ? (
              <Mic className="h-9 w-9 animate-pulse" />
            ) : (
              <Mic className="h-9 w-9" />
            )}
          </button>
        </div>

        {/* Listening instruction label */}
        <p className="text-sm font-semibold text-gray-700 text-center">
          {isListening ? (
            <span className="text-rose-600 flex items-center gap-1.5 justify-center">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              Đang lắng nghe... Hãy phát âm câu tiếng Trung trên
            </span>
          ) : evaluation ? (
            'Nhấn micro để luyện phát âm lại'
          ) : (
            'Nhấn vào Micro để bắt đầu nói'
          )}
        </p>

        {/* Live speech transcription display */}
        <div className="w-full max-w-md bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 text-center min-h-[52px] flex items-center justify-center">
          {isListening ? (
            <p className="text-sm font-medium text-emerald-800 animate-pulse">
              {interimTranscript || transcript || '...'}
            </p>
          ) : transcript ? (
            <div className="space-y-0.5">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">Bạn đã nói:</span>
              <p className="text-base font-bold text-gray-900 font-chinese">{transcript}</p>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-400 italic">
              Giọng nói của bạn sẽ xuất hiện tại đây khi phát âm...
            </p>
          )}
        </div>
      </div>

      {/* Instant Accuracy Score & Detailed Feedback Card */}
      {evaluation && (
        <div
          className={`mt-4 rounded-2xl p-4 sm:p-5 border transition-all ${
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
            {/* Score Badge */}
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
                <h4 className="text-base font-bold text-gray-900">
                  {evaluation.score >= 90
                    ? 'Xuất sắc! 🎉'
                    : evaluation.score >= 75
                    ? 'Rất tốt! 👏'
                    : evaluation.score >= 70
                    ? 'Đạt yêu cầu! 👍'
                    : 'Cần luyện tập thêm! 💪'}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {evaluation.isPassed ? 'Đã vượt qua ngưỡng chuẩn phát âm.' : 'Chưa đạt mốc chuẩn. Hãy thử lại.'}
                </p>
              </div>
            </div>

            {/* Action buttons (Listen to recorded voice & Retry) */}
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
                Làm mới
              </Button>
            </div>
          </div>

          {/* AI Evaluator Feedback message */}
          <div className="bg-white/90 rounded-xl p-3 border border-gray-150 text-xs sm:text-sm text-gray-800 leading-relaxed">
            <span className="font-semibold text-emerald-900 block mb-0.5">Nhận xét từ AI:</span>
            {evaluation.feedback}
          </div>
        </div>
      )}

      {/* Fallback Manual Text Input (for browsers without Web Speech API or microphone issues) */}
      {(showManualFallback || !speechApiSupported) && (
        <form onSubmit={handleManualEvaluate} className="mt-4 pt-4 border-t border-gray-150 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Chế độ nhập dự phòng (Pinyin hoặc Chữ Hán):
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Ví dụ: nǐ hǎo hoặc 你好"
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <Button type="submit" variant="primary" size="sm" className="font-bold text-xs">
              Chấm điểm
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
