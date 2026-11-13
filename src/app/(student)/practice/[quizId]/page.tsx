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
  Heart,
  Gem,
  Volume2,
  Trophy,
  Star,
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
  const [lives, setLives] = useState(3);
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
    setLives(3);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Gamified Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Trang chủ</span>
        </Link>

        {/* Gamification Counters */}
        <div className="flex items-center gap-2">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full text-rose-600 text-xs font-black">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{lives}</span>
          </div>

          {/* XP potential */}
          <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full text-indigo-700 text-xs font-black">
            <Gem className="w-3.5 h-3.5 text-indigo-600" />
            <span>+50 XP</span>
          </div>

          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            HSK 1
          </span>
        </div>
      </div>

      {/* Progress Card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
        <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Câu {currentQuestionIndex + 1} / {demoQuestions.length}</span>
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
            Đã làm: {answeredCount}/{demoQuestions.length}
          </span>
        </div>
        <Progress
          value={currentQuestionIndex + 1}
          max={demoQuestions.length}
          size="sm"
        />
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
            Câu hỏi trắc nghiệm #{currentQuestionIndex + 1}
          </span>
          <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-3 leading-snug">
            {currentQ.question}
          </h2>
          {currentQ.pinyin && (
            <div className="mt-2 inline-flex items-center gap-2 bg-emerald-50/70 border border-emerald-100 px-3 py-1 rounded-xl text-xs font-bold text-emerald-800">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Phiên âm: {currentQ.pinyin}</span>
            </div>
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
                    ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 font-black shadow-sm ring-2 ring-emerald-500/25 scale-[1.01]'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-semibold">{option}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="text-xs font-bold"
          >
            Câu trước
          </Button>

          {currentQuestionIndex < demoQuestions.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
              className="text-xs font-black shadow-xs"
            >
              Câu kế tiếp ➔
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitQuiz}
              disabled={answeredCount < demoQuestions.length}
              className="font-black shadow-md shadow-emerald-700/20"
            >
              Nộp bài kiểm tra ✨
            </Button>
          )}
        </div>
      </div>

      {/* Gamified 3-Star Result Dialog */}
      <Dialog
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title={resultScore?.isPassed ? 'Hoàn thành xuất sắc! 🎉' : 'Cố gắng lên nhé! 💪'}
        description={`Tiêu chí đạt: ${passingScore}% trở lên.`}
      >
        {resultScore && (
          <div className="space-y-4 py-2 text-center">
            {/* Stars row */}
            <div className="flex justify-center items-center gap-2">
              <Star
                className={`w-8 h-8 ${
                  resultScore.percentage >= 60 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                }`}
              />
              <Star
                className={`w-10 h-10 ${
                  resultScore.percentage >= 80
                    ? 'text-amber-400 fill-amber-400 animate-bounce'
                    : 'text-gray-200'
                }`}
              />
              <Star
                className={`w-8 h-8 ${
                  resultScore.percentage === 100 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                }`}
              />
            </div>

            <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="text-3xl font-black text-gray-900">
                {resultScore.percentage}%
              </div>
              <p className="text-xs text-gray-500 font-bold mt-1">
                Đúng {resultScore.correctCount} / {resultScore.total} câu • Thưởng{' '}
                <span className="text-indigo-600 font-black">+{resultScore.isPassed ? 50 : 20} XP</span>
              </p>
            </div>

            {/* Quick breakdown */}
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-left text-xs">
              {demoQuestions.map((q, idx) => {
                const picked = selectedAnswers[q.id];
                const isCorrect = picked === correctAnswersIndex[q.id];

                return (
                  <div key={q.id} className="p-3 rounded-2xl border border-gray-100 bg-white">
                    <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>Câu {idx + 1}: {q.question}</span>
                    </div>
                    <p className="text-gray-500 pl-6 leading-relaxed">{q.explanation}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Làm lại
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-xs font-black shadow-md shadow-emerald-700/20"
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
