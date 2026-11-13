'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  Award,
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
      pinyin: 'xièxie',
      options: ['xièxie', 'xǐexie', 'xiéxie', 'xiēxie'],
      explanation: 'Chữ thứ nhất đọc thanh 4 "xiè", chữ thứ hai là khinh thanh (thanh nhẹ) đọc nhẹ thành "xie".',
      type: 'single_choice',
    },
    {
      id: 'pq-2',
      question: 'Câu đáp lại lịch sự khi ai đó nói "谢谢" là gì?',
      pinyin: 'bú kèqi',
      options: ['不客气 (bú kèqi)', '对不起 (duìbuqǐ)', '没关系 (méi guānxi)', '再见 (zàijiàn)'],
      explanation: '"不客气" (bú kèqi) nghĩa là "Đừng khách sáo / Không có chi".',
      type: 'single_choice',
    },
    {
      id: 'pq-3',
      question: 'Số 15 trong tiếng Trung đọc là gì?',
      pinyin: 'shí wǔ',
      options: ['十五 (shí wǔ)', '五十一 (wǔ shí yī)', '一十五 (yī shí wǔ)', '十五十 (shí wǔ shí)'],
      explanation: 'Quy tắc số đếm: 10 + 5 đọc là "十五" (shí wǔ).',
      type: 'single_choice',
    },
    {
      id: 'pq-4',
      question: 'Quy tắc biến điệu hai thanh 3 đi liền nhau (3 + 3) thay đổi như thế nào?',
      pinyin: '3 + 3 => 2 + 3',
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
      pinyin: 'xuéshēng',
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
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Trang chủ</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            HSK 1 • Đánh giá
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
          <span>Câu {currentQuestionIndex + 1} / {demoQuestions.length}</span>
          <span className="text-slate-500 font-medium">
            Đã trả lời: {answeredCount}/{demoQuestions.length}
          </span>
        </div>
        <Progress
          value={currentQuestionIndex + 1}
          max={demoQuestions.length}
          size="sm"
        />
      </div>

      {/* Question Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs space-y-6">
        <div>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider inline-block">
            Câu hỏi {currentQuestionIndex + 1}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2.5 leading-snug">
            {currentQ.question}
          </h2>
          {currentQ.pinyin && (
            <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700">
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Phiên âm: {currentQ.pinyin}</span>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQ.id] === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left text-sm transition-colors ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{option}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="text-xs font-semibold border-slate-300 text-slate-700"
          >
            Câu trước
          </Button>

          {currentQuestionIndex < demoQuestions.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
              className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs"
            >
              Câu kế tiếp
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitQuiz}
              disabled={answeredCount < demoQuestions.length}
              className="font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs px-6"
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
        title={resultScore?.isPassed ? 'Đạt chuẩn bài kiểm tra' : 'Chưa đạt chuẩn yêu cầu'}
        description={`Tiêu chí đạt: ${passingScore}% trở lên.`}
      >
        {resultScore && (
          <div className="space-y-4 py-2 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-white shadow-2xs">
              <Award className="w-7 h-7 text-emerald-400" />
            </div>

            <div>
              <div className="text-2xl font-bold text-slate-900">
                {resultScore.percentage}%
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Đúng {resultScore.correctCount} trên tổng số {resultScore.total} câu
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200 max-w-sm mx-auto">
              {resultScore.isPassed
                ? 'Bạn đã hoàn thành tốt bài kiểm tra và củng cố vững chắc kiến thức.'
                : 'Hãy ôn lại các từ vựng và quy tắc phát âm trước khi thử lại.'}
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-xs font-semibold border-slate-300 text-slate-700"
              >
                Làm lại bài
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Về Trang chủ
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
