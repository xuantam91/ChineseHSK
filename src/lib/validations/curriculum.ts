import { z } from 'zod';

export const dayTypeEnum = z.enum([
  'learning',
  'review',
  'quiz',
  'rest',
  'checkpoint',
  'theory',
  'practice',
  'assessment',
  'rest_day',
]);

export const blockTypeEnum = z.enum([
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
  'speech_practice',
  'shadowing',
  'roleplay_dialogue',
  'pinyin_chart',
]);

export const curriculumDaySchema = z.object({
  id: z.string().optional(),
  curriculum_week_id: z.string().optional(),
  curriculumWeekId: z.string().optional(),
  day_index: z.number().int().min(1).optional(),
  dayIndex: z.number().int().min(1).optional(),
  day_type: dayTypeEnum.optional(),
  dayType: dayTypeEnum.optional(),
  title: z.string().min(1, 'Tiêu đề ngày học không được để trống'),
  description: z.string().nullable().optional(),
  estimated_minutes: z.number().int().min(1).default(30).optional(),
  estimatedMinutes: z.number().int().min(1).default(30).optional(),
  unlock_offset_days: z.number().int().min(0).optional(),
  unlockOffsetDays: z.number().int().min(0).optional(),
  is_required: z.boolean().default(true).optional(),
  isRequired: z.boolean().default(true).optional(),
  sort_order: z.number().int().default(1).optional(),
  sortOrder: z.number().int().default(1).optional(),
});

export const curriculumDayUpdateSchema = curriculumDaySchema.partial();

export const lessonSchema = z.object({
  id: z.string().optional(),
  curriculum_day_id: z.string().optional(),
  curriculumDayId: z.string().optional(),
  title: z.string().min(1, 'Tiêu đề bài học không được để trống'),
  description: z.string().default('').optional(),
  estimated_minutes: z.number().int().min(1).default(20).optional(),
  estimatedMinutes: z.number().int().min(1).default(20).optional(),
  is_required: z.boolean().default(true).optional(),
  isRequired: z.boolean().default(true).optional(),
  sort_order: z.number().int().default(1).optional(),
  sortOrder: z.number().int().default(1).optional(),
});

export const lessonUpdateSchema = lessonSchema.partial();

export const lessonBlockSchema = z.object({
  id: z.string().optional(),
  lesson_id: z.string().optional(),
  lessonId: z.string().optional(),
  type: blockTypeEnum,
  payload_jsonb: z.record(z.any()).optional(),
  payload: z.record(z.any()).optional(),
  sort_order: z.number().int().default(1).optional(),
  sortOrder: z.number().int().default(1).optional(),
  is_required: z.boolean().default(true).optional(),
  isRequired: z.boolean().default(true).optional(),
  estimated_minutes: z.number().int().min(0).default(5).optional(),
  estimatedMinutes: z.number().int().min(0).default(5).optional(),
});

export const lessonBlockUpdateSchema = lessonBlockSchema.partial();
