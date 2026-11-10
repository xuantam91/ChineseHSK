import { DayType, Enrollment, Lesson, LessonBlock, LessonProgress, ProgramVersion, QuizAttempt } from './database';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export type DayStatus = 'locked' | 'today' | 'overdue' | 'in_progress' | 'completed' | 'rest' | 'rest_day';

export interface DayRoadmapItem {
  id: string;
  day_index: number;
  day_type: DayType;
  title: string;
  estimated_minutes: number;
  unlock_offset_days: number;
  unlock_date: string; // YYYY-MM-DD
  status: DayStatus;
  is_required: boolean;
  lesson_count: number;
  completed_lesson_count: number;
}

export interface WeekRoadmapItem {
  id: string;
  week_index: number;
  title: string;
  days: DayRoadmapItem[];
}

export interface MonthRoadmapItem {
  id: string;
  month_index: number;
  title: string;
  weeks: WeekRoadmapItem[];
}

export interface RoadmapResponse {
  program_version: {
    id: string;
    version_number: string | number;
    title: string;
  };
  enrollment: {
    start_date: string;
    timezone: string;
    status: string;
  };
  today_local: string;
  months: MonthRoadmapItem[];
}

export interface TodayResponse {
  today_local: string;
  enrollment: Enrollment;
  current_day: DayRoadmapItem | null;
  overdue_days: DayRoadmapItem[];
  streak: number;
  stats: {
    completed_lessons: number;
    total_required_lessons: number;
    completion_percentage: number;
  };
}

export interface ProgressResponse {
  enrollment: Enrollment;
  total_required_lessons: number;
  completed_lessons: number;
  completion_percentage: number;
  quiz_history: {
    quiz_id: string;
    quiz_title: string;
    lesson_title: string;
    attempt_no: number;
    score: number;
    passed: boolean;
    submitted_at: string;
  }[];
  streak: number;
  backlog_count: number;
}

export interface SafeQuizQuestion {
  id: string;
  type: string;
  prompt_jsonb: any;
  points: number;
  sort_order: number;
  // NOTE: correct_answer_jsonb & explanation_jsonb are omitted until after submission!
}

export interface SafeQuiz {
  id: string;
  title: string;
  passing_score: number;
  attempt_limit: number | null;
  questions: SafeQuizQuestion[];
}

export interface DayDetailResponse {
  id: string;
  day_index: number;
  day_type: DayType;
  title: string;
  estimated_minutes: number;
  unlock_offset_days: number;
  status: DayStatus;
  lessons: {
    id: string;
    title: string;
    description: string | null;
    estimated_minutes: number;
    is_required: boolean;
    progress_status: string;
  }[];
}

export interface LessonDetailResponse {
  lesson: Lesson;
  blocks: LessonBlock[];
  quiz?: SafeQuiz | null;
  progress: LessonProgress | null;
  completed_block_ids: string[];
}

export interface QuizSubmitResult {
  attempt_id: string;
  attempt_no: number;
  score: number;
  passing_score: number;
  passed: boolean;
  question_results: {
    question_id: string;
    is_correct: boolean;
    awarded_points: number;
    correct_answer: any;
    explanation?: string;
  }[];
  lesson_completed: boolean;
}

export interface DryRunSummary {
  months_count: number;
  weeks_count: number;
  days_count: number;
  lessons_count: number;
  blocks_count: number;
  assets_count: number;
  broken_links_count: number;
  warnings: string[];
  sample_structure: {
    month: string;
    week: string;
    days: string[];
  }[];
}
