import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DEMO_USER_PROFILE, DEMO_MONTHS_OVERVIEW, DEMO_DAYS, DEMO_LESSONS } from '@/lib/mock-data';
import { getStoredUserProfile, saveUserProfile } from '@/lib/student-store';
import { HSKLevel } from '@/types';

describe('Student Profile & Curriculum Official Release', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    const fakeLocalStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        mockStorage = {};
      },
    };

    vi.stubGlobal('window', {
      localStorage: fakeLocalStorage,
    });
    vi.stubGlobal('localStorage', fakeLocalStorage);
  });

  it('provides official curriculum data without [DEMO] in month and day titles', () => {
    for (const month of DEMO_MONTHS_OVERVIEW) {
      expect(month.title).not.toContain('[DEMO]');
    }

    for (const day of DEMO_DAYS) {
      expect(day.title).not.toContain('[DEMO]');
    }

    for (const dayId of Object.keys(DEMO_LESSONS)) {
      for (const lesson of DEMO_LESSONS[dayId]) {
        expect(lesson.title).not.toContain('[DEMO]');
      }
    }
  });

  it('has clean default student profile without [DEMO] and with default HSK level', () => {
    expect(DEMO_USER_PROFILE.displayName).not.toContain('[DEMO]');
    expect(DEMO_USER_PROFILE.currentHskLevel).toBe('HSK1');
  });

  it('persists student chosen HSK level across updates', () => {
    const levels: HSKLevel[] = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7-9'];

    for (const lvl of levels) {
      saveUserProfile({
        ...DEMO_USER_PROFILE,
        currentHskLevel: lvl,
      });

      const stored = getStoredUserProfile();
      expect(stored.currentHskLevel).toBe(lvl);
    }
  });
});
