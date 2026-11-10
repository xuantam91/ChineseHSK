import { formatInTimeZone } from 'date-fns-tz';
import { addDays, parseISO, format } from 'date-fns';
import { DayStatus } from '@/types';

export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Returns the current date in the specified timezone (default Asia/Ho_Chi_Minh)
 * formatted as ISO date string: YYYY-MM-DD.
 */
export function getTodayLocal(timezone: string = DEFAULT_TIMEZONE): string {
  return formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');
}

/**
 * Returns a human-friendly Vietnamese date for today.
 * E.g., "Thứ Ba, 10/11/2026"
 */
export function getFormattedTodayVi(timezone: string = DEFAULT_TIMEZONE): string {
  const dateObj = new Date();
  const dayOfWeekIndex = parseInt(formatInTimeZone(dateObj, timezone, 'i'), 10);
  const dayNames: Record<number, string> = {
    1: 'Thứ Hai',
    2: 'Thứ Ba',
    3: 'Thứ Tư',
    4: 'Thứ Năm',
    5: 'Thứ Sáu',
    6: 'Thứ Bảy',
    7: 'Chủ Nhật',
  };
  const dayName = dayNames[dayOfWeekIndex] || 'Hôm nay';
  const formattedDate = formatInTimeZone(dateObj, timezone, 'dd/MM/yyyy');
  return `${dayName}, ${formattedDate}`;
}

/**
 * Calculates the exact unlock date for a given start_date and offset days.
 * Strictly adheres to principle: never calculate unlock dates by dividing UTC timestamps by 86,400,000.
 * Parses YYYY-MM-DD components and adds integer days.
 */
export function calculateUnlockDate(startDate: string, offsetDays: number): string {
  const baseDate = parseISO(startDate);
  const targetDate = addDays(baseDate, offsetDays);
  return format(targetDate, 'yyyy-MM-dd');
}

/**
 * Computes day status based on student's current local date, the unlock date,
 * and completion state.
 */
export function calculateDayStatus(
  currentLocalDate: string,
  unlockDate: string,
  isCompleted: boolean,
  isRestDay: boolean
): DayStatus {
  if (isRestDay) return 'rest_day';
  if (isCompleted) return 'completed';

  if (currentLocalDate < unlockDate) {
    return 'locked';
  } else if (currentLocalDate === unlockDate) {
    return 'today';
  } else {
    // currentLocalDate > unlockDate and not completed
    return 'overdue';
  }
}

/**
 * Formats YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
