export type ImportJobStatus =
  | 'pending'
  | 'parsing'
  | 'validating'
  | 'staged'
  | 'committed'
  | 'failed';

export type ImportSourceKind = 'markdown' | 'csv' | 'json' | 'notion_api';

export interface ImportJob {
  id: string;
  initiatedBy: string;
  sourceKind: ImportSourceKind;
  status: ImportJobStatus;
  summary?: Record<string, any>;
  errors?: string[];
  createdAt: string;
  committedAt?: string | null;
}

export interface NotionSourceItem {
  id?: string;
  type: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface StagingBlock {
  id?: string;
  type: 'rich_text' | 'vocabulary' | 'video' | 'audio' | 'pdf' | 'flashcard_set' | 'quiz';
  payload: Record<string, any>;
  sortOrder: number;
  isRequired: boolean;
  estimatedMinutes: number;
  driveUrl?: string;
}

export interface StagingLesson {
  id?: string;
  title: string;
  description?: string;
  sortOrder: number;
  estimatedMinutes: number;
  isRequired: boolean;
  blocks: StagingBlock[];
}

export interface StagingDay {
  id?: string;
  dayIndex: number;
  dayType: 'learning' | 'review' | 'rest' | 'checkpoint' | 'quiz';
  title: string;
  estimatedMinutes: number;
  unlockOffsetDays: number;
  isRequired: boolean;
  lessons: StagingLesson[];
}

export interface StagingWeek {
  id?: string;
  weekIndex: number;
  title: string;
  days: StagingDay[];
}

export interface StagingMonth {
  id?: string;
  monthIndex: number;
  title: string;
  weeks: StagingWeek[];
}

export interface StagingCurriculum {
  programSlug?: string;
  programTitle?: string;
  versionNumber?: string;
  months: StagingMonth[];
  contentChecksum?: string;
}

export interface StagingValidationCounts {
  months: number;
  weeks: number;
  days: number;
  lessons: number;
  blocks: number;
  assets: number;
}

export interface StagingValidationResult {
  isValid: boolean;
  counts: StagingValidationCounts;
  warnings: string[];
  errors: string[];
  checksum: string;
  staging?: StagingCurriculum;
}
