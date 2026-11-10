import { z } from 'zod';

export * from './enrollment';
export * from './quiz';
export * from './curriculum';

// Compatibility aliases for existing admin / api endpoints
export const EnrollmentSchema = z.object({
  program_version_id: z.string().min(1, 'program_version_id is required'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'start_date must be in YYYY-MM-DD format'),
  timezone: z.string().default('Asia/Ho_Chi_Minh'),
  target_minutes_per_day: z.number().int().min(5).max(240).default(30),
});

export const BlockCompleteSchema = z.object({
  metadata: z.record(z.any()).optional(),
});

export const QuizSubmitSchema = z.object({
  answers: z.record(z.any()), // Map of question_id -> student answer
});

export const AdminDaySchema = z.object({
  id: z.string().optional(),
  curriculum_week_id: z.string().min(1, 'curriculum_week_id is required'),
  day_index: z.number().int().min(1),
  day_type: z.enum(['learning', 'review', 'quiz', 'rest', 'checkpoint']),
  title: z.string().min(1, 'title is required'),
  estimated_minutes: z.number().int().min(1).default(30),
  unlock_offset_days: z.number().int().min(0),
  is_required: z.boolean().default(true),
  sort_order: z.number().int().default(1),
});

export const AdminLessonSchema = z.object({
  id: z.string().optional(),
  curriculum_day_id: z.string().min(1, 'curriculum_day_id is required'),
  title: z.string().min(1, 'title is required'),
  description: z.string().default(''),
  estimated_minutes: z.number().int().min(1).default(20),
  is_required: z.boolean().default(true),
  sort_order: z.number().int().default(1),
});

export const AdminBlockSchema = z.object({
  id: z.string().optional(),
  lesson_id: z.string().min(1, 'lesson_id is required'),
  type: z.enum([
    'rich_text',
    'video',
    'audio',
    'pdf',
    'image',
    'vocabulary',
    'flashcard_set',
    'instructions',
    'quiz',
    'external_resource',
  ]),
  payload_jsonb: z.record(z.any()),
  sort_order: z.number().int().default(1),
  is_required: z.boolean().default(true),
  estimated_minutes: z.number().int().min(0).default(5),
});

export const AssetValidateSchema = z.object({
  url: z.string().url('Invalid URL format'),
  name: z.string().optional(),
});

export const NotionImportSchema = z.object({
  raw_content: z.string().min(10, 'Nội dung import phải có ít nhất 10 ký tự'),
  program_id: z.string().optional(),
  version_label: z.string().optional().default('v1.1.0-draft'),
  source_url: z.string().optional(),
});
