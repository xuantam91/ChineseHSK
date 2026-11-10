'use client';

import React, { useState } from 'react';
import { QuizBlockData, QuizQuestionClient } from '@/types';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface QuizBlockProps {
  data: QuizBlockData;
  onCompleted?: (isPassed: boolean) => void;
}

export function QuizBlock({ data, onCompleted }: QuizBlockProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    correctCount: number;
    total: number;
    percentage: number;
    isPassed: boolean;
  } | null>(null);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < data.questions.length) {
      alert('Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài!');
      return;
    }

    // In demo mode, we simulate server evaluation where question 1 = 0, question 2 = 1, etc.
    // In production, an API call to /api/quizzes/[id]/submit handles evaluation.
    let correct = 0;
    // Map demo answers: q1 -> 0 (nǐ), q2 -> 1 (您好), q3 -> 0 (5-5), q4 -> 0 (Tốt đẹp)
    const demoAnswerKey: Record<string, number> = {
      q1: 0,
      q2: 1,
      q3: 0,
      q4: 0,
    };

    data.questions.forEach((q) => {
      const studentPick = selectedAnswers[q.id];
      const correctIdx = demoAnswerKey[q.id] ?? 0;
      if (studentPick === correctIdx) {
        correct++;
      }
    });

    const percentage = Math.round((correct / data.questions.length) * 100);
    const passed = percentage >= data.passingScore;

    setScoreResult({
      correctCount: correct,
      total: data.questions.length,
      percentage,
      isPassed: passed,
    });
    setIsSubmitted(true);

    if (onCompleted) {
      onCompleted(passed);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">{data.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Điểm cần đạt: <span className="font-bold text-emerald-700">{data.passingScore}%</span> • Tổng số câu: {data.questions.length}
          </p>
        </div>

        {scoreResult && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
              scoreResult.isPassed
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>
              {scoreResult.isPassed ? 'ĐÃ ĐẠT' : 'CHƯA ĐẠT'}: {scoreResult.percentage}% ({scoreResult.correctCount}/{scoreResult.total})
            </span>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {data.questions.map((question, qIdx) => {
          const selectedOption = selectedAnswers[question.id];

          return (
            <div key={question.id} className="rounded-xl bg-gray-50/60 p-4 border border-gray-100">
              <div className="flex items-start gap-2.5 mb-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                  {qIdx + 1}
                </span>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-gray-900">
                    {question.question}
                  </h4>
                  {question.pinyin && (
                    <p className="text-xs text-emerald-700 font-medium">{question.pinyin}</p>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="grid gap-2 sm:grid-cols-2 mt-2">
                {question.options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;

                  let optionStyles = 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300';
                  if (isSelected && !isSubmitted) {
                    optionStyles = 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-600';
                  }

                  if (isSubmitted) {
                    // In submitted mode
                    const isCorrect = (question.id === 'q1' && optIdx === 0) ||
                                      (question.id === 'q2' && optIdx === 1) ||
                                      (question.id === 'q3' && optIdx === 0) ||
                                      (question.id === 'q4' && optIdx === 0);

                    if (isCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyles = 'border-red-400 bg-red-50 text-red-900';
                    } else {
                      optionStyles = 'border-gray-200 bg-gray-100/50 text-gray-400';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(question.id, optIdx)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs md:text-sm transition-all ${optionStyles}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && isSelected && (
                        <span>
                          {((question.id === 'q1' && optIdx === 0) ||
                            (question.id === 'q2' && optIdx === 1) ||
                            (question.id === 'q3' && optIdx === 0) ||
                            (question.id === 'q4' && optIdx === 0)) ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submission */}
              {isSubmitted && (
                <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950">
                  <span className="font-bold text-blue-900">Giải thích: </span>
                  {question.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Đã chọn: {Object.keys(selectedAnswers).length}/{data.questions.length} câu
        </span>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isSubmitted ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Làm lại bài
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Nộp bài kiểm tra
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
