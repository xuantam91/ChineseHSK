export type AgeGroup = 'kids_6_11' | 'teens_12_17' | 'adults_18_plus';

export type HSKLevel = 'HSK1' | 'HSK2' | 'HSK3' | 'HSK4' | 'HSK5' | 'HSK6' | 'HSK7-9';

export type DayStatus = 'locked' | 'today' | 'overdue' | 'in_progress' | 'completed' | 'rest' | 'rest_day';

export type BlockType = 
  | 'rich_text'
  | 'vocabulary'
  | 'audio'
  | 'video'
  | 'pdf'
  | 'image'
  | 'flashcard_set'
  | 'instructions'
  | 'external_resource'
  | 'quiz'
  | 'speech_practice'
  | 'shadowing'
  | 'roleplay_dialogue'
  | 'pinyin_chart';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'student' | 'admin' | 'super_admin' | 'guardian';
  isDemo?: boolean;
  ageGroup: AgeGroup;
  currentHskLevel?: HSKLevel; // e.g. 'HSK1' | 'HSK2' | 'HSK3' | 'HSK4' | 'HSK5' | 'HSK6' | 'HSK7-9'
  startDate: string; // YYYY-MM-DD in Asia/Ho_Chi_Minh
  timezone: string; // default: 'Asia/Ho_Chi_Minh'
  dailyGoalMinutes: number; // e.g. 15, 30, 45
  streakCount: number;
  lastStudyDate?: string;
}

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  exampleSentence?: string;
  examplePinyin?: string;
  exampleTranslation?: string;
  audioUrl?: string;
  hskLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface FlashcardItem {
  id: string;
  front: string; // Hanzi
  pinyin: string;
  back: string; // Meaning & tips
  example?: string;
  examplePinyin?: string;
  exampleTranslation?: string;
  mastered?: boolean;
}

export interface RichTextBlockData {
  content: string; // Markdown or formatted text
  callout?: {
    type: 'tip' | 'warning' | 'grammar_note' | 'cultural';
    title: string;
    text: string;
  };
}

export interface VocabBlockData {
  title?: string;
  description?: string;
  items: VocabItem[];
}

export interface MediaBlockData {
  mediaType: 'audio' | 'video';
  title: string;
  description?: string;
  driveUrl: string;
  fallbackUrl?: string;
  durationSeconds?: number;
}

export interface PdfBlockData {
  title: string;
  description?: string;
  driveUrl: string;
  pageCount?: number;
}

export interface FlashcardBlockData {
  title?: string;
  cards: FlashcardItem[];
}

export interface QuizQuestionClient {
  id: string;
  question: string;
  pinyin?: string;
  options: string[];
  explanation: string;
  type: 'single_choice' | 'fill_in';
  correctIndex?: number;
}

export interface QuizBlockData {
  quizId: string;
  title: string;
  description?: string;
  passingScore: number; // percentage, e.g. 80
  timeLimitMinutes?: number;
  questions: QuizQuestionClient[];
}

export interface SpeechPracticePayload {
  phrase: string;
  pinyin: string;
  meaningVi: string;
  audioUrl?: string;
  hints?: string;
  hanzi?: string;
  meaning_vi?: string;
  audio_url?: string;
  [key: string]: unknown;
}

export interface ShadowingPayload {
  title: string;
  sentences: Array<{
    id: string;
    hanzi: string;
    pinyin: string;
    vietnamese: string;
    meaningVi?: string;
    audioUrl?: string;
    audio_url?: string;
  }>;
  description?: string;
  [key: string]: unknown;
}

export interface RoleplayPayload {
  title: string;
  roleA: string;
  roleB: string;
  dialogue: Array<{
    speaker: 'A' | 'B';
    speakerName: string;
    hanzi: string;
    pinyin: string;
    vietnamese: string;
    speaker_name?: string;
    audioUrl?: string;
    meaningVi?: string;
  }>;
  description?: string;
  [key: string]: unknown;
}

export interface PinyinChartPayload {
  defaultTab?: 'initials' | 'finals' | 'tones';
  default_tab?: 'initials' | 'finals' | 'tones';
  [key: string]: unknown;
}

export interface LessonBlock {
  id: string;
  lessonId?: string;
  lesson_id?: string;
  type: BlockType;
  sequenceOrder?: number;
  sort_order?: number;
  isRequired?: boolean;
  is_required?: boolean;
  estimatedMinutes?: number;
  estimated_minutes?: number;
  payload_jsonb?: Record<string, any>;
  data?: 
    | RichTextBlockData
    | VocabBlockData
    | MediaBlockData
    | PdfBlockData
    | FlashcardBlockData
    | QuizBlockData
    | SpeechPracticePayload
    | ShadowingPayload
    | RoleplayPayload
    | PinyinChartPayload;
}

export interface Lesson {
  id: string;
  dayId?: string;
  curriculum_day_id?: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  estimated_minutes?: number;
  sequenceOrder?: number;
  sort_order?: number;
  isRequired?: boolean;
  is_required?: boolean;
  isCompleted?: boolean;
  blocks: LessonBlock[];
}

export type CurriculumDayType = 'theory' | 'practice' | 'review' | 'assessment' | 'rest_day' | 'learning' | 'rest' | 'checkpoint';

export interface CurriculumDay {
  id: string;
  weekId?: string;
  curriculum_week_id?: string;
  monthIndex?: number;
  weekIndex?: number;
  dayIndex: number; // 1 to 365
  day_index?: number;
  unlockOffsetDays: number; // Day 1 = 0, Day 2 = 1, etc.
  unlock_offset_days?: number;
  title: string;
  description?: string | null;
  dayType?: CurriculumDayType;
  day_type?: CurriculumDayType;
  estimatedMinutes?: number;
  estimated_minutes?: number;
  isRequired?: boolean;
  is_required?: boolean;
  objectives: string[];
  status: DayStatus;
  lessons: Lesson[];
}

export interface CurriculumWeek {
  id: string;
  monthIndex: number;
  weekIndex: number; // 1 to 4
  title: string;
  description: string;
  days: CurriculumDay[];
}

export interface CurriculumMonth {
  monthIndex: number; // 1 to 12
  title: string;
  hskLevel: string;
  description: string;
  theme: string;
  totalDays: number;
  completedDays: number;
  weeks: CurriculumWeek[];
}

export interface LibraryResource {
  id: string;
  title: string;
  category: 'audio' | 'video' | 'pdf' | 'vocab';
  monthIndex: number;
  fileSize?: string;
  driveUrl: string;
  description: string;
  hskLevel: string;
}

export interface QuizAttemptResult {
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  details: {
    questionId: string;
    isCorrect: boolean;
    studentAnswer: number | string;
    correctAnswer: number | string;
    explanation: string;
  }[];
}

export type EnrollmentStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export interface Enrollment {
  id: string;
  user_id?: string;
  userId?: string;
  program_version_id?: string;
  programVersionId?: string;
  start_date: string; // YYYY-MM-DD
  startDate?: string;
  timezone: string; // e.g. "Asia/Ho_Chi_Minh"
  status: EnrollmentStatus;
  paused_at?: string | null;
  pause_total_days?: number;
  created_at?: string;
}

export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonProgress {
  id: string;
  enrollment_id?: string;
  enrollmentId?: string;
  lesson_id?: string;
  lessonId?: string;
  status: LessonProgressStatus;
  started_at?: string | null;
  completed_at?: string | null;
  completed_required_blocks?: number;
  score?: number | null;
  updated_at?: string;
}

export interface BlockProgress {
  enrollment_id: string;
  lesson_block_id: string;
  completed_at: string;
  metadata_jsonb?: Record<string, any>;
}

export type {
  Quiz,
  QuizQuestion,
  QuizAttempt,
  QuizAnswer,
} from './database';

export type {
  EvaluationResult,
  SpeechEvaluationInput,
  ToneAccuracyResult,
  SyllableFeedback,
} from '@/lib/speech/evaluator';
export type { SpeechPracticeProps } from '@/components/lesson/SpeechPractice';
export type { ShadowingSentence, ShadowingPlayerProps } from '@/components/lesson/ShadowingPlayer';
export type {
  DialogueCharacter,
  DialogueLine,
  RoleplayDialogueProps,
} from '@/components/lesson/RoleplayDialogue';
export type { PhonemeItem, ToneItem } from '@/components/lesson/PinyinChart';


