'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  Flame,
  Layers,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
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
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';
import { getMediaByLessonId, getThematicFlashcardByLessonId } from '@/lib/curriculum/media-resources';
import { DEMO_LESSONS } from '@/lib/mock-data';
import { HSK1_LESSONS, HSK2_LESSONS, HSK3_LESSONS, HSKLesson } from '@/lib/curriculum/hsk1-3-data';
import { HSK4_LESSONS, HSK5_LESSONS, HSK6_LESSONS } from '@/lib/curriculum/hsk4-9-data';
import {
  getCompletedBlockIds,
  toggleBlockCompleted,
  markLessonCompleted,
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
  const numericLevel = (Number(hsk.level.replace('HSK', '')) || 1) as 1 | 2 | 3 | 4 | 5 | 6;

  // 1. Vocabulary Items First (Learn core words before dialogue)
  if (hsk.vocabulary && hsk.vocabulary.length > 0) {
    blocks.push({
      id: `${hsk.id}-blk-vocab`,
      lessonId: hsk.id,
      type: 'vocabulary',
      sequenceOrder: seq++,
      isRequired: true,
      data: {
        title: `Từ vựng trọng tâm (${hsk.vocabulary.length} từ)`,
        description: 'Bấm vào từ hoặc biểu tượng loa để nghe phát âm. Bấm "Tập viết" để tô nét chữ Hán.',
        items: hsk.vocabulary.map((v, i) => ({
          id: `${hsk.id}-voc-${i}`,
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          meaningVi: v.meaningVi,
          exampleSentence: v.exampleSentence,
          exampleTranslation: v.exampleVi,
          audioUrl: v.audioUrl,
          hskLevel: numericLevel,
        })),
      },
    });
  }

  // 2. Grammar Notes & Key Patterns (Ngữ pháp trọng tâm)
  if (hsk.grammarNotes && hsk.grammarNotes.length > 0) {
    const grammarMarkdown = hsk.grammarNotes
      .map((g, idx) => {
        const examplesText = (g.examples || [])
          .map(
            (ex) =>
              `- **${ex.hanzi}** (${ex.pinyin}) — *${ex.vietnamese}*`
          )
          .join('\n');
        return `### ${idx + 1}. ${g.title}\n**Cấu trúc:** \`${g.pattern}\`\n\n${g.explanationVi}\n\n${examplesText}`;
      })
      .join('\n\n---\n\n');

    blocks.push({
      id: `${hsk.id}-blk-grammar`,
      lessonId: hsk.id,
      type: 'rich_text',
      sequenceOrder: seq++,
      isRequired: true,
      data: {
        content: grammarMarkdown,
        callout: {
          type: 'grammar_note',
          title: 'Ghi nhớ nhanh cấu trúc câu',
          text: `Áp dụng ngay ${hsk.grammarNotes.length} điểm ngữ pháp trên vào phần Hội thoại và Luyện nói tiếp theo.`,
        },
      },
    });
  }

  // 3. Dialogue Roleplay
  if (hsk.dialogue && hsk.dialogue.length > 0) {
    blocks.push({
      id: `${hsk.id}-blk-dialogue`,
      lessonId: hsk.id,
      type: 'roleplay_dialogue',
      sequenceOrder: seq++,
      isRequired: true,
      data: {
        title: 'Hội thoại thực tế',
        characterA: {
          name: hsk.dialogue[0]?.speakerName || 'Nhân vật A',
          avatar: hsk.dialogue[0]?.avatar || '👨‍💼',
        },
        characterB: {
          name: hsk.dialogue[1]?.speakerName || 'Nhân vật B',
          avatar: hsk.dialogue[1]?.avatar || '👩‍💼',
        },
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

  // 4. Speech Practice (Curated 6-8 progressive items: Core words -> Speech Drills -> Dialogue)
  const speechItems: Array<{
    id: string;
    hanzi: string;
    pinyin: string;
    meaningVi: string;
    tip?: string;
    audioUrl?: string;
    category?: 'word' | 'sentence';
  }> = [];
  const seenSpeechHanzi = new Set<string>();

  for (const v of (hsk.vocabulary || []).slice(0, 4)) {
    const key = v.hanzi.trim();
    if (key && !seenSpeechHanzi.has(key)) {
      seenSpeechHanzi.add(key);
      speechItems.push({
        id: `${hsk.id}-sp-voc-${speechItems.length}`,
        hanzi: v.hanzi,
        pinyin: v.pinyin,
        meaningVi: v.meaningVi,
        tip: v.exampleSentence ? `Ví dụ: ${v.exampleSentence} (${v.exampleVi || ''})` : undefined,
        category: 'word',
      });
    }
  }

  for (const drill of hsk.speechDrills || []) {
    const key = drill.hanzi.trim();
    if (key && !seenSpeechHanzi.has(key)) {
      seenSpeechHanzi.add(key);
      speechItems.push({
        id: `${hsk.id}-sp-drill-${speechItems.length}`,
        hanzi: drill.hanzi,
        pinyin: drill.pinyin,
        meaningVi: drill.vietnamese,
        tip: drill.pronunciationTipVi,
        audioUrl: drill.audioUrl,
        category: 'sentence',
      });
    }
  }

  for (const line of hsk.dialogue || []) {
    if (speechItems.length >= 8) break;
    const key = line.hanzi.trim();
    if (key && !seenSpeechHanzi.has(key)) {
      seenSpeechHanzi.add(key);
      speechItems.push({
        id: `${hsk.id}-sp-dlg-${speechItems.length}`,
        hanzi: line.hanzi,
        pinyin: line.pinyin,
        meaningVi: line.vietnamese,
        tip: `Câu thoại của ${line.speakerName}`,
        audioUrl: line.audioUrl,
        category: 'sentence',
      });
    }
  }

  if (speechItems.length > 0) {
    blocks.push({
      id: `${hsk.id}-blk-speech`,
      lessonId: hsk.id,
      type: 'speech_practice',
      sequenceOrder: seq++,
      isRequired: true,
      data: {
        hanzi: speechItems[0].hanzi,
        pinyin: speechItems[0].pinyin,
        meaningVi: speechItems[0].meaningVi,
        prompt: speechItems[0].tip,
        items: speechItems,
      },
    });
  }

  // 5. Shadowing Sentences (Curated up to 7 sentences)
  const shadowList: Array<{
    id: string;
    hanzi: string;
    pinyin: string;
    meaningVi: string;
    focusToneSandhi?: string;
  }> = [];
  const seenShadowHanzi = new Set<string>();

  for (const s of hsk.shadowSentences || []) {
    const key = s.hanzi.trim();
    if (key && !seenShadowHanzi.has(key)) {
      seenShadowHanzi.add(key);
      shadowList.push({
        id: `${hsk.id}-sh-${shadowList.length}`,
        hanzi: s.hanzi,
        pinyin: s.pinyin,
        meaningVi: s.vietnamese,
        focusToneSandhi: s.focusToneSandhi,
      });
    }
  }

  for (const d of hsk.dialogue || []) {
    if (shadowList.length >= 7) break;
    const key = d.hanzi.trim();
    if (key && !seenShadowHanzi.has(key)) {
      seenShadowHanzi.add(key);
      shadowList.push({
        id: `${hsk.id}-sh-dlg-${shadowList.length}`,
        hanzi: d.hanzi,
        pinyin: d.pinyin,
        meaningVi: d.vietnamese,
      });
    }
  }

  for (const v of hsk.vocabulary || []) {
    if (shadowList.length >= 7) break;
    if (v.exampleSentence && v.examplePinyin) {
      const key = v.exampleSentence.trim();
      if (key && !seenShadowHanzi.has(key)) {
        seenShadowHanzi.add(key);
        shadowList.push({
          id: `${hsk.id}-sh-ex-${shadowList.length}`,
          hanzi: v.exampleSentence,
          pinyin: v.examplePinyin,
          meaningVi: v.exampleVi || v.meaningVi,
          focusToneSandhi: `Từ trọng tâm: ${v.hanzi} (${v.pinyin} - ${v.meaningVi})`,
        });
      }
    }
  }

  if (shadowList.length > 0) {
    blocks.push({
      id: `${hsk.id}-blk-shadowing`,
      lessonId: hsk.id,
      type: 'shadowing',
      sequenceOrder: seq++,
      isRequired: false,
      data: {
        title: `Luyện nhại âm phản xạ (${shadowList.length} câu thực tế)`,
        sentences: shadowList,
      },
    });
  }

  // 6. Quiz Questions (Properly convert single_choice, ordering, and speaking_response into 4 selectable options with exact correctIndex)
  const adaptedQuizQuestions = (hsk.quizQuestions || []).map((q, i) => {
    let options: string[] = [];
    let correctIndex = 0;

    if (q.options && q.options.length > 0) {
      options = q.options;
      if (typeof q.correctAnswer === 'number') {
        correctIndex = q.correctAnswer;
      } else if (typeof q.correctAnswer === 'string') {
        const ansStr = q.correctAnswer.trim();
        const foundIdx = options.findIndex(
          (opt) => opt.trim() === ansStr || opt.startsWith(ansStr)
        );
        correctIndex = foundIdx >= 0 ? foundIdx : 0;
      }
    } else if (q.type === 'ordering' && q.orderingTokens && q.orderingTokens.length > 0) {
      const correctArr = Array.isArray(q.correctAnswer)
        ? q.correctAnswer
        : q.orderingTokens;
      const correctStr = correctArr.join(' ');
      const revStr = [...correctArr].reverse().join(' ');
      const swapFirstStr =
        correctArr.length >= 2
          ? [correctArr[1], correctArr[0], ...correctArr.slice(2)].join(' ')
          : `${correctStr} 吗`;
      const shiftStr =
        correctArr.length >= 2
          ? [...correctArr.slice(1), correctArr[0]].join(' ')
          : `不 ${correctStr}`;

      const uniqueOpts = Array.from(
        new Set([correctStr, swapFirstStr, revStr, shiftStr])
      );
      while (uniqueOpts.length < 4) {
        uniqueOpts.push(`${correctStr} (${uniqueOpts.length})`);
      }
      // Place correct answer at index (i % 4) for natural variety
      const targetPos = i % Math.min(4, uniqueOpts.length);
      const distractors = uniqueOpts.filter((o) => o !== correctStr);
      options = [
        ...distractors.slice(0, targetPos),
        correctStr,
        ...distractors.slice(targetPos),
      ].slice(0, 4);
      correctIndex = options.indexOf(correctStr);
    } else if (q.type === 'speaking_response' && q.targetSpeech) {
      const correctOpt = `${q.targetSpeech} (${
        typeof q.correctAnswer === 'string' ? q.correctAnswer : 'Phản hồi chuẩn'
      })`;
      const fallbackDistractors = [
        '对不起，我不知道。 (Xin lỗi, tôi không biết.)',
        '谢谢你，不客气！ (Cảm ơn bạn, đừng khách sáo!)',
        '请问洗手间在哪里？ (Xin hỏi nhà vệ sinh ở đâu?)',
      ].filter((d) => !d.includes(q.targetSpeech!));

      options = [correctOpt, ...fallbackDistractors.slice(0, 3)];
      correctIndex = 0;
    }

    return {
      id: `${hsk.id}-q-${i}`,
      type: 'single_choice' as const,
      question: q.prompt,
      pinyin: q.pinyin,
      options,
      explanation: q.explanation,
      correctIndex,
    };
  });

  // If a lesson (e.g. HSK 4-6) has fewer than 3 quiz questions, enrich from vocabulary & dialogue
  if (adaptedQuizQuestions.length < 3 && hsk.vocabulary && hsk.vocabulary.length > 0) {
    const v0 = hsk.vocabulary[0];
    adaptedQuizQuestions.push({
      id: `${hsk.id}-q-voc-extra-1`,
      type: 'single_choice' as const,
      question: `Từ vựng "${v0.hanzi}" (${v0.pinyin}) có ý nghĩa tiếng Việt là gì?`,
      pinyin: v0.pinyin,
      options: [
        v0.meaningVi,
        'Xin lỗi / Làm phiền một chút',
        'Thời tiết hôm nay rất đẹp',
        'Tạm biệt và hẹn gặp lại',
      ],
      explanation: `"${v0.hanzi}" (${v0.pinyin}) nghĩa là "${v0.meaningVi}". ${
        v0.exampleSentence ? `Ví dụ: ${v0.exampleSentence} (${v0.exampleVi || ''})` : ''
      }`,
      correctIndex: 0,
    });
  }

  if (adaptedQuizQuestions.length < 3 && hsk.dialogue && hsk.dialogue.length > 0) {
    const d0 = hsk.dialogue[0];
    adaptedQuizQuestions.push({
      id: `${hsk.id}-q-dlg-extra-2`,
      type: 'single_choice' as const,
      question: `Câu thoại "${d0.hanzi}" trong bài có nghĩa là gì?`,
      pinyin: d0.pinyin,
      options: [
        'Tôi đang đi mua sắm ở siêu thị.',
        d0.vietnamese,
        'Xin hỏi bây giờ là mấy giờ?',
        'Cảm ơn sự giúp đỡ của bạn.',
      ],
      explanation: `Câu "${d0.hanzi}" (${d0.pinyin}) nghĩa là: "${d0.vietnamese}".`,
      correctIndex: 1,
    });
  }

  if (adaptedQuizQuestions.length > 0) {
    blocks.push({
      id: `${hsk.id}-blk-quiz`,
      lessonId: hsk.id,
      type: 'quiz',
      sequenceOrder: seq++,
      isRequired: true,
      data: {
        quizId: `quiz-${hsk.id}`,
        title: 'Kiểm tra nhanh cuối bài',
        passingScore: 80,
        questions: adaptedQuizQuestions,
      },
    });
  }

  return {
    id: hsk.id,
    dayId: 'day-01',
    sequenceOrder: hsk.lessonNumber,
    title: hsk.title,
    description: `${hsk.subtitleVi} — ${hsk.summaryVi}`,
    estimatedMinutes: hsk.estimatedMinutes,
    blocks,
  };
}

function getStepShortLabel(type: string, index: number) {
  switch (type) {
    case 'rich_text':
      return `${index + 1}. Ngữ pháp`;
    case 'pinyin_chart':
      return `${index + 1}. Bảng Pinyin`;
    case 'vocabulary':
      return `${index + 1}. Từ vựng`;
    case 'flashcard_set':
      return `${index + 1}. Flashcard`;
    case 'roleplay_dialogue':
      return `${index + 1}. Hội thoại`;
    case 'speech_practice':
      return `${index + 1}. Luyện nói`;
    case 'shadowing':
      return `${index + 1}. Nhại âm`;
    case 'quiz':
      return `${index + 1}. Kiểm tra`;
    case 'video':
      return `${index + 1}. Video`;
    case 'audio':
      return `${index + 1}. Nghe Audio`;
    default:
      return `Bước ${index + 1}`;
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

  // Fallback to first HSK1 lesson if still not found
  if (!currentLesson) {
    currentLesson = adaptHskLessonToLesson(HSK1_LESSONS[0]);
    allDayLessons = ALL_HSK_LESSONS.map((h) => adaptHskLessonToLesson(h));
  }

  const [completedBlocks, setCompletedBlocks] = useState<string[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'step' | 'all'>('step');
  const [showSupplementary, setShowSupplementary] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  useEffect(() => {
    setCompletedBlocks(getCompletedBlockIds());
    setActiveStepIdx(0);
    setShowSupplementary(false);
  }, [lessonId]);

  const markBlockDone = (blockId: string) => {
    if (!completedBlocks.includes(blockId)) {
      toggleBlockCompleted(blockId);
      setCompletedBlocks((prev) => [...prev, blockId]);
    }
  };

  const handleToggleBlock = (blockId: string) => {
    const isNowDone = toggleBlockCompleted(blockId);
    if (isNowDone) {
      setCompletedBlocks((prev) => [...prev, blockId]);
    } else {
      setCompletedBlocks((prev) => prev.filter((id) => id !== blockId));
    }
  };

  const blocks = currentLesson.blocks;
  const totalSteps = blocks.length;
  const activeBlock = blocks[activeStepIdx] || blocks[0];

  const completedCount = blocks.filter((b) => completedBlocks.includes(b.id)).length;

  const handleNextStep = () => {
    if (activeBlock) {
      markBlockDone(activeBlock.id);
    }
    if (activeStepIdx < totalSteps - 1) {
      setActiveStepIdx((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinishLesson();
    }
  };

  const handlePrevStep = () => {
    if (activeStepIdx > 0) {
      setActiveStepIdx((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishLesson = () => {
    if (currentLesson) {
      blocks.forEach((b) => markBlockDone(b.id));
      markLessonCompleted(currentLesson.id);
      setIsCompletedModalOpen(true);
    }
  };

  // Find next lesson
  const currentIdx = allDayLessons.findIndex((l) => l.id === currentLesson?.id);
  const nextLesson = allDayLessons[currentIdx + 1];

  const supplementaryMedia = getMediaByLessonId(currentLesson.id);
  const thematicFlashcardSet = getThematicFlashcardByLessonId(currentLesson.id);
  const hasSupplementary =
    !!thematicFlashcardSet || (supplementaryMedia && supplementaryMedia.length > 0);

  const renderBlockContent = (block: LessonBlock) => {
    if (!block) return null;

    return (
      <div key={block.id} className="space-y-4">
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
                markBlockDone(block.id);
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
            prompt={(block.data as any)?.prompt || (block.data as any)?.hints}
            items={(block.data as any)?.items}
            audioUrl={(block.data as any)?.audioUrl}
            onCompleted={(res) => {
              if (res.isPassed) {
                markBlockDone(block.id);
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
              focusToneSandhi: s.focusToneSandhi,
            }))}
            onAllCompleted={() => markBlockDone(block.id)}
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
            onComplete={() => markBlockDone(block.id)}
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
    <div className="min-h-screen bg-slate-50">
      {/* Clean Sticky Header */}
      <div className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 gap-3">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Lộ trình</span>
          </Link>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="flex-1">
              <Progress
                value={viewMode === 'step' ? activeStepIdx + 1 : completedCount}
                max={totalSteps || 1}
                size="sm"
              />
            </div>
            <span className="text-xs font-bold text-emerald-800 whitespace-nowrap">
              {viewMode === 'step'
                ? `Bước ${activeStepIdx + 1}/${totalSteps}`
                : `${completedCount}/${totalSteps} xong`}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'step' ? 'all' : 'step')}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              title="Chuyển chế độ hiển thị"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>{viewMode === 'step' ? 'Xem tất cả' : 'Xem từng bước'}</span>
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleFinishLesson}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              className="font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs"
            >
              Hoàn thành
            </Button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Compact Lesson Title Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>BÀI HỌC {currentLesson.sequenceOrder}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-100">
                <Clock className="w-3.5 h-3.5" />
                {currentLesson.estimatedMinutes} phút
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {currentLesson.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 line-clamp-2 max-w-2xl">
              {currentLesson.description}
            </p>
          </div>

          <div className="self-start sm:self-center shrink-0">
            <TTSVoiceSelector variant="dropdown" />
          </div>
        </div>

        {/* STEPPER NAVIGATION PILLS (Easy 1-click navigation between lesson parts) */}
        {viewMode === 'step' && totalSteps > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {blocks.map((b, idx) => {
              const isCurrent = !showSupplementary && idx === activeStepIdx;
              const isDone = completedBlocks.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setShowSupplementary(false);
                    setActiveStepIdx(idx);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                    isCurrent
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {isDone && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-300' : 'text-emerald-600'}`}
                    />
                  )}
                  <span>{getStepShortLabel(b.type, idx)}</span>
                </button>
              );
            })}

            {hasSupplementary && (
              <button
                type="button"
                onClick={() => setShowSupplementary(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  showSupplementary
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Mở rộng & Video</span>
              </button>
            )}
          </div>
        )}

        {/* FOCUSED STEP VIEW (DEFAULT - UNCLUTTERED) */}
        {viewMode === 'step' ? (
          showSupplementary ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-6">
              <SupplementaryMediaBlock
                lessonId={currentLesson.id}
                supplementaryMedia={supplementaryMedia}
                thematicFlashcardSet={thematicFlashcardSet}
              />
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowSupplementary(false)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Quay lại bài học
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinishLesson}
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Hoàn thành bài học
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-6">
              {renderBlockContent(activeBlock)}

              {/* Step Bottom Navigation Bar */}
              <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={activeStepIdx === 0}
                  onClick={handlePrevStep}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
                >
                  Bước trước
                </Button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {activeStepIdx < totalSteps - 1 ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={handleNextStep}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 shadow-xs"
                    >
                      Tiếp tục: {getStepShortLabel(blocks[activeStepIdx + 1].type, activeStepIdx + 1)}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={handleFinishLesson}
                      rightIcon={<CheckCircle2 className="w-4 h-4" />}
                      className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 shadow-md shadow-emerald-700/20"
                    >
                      Hoàn thành bài học
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          /* ALL-AT-ONCE VIEW (For students who toggle "Xem tất cả") */
          <div className="space-y-6">
            {blocks.map((block, idx) => {
              const isBlockDone = completedBlocks.includes(block.id);
              return (
                <div
                  key={block.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                      {getStepShortLabel(block.type, idx)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleBlock(block.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                        isBlockDone
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isBlockDone ? 'Đã xong' : 'Đánh dấu xong'}</span>
                    </button>
                  </div>
                  {renderBlockContent(block)}
                </div>
              );
            })}

            {hasSupplementary && (
              <SupplementaryMediaBlock
                lessonId={currentLesson.id}
                supplementaryMedia={supplementaryMedia}
                thematicFlashcardSet={thematicFlashcardSet}
              />
            )}

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinishLesson}
                rightIcon={<CheckCircle2 className="w-5 h-5" />}
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8"
              >
                Hoàn thành bài học
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Congratulations Dialog */}
      <Dialog
        isOpen={isCompletedModalOpen}
        onClose={() => setIsCompletedModalOpen(false)}
        title="Hoàn thành bài học xuất sắc!"
        description="Tiến độ của bạn đã được lưu lại. Bạn có thể chuyển ngay sang bài kế tiếp."
      >
        <div className="py-4 text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/20">
            <Award className="w-8 h-8 text-amber-300 stroke-[1.75]" />
          </div>

          <h3 className="text-lg font-extrabold text-slate-900">
            {currentLesson.title}
          </h3>

          {/* Visual 3-Column Achievement Summary */}
          <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-lg font-black text-emerald-800">{totalSteps}/{totalSteps}</div>
              <div className="text-xs font-semibold text-emerald-700 mt-0.5">Phần hoàn thành</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-lg font-black text-amber-900">+50 XP</div>
              <div className="text-xs font-semibold text-amber-800 mt-0.5">Điểm tích lũy</div>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
              <div className="text-lg font-black text-teal-900">{currentLesson.estimatedMinutes}p</div>
              <div className="text-xs font-semibold text-teal-800 mt-0.5">Thời lượng học</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/roadmap')}
            className="font-semibold text-xs border-slate-300 text-slate-700"
          >
            Xem lộ trình
          </Button>

          {nextLesson ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsCompletedModalOpen(false);
                router.push(`/lesson/${nextLesson.id}`);
              }}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              Học bài tiếp theo: {nextLesson.title}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push('/dashboard')}
              className="font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              Về Bảng điều khiển
            </Button>
          )}
        </div>
      </Dialog>
    </div>
  );
}
