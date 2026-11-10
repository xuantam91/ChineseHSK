import { describe, it, expect } from 'vitest';
import {
  getTodayLocal,
  calculateUnlockDate,
  calculateDayStatus,
  formatDisplayDate,
  DEFAULT_TIMEZONE,
} from './timezone';

describe('Timezone & Scheduling Engine', () => {
  it('returns valid YYYY-MM-DD for Asia/Ho_Chi_Minh', () => {
    const today = getTodayLocal(DEFAULT_TIMEZONE);
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('calculates unlock date correctly without UTC timestamp division bug', () => {
    const startDate = '2026-01-01';
    expect(calculateUnlockDate(startDate, 0)).toBe('2026-01-01');
    expect(calculateUnlockDate(startDate, 1)).toBe('2026-01-02');
    expect(calculateUnlockDate(startDate, 30)).toBe('2026-01-31');
    expect(calculateUnlockDate(startDate, 31)).toBe('2026-02-01');
  });

  it('handles leap year correctly (Feb 2028)', () => {
    const startDate = '2028-02-28';
    expect(calculateUnlockDate(startDate, 1)).toBe('2028-02-29');
    expect(calculateUnlockDate(startDate, 2)).toBe('2028-03-01');
  });

  it('determines day status properly', () => {
    const today = '2026-11-10';

    // Rest day
    expect(calculateDayStatus(today, '2026-11-10', false, true)).toBe('rest_day');

    // Completed day
    expect(calculateDayStatus(today, '2026-11-10', true, false)).toBe('completed');

    // Today's day
    expect(calculateDayStatus(today, '2026-11-10', false, false)).toBe('today');

    // Future locked day
    expect(calculateDayStatus(today, '2026-11-12', false, false)).toBe('locked');

    // Past overdue day (Backlog)
    expect(calculateDayStatus(today, '2026-11-08', false, false)).toBe('overdue');
  });

  it('formats display date correctly', () => {
    expect(formatDisplayDate('2026-11-10')).toBe('10/11/2026');
  });
});
