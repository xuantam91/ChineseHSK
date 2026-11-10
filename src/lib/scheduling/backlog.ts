import { CurriculumDay, Enrollment, LessonProgress } from '@/types';
import { calculateUnlockDate } from './unlock';
import { DEFAULT_TIMEZONE, getTodayLocalDate } from './calendar';

export interface BacklogOptions {
  referenceDate?: string | Date;
}

/**
 * Calculates all overdue unfinished curriculum days up to today.
 * Preserves every missed day without auto-skipping or losing track.
 * Rest days and optional days are excluded from study backlog debt.
 */
export function calculateBacklog(
  enrollment: Enrollment,
  days: CurriculumDay[],
  progress: LessonProgress[] | Map<string, LessonProgress>,
  options?: BacklogOptions
): CurriculumDay[] {
  const timezone = enrollment.timezone || DEFAULT_TIMEZONE;
  const today =
    typeof options?.referenceDate === 'string'
      ? options.referenceDate
      : getTodayLocalDate(timezone, options?.referenceDate);

  const startDate = enrollment.start_date || enrollment.startDate || today;

  // Build progress map if array is passed
  const progressMap =
    progress instanceof Map
      ? progress
      : new Map<string, LessonProgress>(
          progress.map((p) => [p.lesson_id || p.lessonId || p.id, p])
        );

  // Sort days by unlock_offset_days or day_index
  const sortedDays = [...days].sort((a, b) => {
    const offsetA = a.unlock_offset_days ?? a.unlockOffsetDays ?? a.day_index ?? a.dayIndex;
    const offsetB = b.unlock_offset_days ?? b.unlockOffsetDays ?? b.day_index ?? b.dayIndex;
    return offsetA - offsetB;
  });

  const backlog: CurriculumDay[] = [];

  for (const day of sortedDays) {
    const isRest =
      day.day_type === 'rest' ||
      day.dayType === 'rest' ||
      day.dayType === 'rest_day';

    const isOptional = day.is_required === false || day.isRequired === false;

    // Rest days and optional days do not accumulate as learning backlog
    if (isRest || isOptional) {
      continue;
    }

    const offset = day.unlock_offset_days ?? day.unlockOffsetDays ?? 0;
    const unlockDate = calculateUnlockDate(startDate, offset);

    // Only days unlocked BEFORE today can be overdue backlog
    if (unlockDate >= today) {
      continue;
    }

    const lessons = day.lessons || [];
    const requiredLessons = lessons.filter(
      (l) => l.is_required !== false && l.isRequired !== false
    );

    const targetLessons = requiredLessons.length > 0 ? requiredLessons : lessons;

    // Check if all target lessons are completed
    let isDayFinished = false;
    if (targetLessons.length > 0) {
      const completedCount = targetLessons.filter((l) => {
        const prog = progressMap.get(l.id);
        return prog?.status === 'completed';
      }).length;
      isDayFinished = completedCount === targetLessons.length;
    }

    if (!isDayFinished) {
      backlog.push(day);
    }
  }

  return backlog;
}
