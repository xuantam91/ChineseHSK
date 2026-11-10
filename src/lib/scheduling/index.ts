import { addDays, parseISO, format } from 'date-fns';
import { DayStatus } from '@/types';
import { DayType } from '@/types/database';
import { getTodayLocalDate } from './calendar';
import { calculateUnlockDate } from './unlock';

export * from './calendar';
export * from './unlock';
export * from './backlog';
export * from './progress';

// Compatibility aliases for existing db callers
export const getLocalToday = getTodayLocalDate;
export const getUnlockDate = calculateUnlockDate;

export interface LegacyDayStatusOptions {
  startDate: string;
  unlockOffsetDays: number;
  dayType: DayType | string;
  isCompleted: boolean;
  todayLocal: string;
}

/**
 * Legacy calculateDayStatus for direct options object callers.
 */
export function calculateDayStatus({
  startDate,
  unlockOffsetDays,
  dayType,
  isCompleted,
  todayLocal,
}: LegacyDayStatusOptions): DayStatus {
  const unlockDate = calculateUnlockDate(startDate, unlockOffsetDays);

  if (todayLocal < unlockDate) {
    return 'locked';
  }

  if (isCompleted) {
    return 'completed';
  }

  if (dayType === 'rest' || dayType === 'rest_day') {
    return 'rest';
  }

  if (todayLocal === unlockDate) {
    return 'today';
  }

  // todayLocal > unlockDate and not completed
  return 'overdue';
}

/**
 * Calculates streak count (consecutive completed days ending today or yesterday).
 */
export function calculateStreak(
  completedDates: string[],
  todayLocal: string = getTodayLocalDate()
): number {
  if (!completedDates || completedDates.length === 0) return 0;

  const dateSet = new Set(completedDates);
  let streak = 0;
  let checkDate = parseISO(todayLocal);

  // If today is not completed, check if yesterday was completed to keep the streak alive
  if (!dateSet.has(todayLocal)) {
    checkDate = addDays(checkDate, -1);
    const yesterdayStr = format(checkDate, 'yyyy-MM-dd');
    if (!dateSet.has(yesterdayStr)) {
      return 0;
    }
  }

  while (dateSet.has(format(checkDate, 'yyyy-MM-dd'))) {
    streak++;
    checkDate = addDays(checkDate, -1);
  }

  return streak;
}
