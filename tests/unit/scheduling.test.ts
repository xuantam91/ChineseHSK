import { describe, it, expect } from 'vitest';
import {
  getTodayLocalDate,
  formatLocalDate,
  parseLocalDate,
  diffInDays,
  addDaysToLocalDate,
  isValidDateString,
  calculateUnlockDate,
  isDayUnlocked,
  getDayStatus,
  calculateBacklog,
  calculateEnrollmentProgress,
  isLessonCompleted,
} from '@/lib/scheduling';
import { CurriculumDay, Enrollment, Lesson, LessonBlock, LessonProgress } from '@/types';

describe('Scheduling: Calendar & Local Date Handling', () => {
  it('parses valid local date strings and rejects invalid ones', () => {
    expect(isValidDateString('2026-03-01')).toBe(true);
    expect(isValidDateString('2024-02-29')).toBe(true); // leap year
    expect(isValidDateString('2026-02-29')).toBe(false); // non-leap year
    expect(isValidDateString('2026-13-01')).toBe(false);
    expect(isValidDateString('invalid-date')).toBe(false);
  });

  it('calculates calendar day differences without UTC 86400000 division errors', () => {
    expect(diffInDays('2026-03-01', '2026-03-01')).toBe(0);
    expect(diffInDays('2026-03-01', '2026-03-05')).toBe(4);
    expect(diffInDays('2026-03-05', '2026-03-01')).toBe(-4);
  });

  it('correctly handles leap year calendar math (Feb 28 -> Feb 29 -> Mar 1)', () => {
    // 2024 is a leap year
    expect(addDaysToLocalDate('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDaysToLocalDate('2024-02-28', 2)).toBe('2024-03-01');
    expect(diffInDays('2024-02-28', '2024-03-01')).toBe(2);

    // 2026 is NOT a leap year
    expect(addDaysToLocalDate('2026-02-28', 1)).toBe('2026-03-01');
    expect(diffInDays('2026-02-28', '2026-03-01')).toBe(1);

    // 2028 is a leap year
    expect(addDaysToLocalDate('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDaysToLocalDate('2028-02-28', 2)).toBe('2028-03-01');
  });

  it('evaluates exact 23:59 vs 00:01 boundary in Asia/Ho_Chi_Minh (UTC+7)', () => {
    // 2026-03-01T16:59:00Z is 23:59:00 on 2026-03-01 in UTC+7 (Asia/Ho_Chi_Minh)
    const dateAt2359 = new Date('2026-03-01T16:59:00.000Z');
    expect(getTodayLocalDate('Asia/Ho_Chi_Minh', dateAt2359)).toBe('2026-03-01');

    // 2026-03-01T17:01:00Z is 00:01:00 on 2026-03-02 in UTC+7 (Asia/Ho_Chi_Minh)
    const dateAt0001 = new Date('2026-03-01T17:01:00.000Z');
    expect(getTodayLocalDate('Asia/Ho_Chi_Minh', dateAt0001)).toBe('2026-03-02');

    // Day 2 (unlockOffsetDays = 1) for a student starting 2026-03-01
    // At 23:59 on March 1st, Day 2 is locked:
    expect(isDayUnlocked('2026-03-01', 1, 'Asia/Ho_Chi_Minh', dateAt2359)).toBe(false);

    // At 00:01 on March 2nd, Day 2 is unlocked:
    expect(isDayUnlocked('2026-03-01', 1, 'Asia/Ho_Chi_Minh', dateAt0001)).toBe(true);
  });
});

describe('Scheduling: Dynamic Enrollment & Personal Calendar', () => {
  const studentA_Enrollment: Enrollment = {
    id: 'enr-student-a',
    user_id: 'user-a',
    program_version_id: 'ver-1',
    start_date: '2026-03-01',
    timezone: 'Asia/Ho_Chi_Minh',
    status: 'active',
  };

  const studentB_Enrollment: Enrollment = {
    id: 'enr-student-b',
    user_id: 'user-b',
    program_version_id: 'ver-1',
    start_date: '2026-03-10',
    timezone: 'Asia/Ho_Chi_Minh',
    status: 'active',
  };

  it('gives Student A and Student B completely independent unlock dates for the same curriculum', () => {
    // Day 1 (offset 0)
    expect(calculateUnlockDate(studentA_Enrollment.start_date, 0)).toBe('2026-03-01');
    expect(calculateUnlockDate(studentB_Enrollment.start_date, 0)).toBe('2026-03-10');

    // Day 5 (offset 4)
    expect(calculateUnlockDate(studentA_Enrollment.start_date, 4)).toBe('2026-03-05');
    expect(calculateUnlockDate(studentB_Enrollment.start_date, 4)).toBe('2026-03-14');

    // On 2026-03-05:
    // Student A has Day 1..5 unlocked
    expect(isDayUnlocked(studentA_Enrollment.start_date, 0, 'Asia/Ho_Chi_Minh', '2026-03-05')).toBe(true);
    expect(isDayUnlocked(studentA_Enrollment.start_date, 4, 'Asia/Ho_Chi_Minh', '2026-03-05')).toBe(true);
    // Student B has not started yet (Day 1 is locked)
    expect(isDayUnlocked(studentB_Enrollment.start_date, 0, 'Asia/Ho_Chi_Minh', '2026-03-05')).toBe(false);

    // On 2026-03-10:
    // Student A has Day 10 unlocked
    expect(isDayUnlocked(studentA_Enrollment.start_date, 9, 'Asia/Ho_Chi_Minh', '2026-03-10')).toBe(true);
    // Student B has Day 1 unlocked today
    expect(isDayUnlocked(studentB_Enrollment.start_date, 0, 'Asia/Ho_Chi_Minh', '2026-03-10')).toBe(true);
    expect(isDayUnlocked(studentB_Enrollment.start_date, 1, 'Asia/Ho_Chi_Minh', '2026-03-10')).toBe(false);
  });
});

describe('Scheduling: Day Status & Sequence Rules', () => {
  const enrollment: Enrollment = {
    id: 'enr-1',
    start_date: '2026-03-01',
    timezone: 'Asia/Ho_Chi_Minh',
    status: 'active',
  };

  const createDay = (
    dayIndex: number,
    unlockOffsetDays: number,
    dayType: CurriculumDay['day_type'] = 'learning'
  ): CurriculumDay => ({
    id: `day-${dayIndex}`,
    dayIndex,
    day_index: dayIndex,
    dayType,
    day_type: dayType,
    title: `Ngày ${dayIndex}`,
    estimatedMinutes: 30,
    estimated_minutes: 30,
    unlockOffsetDays,
    unlock_offset_days: unlockOffsetDays,
    isRequired: dayType !== 'rest',
    is_required: dayType !== 'rest',
    objectives: ['Learn basic grammar'],
    status: 'locked',
    lessons: [
      {
        id: `les-${dayIndex}-1`,
        curriculum_day_id: `day-${dayIndex}`,
        title: `Bài học ${dayIndex}.1`,
        description: 'Mô tả bài học',
        sort_order: 1,
        estimatedMinutes: 15,
        estimated_minutes: 15,
        isRequired: true,
        is_required: true,
        blocks: [],
      },
    ],
  });

  it('determines "today", "locked", "overdue", and "completed" correctly', () => {
    const day1 = createDay(1, 0); // Unlocks 2026-03-01
    const day2 = createDay(2, 1); // Unlocks 2026-03-02
    const day3 = createDay(3, 2); // Unlocks 2026-03-03

    const progressMap = new Map<string, LessonProgress>();

    // On 2026-03-02:
    // Day 1 was unlocked yesterday, unfinished -> 'overdue'
    expect(getDayStatus(day1, enrollment, progressMap, { referenceDate: '2026-03-02' })).toBe('overdue');

    // Day 2 unlocks today -> 'today'
    expect(getDayStatus(day2, enrollment, progressMap, { referenceDate: '2026-03-02' })).toBe('today');

    // Day 3 unlocks tomorrow -> 'locked'
    expect(getDayStatus(day3, enrollment, progressMap, { referenceDate: '2026-03-02' })).toBe('locked');

    // Mark Day 1 lesson as completed
    progressMap.set('les-1-1', {
      id: 'prog-1',
      enrollment_id: enrollment.id,
      lesson_id: 'les-1-1',
      status: 'completed',
    });

    // Day 1 is now 'completed'
    expect(getDayStatus(day1, enrollment, progressMap, { referenceDate: '2026-03-02' })).toBe('completed');
  });

  it('correctly handles rest days vs checkpoint days', () => {
    const restDay = createDay(7, 6, 'rest'); // Rest day on Day 7 (2026-03-07)
    const checkpointDay = createDay(14, 13, 'checkpoint'); // Checkpoint on Day 14 (2026-03-14)

    const progressMap = new Map<string, LessonProgress>();

    // On 2026-03-07: Rest day should report 'rest'
    expect(getDayStatus(restDay, enrollment, progressMap, { referenceDate: '2026-03-07' })).toBe('rest');

    // On 2026-03-08: Past rest day does not report overdue, still 'rest'
    expect(getDayStatus(restDay, enrollment, progressMap, { referenceDate: '2026-03-08' })).toBe('rest');

    // Checkpoint day on its date reports 'today'
    expect(getDayStatus(checkpointDay, enrollment, progressMap, { referenceDate: '2026-03-14' })).toBe('today');

    // Checkpoint day past due reports 'overdue'
    expect(getDayStatus(checkpointDay, enrollment, progressMap, { referenceDate: '2026-03-15' })).toBe('overdue');
  });

  it('respects strict vs non-strict sequence rules', () => {
    const day2 = createDay(2, 1); // Unlocks 2026-03-02
    const progressMap = new Map<string, LessonProgress>();

    // Non-strict sequence (default): Day 2 is 'today' even if Day 1 was not completed
    expect(
      getDayStatus(day2, enrollment, progressMap, {
        referenceDate: '2026-03-02',
        strictSequence: false,
        previousDayCompleted: false,
      })
    ).toBe('today');

    // Strict sequence: if previous day was not completed, Day 2 remains 'locked'
    expect(
      getDayStatus(day2, enrollment, progressMap, {
        referenceDate: '2026-03-02',
        strictSequence: true,
        previousDayCompleted: false,
      })
    ).toBe('locked');

    // Strict sequence: once previous day is completed, Day 2 becomes accessible ('today')
    expect(
      getDayStatus(day2, enrollment, progressMap, {
        referenceDate: '2026-03-02',
        strictSequence: true,
        previousDayCompleted: true,
      })
    ).toBe('today');
  });
});

describe('Scheduling: Backlog Calculation', () => {
  const enrollment: Enrollment = {
    id: 'enr-backlog',
    start_date: '2026-03-01',
    timezone: 'Asia/Ho_Chi_Minh',
    status: 'active',
  };

  const days: CurriculumDay[] = [
    {
      id: 'day-1',
      dayIndex: 1,
      day_index: 1,
      unlockOffsetDays: 0,
      unlock_offset_days: 0,
      title: 'Ngày 1',
      dayType: 'learning',
      day_type: 'learning',
      estimatedMinutes: 30,
      isRequired: true,
      is_required: true,
      objectives: [],
      status: 'locked',
      lessons: [
        {
          id: 'l-1',
          curriculum_day_id: 'day-1',
          title: 'Bài 1',
          description: '',
          sort_order: 1,
          estimatedMinutes: 15,
          isRequired: true,
          blocks: [],
        },
      ],
    },
    {
      id: 'day-2',
      dayIndex: 2,
      day_index: 2,
      unlockOffsetDays: 1,
      unlock_offset_days: 1,
      title: 'Ngày 2',
      dayType: 'learning',
      day_type: 'learning',
      estimatedMinutes: 30,
      isRequired: true,
      is_required: true,
      objectives: [],
      status: 'locked',
      lessons: [
        {
          id: 'l-2',
          curriculum_day_id: 'day-2',
          title: 'Bài 2',
          description: '',
          sort_order: 1,
          estimatedMinutes: 15,
          isRequired: true,
          blocks: [],
        },
      ],
    },
    {
      id: 'day-3',
      dayIndex: 3,
      day_index: 3,
      unlockOffsetDays: 2,
      unlock_offset_days: 2,
      title: 'Ngày 3',
      dayType: 'learning',
      day_type: 'learning',
      estimatedMinutes: 30,
      isRequired: true,
      is_required: true,
      objectives: [],
      status: 'locked',
      lessons: [
        {
          id: 'l-3',
          curriculum_day_id: 'day-3',
          title: 'Bài 3',
          description: '',
          sort_order: 1,
          estimatedMinutes: 15,
          isRequired: true,
          blocks: [],
        },
      ],
    },
    {
      id: 'day-4',
      dayIndex: 4,
      day_index: 4,
      unlockOffsetDays: 3,
      unlock_offset_days: 3,
      title: 'Ngày 4',
      dayType: 'learning',
      day_type: 'learning',
      estimatedMinutes: 30,
      isRequired: true,
      is_required: true,
      objectives: [],
      status: 'locked',
      lessons: [
        {
          id: 'l-4',
          curriculum_day_id: 'day-4',
          title: 'Bài 4',
          description: '',
          sort_order: 1,
          estimatedMinutes: 15,
          isRequired: true,
          blocks: [],
        },
      ],
    },
    {
      id: 'day-5',
      dayIndex: 5,
      day_index: 5,
      unlockOffsetDays: 4,
      unlock_offset_days: 4,
      title: 'Ngày 5 (Nghỉ)',
      dayType: 'rest',
      day_type: 'rest',
      estimatedMinutes: 15,
      isRequired: false,
      is_required: false,
      objectives: [],
      status: 'locked',
      lessons: [],
    },
  ];

  it('skipping 3 days leaves exactly 3 backlog days without losing track', () => {
    // Today is 2026-03-04 (Day 4 is today)
    // Days 1, 2, 3 were skipped
    const progress: LessonProgress[] = [];
    const backlog = calculateBacklog(enrollment, days, progress, { referenceDate: '2026-03-04' });

    expect(backlog.length).toBe(3);
    expect(backlog.map((d) => d.id)).toEqual(['day-1', 'day-2', 'day-3']);
  });

  it('completing one skipped day reduces backlog accurately', () => {
    // Student catches up and completes Day 2
    const progress: LessonProgress[] = [
      {
        id: 'p-2',
        enrollment_id: enrollment.id,
        lesson_id: 'l-2',
        status: 'completed',
      },
    ];

    const backlog = calculateBacklog(enrollment, days, progress, { referenceDate: '2026-03-04' });
    expect(backlog.length).toBe(2);
    expect(backlog.map((d) => d.id)).toEqual(['day-1', 'day-3']);
  });

  it('excludes rest days and optional days from learning backlog', () => {
    // Reference date 2026-03-06 (Day 6, after Day 5 rest day)
    const backlog = calculateBacklog(enrollment, days, [], { referenceDate: '2026-03-06' });
    // Days 1, 2, 3, 4 are in backlog; Day 5 (rest) is NOT in backlog
    expect(backlog.length).toBe(4);
    expect(backlog.some((d) => d.id === 'day-5')).toBe(false);
  });
});

describe('Scheduling: Progress Calculation', () => {
  it('computes enrollment percentage and clamps values cleanly', () => {
    expect(calculateEnrollmentProgress(100, 25)).toEqual({
      percent: 25,
      completed: 25,
      total: 100,
    });
    expect(calculateEnrollmentProgress(0, 0)).toEqual({
      percent: 0,
      completed: 0,
      total: 0,
    });
    expect(calculateEnrollmentProgress(10, 10)).toEqual({
      percent: 100,
      completed: 10,
      total: 10,
    });
  });

  it('evaluates lesson completion with required blocks and quiz threshold', () => {
    const blocks: LessonBlock[] = [
      {
        id: 'b-1',
        lesson_id: 'l-1',
        type: 'rich_text',
        sort_order: 1,
        is_required: true,
        estimated_minutes: 5,
      },
      {
        id: 'b-2',
        lesson_id: 'l-1',
        type: 'vocabulary',
        sort_order: 2,
        is_required: true,
        estimated_minutes: 5,
      },
      {
        id: 'b-3',
        lesson_id: 'l-1',
        type: 'quiz',
        sort_order: 3,
        is_required: true,
        estimated_minutes: 10,
      },
    ];

    const completedBlockIds = new Set(['b-1', 'b-2', 'b-3']);

    // All blocks done and quiz passed -> true
    expect(isLessonCompleted(blocks, completedBlockIds, true)).toBe(true);

    // All blocks done but quiz failed -> false
    expect(isLessonCompleted(blocks, completedBlockIds, false)).toBe(false);

    // Quiz passed but block b-2 missing -> false
    const missingBlockIds = new Set(['b-1', 'b-3']);
    expect(isLessonCompleted(blocks, missingBlockIds, true)).toBe(false);
  });
});
