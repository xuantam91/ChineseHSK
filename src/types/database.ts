// ==============================================================================
// Chinese Learning Journey — Database Types
// File: src/types/database.ts
// Description: Full TypeScript schema definitions, enums, JSON payloads, and
//              Supabase Database client mapping.
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ------------------------------------------------------------------------------
// Domain Enums & Literal Unions
// ------------------------------------------------------------------------------
export type UserRole = 'student' | 'admin' | 'guardian';

export type AgeGroup =
  | 'adult'
  | 'teen'
  | 'kid'
  | 'all'
  | 'adults'
  | 'teens'
  | 'kids'
  | 'kids_6_11'
  | 'teens_12_17'
  | 'adults_18_plus';

export type PublishStatus = 'draft' | 'published' | 'archived' | 'active';

export type DayType = 'learning' | 'review' | 'quiz' | 'rest' | 'checkpoint';

export type BlockType =
  | 'rich_text'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'image'
  | 'vocabulary'
  | 'flashcard_set'
  | 'instructions'
  | 'quiz'
  | 'external_resource';

export type AssetProvider = 'google_drive' | 's3' | 'cloudinary' | 'local';
export type AssetAccessMode = 'direct' | 'embed' | 'fallback_link' | 'anyone_with_link';
export type AssetStatus = 'valid' | 'broken' | 'restricted' | 'pending_check' | 'verified' | 'missing' | 'permission_denied';

export type EnrollmentStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed';

export type QuizQuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank';

export type ImportSourceKind =
  | 'notion_api'
  | 'notion_export'
  | 'google_drive'
  | 'manual_seed';

export type ImportJobStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

// ------------------------------------------------------------------------------
// Structured JSON Payloads
// ------------------------------------------------------------------------------

export interface RichTextPayload {
  title?: string;
  content_markdown?: string;
  content?: string;
  [key: string]: unknown;
}

export interface VideoPayload {
  title: string;
  asset_id?: string;
  embed_url: string;
  caption?: string;
  duration_seconds?: number;
  [key: string]: unknown;
}

export interface AudioPayload {
  title: string;
  asset_id?: string;
  audio_url?: string;
  drive_url?: string | null;
  speaker?: string;
  repeat_recommended?: number;
  [key: string]: unknown;
}

export interface PdfPayload {
  title: string;
  asset_id?: string;
  pdf_url?: string;
  drive_url?: string;
  page_count?: number;
  [key: string]: unknown;
}

export interface ImagePayload {
  title?: string;
  asset_id?: string;
  image_url: string;
  alt?: string;
  caption?: string;
  [key: string]: unknown;
}

export interface VocabularyItem {
  hanzi: string;
  pinyin: string;
  meaning_vi: string;
  tone_breakdown?: string;
  audio_url?: string;
  example?: string;
  example_sentence?: string;
  example_pinyin?: string;
  example_meaning_vi?: string;
  [key: string]: unknown;
}

export interface VocabularyPayload {
  title?: string;
  items: VocabularyItem[];
  [key: string]: unknown;
}

export interface FlashcardItem {
  id: string;
  front: string;
  pinyin: string;
  back: string;
  audio_url?: string;
  note?: string;
  [key: string]: unknown;
}

export interface FlashcardSetPayload {
  title?: string;
  cards: FlashcardItem[];
  [key: string]: unknown;
}

export interface InstructionsPayload {
  title: string;
  content_markdown: string;
  checklist?: string[];
  [key: string]: unknown;
}

export interface QuizBlockPayload {
  title: string;
  quiz_id?: string;
  passing_score?: number;
  questions_count?: number;
  [key: string]: unknown;
}

export interface ExternalResourcePayload {
  title: string;
  url: string;
  description?: string;
  is_verified?: boolean;
  [key: string]: unknown;
}

export type LessonBlockPayload =
  | RichTextPayload
  | VideoPayload
  | AudioPayload
  | PdfPayload
  | ImagePayload
  | VocabularyPayload
  | FlashcardSetPayload
  | InstructionsPayload
  | QuizBlockPayload
  | ExternalResourcePayload
  | Record<string, unknown>;

export interface QuizQuestionOption {
  id: string;
  text: string;
  pinyin?: string;
  image_url?: string;
  [key: string]: unknown;
}

export interface QuizPromptPayload {
  question: string;
  options?: QuizQuestionOption[];
  placeholder?: string;
  audio_prompt_url?: string;
  image_prompt_url?: string;
  pinyin_prompt?: string;
  [key: string]: unknown;
}

export interface QuizExplanationPayload {
  text?: string;
  explanation?: string;
  reference_block_id?: string;
  [key: string]: unknown;
}

export interface AssetMetadataPayload {
  duration_seconds?: number;
  resolution?: string;
  pages?: number;
  file_size_kb?: number;
  safe_preview?: boolean;
  speaker?: string;
  [key: string]: unknown;
}

export interface ImportJobSummaryPayload {
  months_count?: number;
  weeks_count?: number;
  days_count?: number;
  lessons_count?: number;
  blocks_count?: number;
  assets_count?: number;
  warnings?: string[];
  [key: string]: unknown;
}

export interface AuditLogSummaryPayload {
  changes?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  [key: string]: unknown;
}

// ------------------------------------------------------------------------------
// Core Supabase Database Schema
// ------------------------------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          age_group: AgeGroup;
          timezone: string;
          role: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          display_name: string;
          age_group?: AgeGroup;
          timezone?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          age_group?: AgeGroup;
          timezone?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      programs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          target_age_group: AgeGroup;
          status: PublishStatus;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          target_age_group?: AgeGroup;
          status?: PublishStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          target_age_group?: AgeGroup;
          status?: PublishStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      program_versions: {
        Row: {
          id: string;
          program_id: string;
          version_number: number | string;
          status: PublishStatus;
          published_at: string | null;
          source_url: string | null;
          content_checksum: string | null;
          changelog?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          version_number: number | string;
          status?: PublishStatus;
          published_at?: string | null;
          source_url?: string | null;
          content_checksum?: string | null;
          changelog?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          version_number?: number | string;
          status?: PublishStatus;
          published_at?: string | null;
          source_url?: string | null;
          content_checksum?: string | null;
          changelog?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'program_versions_program_id_fkey';
            columns: ['program_id'];
            isOneToOne: false;
            referencedRelation: 'programs';
            referencedColumns: ['id'];
          }
        ];
      };

      curriculum_months: {
        Row: {
          id: string;
          program_version_id: string;
          month_index: number;
          title: string;
          sort_order: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          program_version_id: string;
          month_index: number;
          title: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          program_version_id?: string;
          month_index?: number;
          title?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'curriculum_months_program_version_id_fkey';
            columns: ['program_version_id'];
            isOneToOne: false;
            referencedRelation: 'program_versions';
            referencedColumns: ['id'];
          }
        ];
      };

      curriculum_weeks: {
        Row: {
          id: string;
          curriculum_month_id: string;
          week_index: number;
          title: string;
          sort_order: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          curriculum_month_id: string;
          week_index: number;
          title: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          curriculum_month_id?: string;
          week_index?: number;
          title?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'curriculum_weeks_curriculum_month_id_fkey';
            columns: ['curriculum_month_id'];
            isOneToOne: false;
            referencedRelation: 'curriculum_months';
            referencedColumns: ['id'];
          }
        ];
      };

      curriculum_days: {
        Row: {
          id: string;
          curriculum_week_id: string;
          program_version_id?: string;
          day_index: number;
          day_type: DayType;
          title: string;
          estimated_minutes: number;
          unlock_offset_days: number;
          is_required: boolean;
          sort_order: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          curriculum_week_id: string;
          program_version_id?: string;
          day_index: number;
          day_type?: DayType;
          title: string;
          estimated_minutes?: number;
          unlock_offset_days?: number;
          is_required?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          curriculum_week_id?: string;
          program_version_id?: string;
          day_index?: number;
          day_type?: DayType;
          title?: string;
          estimated_minutes?: number;
          unlock_offset_days?: number;
          is_required?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'curriculum_days_curriculum_week_id_fkey';
            columns: ['curriculum_week_id'];
            isOneToOne: false;
            referencedRelation: 'curriculum_weeks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'curriculum_days_program_version_id_fkey';
            columns: ['program_version_id'];
            isOneToOne: false;
            referencedRelation: 'program_versions';
            referencedColumns: ['id'];
          }
        ];
      };

      lessons: {
        Row: {
          id: string;
          curriculum_day_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          sortOrder?: number;
          estimated_minutes: number;
          is_required: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          curriculum_day_id: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          sortOrder?: number;
          estimated_minutes?: number;
          is_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          curriculum_day_id?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          sortOrder?: number;
          estimated_minutes?: number;
          is_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_curriculum_day_id_fkey';
            columns: ['curriculum_day_id'];
            isOneToOne: false;
            referencedRelation: 'curriculum_days';
            referencedColumns: ['id'];
          }
        ];
      };

      lesson_blocks: {
        Row: {
          id: string;
          lesson_id: string;
          type: BlockType;
          payload_jsonb: Json;
          sort_order: number;
          is_required: boolean;
          estimated_minutes: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          type: BlockType;
          payload_jsonb?: Json;
          sort_order?: number;
          is_required?: boolean;
          estimated_minutes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          type?: BlockType;
          payload_jsonb?: Json;
          sort_order?: number;
          is_required?: boolean;
          estimated_minutes?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_blocks_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          }
        ];
      };

      assets: {
        Row: {
          id: string;
          provider: string;
          drive_file_id?: string | null;
          name: string;
          mime_type?: string | null;
          web_view_link?: string | null;
          resource_key?: string | null;
          access_mode: AssetAccessMode;
          status: AssetStatus;
          last_checked_at?: string | null;
          source_url?: string | null;
          metadata_jsonb?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          provider?: string;
          drive_file_id?: string | null;
          name: string;
          mime_type?: string | null;
          web_view_link?: string | null;
          resource_key?: string | null;
          access_mode?: AssetAccessMode;
          status?: AssetStatus;
          last_checked_at?: string | null;
          source_url?: string | null;
          metadata_jsonb?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider?: string;
          drive_file_id?: string | null;
          name?: string;
          mime_type?: string | null;
          web_view_link?: string | null;
          resource_key?: string | null;
          access_mode?: AssetAccessMode;
          status?: AssetStatus;
          last_checked_at?: string | null;
          source_url?: string | null;
          metadata_jsonb?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      lesson_assets: {
        Row: {
          id: string;
          lesson_block_id: string;
          asset_id: string;
          sort_order: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          lesson_block_id: string;
          asset_id: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_block_id?: string;
          asset_id?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_assets_lesson_block_id_fkey';
            columns: ['lesson_block_id'];
            isOneToOne: false;
            referencedRelation: 'lesson_blocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_assets_asset_id_fkey';
            columns: ['asset_id'];
            isOneToOne: false;
            referencedRelation: 'assets';
            referencedColumns: ['id'];
          }
        ];
      };

      enrollments: {
        Row: {
          id: string;
          user_id: string;
          program_version_id: string;
          start_date: string;
          timezone: string;
          status: EnrollmentStatus;
          paused_at?: string | null;
          pause_total_days: number;
          target_minutes_per_day?: number;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_version_id: string;
          start_date: string;
          timezone?: string;
          status?: EnrollmentStatus;
          paused_at?: string | null;
          pause_total_days?: number;
          target_minutes_per_day?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          program_version_id?: string;
          start_date?: string;
          timezone?: string;
          status?: EnrollmentStatus;
          paused_at?: string | null;
          pause_total_days?: number;
          target_minutes_per_day?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_program_version_id_fkey';
            columns: ['program_version_id'];
            isOneToOne: false;
            referencedRelation: 'program_versions';
            referencedColumns: ['id'];
          }
        ];
      };

      enrollment_schedule_adjustments: {
        Row: {
          id: string;
          enrollment_id: string;
          reason: string;
          days_adjusted: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          enrollment_id: string;
          reason: string;
          days_adjusted: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          enrollment_id?: string;
          reason?: string;
          days_adjusted?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollment_schedule_adjustments_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: false;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          }
        ];
      };

      lesson_progress: {
        Row: {
          id: string;
          enrollment_id: string;
          lesson_id: string;
          status: LessonProgressStatus;
          completed_required_blocks?: number | boolean;
          started_at: string | null;
          completed_at: string | null;
          score: number | null;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          enrollment_id: string;
          lesson_id: string;
          status?: LessonProgressStatus;
          completed_required_blocks?: number | boolean;
          started_at?: string | null;
          completed_at?: string | null;
          score?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          enrollment_id?: string;
          lesson_id?: string;
          status?: LessonProgressStatus;
          completed_required_blocks?: number | boolean;
          started_at?: string | null;
          completed_at?: string | null;
          score?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: false;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          }
        ];
      };

      block_progress: {
        Row: {
          id: string;
          enrollment_id: string;
          lesson_block_id: string;
          completed_at: string;
          metadata_jsonb?: Json;
        };
        Insert: {
          id?: string;
          enrollment_id: string;
          lesson_block_id: string;
          completed_at?: string;
          metadata_jsonb?: Json;
        };
        Update: {
          id?: string;
          enrollment_id?: string;
          lesson_block_id?: string;
          completed_at?: string;
          metadata_jsonb?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'block_progress_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: false;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'block_progress_lesson_block_id_fkey';
            columns: ['lesson_block_id'];
            isOneToOne: false;
            referencedRelation: 'lesson_blocks';
            referencedColumns: ['id'];
          }
        ];
      };

      quizzes: {
        Row: {
          id: string;
          lesson_id: string | null;
          title: string;
          passing_score: number;
          attempt_limit: number | null;
          status: PublishStatus;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          lesson_id?: string | null;
          title: string;
          passing_score?: number;
          attempt_limit?: number | null;
          status?: PublishStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string | null;
          title?: string;
          passing_score?: number;
          attempt_limit?: number | null;
          status?: PublishStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quizzes_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          }
        ];
      };

      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          type: QuizQuestionType;
          prompt_jsonb: Json;
          correct_answer_jsonb: Json;
          explanation_jsonb?: Json;
          points: number;
          sort_order: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          type: QuizQuestionType;
          prompt_jsonb?: Json;
          correct_answer_jsonb?: Json;
          explanation_jsonb?: Json;
          points?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          type?: QuizQuestionType;
          prompt_jsonb?: Json;
          correct_answer_jsonb?: Json;
          explanation_jsonb?: Json;
          points?: number;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_questions_quiz_id_fkey';
            columns: ['quiz_id'];
            isOneToOne: false;
            referencedRelation: 'quizzes';
            referencedColumns: ['id'];
          }
        ];
      };

      quiz_attempts: {
        Row: {
          id: string;
          enrollment_id: string;
          quiz_id: string;
          attempt_no: number;
          submitted_at: string;
          score: number;
          passed: boolean;
          created_at?: string;
        };
        Insert: {
          id?: string;
          enrollment_id: string;
          quiz_id: string;
          attempt_no: number;
          submitted_at?: string;
          score: number;
          passed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          enrollment_id?: string;
          quiz_id?: string;
          attempt_no?: number;
          submitted_at?: string;
          score?: number;
          passed?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_attempts_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: false;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_attempts_quiz_id_fkey';
            columns: ['quiz_id'];
            isOneToOne: false;
            referencedRelation: 'quizzes';
            referencedColumns: ['id'];
          }
        ];
      };

      quiz_answers: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          answer_jsonb: Json;
          is_correct: boolean;
          awarded_points: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          answer_jsonb?: Json;
          is_correct?: boolean;
          awarded_points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          question_id?: string;
          answer_jsonb?: Json;
          is_correct?: boolean;
          awarded_points?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_answers_attempt_id_fkey';
            columns: ['attempt_id'];
            isOneToOne: false;
            referencedRelation: 'quiz_attempts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quiz_answers_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'quiz_questions';
            referencedColumns: ['id'];
          }
        ];
      };

      import_jobs: {
        Row: {
          id: string;
          initiated_by: string | null;
          source_kind: ImportSourceKind;
          status: ImportJobStatus;
          summary_jsonb: Json;
          error_jsonb: Json;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          initiated_by?: string | null;
          source_kind: ImportSourceKind;
          status?: ImportJobStatus;
          summary_jsonb?: Json;
          error_jsonb?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          initiated_by?: string | null;
          source_kind?: ImportSourceKind;
          status?: ImportJobStatus;
          summary_jsonb?: Json;
          error_jsonb?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'import_jobs_initiated_by_fkey';
            columns: ['initiated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      source_mappings: {
        Row: {
          id: string;
          source_type: string;
          source_id: string;
          target_type: string;
          target_id: string;
          source_hash: string | null;
          created_at?: string;
        };
        Insert: {
          id?: string;
          source_type: string;
          source_id: string;
          target_type: string;
          target_id: string;
          source_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_type?: string;
          source_id?: string;
          target_type?: string;
          target_id?: string;
          source_hash?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      audit_logs: {
        Row: {
          id: string;
          actor_user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          summary_jsonb: Json;
          created_at?: string;
        };
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          summary_jsonb?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          summary_jsonb?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_logs_actor_user_id_fkey';
            columns: ['actor_user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };

    Views: {
      student_quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          type: QuizQuestionType;
          prompt_jsonb: Json;
          points: number;
          sort_order: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_questions_quiz_id_fkey';
            columns: ['quiz_id'];
            isOneToOne: false;
            referencedRelation: 'quizzes';
            referencedColumns: ['id'];
          }
        ];
      };
    };

    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_day_unlocked: {
        Args: {
          p_user_id: string;
          p_day_id: string;
        };
        Returns: boolean;
      };
      submit_quiz_attempt: {
        Args: {
          p_enrollment_id: string;
          p_quiz_id: string;
          p_answers: Json;
        };
        Returns: Json;
      };
    };

    Enums: {
      user_role: UserRole;
      age_group: AgeGroup;
      publish_status: PublishStatus;
      day_type: DayType;
      block_type: BlockType;
      asset_access_mode: AssetAccessMode;
      asset_status: AssetStatus;
      enrollment_status: EnrollmentStatus;
      lesson_progress_status: LessonProgressStatus;
      quiz_question_type: QuizQuestionType;
      import_source_kind: ImportSourceKind;
      import_job_status: ImportJobStatus;
    };
  };
}

// ------------------------------------------------------------------------------
// Convenience Entity Types
// ------------------------------------------------------------------------------
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Program = Database['public']['Tables']['programs']['Row'];
export type ProgramVersion = Database['public']['Tables']['program_versions']['Row'];
export type CurriculumMonth = Database['public']['Tables']['curriculum_months']['Row'];
export type CurriculumWeek = Database['public']['Tables']['curriculum_weeks']['Row'];
export type CurriculumDay = Database['public']['Tables']['curriculum_days']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type LessonBlock = Database['public']['Tables']['lesson_blocks']['Row'];
export type Asset = Database['public']['Tables']['assets']['Row'];
export type LessonAsset = Database['public']['Tables']['lesson_assets']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type EnrollmentScheduleAdjustment = Database['public']['Tables']['enrollment_schedule_adjustments']['Row'];
export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
export type BlockProgress = Database['public']['Tables']['block_progress']['Row'];
export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row'];
export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];
export type QuizAnswer = Database['public']['Tables']['quiz_answers']['Row'];
export type ImportJob = Database['public']['Tables']['import_jobs']['Row'];
export type SourceMapping = Database['public']['Tables']['source_mappings']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

// View types
export type StudentQuizQuestion = Database['public']['Views']['student_quiz_questions']['Row'];
