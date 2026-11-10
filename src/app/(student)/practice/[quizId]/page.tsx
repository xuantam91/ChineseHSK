'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Dialog } from '@/components/ui/Dialog';
import { QuizQuestionClient } from '@/types';

export default function PracticeQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const router = useRouter();
  const { quizId } = use(params);

  const demoQuestions: QuizQuestionClient[] = [
    {
      id: 'pq-1',
      question: 'Phát âm nào sau đây đúng với chữ Hán "谢谢" (Cảm ơn)?',
      pinyin: '谢谢',
      options: ['xièxie', 'xǐexie', 'xiéxie', 'xiēxie'],
      explanation: 'Chữ thứ nhất đọc thanh 4 "xiè", chữ thứ hai là khinh thanh (thanh nhẹ) đọc nhẹ thành "xie".',
      type: 'single_choice',
    },
    {
      id: 'pq-2',
      question: 'Câu đáp lại lịch sự khi ai đó nói "谢谢" là gì?',
      options: ['不客气 (bú kèqi)', '对不起 (duìbuqǐ)', '没关系 (méi guānxi)', '再见 (zàijiàn)'],
      explanation: '"不客气" (bú kèqi) nghĩa là "Đừng khách sáo / Không có chi".',
      type: 'single_choice',
    },
    {
      id: 'pq-3',
      question: 'Số 15 trong tiếng Trung đọc là gì?',
      options: ['十五 (shí wǔ)', '五十一 (wǔ shí yī)', '一十五 (yī shí wǔ)', '十五十 (shí wǔ shí)'],
      explanation: 'Quy tắc số đếm: 10 + 5 đọc là "十五" (shí wǔ).',
      type: 'single_choice',
    },
    {
      id: 'pq-4',
      question: 'Quy tắc biến điệu hai thanh 3 đi liền nhau (3 + 3) thay đổi như thế nào?',
      options: [
        'Thanh 3 thứ nhất biến thành thanh 2 (2 + 3)',
        'Thanh 3 thứ hai biến thành thanh 2 (3 + 2)',
        'Cả hai đều biến thành thanh 1 (1 + 1)',
        'Giữ nguyên không đổi',
      ],
      explanation: 'Khi hai thanh 3 đi liền nhau, âm thứ nhất chuyển thành thanh 2 (ví dụ: nǐ + hǎo -> ní hǎo).',
      type: 'single_choice',
    },
    {
      id: 'pq-5',
      question: 'Từ nào có nghĩa là "học sinh"?',
      options: ['学生 (xuéshēng)', '老师 (lǎoshī)', '朋友 (péngyou)', '医生 (yīshēng)'],
      explanation: '"学生" (xuéshēng) nghĩa là học sinh/sinh viên.',
      type: 'single_choice',
    },
  ];

  const correctAnswersIndex: Record<string, number> = {
    'pq-1': 0,
    'pq-2': 0,
    'pq-3': 0,
    'pq-4': 0,
    'pq-5': 0,
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultScore, setResultScore] = useState<{
    correctCount: number;
    total: number;
    percentage: number;
    isPassed: boolean;
  } | null>(null);

  const currentQ = demoQuestions[currentQuestionIndex];
  const passingScore = 80;

  const handleSelectAnswer = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < demoQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    demoQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === correctAnswersIndex[q.id]) {
        correct++;
      }
    });

    const percentage = Math.round((correct / demoQuestions.length) * 100);
    const passed = percentage >= passingScore;

    setResultScore({
      correctCount: correct,
      total: demoQuestions.length,
      percentage,
      isPassed: passed,
    });
    setIsResultModalOpen(true);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsResultModalOpen(false);
    setResultScore(null);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về bảng điều khiển</span>
        </Link>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Bài kiểm tra HSK 1 [DEMO]
        </span>
      </div>

      {/* Progress & Counter */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-2">
          <span>
            Câu hỏi {currentQuestionIndex + 1} / {demoQuestions.length}
          </span>
          <span>Đã làm: {answeredCount}/{demoQuestions.length}</span>
        </div>
        <Progress
          value={currentQuestionIndex + 1}
          max={demoQuestions.length}
          size="sm"
        />
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
            Câu {currentQuestionIndex + 1}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            {currentQ.question}
          </h2>
          {currentQ.pinyin && (
            <p className="text-sm font-semibold text-emerald-700 mt-1">{currentQ.pinyin}</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQ.id] === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left text-sm transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            Câu trước
          </Button>

          {currentQuestionIndex < demoQuestions.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
            >
              Câu kế tiếp
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitQuiz}
              disabled={answeredCount < demoQuestions.length}
              className="font-bold shadow-md shadow-emerald-700/20"
            >
              Nộp bài kiểm tra
            </Button>
          )}
        </div>
      </div>

      {/* Result Dialog */}
      <Dialog
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title={resultScore?.isPassed ? 'Chúc mừng bạn đã vượt qua! 🎉' : 'Cố gắng lên nhé! 💪'}
        description={`Tiêu chí đạt: ${passingScore}% trở lên.`}
      >
        {resultScore && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-2 ${
                  resultScore.isPassed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <Award className="w-7 h-7" />
              </div>
              <div className="text-2xl font-black text-gray-900">
                {resultScore.percentage}%
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Đúng {resultScore.correctCount} trên tổng số {resultScore.total} câu
              </p>
            </div>

            {/* Explanations summary */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
              <h4 className="font-bold text-gray-800">Chi tiết lời giải:</h4>
              {demoQuestions.map((q, idx) => {
                const picked = selectedAnswers[q.id];
                const isCorrect = picked === correctAnswersIndex[q.id];

                return (
                  <div key={q.id} className="p-3 rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-start gap-1.5 font-semibold text-gray-900 mb-1">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <span>Câu {idx + 1}: {q.question}</span>
                    </div>
                    <p className="text-gray-500 pl-5">{q.explanation}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Làm lại
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                Về bảng điều khiển
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
