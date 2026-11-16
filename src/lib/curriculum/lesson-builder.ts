import type {
  HSKLevel,
  HSKLesson,
  DialogueLine,
  SpeechDrill,
  ShadowSentence,
  CurriculumVocabItem,
  GrammarNote,
  QuizQuestion,
} from './hsk1-3-data';

export interface CompactVocabInput {
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  radical: string;
  radicalMeaningVi?: string;
  strokeCount: number;
  exampleSentence: string;
  examplePinyin: string;
  exampleVi: string;
}

export interface CompactDialogueInput {
  speaker: 'A' | 'B';
  speakerName: string;
  avatar?: string;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
}

export interface CompactGrammarInput {
  title: string;
  pattern: string;
  explanationVi: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleVi: string;
}

export interface StandardLessonInput {
  id: string;
  lessonNumber: number;
  level: 'HSK1' | 'HSK2' | 'HSK3' | 'HSK4' | 'HSK5' | 'HSK6';
  title: string;
  subtitleVi: string;
  topicIcon: string;
  imageUrl: string;
  videoUrl: string;
  videoTitleVi?: string;
  coverCalligraphy?: string;
  estimatedMinutes?: number;
  summaryVi: string;
  vocabulary: CompactVocabInput[];
  dialogue: CompactDialogueInput[];
  grammarNotes: CompactGrammarInput[];
  orderingQuiz?: {
    prompt: string;
    tokens: string[];
    correctOrder: string[];
    explanation: string;
  };
}

export function buildStandardLesson(input: StandardLessonInput): HSKLesson {
  const hskLevel = input.level as HSKLevel;
  const vocabList: CurriculumVocabItem[] = input.vocabulary.map((v, idx) => ({
    id: `${input.id}-v${idx + 1}`,
    hanzi: v.hanzi,
    pinyin: v.pinyin,
    meaningVi: v.meaningVi,
    radical: v.radical,
    radicalMeaningVi: v.radicalMeaningVi,
    strokeCount: v.strokeCount,
    exampleSentence: v.exampleSentence,
    examplePinyin: v.examplePinyin,
    exampleVi: v.exampleVi,
    hskLevel,
  }));

  const dialogueList: DialogueLine[] = input.dialogue.map((d, idx) => ({
    id: `${input.id}-d${idx + 1}`,
    speaker: d.speaker,
    speakerName: d.speakerName,
    avatar: d.avatar || (d.speaker === 'A' ? '👨‍🏫' : '👩‍🎓'),
    hanzi: d.hanzi,
    pinyin: d.pinyin,
    vietnamese: d.vietnamese,
  }));

  const grammarList: GrammarNote[] = input.grammarNotes.map((g, idx) => ({
    id: `${input.id}-g${idx + 1}`,
    title: g.title,
    pattern: g.pattern,
    explanationVi: g.explanationVi,
    examples: [
      {
        hanzi: g.exampleHanzi,
        pinyin: g.examplePinyin,
        vietnamese: g.exampleVi,
      },
    ],
  }));

  const speechDrills: SpeechDrill[] = [
    {
      id: `${input.id}-sd1`,
      hanzi: vocabList[0]?.exampleSentence || dialogueList[0]?.hanzi || '你好',
      pinyin: vocabList[0]?.examplePinyin || dialogueList[0]?.pinyin || 'Nǐ hǎo',
      vietnamese: vocabList[0]?.exampleVi || dialogueList[0]?.vietnamese || 'Xin chào',
      difficulty: 'easy',
      pronunciationTipVi: `Chú ý phát âm rõ từ khóa "${vocabList[0]?.hanzi || ''}" (${vocabList[0]?.pinyin || ''}).`,
    },
    {
      id: `${input.id}-sd2`,
      hanzi: dialogueList[0]?.hanzi || vocabList[1]?.exampleSentence || '谢谢',
      pinyin: dialogueList[0]?.pinyin || vocabList[1]?.examplePinyin || 'Xièxie',
      vietnamese: dialogueList[0]?.vietnamese || vocabList[1]?.exampleVi || 'Cảm ơn',
      difficulty: 'medium',
      pronunciationTipVi: 'Giữ nhịp điệu tự nhiên theo ngữ cảnh hội thoại.',
    },
    {
      id: `${input.id}-sd3`,
      hanzi: dialogueList[1]?.hanzi || vocabList[2]?.exampleSentence || '再见',
      pinyin: dialogueList[1]?.pinyin || vocabList[2]?.examplePinyin || 'Zàijiàn',
      vietnamese: dialogueList[1]?.vietnamese || vocabList[2]?.exampleVi || 'Tạm biệt',
      difficulty: 'hard',
      pronunciationTipVi: 'Luyện phản xạ nói liền mạch cả câu không ngắt quãng.',
    },
  ];

  const shadowSentences: ShadowSentence[] = [
    {
      id: `${input.id}-sh1`,
      hanzi: dialogueList[0]?.hanzi || '',
      pinyin: dialogueList[0]?.pinyin || '',
      vietnamese: dialogueList[0]?.vietnamese || '',
      focusToneSandhi: `Trọng tâm ngữ điệu: ${grammarList[0]?.title || input.title}`,
    },
    {
      id: `${input.id}-sh2`,
      hanzi: dialogueList[2]?.hanzi || dialogueList[1]?.hanzi || '',
      pinyin: dialogueList[2]?.pinyin || dialogueList[1]?.pinyin || '',
      vietnamese: dialogueList[2]?.vietnamese || dialogueList[1]?.vietnamese || '',
      focusToneSandhi: `Từ khóa: ${vocabList[0]?.hanzi || ''} • ${vocabList[1]?.hanzi || ''}`,
    },
  ];

  const v0 = vocabList[0];
  const v1 = vocabList[1] || vocabList[0];
  const v2 = vocabList[2] || vocabList[0];
  const v3 = vocabList[3] || vocabList[0];

  const defaultTokens = [
    vocabList[0]?.hanzi || '我',
    vocabList[1]?.hanzi || '很',
    vocabList[2]?.hanzi || '好',
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: `${input.id}-q1`,
      type: 'single_choice',
      prompt: `Từ "${v0.hanzi}" (${v0.pinyin}) có nghĩa tiếng Việt là gì?`,
      options: [v0.meaningVi, v1.meaningVi, v2.meaningVi, v3.meaningVi],
      correctAnswer: 0,
      explanation: `"${v0.hanzi}" (${v0.pinyin}) nghĩa là "${v0.meaningVi}". Ví dụ: ${v0.exampleSentence} (${v0.exampleVi}).`,
    },
    {
      id: `${input.id}-q2`,
      type: 'single_choice',
      prompt: `Trong bài học "${input.title}", câu "${dialogueList[0].hanzi}" có nghĩa là gì?`,
      options: [
        dialogueList[0].vietnamese,
        dialogueList[1]?.vietnamese || v1.exampleVi || v1.meaningVi,
        dialogueList[2]?.vietnamese || v2.exampleVi || v2.meaningVi,
        dialogueList[3]?.vietnamese || v3.exampleVi || v3.meaningVi,
      ],
      correctAnswer: 0,
      explanation: `"${dialogueList[0].hanzi}" (${dialogueList[0].pinyin}) dịch là: "${dialogueList[0].vietnamese}".`,
    },
    {
      id: `${input.id}-q3`,
      type: 'ordering',
      prompt:
        input.orderingQuiz?.prompt ||
        `Sắp xếp thành câu đúng nghĩa: "${grammarList[0]?.examples[0]?.vietnamese || v0.exampleVi}"`,
      orderingTokens: input.orderingQuiz?.tokens || defaultTokens,
      correctAnswer: input.orderingQuiz?.correctOrder || defaultTokens,
      explanation:
        input.orderingQuiz?.explanation ||
        `Cấu trúc chuẩn: ${grammarList[0]?.pattern || ''} -> ${grammarList[0]?.examples[0]?.hanzi || v0.exampleSentence}`,
    },
    {
      id: `${input.id}-q4`,
      type: 'speaking_response',
      prompt: `Hãy đọc to câu tiếng Trung: "${dialogueList[1]?.vietnamese || v0.exampleVi}"`,
      targetSpeech: dialogueList[1]?.hanzi || v0.exampleSentence,
      pinyin: dialogueList[1]?.pinyin || v0.examplePinyin,
      correctAnswer: dialogueList[1]?.hanzi || v0.exampleSentence,
      explanation: `Phát âm chuẩn: ${dialogueList[1]?.hanzi || v0.exampleSentence} (${dialogueList[1]?.pinyin || v0.examplePinyin}).`,
    },
  ];

  return {
    id: input.id,
    lessonNumber: input.lessonNumber,
    level: hskLevel,
    title: input.title,
    subtitleVi: input.subtitleVi,
    topicIcon: input.topicIcon,
    imageUrl: input.imageUrl,
    videoUrl: input.videoUrl,
    videoTitleVi: input.videoTitleVi,
    coverCalligraphy: input.coverCalligraphy,
    estimatedMinutes: input.estimatedMinutes || 30,
    summaryVi: input.summaryVi,
    dialogue: dialogueList,
    speechDrills,
    shadowSentences,
    vocabulary: vocabList,
    grammarNotes: grammarList,
    quizQuestions,
  };
}
