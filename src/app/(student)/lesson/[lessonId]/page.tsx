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
  Gem,
  Flame,
  Volume2,
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
import { SpeechPractice } from '@/components/lesson/SpeechPractice';
import { ShadowingPlayer } from '@/components/lesson/ShadowingPlayer';
import { RoleplayDialogue } from '@/components/lesson/RoleplayDialogue';
import { PinyinChart } from '@/components/lesson/PinyinChart';
import { ImageBlock } from '@/components/lesson/ImageBlock';
import { SupplementaryMediaBlock } from '@/components/lesson/SupplementaryMediaBlock';
import { getMediaByLessonId, getThematicFlashcardByLessonId } from '@/lib/curriculum/media-resources';
import { DEMO_LESSONS } from '@/lib/mock-data';
import { HSK1_LESSONS, HSK2_LESSONS, HSK3_LESSONS, HSKLesson } from '@/lib/curriculum/hsk1-3-data';
import { HSK4_LESSONS, HSK5_LESSONS, HSK6_LESSONS } from '@/lib/curriculum/hsk4-9-data';
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

const ALL_HSK_LESSONS: HSKLesson[] = [
  ...HSK1_LESSONS,
  ...HSK2_LESSONS,
  ...HSK3_LESSONS,
  ...HSK4_LESSONS,
  ...HSK5_LESSONS,
  ...HSK6_LESSONS,
];

function adaptHskLessonToLesson(hsk: HSKLesson): Lesson {
  const blocks: LessonBlock[] = [];
  let seq = 1;

  // 1. Overview & Intro
  blocks.push({
    id: `${hsk.id}-blk-intro`,
    lessonId: hsk.id,
    type: 'rich_text',
    sequenceOrder: seq++,
    isRequired: true,
    data: {
      content: `# ${hsk.title}\n\n**${hsk.subtitleVi}**\n\n${hsk.summaryVi}`,
      callout: {
        type: 'tip',
        title: 'Mục tiêu bài học',
        text: `Học ${hsk.vocabulary.length} từ vựng mới, đối thoại đời sống và luyện nói mic để đạt điểm tuyệt đối.`,
      },
    },
  });

  // 2. Dialogue Roleplay
  if (hsk.dialogue && hsk.dialogue.length > 0) {
    blocks.push({
      id: `${hsk.id}-blk-dialogue`,
      lessonId: hsk.id,
      type: 'roleplay_dialogue',
      sequenceOrder: seq++,
      isRequired: true,
      data: {
        title: 'Hội thoại đàm thoại tình huống thực tế',
        characterA: { name: hsk.dialogue[0]?.speakerName || 'Nhân vật A', avatar: '👨‍💼' },
        characterB: { name: hsk.dialogue[1]?.speakerName || 'Nhân vật B', avatar: '👩‍💼' },
        lines: hsk.dialogue.map((d, i) => ({
          id: `${hsk.id}-d-${i}`,
          role: (d.speaker === 'A' ? 'A' : 'B') as 'A' | 'B',
          speakerName: d.speakerName,
          hanzi: d.hanzi,
          pinyin: d.pinyin,
          meaningVi: d.vietnamese,
          audioUrl: d.audioUrl,
        })),
      },
    });
  }

  // 3. Vocabulary Items
  if (hsk.vocabulary && hsk.vocabulary.length > 0) {
    blocks.push({
      id: `${hsk.id}-blk-vocab`,
      lessonId: hsk.id,
      type: 'vocabulary',
      sequenceOrder: seq++,
      isRequired: true,
      data: {
        title: `Từ vựng cốt lõi New HSK 3.0 (${hsk.vocabulary.length} từ)`,
        description: 'Bấm biểu tượng loa để nghe phát âm bản xứ và xem ví dụ minh họa.',
        items: hsk.vocabulary.map((v, i) => ({
          id: `${hsk.id}-voc-${i}`,
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          meaningVi: v.meaningVi,
          exampleSentence: v.exampleSentence,
          exampleTranslation: v.exampleVi,
          hskLevel: hsk.level === 'HSK1' ? 1 : hsk.level === 'HSK2' ? 2 : 3,
        })),
      },
    });
  }

  // 4. Speech Practice (Luyện nói mic)
  if (hsk.speechDrills && hsk.speechDrills.length > 0) {
    const drill = hsk.speechDrills[0];
    blocks.push({
      id: `${hsk.id}-blk-speech`,
      lessonId: hsk.id,
      type: 'speech_practice',
      sequenceOrder: seq++,
      isRequired: true,
      data: {
        hanzi: drill.hanzi,
        pinyin: drill.pinyin,
        meaningVi: drill.vietnamese,
        audioUrl: drill.audioUrl,
        prompt: drill.pronunciationTipVi,
      },
    });
  }

  // 5. Shadowing Sentences
  if (hsk.shadowSentences && hsk.shadowSentences.length > 0) {
    blocks.push({
      id: `${hsk.id}-blk-shadowing`,
      lessonId: hsk.id,
      type: 'shadowing',
      sequenceOrder: seq++,
      isRequired: false,
      data: {
        title: 'Luyện nhại giọng phản xạ (Shadowing bản xứ)',
        sentences: hsk.shadowSentences.map((s, i) => ({
          id: `${hsk.id}-sh-${i}`,
          hanzi: s.hanzi,
          pinyin: s.pinyin,
          meaningVi: s.vietnamese,
          focusToneSandhi: s.focusToneSandhi,
        })),
      },
    });
  }

  // 6. Quiz Questions
  if (hsk.quizQuestions && hsk.quizQuestions.length > 0) {
    blocks.push({
      id: `${hsk.id}-blk-quiz`,
      lessonId: hsk.id,
      type: 'quiz',
      sequenceOrder: seq++,
      isRequired: true,
      data: {
        quizId: `quiz-${hsk.id}`,
        title: 'Kiểm tra phản xạ & Củng cố kiến thức',
        passingScore: 80,
        questions: hsk.quizQuestions.map((q, i) => ({
          id: `${hsk.id}-q-${i}`,
          type: (q.type === 'fill_in' ? 'fill_in' : 'single_choice') as 'single_choice' | 'fill_in',
          question: q.prompt,
          pinyin: q.pinyin,
          options: q.options || [],
          explanation: q.explanation,
        })),
      },
    });
  }

  return {
    id: hsk.id,
    dayId: 'day-01',
    sequenceOrder: hsk.lessonNumber,
    title: hsk.title,
    description: hsk.subtitleVi,
    estimatedMinutes: hsk.estimatedMinutes,
    blocks,
  };
}

function getBlockFriendlyLabel(type: string, seq: number) {
  switch (type) {
    case 'rich_text':
      return { title: `📖 PHẦN ${seq}: HƯỚNG DẪN & BỐI CẢNH`, color: 'text-blue-700 bg-blue-50' };
    case 'vocabulary':
      return { title: `🔤 PHẦN ${seq}: TỪ VỰNG CỐT LÕI`, color: 'text-amber-800 bg-amber-50' };
    case 'roleplay_dialogue':
      return { title: `💬 PHẦN ${seq}: HỘI THOẠI ĐỜI SỐNG`, color: 'text-purple-700 bg-purple-50' };
    case 'speech_practice':
      return { title: `🎙️ PHẦN ${seq}: LUYỆN NÓI CHẤM MIC`, color: 'text-rose-700 bg-rose-50' };
    case 'shadowing':
      return { title: `🎧 PHẦN ${seq}: NHẠI ÂM SHADOWING`, color: 'text-teal-700 bg-teal-50' };
    case 'quiz':
      return { title: `⚡ PHẦN ${seq}: THỬ TÀI TRẮC NGHIỆM`, color: 'text-indigo-700 bg-indigo-50' };
    case 'flashcard_set':
      return { title: `🎴 PHẦN ${seq}: FLASHCARD LẬT THẺ`, color: 'text-emerald-700 bg-emerald-50' };
    case 'video':
      return { title: `🎬 PHẦN ${seq}: VIDEO BỐI CẢNH`, color: 'text-red-700 bg-red-50' };
    case 'audio':
      return { title: `🔊 PHẦN ${seq}: AUDIO NGHE LẶP`, color: 'text-sky-700 bg-sky-50' };
    default:
      return { title: `📌 PHẦN ${seq}: NỘI DUNG BÀI HỌC`, color: 'text-gray-700 bg-gray-50' };
  }
}

export default function LessonReaderPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const router = useRouter();
  const { lessonId } = use(params);

  // 1. Check in DEMO_LESSONS
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

  // 2. If not found in DEMO_LESSONS, check ALL_HSK_LESSONS
  if (!currentLesson) {
    const hskFound = ALL_HSK_LESSONS.find((l) => l.id === lessonId);
    if (hskFound) {
      currentLesson = adaptHskLessonToLesson(hskFound);
      allDayLessons = ALL_HSK_LESSONS.map((h) => adaptHskLessonToLesson(h));
    }
  }

  // Fallback to first demo lesson if still not found
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
    const friendly = getBlockFriendlyLabel(block.type, block.sequenceOrder || 1);

    return (
      <div
        key={block.id}
        className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-7 shadow-xs space-y-4 hover:border-emerald-100 transition-colors"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${friendly.color}`}>
              {friendly.title}
            </span>
            {block.isRequired && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                Bắt buộc
              </span>
            )}
          </div>

          {block.isRequired && (
            <button
              onClick={() => handleToggleBlock(block.id)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                isBlockDone
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isBlockDone ? '✓ Đã hoàn thành' : 'Đánh dấu xong'}</span>
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
        {block.type === 'image' && <ImageBlock data={block.data as any} />}
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
        {block.type === 'speech_practice' && (
          <SpeechPractice
            hanzi={
              (block.data as any)?.hanzi ||
              (block.data as any)?.phrase ||
              '你好'
            }
            pinyin={(block.data as any)?.pinyin || 'nǐ hǎo'}
            meaningVi={
              (block.data as any)?.meaningVi ||
              (block.data as any)?.meaning_vi ||
              'Xin chào'
            }
            audioUrl={(block.data as any)?.audioUrl}
            onCompleted={(res) => {
              if (res.isPassed) {
                handleToggleBlock(block.id);
              }
            }}
          />
        )}
        {block.type === 'shadowing' && (
          <ShadowingPlayer
            title={(block.data as any)?.title || 'Luyện nghe & Nhại lại (Shadowing)'}
            sentences={((block.data as any)?.sentences || []).map((s: any, idx: number) => ({
              id: s.id || `sh-${idx}`,
              hanzi: s.hanzi || '',
              pinyin: s.pinyin || '',
              meaningVi: s.meaningVi || s.vietnamese || '',
              audioUrl: s.audioUrl,
              speaker: s.speaker,
            }))}
            onAllCompleted={() => handleToggleBlock(block.id)}
          />
        )}
        {block.type === 'roleplay_dialogue' && (
          <RoleplayDialogue
            title={(block.data as any)?.title || 'Hội thoại tương tác theo vai'}
            characterA={{
              name: (block.data as any)?.roleA || (block.data as any)?.characterA?.name || 'Nhân vật A',
              avatar: (block.data as any)?.characterA?.avatar || '👨‍💼',
            }}
            characterB={{
              name: (block.data as any)?.roleB || (block.data as any)?.characterB?.name || 'Nhân vật B',
              avatar: (block.data as any)?.characterB?.avatar || '👩‍💼',
            }}
            lines={((block.data as any)?.lines || (block.data as any)?.dialogue || []).map((l: any, i: number) => ({
              id: l.id || `line-${i}`,
              role: (l.role || l.speaker || 'A') as 'A' | 'B',
              speakerName: l.speakerName || l.speaker_name || (l.role === 'B' ? 'Nhân vật B' : 'Nhân vật A'),
              hanzi: l.hanzi || '',
              pinyin: l.pinyin || '',
              meaningVi: l.meaningVi || l.vietnamese || '',
              audioUrl: l.audioUrl,
            }))}
            onComplete={() => handleToggleBlock(block.id)}
          />
        )}
        {block.type === 'pinyin_chart' && (
          <PinyinChart
            defaultTab={(block.data as any)?.defaultTab || 'initials'}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Sticky Top Bar for Focused Reader */}
      <div className="sticky top-0 z-30 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:px-6">
          <Link
            href={`/roadmap`}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại Lộ trình</span>
            <span className="sm:hidden">Thoát</span>
          </Link>

          {/* Segmented Progress Bar & XP indicator */}
          <div className="flex items-center gap-3">
            <div className="w-32 sm:w-48 hidden sm:block">
              <Progress
                value={completedRequiredCount}
                max={requiredBlocks.length || 1}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              <Gem className="w-3 h-3 text-indigo-600" />
              <span>+20 XP</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-bold hidden sm:inline">
              {completedRequiredCount}/{requiredBlocks.length} xong
            </span>

            {isReadyToComplete ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleFinishLesson}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                className="font-black text-xs shadow-md shadow-emerald-700/20"
              >
                Hoàn thành bài
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-xs opacity-60 font-semibold"
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
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Bài học {currentLesson.sequenceOrder}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-500 font-semibold">
              <Clock className="w-3 h-3" />
              {currentLesson.estimatedMinutes} phút
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {currentLesson.title}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            {currentLesson.description}
          </p>
        </div>

        {/* Blocks rendered in sequential order */}
        <div className="space-y-6">
          {currentLesson.blocks.map((block) => renderBlock(block))}
        </div>

        {/* Supplementary Multimedia & Thematic Flashcards */}
        <SupplementaryMediaBlock
          lessonId={currentLesson.id}
          supplementaryMedia={getMediaByLessonId(currentLesson.id)}
          thematicFlashcardSet={getThematicFlashcardByLessonId(currentLesson.id)}
        />

        {/* Bottom Actions Bar */}
        <div className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
          <Link href={`/roadmap`}>
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Quay lại lộ trình
            </Button>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              onClick={handleFinishLesson}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
              className="w-full sm:w-auto font-black shadow-md shadow-emerald-700/20"
            >
              Hoàn thành bài học
            </Button>

            {nextLesson && (
              <Link href={`/lesson/${nextLesson.id}`}>
                <Button variant="outline" size="md" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  Bài tiếp theo
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Gamified Congratulations Dialog */}
      <Dialog
        isOpen={isCompletedModalOpen}
        onClose={() => setIsCompletedModalOpen(false)}
        title="Xuất sắc hoàn thành bài học! 🎉"
        description="Bạn vừa tích lũy thêm điểm kinh nghiệm và củng cố vững chắc chuỗi học tập."
      >
        <div className="py-4 text-center space-y-3">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30 animate-bounce">
            <Award className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-black text-gray-900">
            Xin chúc mừng! ✨
          </h3>

          <div className="flex justify-center items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-xs font-black">
              <Gem className="w-4 h-4" />
              <span>+50 XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-black">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Streak +1 Ngày</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 max-w-xs mx-auto pt-1 font-medium">
            Tiến độ đã được lưu tự động trên hệ thống. Hãy tiếp tục giữ vững nhịp độ này!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/roadmap`)}
            className="font-bold text-xs"
          >
            Về Lộ trình
          </Button>

          {nextLesson ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push(`/lesson/${nextLesson.id}`)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="font-black text-xs shadow-md shadow-emerald-700/20"
            >
              Học bài tiếp theo ➔
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="font-black text-xs"
            >
              Về Trang chủ
            </Button>
          )}
        </div>
      </Dialog>
    </div>
  );
}
