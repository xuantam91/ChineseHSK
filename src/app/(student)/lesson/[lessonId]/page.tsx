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
import { LessonCoverCard } from '@/components/lesson/LessonCoverCard';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';
import { getMediaByLessonId, getThematicFlashcardByLessonId } from '@/lib/curriculum/media-resources';
import { DEMO_LESSONS } from '@/lib/mock-data';
import { HSK1_LESSONS, HSK2_LESSONS, HSK3_LESSONS, HSKLesson } from '@/lib/curriculum/hsk1-3-data';
import { HSK4_LESSONS, HSK5_LESSONS, HSK6_LESSONS } from '@/lib/curriculum/hsk4-9-data';
import {
  getCompletedBlockIds,
  toggleBlockCompleted,
  markLessonCompleted,
  getStoredUserProfile,
  isDemoAccount,
  DEMO_MAX_LESSONS,
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
          examplePinyin: v.examplePinyin,
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
        tip: v.exampleSentence
          ? `Ví dụ: ${v.exampleSentence} (${v.examplePinyin ? `${v.examplePinyin} — ` : ''}${v.exampleVi || ''})`
          : undefined,
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
      const correctOpt = `${q.targetSpeech} (${q.pinyin ? `${q.pinyin} — ` : ''}${
        typeof q.correctAnswer === 'string' ? q.correctAnswer : 'Phản hồi chuẩn'
      })`;
      const fallbackDistractors = [
        '对不起，我不知道。 (Duìbuqǐ, wǒ bù zhīdào. — Xin lỗi, tôi không biết.)',
        '谢谢你，不客气！ (Xièxie nǐ, bú kèqi! — Cảm ơn bạn, đừng khách sáo!)',
        '请问洗手间在哪里？ (Qǐngwèn xǐshǒujiān zài nǎlǐ? — Xin hỏi nhà vệ sinh ở đâu?)',
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

  // Enrich Final Comprehensive Quiz to 8-10 questions covering Vocabulary, Pinyin, Grammar, and Dialogue
  const fallbackViMeanings = [
    'Xin lỗi / Làm phiền một chút',
    'Thời tiết hôm nay rất đẹp',
    'Tạm biệt và hẹn gặp lại',
    'Đi siêu thị mua hoa quả',
    'Tôi đang làm việc ở văn phòng',
  ];
  const fallbackPinyins = ['wǒ men', 'xīng qī', 'piào liang', 'zhōng guó', 'xué xí'];
  const fallbackHanzis = ['对不起', '没关系', '再见', '明天', '朋友'];

  // Add Vocabulary Meaning questions
  for (let idx = 0; idx < (hsk.vocabulary || []).length; idx++) {
    if (adaptedQuizQuestions.length >= 10) break;
    const v = hsk.vocabulary[idx];
    const otherMeanings = (hsk.vocabulary || [])
      .filter((other) => other.hanzi !== v.hanzi)
      .map((other) => other.meaningVi);
    const distractors = [...otherMeanings, ...fallbackViMeanings]
      .filter((m) => m !== v.meaningVi)
      .slice(0, 3);
    const pos = idx % 4;
    const opts = [
      ...distractors.slice(0, pos),
      v.meaningVi,
      ...distractors.slice(pos),
    ].slice(0, 4);

    adaptedQuizQuestions.push({
      id: `${hsk.id}-q-voc-meaning-${idx}`,
      type: 'single_choice' as const,
      question: `Từ vựng "${v.hanzi}" (${v.pinyin}) có nghĩa tiếng Việt là gì?`,
      pinyin: v.pinyin,
      options: opts,
      explanation: `"${v.hanzi}" (${v.pinyin}) có nghĩa là "${v.meaningVi}". ${
        v.exampleSentence ? `Ví dụ: ${v.exampleSentence} (${v.exampleVi || ''})` : ''
      }`,
      correctIndex: opts.indexOf(v.meaningVi),
    });

    // Also add Reverse Vocab (Meaning -> Hanzi) or Pinyin question for the first 2 words
    if (idx < 2 && adaptedQuizQuestions.length < 10) {
      const otherHanzis = (hsk.vocabulary || [])
        .filter((other) => other.hanzi !== v.hanzi)
        .map((other) => `${other.hanzi} (${other.pinyin})`);
      const targetChoice = `${v.hanzi} (${v.pinyin})`;
      const zhDistractors = [
        ...otherHanzis,
        ...fallbackHanzis.map((hz, k) => `${hz} (${fallbackPinyins[k]})`),
      ]
        .filter((item) => item !== targetChoice)
        .slice(0, 3);
      const revPos = (idx + 1) % 4;
      const revOpts = [
        ...zhDistractors.slice(0, revPos),
        targetChoice,
        ...zhDistractors.slice(revPos),
      ].slice(0, 4);

      adaptedQuizQuestions.push({
        id: `${hsk.id}-q-voc-hanzi-${idx}`,
        type: 'single_choice' as const,
        question: `Trong tiếng Trung, từ nào dưới đây mang nghĩa là "${v.meaningVi}"?`,
        pinyin: v.pinyin,
        options: revOpts,
        explanation: `Để diễn đạt "${v.meaningVi}", tiếng Trung dùng từ "${v.hanzi}" (${v.pinyin}).`,
        correctIndex: revOpts.indexOf(targetChoice),
      });
    }
  }

  // Add Grammar Pattern Comprehension questions
  for (let gIdx = 0; gIdx < (hsk.grammarNotes || []).length; gIdx++) {
    if (adaptedQuizQuestions.length >= 10) break;
    const g = hsk.grammarNotes[gIdx];
    const ex = g.examples?.[0];
    if (ex) {
      const exOpts = [
        ex.vietnamese,
        'Xin hỏi nhà ga tàu điện ngầm ở đâu?',
        'Hôm nay tôi rất bận không đi được.',
        'Quyển sách tiếng Trung này của ai?',
      ].filter((val, i, arr) => arr.indexOf(val) === i);
      while (exOpts.length < 4) {
        exOpts.push(`Phương án khác ${exOpts.length}`);
      }

      adaptedQuizQuestions.push({
        id: `${hsk.id}-q-gram-${gIdx}`,
        type: 'single_choice' as const,
        question: `Áp dụng điểm ngữ pháp "${g.title}" (${g.pattern}), câu "${ex.hanzi}" có nghĩa là gì?`,
        pinyin: ex.pinyin,
        options: exOpts.slice(0, 4),
        explanation: `Theo cấu trúc "${g.pattern}": câu "${ex.hanzi}" (${ex.pinyin}) nghĩa là "${ex.vietnamese}".`,
        correctIndex: 0,
      });
    }
  }

  // Add Dialogue Comprehension questions
  for (let dIdx = 0; dIdx < (hsk.dialogue || []).length; dIdx++) {
    if (adaptedQuizQuestions.length >= 10) break;
    const d = hsk.dialogue[dIdx];
    const otherDlgMeanings = (hsk.dialogue || [])
      .filter((line) => line.hanzi !== d.hanzi)
      .map((line) => line.vietnamese);
    const dlgDistractors = [...otherDlgMeanings, ...fallbackViMeanings]
      .filter((m) => m !== d.vietnamese)
      .slice(0, 3);
    const dPos = (dIdx + 2) % 4;
    const dOpts = [
      ...dlgDistractors.slice(0, dPos),
      d.vietnamese,
      ...dlgDistractors.slice(dPos),
    ].slice(0, 4);

    adaptedQuizQuestions.push({
      id: `${hsk.id}-q-dlg-${dIdx}`,
      type: 'single_choice' as const,
      question: `Trong hội thoại, khi ${d.speakerName} nói "${d.hanzi}", câu này có nghĩa là gì?`,
      pinyin: d.pinyin,
      options: dOpts,
      explanation: `Câu "${d.hanzi}" (${d.pinyin}) nghĩa là: "${d.vietnamese}".`,
      correctIndex: dOpts.indexOf(d.vietnamese),
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
        title: `Kiểm tra tổng hợp cuối bài (${adaptedQuizQuestions.length} câu hỏi bao phủ toàn bài)`,
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

function make4Options(correct: string, candidates: string[], targetIdx: number): { options: string[]; correctIndex: number } {
  const fallbacks = [
    'Xin lỗi, tôi không biết',
    'Thời tiết hôm nay rất tốt',
    'Cảm ơn và hẹn gặp lại',
    'Tôi đang học tiếng Trung',
  ];
  const distractors = Array.from(new Set([...candidates, ...fallbacks]))
    .filter((c) => c && c.trim() !== correct.trim())
    .slice(0, 3);
  const pos = targetIdx % 4;
  const options = [
    ...distractors.slice(0, pos),
    correct,
    ...distractors.slice(pos),
  ].slice(0, 4);
  return {
    options,
    correctIndex: Math.max(0, options.indexOf(correct)),
  };
}

/**
 * Generates a 2-3 question Mini Checkpoint Quiz for the end of each section (Parts 1 to 5).
 */
function buildSectionMiniQuiz(block: LessonBlock, lesson: Lesson): QuizBlockData | null {
  if (!block || block.type === 'quiz' || block.type === 'video' || block.type === 'audio' || block.type === 'image' || block.type === 'pdf') {
    return null;
  }

  // Gather lesson-wide vocabulary items for realistic distractors
  const vocabBlock = lesson.blocks.find((b) => b.type === 'vocabulary');
  const vocabItems = ((vocabBlock?.data as VocabBlockData)?.items || []) as Array<{
    hanzi: string;
    pinyin: string;
    meaningVi: string;
    exampleSentence?: string;
    examplePinyin?: string;
    exampleTranslation?: string;
  }>;

  if (block.type === 'vocabulary') {
    const items = (block.data as VocabBlockData)?.items || [];
    if (items.length === 0) return null;
    const v0 = items[0];
    const v1 = items[Math.min(1, items.length - 1)];
    const v2 = items[Math.min(2, items.length - 1)];

    const q1Opts = make4Options(
      v0.meaningVi,
      items.map((x) => x.meaningVi),
      0
    );
    const q2Opts = make4Options(
      `${v1.hanzi} (${v1.pinyin})`,
      items.map((x) => `${x.hanzi} (${x.pinyin})`),
      1
    );
    const q3Opts = make4Options(
      v2.pinyin,
      [...items.map((x) => x.pinyin), 'wǒ men', 'xīng qī', 'zhōng guó'],
      2
    );

    return {
      quizId: `mini-quiz-${block.id}`,
      title: 'Mini Quiz Phần 1: Củng cố nhanh Từ vựng vừa học',
      passingScore: 60,
      questions: [
        {
          id: `${block.id}-mq-1`,
          type: 'single_choice',
          question: `Từ vựng "${v0.hanzi}" (${v0.pinyin}) vừa nghe có nghĩa là gì?`,
          pinyin: v0.pinyin,
          options: q1Opts.options,
          explanation: `"${v0.hanzi}" (${v0.pinyin}) có nghĩa là "${v0.meaningVi}".`,
          correctIndex: q1Opts.correctIndex,
        },
        {
          id: `${block.id}-mq-2`,
          type: 'single_choice',
          question: `Để diễn đạt "${v1.meaningVi}" bằng tiếng Trung, bạn chọn từ nào?`,
          options: q2Opts.options,
          explanation: `"${v1.meaningVi}" trong tiếng Trung là "${v1.hanzi}" (${v1.pinyin}).`,
          correctIndex: q2Opts.correctIndex,
        },
        {
          id: `${block.id}-mq-3`,
          type: 'single_choice',
          question: `Phiên âm Pinyin chuẩn của chữ "${v2.hanzi}" (${v2.meaningVi}) là gì?`,
          options: q3Opts.options,
          explanation: `Chữ "${v2.hanzi}" đọc là "${v2.pinyin}" (${v2.meaningVi}).`,
          correctIndex: q3Opts.correctIndex,
        },
      ],
    };
  }

  if (block.type === 'rich_text') {
    const v0 = vocabItems[0] || {
      hanzi: '你好',
      pinyin: 'nǐ hǎo',
      meaningVi: 'Xin chào',
      exampleSentence: '你好，很高兴认识你。',
      examplePinyin: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ.',
      exampleTranslation: 'Xin chào, rất vui được làm quen với bạn.',
    };
    const vLast = vocabItems[vocabItems.length - 1] || v0;

    const exSentence = v0.exampleSentence || v0.hanzi;
    const exPinyin = v0.examplePinyin || v0.pinyin;
    const exMeaning = v0.exampleTranslation || v0.meaningVi;
    const lastSent = vLast.exampleSentence || vLast.hanzi;
    const lastPinyin = vLast.examplePinyin || vLast.pinyin;
    const lastLabeled = lastPinyin ? `${lastSent} (${lastPinyin})` : lastSent;

    const q1Opts = make4Options(
      exMeaning,
      vocabItems.map((x) => x.exampleTranslation || x.meaningVi),
      1
    );
    const q2Opts = make4Options(
      lastLabeled,
      [
        ...vocabItems.map((x) => {
          const s = x.exampleSentence || x.hanzi;
          const p = x.examplePinyin || x.pinyin;
          return p ? `${s} (${p})` : s;
        }),
        '请问洗手间在哪里？ (Qǐngwèn xǐshǒujiān zài nǎlǐ?)',
        '明天见！ (Míngtiān jiàn!)',
      ],
      2
    );

    return {
      quizId: `mini-quiz-${block.id}`,
      title: 'Mini Quiz Phần 2: Nắm vững Ngữ pháp & Mẫu câu',
      passingScore: 60,
      questions: [
        {
          id: `${block.id}-mq-1`,
          type: 'single_choice',
          question: `Mẫu câu ví dụ "${exSentence}"${exPinyin ? ` (${exPinyin})` : ''} trong bài mang ý nghĩa gì?`,
          pinyin: exPinyin,
          options: q1Opts.options,
          explanation: `Câu "${exSentence}" (${exPinyin}) có nghĩa là: "${exMeaning}".`,
          correctIndex: q1Opts.correctIndex,
        },
        {
          id: `${block.id}-mq-2`,
          type: 'single_choice',
          question: `Câu tiếng Trung nào dưới đây diễn đạt đúng ý "${vLast.exampleTranslation || vLast.meaningVi}"?`,
          pinyin: lastPinyin,
          options: q2Opts.options,
          explanation: `Đáp án chuẩn là: "${lastSent}" (${lastPinyin}).`,
          correctIndex: q2Opts.correctIndex,
        },
      ],
    };
  }

  if (block.type === 'roleplay_dialogue') {
    const rawLines = ((block.data as any)?.lines || (block.data as any)?.dialogue || []) as Array<{
      hanzi: string;
      pinyin: string;
      meaningVi?: string;
      vietnamese?: string;
      speakerName?: string;
    }>;
    if (rawLines.length === 0) return null;

    const l0 = rawLines[0];
    const l1 = rawLines[Math.min(1, rawLines.length - 1)];
    const l0Meaning = l0.meaningVi || l0.vietnamese || 'Xin chào';
    const l1Meaning = l1.meaningVi || l1.vietnamese || 'Rất vui được gặp bạn';
    const l1Labeled = l1.pinyin ? `${l1.hanzi} (${l1.pinyin})` : l1.hanzi;

    const q1Opts = make4Options(
      l0Meaning,
      rawLines.map((x) => x.meaningVi || x.vietnamese || ''),
      0
    );
    const q2Opts = make4Options(
      l1Labeled,
      [
        ...rawLines.map((x) => (x.pinyin ? `${x.hanzi} (${x.pinyin})` : x.hanzi)),
        '对不起，我不知道。 (Duìbuqǐ, wǒ bù zhīdào.)',
        '再见！ (Zàijiàn!)',
      ],
      1
    );

    return {
      quizId: `mini-quiz-${block.id}`,
      title: 'Mini Quiz Phần 3: Kiểm tra hiểu Hội thoại thực tế',
      passingScore: 60,
      questions: [
        {
          id: `${block.id}-mq-1`,
          type: 'single_choice',
          question: `Khi nhân vật mở đầu nói "${l0.hanzi}" (${l0.pinyin}), câu này có nghĩa là gì?`,
          pinyin: l0.pinyin,
          options: q1Opts.options,
          explanation: `"${l0.hanzi}" (${l0.pinyin}) có nghĩa là: "${l0Meaning}".`,
          correctIndex: q1Opts.correctIndex,
        },
        {
          id: `${block.id}-mq-2`,
          type: 'single_choice',
          question: `Để đáp lại với ý "${l1Meaning}", nhân vật tiếp theo đã nói câu nào?`,
          pinyin: l1.pinyin,
          options: q2Opts.options,
          explanation: `Câu thoại đáp lại là: "${l1.hanzi}" (${l1.pinyin}).`,
          correctIndex: q2Opts.correctIndex,
        },
      ],
    };
  }

  if (block.type === 'speech_practice') {
    const items = ((block.data as any)?.items || [
      {
        hanzi: (block.data as any)?.hanzi || '你好',
        pinyin: (block.data as any)?.pinyin || 'nǐ hǎo',
        meaningVi: (block.data as any)?.meaningVi || 'Xin chào',
      },
    ]) as Array<{ hanzi: string; pinyin: string; meaningVi: string }>;

    const s0 = items[0];
    const sLast = items[items.length - 1];
    const sLastLabeled = sLast.pinyin ? `${sLast.hanzi} (${sLast.pinyin})` : sLast.hanzi;

    const q1Opts = make4Options(
      s0.pinyin,
      [...items.map((x) => x.pinyin), 'xiè xie', 'bú kè qi', 'zài jiàn'],
      0
    );
    const q2Opts = make4Options(
      sLastLabeled,
      [
        ...items.map((x) => (x.pinyin ? `${x.hanzi} (${x.pinyin})` : x.hanzi)),
        '谢谢你 (Xièxie nǐ)',
        '没关系 (Méi guānxi)',
      ],
      2
    );

    return {
      quizId: `mini-quiz-${block.id}`,
      title: 'Mini Quiz Phần 4: Củng cố Phản xạ Luyện nói & Phiên âm',
      passingScore: 60,
      questions: [
        {
          id: `${block.id}-mq-1`,
          type: 'single_choice',
          question: `Khi luyện nói "${s0.hanzi}" (${s0.meaningVi}), phiên âm Pinyin chuẩn là gì?`,
          options: q1Opts.options,
          explanation: `"${s0.hanzi}" được phát âm theo Pinyin là "${s0.pinyin}".`,
          correctIndex: q1Opts.correctIndex,
        },
        {
          id: `${block.id}-mq-2`,
          type: 'single_choice',
          question: `Khi muốn nói "${sLast.meaningVi}" bằng tiếng Trung, bạn đọc câu nào?`,
          pinyin: sLast.pinyin,
          options: q2Opts.options,
          explanation: `Câu chuẩn là "${sLast.hanzi}" (${sLast.pinyin}).`,
          correctIndex: q2Opts.correctIndex,
        },
      ],
    };
  }

  if (block.type === 'shadowing') {
    const sentences = ((block.data as any)?.sentences || []) as Array<{
      hanzi: string;
      pinyin: string;
      meaningVi?: string;
      vietnamese?: string;
    }>;
    if (sentences.length === 0) return null;

    const sh0 = sentences[0];
    const sh1 = sentences[Math.min(1, sentences.length - 1)];
    const sh0Meaning = sh0.meaningVi || sh0.vietnamese || 'Xin chào';
    const sh1Meaning = sh1.meaningVi || sh1.vietnamese || 'Cảm ơn';
    const sh1Labeled = sh1.pinyin ? `${sh1.hanzi} (${sh1.pinyin})` : sh1.hanzi;

    const q1Opts = make4Options(
      sh0Meaning,
      sentences.map((x) => x.meaningVi || x.vietnamese || ''),
      1
    );
    const q2Opts = make4Options(
      sh1Labeled,
      [
        ...sentences.map((x) => (x.pinyin ? `${x.hanzi} (${x.pinyin})` : x.hanzi)),
        '我不知道。 (Wǒ bù zhīdào.)',
        '明天见！ (Míngtiān jiàn!)',
      ],
      0
    );

    return {
      quizId: `mini-quiz-${block.id}`,
      title: 'Mini Quiz Phần 5: Kiểm tra nhanh các câu vừa Nhại âm',
      passingScore: 60,
      questions: [
        {
          id: `${block.id}-mq-1`,
          type: 'single_choice',
          question: `Câu nhại âm "${sh0.hanzi}" (${sh0.pinyin}) có nghĩa tiếng Việt là gì?`,
          pinyin: sh0.pinyin,
          options: q1Opts.options,
          explanation: `"${sh0.hanzi}" (${sh0.pinyin}) nghĩa là "${sh0Meaning}".`,
          correctIndex: q1Opts.correctIndex,
        },
        {
          id: `${block.id}-mq-2`,
          type: 'single_choice',
          question: `Câu nào trong bài nhại âm mang ý nghĩa "${sh1Meaning}"?`,
          pinyin: sh1.pinyin,
          options: q2Opts.options,
          explanation: `"${sh1Meaning}" tương ứng với câu "${sh1.hanzi}" (${sh1.pinyin}).`,
          correctIndex: q2Opts.correctIndex,
        },
      ],
    };
  }

  return null;
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
  let matchedHskLesson: HSKLesson | undefined = ALL_HSK_LESSONS.find((l) => l.id === lessonId);

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
    if (matchedHskLesson) {
      currentLesson = adaptHskLessonToLesson(matchedHskLesson);
      allDayLessons = ALL_HSK_LESSONS.map((h) => adaptHskLessonToLesson(h));
    }
  }

  // Fallback to first HSK1 lesson if still not found
  if (!currentLesson) {
    matchedHskLesson = HSK1_LESSONS[0];
    currentLesson = adaptHskLessonToLesson(HSK1_LESSONS[0]);
    allDayLessons = ALL_HSK_LESSONS.map((h) => adaptHskLessonToLesson(h));
  }

  const [completedBlocks, setCompletedBlocks] = useState<string[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'step' | 'all'>('step');
  const [showSupplementary, setShowSupplementary] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    setCompletedBlocks(getCompletedBlockIds());
    setIsDemoUser(isDemoAccount(getStoredUserProfile()));
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

  // Find next lesson (respecting Demo 3-lesson limit)
  const currentIdx = allDayLessons.findIndex((l) => l.id === currentLesson?.id);
  const rawNextLesson = allDayLessons[currentIdx + 1];
  const nextLesson =
    isDemoUser && rawNextLesson && (rawNextLesson.sequenceOrder || 1) > DEMO_MAX_LESSONS
      ? undefined
      : rawNextLesson;
  const isLockedForDemo =
    isDemoUser && (matchedHskLesson?.lessonNumber || currentLesson.sequenceOrder || 1) > DEMO_MAX_LESSONS;

  const supplementaryMedia = getMediaByLessonId(currentLesson.id);
  const thematicFlashcardSet = getThematicFlashcardByLessonId(currentLesson.id);
  const hasSupplementary =
    !!thematicFlashcardSet || (supplementaryMedia && supplementaryMedia.length > 0);

  const renderBlockContent = (block: LessonBlock) => {
    if (!block) return null;
    const sectionMiniQuiz = buildSectionMiniQuiz(block, currentLesson);

    return (
      <div key={block.id} className="space-y-6">
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

        {/* Section Mini Checkpoint Quiz (For Parts 1 to 5) */}
        {sectionMiniQuiz && (
          <div className="pt-4 border-t border-slate-200">
            <QuizBlock
              data={sectionMiniQuiz}
              onCompleted={(passed) => {
                if (passed) {
                  markBlockDone(block.id);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Clean Sticky Header */}
      <div className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/"
              title="Về trang giới thiệu GLOBY Chinese"
              className="inline-flex items-center hover:opacity-90 transition-opacity"
            >
              <img
                src="/assets/app-icon.svg"
                alt="GLOBY Chinese"
                width={28}
                height={28}
                className="w-7 h-auto block"
              />
            </Link>
            <span className="h-4 w-px bg-slate-200" aria-hidden="true" />
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Lộ trình</span>
            </Link>
          </div>

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
        {/* Vivid Magazine-Style Lesson Cover Card */}
        <LessonCoverCard
          hskLesson={matchedHskLesson}
          fallbackTitle={currentLesson.title}
          fallbackDescription={currentLesson.description}
          sequenceOrder={currentLesson.sequenceOrder}
          estimatedMinutes={currentLesson.estimatedMinutes}
          totalLessonsInLevel={20}
        />

        {isLockedForDemo ? (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-6 sm:p-8 text-center space-y-4">
            <div className="inline-flex px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
              🔒 Giới hạn Tài khoản Học thử (Demo: {DEMO_MAX_LESSONS} bài đầu)
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Đăng ký tài khoản chính thức để mở khóa Bài {matchedHskLesson?.lessonNumber || currentLesson.sequenceOrder}
            </h2>
            <p className="text-sm text-slate-700 max-w-xl mx-auto">
              Tài khoản Demo chỉ hiển thị và cho phép học thử 3 bài đầu tiên của mỗi cấp độ. Hãy đăng ký hoặc đăng nhập tài khoản chính thức để học trọn bộ 120 bài HSK 1–6.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/roadmap">
                <Button variant="outline" size="md" className="text-xs font-bold">
                  Quay lại 3 bài học thử
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-6"
                >
                  Đăng ký mở khóa toàn bộ
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
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
          </>
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
