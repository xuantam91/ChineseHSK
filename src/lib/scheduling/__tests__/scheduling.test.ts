import { describe, it, expect } from 'vitest';
import {
  getLocalToday,
  getUnlockDate,
  isDayUnlocked,
  calculateDayStatus,
  calculateStreak,
} from '../index';

describe('Scheduling Engine & Strict Timezone (Asia/Ho_Chi_Minh)', () => {
  it('returns valid YYYY-MM-DD local date string', () => {
    const today = getLocalToday('Asia/Ho_Chi_Minh');
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('calculates unlock dates deterministically using calendar offset', () => {
    const startDate = '2026-03-01';
    expect(getUnlockDate(startDate, 0)).toBe('2026-03-01'); // Day 1
    expect(getUnlockDate(startDate, 1)).toBe('2026-03-02'); // Day 2
    expect(getUnlockDate(startDate, 5)).toBe('2026-03-06'); // Day 6
    expect(getUnlockDate(startDate, 30)).toBe('2026-03-31'); // Day 31
    expect(getUnlockDate(startDate, 31)).toBe('2026-04-01'); // Cross month boundary
  });

  it('handles leap year correctly without 86,400,000 ms rounding errors', () => {
    // 2024 was a leap year (Feb 29 exists)
    const leapStart = '2024-02-28';
    expect(getUnlockDate(leapStart, 1)).toBe('2024-02-29');
    expect(getUnlockDate(leapStart, 2)).toBe('2024-03-01');

    // 2026 is a standard year (Feb 28 -> Mar 1)
    const nonLeapStart = '2026-02-28';
    expect(getUnlockDate(nonLeapStart, 1)).toBe('2026-03-01');
  });

  it('provides independent unlock timelines for two users with different start dates', () => {
    const studentA_Start = '2026-03-01';
    const studentB_Start = '2026-03-10';

    const checkDate = '2026-03-05';
    // On 2026-03-05:
    // Student A (Day 5, offset 4): 2026-03-01 + 4 = 2026-03-05 -> Unlocked!
    expect(isDayUnlocked(studentA_Start, 4, checkDate)).toBe(true);

    // Student B (Day 5, offset 4): 2026-03-10 + 4 = 2026-03-14 -> Locked!
    expect(isDayUnlocked(studentB_Start, 4, checkDate)).toBe(false);
  });

  it('computes correct DayStatus: locked, today, overdue, completed, rest', () => {
    const startDate = '2026-03-01';

    // 1. Future day is 'locked'
    expect(
      calculateDayStatus({
        startDate,
        unlockOffsetDays: 10,
        dayType: 'learning',
        isCompleted: false,
        todayLocal: '2026-03-05',
      })
    ).toBe('locked');

    // 2. Day scheduled for today is 'today'
    expect(
      calculateDayStatus({
        startDate,
        unlockOffsetDays: 4,
        dayType: 'learning',
        isCompleted: false,
        todayLocal: '2026-03-05',
      })
    ).toBe('today');

    // 3. Past day not yet finished is 'overdue' (Backlog)
    expect(
      calculateDayStatus({
        startDate,
        unlockOffsetDays: 1,
        dayType: 'learning',
        isCompleted: false,
        todayLocal: '2026-03-05',
      })
    ).toBe('overdue');

    // 4. Completed day is 'completed'
    expect(
      calculateDayStatus({
        startDate,
        unlockOffsetDays: 1,
        dayType: 'learning',
        isCompleted: true,
        todayLocal: '2026-03-05',
      })
    ).toBe('completed');

    // 5. Rest day that has reached calendar date is 'rest'
    expect(
      calculateDayStatus({
        startDate,
        unlockOffsetDays: 3,
        dayType: 'rest',
        isCompleted: false,
        todayLocal: '2026-03-05',
      })
    ).toBe('rest');
  });

  it('calculates streak count accurately', () => {
    const today = '2026-03-05';
    // Streak of 3 consecutive days ending today: March 3, 4, 5
    expect(calculateStreak(['2026-03-03', '2026-03-04', '2026-03-05'], today)).toBe(3);

    // If today is not completed yet, but yesterday was completed: keep streak alive!
    expect(calculateStreak(['2026-03-03', '2026-03-04'], today)).toBe(2);

    // Missed yesterday breaks streak
    expect(calculateStreak(['2026-03-01', '2026-03-02'], today)).toBe(0);
  });
});
