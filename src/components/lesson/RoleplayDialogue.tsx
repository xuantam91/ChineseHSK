'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
  Bot,
  Play,
  Check,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { evaluateSpeech, EvaluationResult } from '@/lib/speech/evaluator';
import { speakChinese, stopChineseSpeech } from '@/lib/tts';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';

export interface DialogueCharacter {
  name: string;
  avatar?: string;
  color?: string; // Tailwind color class or hex
  description?: string;
}

export interface DialogueLine {
  id: string;
  role: 'A' | 'B';
  speakerName: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  audioUrl?: string;
}

export interface RoleplayDialogueProps {
  title?: string;
  description?: string;
  characterA: DialogueCharacter;
  characterB: DialogueCharacter;
  lines: DialogueLine[];
  passingThreshold?: number;
  onComplete?: () => void;
  className?: string;
}

export function RoleplayDialogue({
  title = 'Luyện Hội Thoại Nhập Vai 1-1',
  description = 'Chọn một nhân vật để đóng vai và hội thoại trực tiếp cùng AI.',
  characterA,
  characterB,
  lines,
  passingThreshold = 70,
  onComplete,
  className = '',
}: RoleplayDialogueProps) {
  // Student role selection: 'A' or 'B'
  const [studentRole, setStudentRole] = useState<'A' | 'B'>('B');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // States
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [completedLineIds, setCompletedLineIds] = useState<Record<string, number>>({});
  const [isDialogueFinished, setIsDialogueFinished] = useState(false);

  // Visibility toggles
  const [showPinyin, setShowPinyin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);

  // Refs
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timelineEndRef = useRef<HTMLDivElement | null>(null);

  const currentLine = lines[currentLineIndex];
  const isStudentTurn = currentLine && currentLine.role === studentRole;
  const isAiTurn = currentLine && currentLine.role !== studentRole;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // When currentLineIndex changes, if it is AI turn, trigger AI speech automatically
  useEffect(() => {
    if (isDialogueFinished) return;

    if (currentLine && currentLine.role !== studentRole) {
      // Small pause before AI starts speaking
      const timeout = setTimeout(() => {
        playAiLine(currentLine);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, studentRole, isDialogueFinished]);

  // Scroll to active conversation line
  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [currentLineIndex]);

  // Play line using audioUrl or SpeechSynthesis
  const playAiLine = (line: DialogueLine) => {
    setIsAiSpeaking(true);

    if (line.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(line.audioUrl);
      } else {
        audioRef.current.src = line.audioUrl;
      }
      audioRef.current.onended = () => handleAiLineFinished(line.id);
      audioRef.current.onerror = () => speakTTS(line.hanzi, () => handleAiLineFinished(line.id));
      audioRef.current.play().catch(() => speakTTS(line.hanzi, () => handleAiLineFinished(line.id)));
    } else {
      speakTTS(line.hanzi, () => handleAiLineFinished(line.id));
    }
  };

  const speakTTS = (text: string, onEnd?: () => void) => {
    speakChinese(text, {
      onEnd: () => {
        setIsAiSpeaking(false);
        onEnd?.();
      },
      onError: () => {
        setIsAiSpeaking(false);
        onEnd?.();
      },
    });
  };

  const handleAiLineFinished = (lineId: string) => {
    setIsAiSpeaking(false);
    setCompletedLineIds((prev) => ({ ...prev, [lineId]: 100 }));
    advanceToNextLine();
  };

  // Student speech recognition
  const startStudentSpeech = () => {
    setEvaluation(null);
    setTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (currentLine) {
        setCompletedLineIds((prev) => ({ ...prev, [currentLine.id]: 95 }));
      }
      advanceToNextLine();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      let finalRecognized = '';

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
        setTranscript(finalRecognized || interim);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        const spoken = finalRecognized.trim() || transcript.trim();
        if (spoken && currentLine) {
          const evalResult = evaluateSpeech({
            expectedHanzi: currentLine.hanzi,
            expectedPinyin: currentLine.pinyin,
            receivedText: spoken,
            passingThreshold,
          });

          setEvaluation(evalResult);

          if (evalResult.isPassed) {
            setCompletedLineIds((prev) => ({ ...prev, [currentLine.id]: evalResult.score }));
            // Automatically advance after brief success display
            setTimeout(() => {
              advanceToNextLine();
            }, 1800);
          }
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopStudentSpeech = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Move to next line in dialogue
  const advanceToNextLine = () => {
    setEvaluation(null);
    setTranscript('');

    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      setIsDialogueFinished(true);
      onComplete?.();
    }
  };

  // Play reference audio for student line
  const playReference = (line: DialogueLine, speedRate = 0.78) => {
    speakChinese(line.hanzi, {
      speedRate,
      onEnd: () => setIsAiSpeaking(false),
      onError: () => setIsAiSpeaking(false),
    });
  };

  // Restart dialogue
  const handleRestart = (newRole?: 'A' | 'B') => {
    if (newRole) {
      setStudentRole(newRole);
    }
    setCurrentLineIndex(0);
    setCompletedLineIds({});
    setIsDialogueFinished(false);
    setEvaluation(null);
    setTranscript('');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Calculate overall dialogue score
  const scoreValues = Object.values(completedLineIds);
  const averageScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : 100;

  return (
    <div
      className={`rounded-3xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm space-y-6 ${className}`}
    >
      {/* Header & Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              Mô phỏng Hội Thoại 2 Nhân Vật
            </span>
            <Badge variant="outline" size="sm">
              Lượt {Math.min(currentLineIndex + 1, lines.length)} / {lines.length}
            </Badge>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{description}</p>
        </div>

        {/* Role Selector Tabs & TTS Voice */}
        <div className="flex flex-wrap items-center gap-2">
          <TTSVoiceSelector variant="dropdown" />
          <div className="flex items-center p-1 rounded-2xl bg-gray-100 border border-gray-200 shadow-inner">
            <button
              type="button"
              onClick={() => handleRestart('A')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                studentRole === 'A'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Vai A: {characterA.name}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRestart('B')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                studentRole === 'B'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Vai B: {characterB.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Chat Bubbles */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto p-4 bg-gray-50/50 rounded-2xl border border-gray-150">
        {lines.map((line, index) => {
          const isRoleA = line.role === 'A';
          const isStudent = line.role === studentRole;
          const isCurrent = index === currentLineIndex && !isDialogueFinished;
          const isPast = index < currentLineIndex || isDialogueFinished;
          const character = isRoleA ? characterA : characterB;
          const score = completedLineIds[line.id];

          return (
            <div
              key={line.id}
              className={`flex items-start gap-3 transition-all ${
                isRoleA ? 'flex-row' : 'flex-row-reverse'
              } ${isCurrent ? 'opacity-100 scale-[1.01]' : isPast ? 'opacity-90' : 'opacity-40'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold text-xs text-white shadow-xs ${
                  isRoleA ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}
              >
                {character.name.charAt(0)}
              </div>

              {/* Bubble Content */}
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 shadow-xs border transition-all ${
                  isCurrent
                    ? 'bg-white border-emerald-400 ring-2 ring-emerald-100 shadow-md'
                    : isRoleA
                    ? 'bg-white border-gray-200 text-gray-900'
                    : 'bg-emerald-50/60 border-emerald-200 text-gray-900'
                }`}
              >
                {/* Speaker Header */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-500">
                    {character.name} {isStudent ? '(Bạn đóng vai)' : '(AI)'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {score !== undefined && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {score}%
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => playReference(line)}
                      title="Nghe lại câu này"
                      className="text-gray-400 hover:text-emerald-600 p-0.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pinyin */}
                {showPinyin && (
                  <p className="text-xs sm:text-sm font-semibold text-emerald-700 mb-0.5">
                    {line.pinyin}
                  </p>
                )}

                {/* Hanzi */}
                <p className="font-chinese text-base sm:text-lg font-bold text-gray-900">
                  {line.hanzi}
                </p>

                {/* Meaning */}
                {showMeaning && (
                  <p className="text-xs text-gray-500 mt-1 italic">{line.meaningVi}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={timelineEndRef} />
      </div>

      {/* Active Turn Interactive Action Area */}
      {!isDialogueFinished && currentLine && (
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-[#f7fcf9] to-[#ffffff] p-5 sm:p-6 shadow-sm">
          {isAiTurn ? (
            /* AI Speaking State */
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {characterA.name === currentLine.speakerName ? characterA.name : characterB.name} (AI) đang nói...
                  </h4>
                  <p className="text-xs text-gray-500">Lắng nghe để chuẩn bị cho lượt thoại tiếp theo</p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAiLineFinished(currentLine.id)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Bỏ qua
              </Button>
            </div>
          ) : (
            /* Student's Turn to Speak */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    Đến lượt bạn nói! Hãy phát âm câu dưới đây:
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => playReference(currentLine, 0.78)}
                    leftIcon={<Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                    className="text-xs font-semibold"
                  >
                    Nghe mẫu
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => playReference(currentLine, 0.55)}
                    leftIcon={<Volume2 className="w-3.5 h-3.5 text-amber-600" />}
                    className="text-xs font-semibold"
                  >
                    Nghe chậm (0.55x)
                  </Button>
                </div>
              </div>

              {/* Target Line Display */}
              <div className="text-center py-2">
                <p className="text-sm sm:text-base font-semibold text-emerald-700 mb-1">
                  {currentLine.pinyin}
                </p>
                <h3 className="font-chinese text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {currentLine.hanzi}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 italic">
                  {currentLine.meaningVi}
                </p>
              </div>

              {/* Mic & Evaluation Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                {/* Microphone Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={isListening ? stopStudentSpeech : startStudentSpeech}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-md transition-all active:scale-95 ${
                      isListening
                        ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                  </button>

                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                      {isListening ? 'Đang lắng nghe bạn...' : 'Nhấn vào micro để nói'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transcript ? `Đã nhận diện: "${transcript}"` : 'AI sẽ tự động chấm điểm phát âm'}
                    </p>
                  </div>
                </div>

                {/* Proceed / 1-Click Practice Button */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (currentLine) {
                        setCompletedLineIds((prev) => ({ ...prev, [currentLine.id]: 95 }));
                      }
                      advanceToNextLine();
                    }}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    className="text-xs font-bold text-slate-700 border-slate-300 hover:bg-emerald-50"
                  >
                    Đã tự đọc theo (Qua lượt)
                  </Button>

                  {evaluation?.isPassed && (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={advanceToNextLine}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      className="text-xs font-bold"
                    >
                      Tiếp tục ngay
                    </Button>
                  )}
                </div>
              </div>

              {/* Real-time Evaluation Result Banner */}
              {evaluation && (
                <div
                  className={`rounded-2xl p-3 border flex items-center justify-between gap-3 text-xs sm:text-sm ${
                    evaluation.isPassed
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {evaluation.isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span>{evaluation.feedback}</span>
                  </div>
                  <Badge variant={evaluation.isPassed ? 'success' : 'outline'} size="sm">
                    {evaluation.score}%
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Completion Celebration Card */}
      {isDialogueFinished && (
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-teal-50/40 p-6 sm:p-8 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Hoàn thành xuất sắc bài hội thoại! 🎉
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Bạn đã hoàn thành toàn bộ các lượt đối thoại trong vai{' '}
              <strong>{studentRole === 'A' ? characterA.name : characterB.name}</strong>.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-xs uppercase font-bold text-gray-400">Điểm trung bình:</span>
            <span className="text-2xl font-black text-emerald-700">{averageScore}%</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => handleRestart(studentRole === 'A' ? 'B' : 'A')}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Đổi sang vai {studentRole === 'A' ? characterB.name : characterA.name}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => handleRestart(studentRole)}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="font-bold"
            >
              Luyện lại vai này
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
