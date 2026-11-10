import { z } from 'zod';
import { isValidDateString } from '../scheduling/calendar';

export const ageGroupEnum = z.enum([
  'kids',
  'teens',
  'adults',
  'kids_6_11',
  'teens_12_17',
  'adults_18_plus',
]);

/**
 * Validates enrollment / onboarding request.
 * Supports both camelCase and snake_case inputs.
 */
export const enrollmentRequestSchema = z
  .object({
    displayName: z.string().min(2, 'Tên hiển thị phải có ít nhất 2 ký tự').max(100).optional(),
    display_name: z.string().min(2).max(100).optional(),
    ageGroup: ageGroupEnum.optional(),
    age_group: ageGroupEnum.optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày bắt đầu phải có định dạng YYYY-MM-DD')
      .refine(isValidDateString, 'Ngày bắt đầu không phải ngày lịch hợp lệ')
      .optional(),
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày bắt đầu phải có định dạng YYYY-MM-DD')
      .refine(isValidDateString, 'Ngày bắt đầu không phải ngày lịch hợp lệ')
      .optional(),
    timezone: z.string().default('Asia/Ho_Chi_Minh'),
    targetMinutes: z.number().int().min(5).max(300).default(30).optional(),
    target_minutes_per_day: z.number().int().min(5).max(300).default(30).optional(),
    programVersionId: z.string().optional(),
    program_version_id: z.string().optional(),
  })
  .transform((data) => {
    const displayName = data.displayName || data.display_name || 'Học viên';
    const ageGroup = data.ageGroup || data.age_group || 'adults';
    const startDate = data.startDate || data.start_date || new Date().toISOString().slice(0, 10);
    const targetMinutes = data.targetMinutes ?? data.target_minutes_per_day ?? 30;
    const programVersionId = data.programVersionId || data.program_version_id || 'ver-default';

    return {
      displayName,
      ageGroup,
      startDate,
      timezone: data.timezone,
      targetMinutes,
      programVersionId,
      // snake_case aliases
      display_name: displayName,
      age_group: ageGroup,
      start_date: startDate,
      target_minutes_per_day: targetMinutes,
      program_version_id: programVersionId,
    };
  });

export type EnrollmentRequest = z.infer<typeof enrollmentRequestSchema>;
