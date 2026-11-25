'use client';

import React, { useState } from 'react';
import { QuizBlockData, QuizQuestionClient } from '@/types';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { speakChinese, useTTS } from '@/lib/tts';

export interface QuizBlockProps {
  data: QuizBlockData;
  onCompleted?: (isPassed: boolean) => void;
}

const LEGACY_DEMO_ANSWER_KEY: Record<string, number> = {
  q1: 0,
  q2: 0,
  q3: 0,
  q4: 0,
};

function getCorrectOptionIndex(q: QuizQuestionClient): number {
  if (typeof q.correctIndex === 'number' && q.correctIndex >= 0) {
    return q.correctIndex;
  }
  return LEGACY_DEMO_ANSWER_KEY[q.id] ?? 0;
}

export function QuizBlock({ data, onCompleted }: QuizBlockProps) {
  const { settings } = useTTS();
  const showPinyin = settings.showPinyin;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  // Extract Chinese characters from an option string if any, to play audio on click
  const extractChineseText = (str: string): string | null => {
    const match = str.match(/[\u4e00-\u9fff，。！？、]+/g);
    return match ? match.join('') : null;
  };

  const handleSelectOption = (question: QuizQuestionClient, optionIndex: number) => {
    const chosenText = question.options[optionIndex] || '';
    const zh = extractChineseText(chosenText);
    if (zh) {
      speakChinese(zh, { speedRate: 0.8 });
    }

    const nextAnswers = {
      ...selectedAnswers,
      [question.id]: optionIndex,
    };
    setSelectedAnswers(nextAnswers);

    // Check if all questions have now been answered
    if (Object.keys(nextAnswers).length === data.questions.length) {
      let correctCount = 0;
      data.questions.forEach((q) => {
        if (nextAnswers[q.id] === getCorrectOptionIndex(q)) {
          correctCount++;
        }
      });
      const pct =
        data.questions.length > 0
          ? Math.round((correctCount / data.questions.length) * 100)
          : 100;
      if (onCompleted) {
        onCompleted(pct >= data.passingScore);
      }
    }
  };

  const handleResetQuestion = (questionId: string) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleRetryAll = () => {
    setSelectedAnswers({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = data.questions.length;
  const isAllAnswered = totalCount > 0 && answeredCount === totalCount;

  let correctCount = 0;
  data.questions.forEach((q) => {
    if (selectedAnswers[q.id] === getCorrectOptionIndex(q)) {
      correctCount++;
    }
  });
  const scorePercentage =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;
  const isPassed = scorePercentage >= data.passingScore;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Chấm điểm tức thì 1-chạm
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Đã làm: {answeredCount}/{totalCount} câu
            </span>
          </div>
          <h3 className="text-base md:text-lg font-extrabold text-slate-900">{data.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bấm chọn đáp án để xem kết quả và lời giải thích ngay lập tức (Cần đạt tối thiểu{' '}
            <strong className="text-emerald-700">{data.passingScore}%</strong>).
          </p>
        </div>

        {answeredCount > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                isPassed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>
                Đúng {correctCount}/{answeredCount} ({scorePercentage}%)
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetryAll}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs font-semibold"
            >
              Làm lại
            </Button>
          </div>
        )}
      </div>

      {/* Visual Score Celebration Banner when all questions are answered */}
      {isAllAnswered && (
        <div
          className={`rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isPassed
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border-emerald-200'
              : 'bg-amber-50/80 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xs shrink-0 ${
                isPassed ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
            >
              {scorePercentage}%
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                {isPassed
                  ? 'Tuyệt vời! Bạn đã vượt qua bài kiểm tra!'
                  : 'Cố lên! Hãy thử chọn lại câu chưa đúng nhé!'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Bạn trả lời đúng <strong>{correctCount}/{totalCount}</strong> câu hỏi trọng tâm.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRetryAll}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs font-bold bg-white shrink-0"
          >
            Làm lại bài
          </Button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-5">
        {data.questions.map((question, qIdx) => {
          const selectedOption = selectedAnswers[question.id];
          const isQuestionAnswered = selectedOption !== undefined;
          const correctIdx = getCorrectOptionIndex(question);
          const isStudentCorrect = selectedOption === correctIdx;

          return (
            <div
              key={question.id}
              className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                !isQuestionAnswered
                  ? 'bg-slate-50/70 border-slate-200'
                  : isStudentCorrect
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : 'bg-rose-50/30 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                      !isQuestionAnswered
                        ? 'bg-emerald-700 text-white'
                        : isStudentCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {qIdx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                      {question.question}
                    </h4>
                    {showPinyin && question.pinyin && (
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                        {question.pinyin}
                      </p>
                    )}
                  </div>
                </div>

                {isQuestionAnswered && !isStudentCorrect && (
                  <button
                    type="button"
                    onClick={() => handleResetQuestion(question.id)}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shrink-0"
                  >
                    Chọn lại
                  </button>
                )}
              </div>

              {/* Options */}
              <div className="grid gap-2.5 sm:grid-cols-2 mt-3">
                {question.options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isThisCorrect = optIdx === correctIdx;
                  const zhText = extractChineseText(option);

                  let optionStyles =
                    'border-slate-200 bg-white text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/30';

                  if (isQuestionAnswered) {
                    if (isThisCorrect) {
                      optionStyles =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500';
                    } else if (isSelected && !isThisCorrect) {
                      optionStyles =
                        'border-rose-400 bg-rose-50 text-rose-950 font-semibold';
                    } else {
                      optionStyles =
                        'border-slate-200 bg-slate-100/50 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(question, optIdx)}
                      className={`flex items-center justify-between gap-2 p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all cursor-pointer ${optionStyles}`}
                    >
                      <span className="leading-snug">{option}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {zhText && (
                          <Volume2 className="w-3.5 h-3.5 text-emerald-600 opacity-70" />
                        )}
                        {isQuestionAnswered && isThisCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                        {isQuestionAnswered && isSelected && !isThisCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Box */}
              {isQuestionAnswered && (
                <div
                  className={`mt-3 p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    isStudentCorrect
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/90 border-amber-200 text-amber-950'
                  }`}
                >
                  <span className="font-bold mr-1.5">
                    {isStudentCorrect ? '✓ Chính xác!' : '💡 Đáp án đúng & Giải thích:'}
                  </span>
                  {question.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
