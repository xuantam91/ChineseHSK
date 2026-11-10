import { CurriculumDay, DayStatus, Enrollment, LessonProgress } from '@/types';
import { addDaysToLocalDate, DEFAULT_TIMEZONE, getTodayLocalDate } from './calendar';

export interface DayStatusOptions {
  referenceDate?: string | Date;
  strictSequence?: boolean;
  previousDayCompleted?: boolean;
}

/**
 * Calculates the exact unlock date for a given start_date and unlock_offset_days.
 * Start date Day 1 has unlockOffsetDays = 0, Day 2 = 1, etc.
 * Uses integer local calendar addition.
 */
export function calculateUnlockDate(startDate: string, unlockOffsetDays: number): string {
  return addDaysToLocalDate(startDate, unlockOffsetDays);
}

/**
 * Checks if a curriculum day is unlocked for a student on a given reference date
 * in the specified timezone (defaults to Asia/Ho_Chi_Minh).
 */
export function isDayUnlocked(
  startDate: string,
  unlockOffsetDays: number,
  timezoneOrRefDate: string | Date = DEFAULT_TIMEZONE,
  referenceDate?: string | Date
): boolean {
  let timezone = DEFAULT_TIMEZONE;
  let refDate: string | Date | undefined = referenceDate;

  if (typeof timezoneOrRefDate === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(timezoneOrRefDate)) {
      refDate = timezoneOrRefDate;
    } else {
      timezone = timezoneOrRefDate;
    }
  } else if (timezoneOrRefDate instanceof Date) {
    refDate = timezoneOrRefDate;
  }

  const today =
    typeof refDate === 'string'
      ? refDate
      : getTodayLocalDate(timezone, refDate);
  const unlockDate = calculateUnlockDate(startDate, unlockOffsetDays);
  return today >= unlockDate;
}

/**
 * Computes day status: 'locked' | 'today' | 'overdue' | 'in_progress' | 'completed' | 'rest'
 */
export function getDayStatus(
  day: CurriculumDay,
  enrollment: Enrollment,
  lessonProgressMap: Map<string, LessonProgress> | Record<string, LessonProgress>,
  options?: DayStatusOptions
): DayStatus {
  const timezone = enrollment.timezone || DEFAULT_TIMEZONE;
  const today =
    typeof options?.referenceDate === 'string'
      ? options.referenceDate
      : getTodayLocalDate(timezone, options?.referenceDate);

  const startDate = enrollment.start_date || enrollment.startDate || today;
  const offset = day.unlock_offset_days ?? day.unlockOffsetDays ?? 0;
  const unlockDate = calculateUnlockDate(startDate, offset);
  const isUnlocked = today >= unlockDate;

  // Helper to look up lesson progress
  const getProgress = (lessonId: string): LessonProgress | undefined => {
    if (lessonProgressMap instanceof Map) {
      return lessonProgressMap.get(lessonId);
    }
    return lessonProgressMap[lessonId];
  };

  const isRestDay =
    day.day_type === 'rest' ||
    day.dayType === 'rest' ||
    day.dayType === 'rest_day';

  // Check lesson completion
  const lessons = day.lessons || [];
  const requiredLessons = lessons.filter(
    (l) => l.is_required !== false && l.isRequired !== false
  );

  const targetLessons = requiredLessons.length > 0 ? requiredLessons : lessons;

  let isCompleted = false;
  let hasAnyProgress = false;

  if (targetLessons.length > 0) {
    const completedCount = targetLessons.filter((l) => {
      const p = getProgress(l.id);
      return p?.status === 'completed';
    }).length;

    isCompleted = completedCount === targetLessons.length;
    hasAnyProgress =
      completedCount > 0 ||
      lessons.some((l) => {
        const p = getProgress(l.id);
        return p?.status === 'in_progress';
      });
  }

  // If already completed, status is 'completed'
  if (isCompleted) {
    return 'completed';
  }

  // Strict sequence rule: if enabled and previous day is incomplete, keep locked
  if (options?.strictSequence && options.previousDayCompleted === false) {
    return 'locked';
  }

  // If not unlocked yet
  if (!isUnlocked) {
    return 'locked';
  }

  // Rest day handling (unlocked but rest day)
  if (isRestDay) {
    return 'rest';
  }

  // In progress (some lessons completed or in progress, but day not finished)
  if (hasAnyProgress) {
    return 'in_progress';
  }

  // Unlocked today
  if (today === unlockDate) {
    return 'today';
  }

  // Unlocked in the past and unfinished
  return 'overdue';
}
