'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { RichTextBlock } from '@/components/lesson/RichTextBlock';
import { VocabBlock } from '@/components/lesson/VocabBlock';
import { MediaBlock } from '@/components/lesson/MediaBlock';
import { PdfBlock } from '@/components/lesson/PdfBlock';
import { FlashcardBlock } from '@/components/lesson/FlashcardBlock';
import { QuizBlock } from '@/components/lesson/QuizBlock';
import { DEMO_LESSONS } from '@/lib/mock-data';
import {
  getCompletedBlockIds,
  toggleBlockCompleted,
  markLessonCompleted,
  getCompletedLessonIds,
} from '@/lib/student-store';
import {
  Lesson,
  LessonBlock,
  RichTextBlockData,
  VocabBlockData,
  MediaBlockData,
  PdfBlockData,
  FlashcardBlockData,
  QuizBlockData,
} from '@/types';

export default function LessonReaderPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const router = useRouter();
  const { lessonId } = use(params);

  // Find lesson across all days
  let currentLesson: Lesson | undefined;
  let allDayLessons: Lesson[] = [];

  for (const dayId of Object.keys(DEMO_LESSONS)) {
    const list = DEMO_LESSONS[dayId];
    const found = list.find((l) => l.id === lessonId);
    if (found) {
      currentLesson = found;
      allDayLessons = list;
      break;
    }
  }

  // Fallback to first lesson
  if (!currentLesson) {
    currentLesson = DEMO_LESSONS['day-01'][0];
    allDayLessons = DEMO_LESSONS['day-01'];
  }

  const [completedBlocks, setCompletedBlocks] = useState<string[]>([]);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  useEffect(() => {
    setCompletedBlocks(getCompletedBlockIds());
  }, []);

  const handleToggleBlock = (blockId: string) => {
    const isNowDone = toggleBlockCompleted(blockId);
    if (isNowDone) {
      setCompletedBlocks((prev) => [...prev, blockId]);
    } else {
      setCompletedBlocks((prev) => prev.filter((id) => id !== blockId));
    }
  };

  const requiredBlocks = currentLesson.blocks.filter((b) => b.isRequired);
  const completedRequiredCount = requiredBlocks.filter((b) =>
    completedBlocks.includes(b.id)
  ).length;

  const isReadyToComplete =
    requiredBlocks.length === 0 || completedRequiredCount === requiredBlocks.length;

  const handleFinishLesson = () => {
    if (currentLesson) {
      markLessonCompleted(currentLesson.id);
      setIsCompletedModalOpen(true);
    }
  };

  // Find next lesson
  const currentIdx = allDayLessons.findIndex((l) => l.id === currentLesson?.id);
  const nextLesson = allDayLessons[currentIdx + 1];

  const renderBlock = (block: LessonBlock) => {
    const isBlockDone = completedBlocks.includes(block.id);

    return (
      <div
        key={block.id}
        className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-7 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Khối {block.sequenceOrder} • {block.type}
            </span>
            {block.isRequired && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Bắt buộc
              </span>
            )}
          </div>

          {block.isRequired && (
            <button
              onClick={() => handleToggleBlock(block.id)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                isBlockDone
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isBlockDone ? 'Đã xong' : 'Đánh dấu xong'}</span>
            </button>
          )}
        </div>

        {/* Content Type Dispatch */}
        {block.type === 'rich_text' && (
          <RichTextBlock data={block.data as RichTextBlockData} />
        )}
        {block.type === 'vocabulary' && (
          <VocabBlock data={block.data as VocabBlockData} />
        )}
        {(block.type === 'video' || block.type === 'audio') && (
          <MediaBlock data={block.data as MediaBlockData} />
        )}
        {block.type === 'pdf' && <PdfBlock data={block.data as PdfBlockData} />}
        {block.type === 'flashcard_set' && (
          <FlashcardBlock data={block.data as FlashcardBlockData} />
        )}
        {block.type === 'quiz' && (
          <QuizBlock
            data={block.data as QuizBlockData}
            onCompleted={(passed) => {
              if (passed) {
                handleToggleBlock(block.id);
              }
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Sticky Top Bar for Focused Reader */}
      <div className="sticky top-0 z-30 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href={`/learn/${currentLesson.dayId}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Tổng quan ngày học</span>
            <span className="sm:hidden">Quay lại</span>
          </Link>

          <div className="flex-1 max-w-xs mx-4 hidden sm:block">
            <Progress
              value={completedRequiredCount}
              max={requiredBlocks.length || 1}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">
              {completedRequiredCount}/{requiredBlocks.length} khối xong
            </span>

            {isReadyToComplete ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleFinishLesson}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                className="font-bold text-xs"
              >
                Hoàn thành bài
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-xs opacity-60"
              >
                Chưa xong hết
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Reading Container */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Lesson Title Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Bài học {currentLesson.sequenceOrder}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" />
              {currentLesson.estimatedMinutes} phút
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {currentLesson.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {currentLesson.description}
          </p>
        </div>

        {/* Blocks rendered in sequential order */}
        <div className="space-y-6">
          {currentLesson.blocks.map((block) => renderBlock(block))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
          <Link href={`/learn/${currentLesson.dayId}`}>
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Quay lại danh sách ngày
            </Button>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              onClick={handleFinishLesson}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold"
            >
              Hoàn thành bài học này
            </Button>

            {nextLesson && (
              <Link href={`/lesson/${nextLesson.id}`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Bài tiếp theo
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Congratulations Dialog */}
      <Dialog
        isOpen={isCompletedModalOpen}
        onClose={() => setIsCompletedModalOpen(false)}
        title="Chúc mừng bạn đã hoàn thành bài học! 🎉"
        description="Bạn vừa tích lũy thêm kiến thức mới vào hành trình 12 tháng của mình."
      >
        <div className="py-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-3 animate-bounce">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Xuất sắc hoàn thành!</h3>
          <p className="text-xs text-gray-600 max-w-xs mx-auto">
            Hệ thống đã lưu lại tiến độ học tập và cập nhật chuỗi streak của bạn.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/learn/${currentLesson.dayId}`)}
          >
            Về danh sách bài
          </Button>

          {nextLesson ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push(`/lesson/${nextLesson.id}`)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Học bài tiếp theo
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              Về Trang chủ
            </Button>
          )}
        </div>
      </Dialog>
    </div>
  );
}
