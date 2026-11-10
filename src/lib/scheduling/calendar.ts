import { formatInTimeZone } from 'date-fns-tz';
import { addDays, parseISO, format, differenceInCalendarDays, isValid } from 'date-fns';

export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Returns the current date in the specified timezone (default Asia/Ho_Chi_Minh)
 * formatted as ISO date string: YYYY-MM-DD.
 * If referenceDate is provided, formats that date into the timezone.
 */
export function getTodayLocalDate(
  timezone: string = DEFAULT_TIMEZONE,
  referenceDate?: Date | string
): string {
  if (typeof referenceDate === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(referenceDate)) return referenceDate;
    const parsed = parseISO(referenceDate);
    if (isValid(parsed)) {
      return formatInTimeZone(parsed, timezone, 'yyyy-MM-dd');
    }
  }
  const date = (referenceDate instanceof Date && isValid(referenceDate)) ? referenceDate : new Date();
  return formatInTimeZone(date, timezone, 'yyyy-MM-dd');
}

/**
 * Formats any Date object to YYYY-MM-DD in the target timezone.
 */
export function formatLocalDate(
  date: Date,
  timezone: string = DEFAULT_TIMEZONE
): string {
  return formatInTimeZone(date, timezone, 'yyyy-MM-dd');
}

/**
 * Safely parses a YYYY-MM-DD date string into a local Date object.
 * Does not divide by 86,400,000 or cause timezone boundary drift.
 */
export function parseLocalDate(dateStr: string): Date {
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  return parsed;
}

/**
 * Calculates calendar difference in days between two YYYY-MM-DD strings.
 * Result is (endDateStr - startDateStr).
 * Positive if endDateStr > startDateStr, 0 if equal, negative if endDateStr < startDateStr.
 * Never uses UTC milliseconds division (no / 86400000).
 */
export function diffInDays(startDateStr: string, endDateStr: string): number {
  const startDate = parseLocalDate(startDateStr);
  const endDate = parseLocalDate(endDateStr);
  return differenceInCalendarDays(endDate, startDate);
}

/**
 * Adds integer days to a YYYY-MM-DD date string and returns the resulting YYYY-MM-DD.
 * Properly accounts for leap years (e.g. Feb 28 -> Feb 29 in leap years) and variable month lengths.
 */
export function addDaysToLocalDate(dateStr: string, days: number): string {
  const baseDate = parseLocalDate(dateStr);
  const targetDate = addDays(baseDate, days);
  return format(targetDate, 'yyyy-MM-dd');
}

/**
 * Validates whether a string is a valid YYYY-MM-DD calendar date.
 */
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const date = parseISO(dateStr);
  if (!isValid(date)) return false;
  // Ensure round-trip format matches to catch invalid dates like 2026-02-29
  return format(date, 'yyyy-MM-dd') === dateStr;
}
