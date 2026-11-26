'use client';

import { UserProfile, DayStatus, CurriculumDay } from '@/types';
import { DEMO_USER_PROFILE, DEMO_DAYS } from './mock-data';
import { getTodayLocal, calculateUnlockDate, calculateDayStatus } from './timezone';

const STORAGE_KEY_USER = 'chinese_journey_user_profile';
const STORAGE_KEY_COMPLETED_LESSONS = 'chinese_journey_completed_lessons';
const STORAGE_KEY_COMPLETED_BLOCKS = 'chinese_journey_completed_blocks';
const STORAGE_KEY_QUIZ_ATTEMPTS = 'chinese_journey_quiz_attempts';

export const STUDENT_STATE_SYNCED_EVENT = 'student_state_synced';
export const DEMO_MAX_LESSONS = 3;

export interface SyncedStudentState {
  profile: UserProfile;
  completedLessons: string[];
  completedBlocks: string[];
}

export function isDemoAccount(profile?: UserProfile | null): boolean {
  if (!profile) return true;
  if (profile.role === 'admin' || profile.role === 'super_admin') return false;
  if (typeof profile.isDemo === 'boolean') return profile.isDemo;
  return (
    profile.id === 'usr_demo_student_01' ||
    profile.email?.toLowerCase() === 'student.demo@chinese-journey.edu.vn'
  );
}

function emitStateSynced(detail?: SyncedStudentState) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(STUDENT_STATE_SYNCED_EVENT, { detail }));
  } catch {
    // ignore
  }
}

export function getStoredUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEMO_USER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return DEMO_USER_PROFILE;
    return JSON.parse(raw);
  } catch {
    return DEMO_USER_PROFILE;
  }
}

function postCloudSync(payload: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
  fetch('/api/me/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export function saveUserProfile(
  profile: UserProfile,
  options: { syncToCloud?: boolean } = {}
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    emitStateSynced({
      profile,
      completedLessons: getCompletedLessonIds(),
      completedBlocks: getCompletedBlockIds(),
    });

    if (options.syncToCloud !== false && !isDemoAccount(profile)) {
      postCloudSync({
        mode: 'update_profile',
        current_hsk_level: profile.currentHskLevel || 'HSK1',
        daily_goal_minutes: profile.dailyGoalMinutes || 30,
        start_date: profile.startDate,
        age_group: profile.ageGroup,
        display_name: profile.displayName,
      });
    }
  } catch (err) {
    console.error('Failed to save profile', err);
  }
}

export function getCompletedLessonIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_LESSONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markLessonCompleted(lessonId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const ids = getCompletedLessonIds();
    if (!ids.includes(lessonId)) {
      ids.push(lessonId);
      localStorage.setItem(STORAGE_KEY_COMPLETED_LESSONS, JSON.stringify(ids));
    }
    const profile = getStoredUserProfile();
    const blocks = getCompletedBlockIds();
    emitStateSynced({
      profile,
      completedLessons: ids,
      completedBlocks: blocks,
    });

    if (!isDemoAccount(profile)) {
      postCloudSync({
        mode: 'complete_lesson',
        completed_lessons: ids,
        completed_blocks: blocks,
      });
    }
  } catch (err) {
    console.error('Failed to save completed lesson', err);
  }
}

export function getCompletedBlockIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_BLOCKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBlockCompleted(blockId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    let ids = getCompletedBlockIds();
    const isCompleted = ids.includes(blockId);
    if (isCompleted) {
      ids = ids.filter((id) => id !== blockId);
    } else {
      ids.push(blockId);
    }
    localStorage.setItem(STORAGE_KEY_COMPLETED_BLOCKS, JSON.stringify(ids));

    const profile = getStoredUserProfile();
    const lessons = getCompletedLessonIds();
    emitStateSynced({
      profile,
      completedLessons: lessons,
      completedBlocks: ids,
    });

    if (!isDemoAccount(profile)) {
      postCloudSync({
        mode: 'replace_blocks',
        completed_blocks: ids,
        completed_lessons: lessons,
      });
    }
    return !isCompleted;
  } catch {
    return false;
  }
}

export function clearLocalStudentProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_COMPLETED_LESSONS);
    localStorage.removeItem(STORAGE_KEY_COMPLETED_BLOCKS);
    localStorage.removeItem(STORAGE_KEY_QUIZ_ATTEMPTS);
    emitStateSynced({
      profile: DEMO_USER_PROFILE,
      completedLessons: [],
      completedBlocks: [],
    });
  } catch {
    // ignore
  }
}

/**
 * Synchronizes student progress & profile with Supabase Cloud (/api/me/sync).
 * - If authenticated on a fresh device (localStorage has demo/empty state), pulls cloud state cleanly.
 * - If authenticated with existing local progress for the same account, merges local + cloud so no progress is lost.
 * - If unauthenticated (401), keeps Demo mode untouched.
 */
export async function syncStudentProgressWithCloud(): Promise<SyncedStudentState | null> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return null;

  try {
    const stored = getStoredUserProfile();
    const hasLocalRealUser = !isDemoAccount(stored);

    const res = hasLocalRealUser
      ? await fetch('/api/me/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'merge',
            completed_lessons: getCompletedLessonIds(),
            completed_blocks: getCompletedBlockIds(),
            current_hsk_level: stored.currentHskLevel || 'HSK1',
            daily_goal_minutes: stored.dailyGoalMinutes || 30,
            start_date: stored.startDate,
            age_group: stored.ageGroup,
            display_name: stored.displayName,
            streak_count: stored.streakCount,
            last_study_date: stored.lastStudyDate,
          }),
        })
      : await fetch('/api/me/sync', { method: 'GET' });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    const data = json?.data;
    if (!json?.success || !data?.user || !data?.learning_state) {
      return null;
    }

    const cloudUser = data.user;
    const ls = data.learning_state;

    const mergedProfile: UserProfile = {
      id: cloudUser.id,
      email: cloudUser.email || stored.email,
      displayName: cloudUser.display_name || stored.displayName,
      role: cloudUser.role || 'student',
      isDemo: false,
      ageGroup: ls.age_group || cloudUser.age_group || 'adults_18_plus',
      currentHskLevel: ls.current_hsk_level || 'HSK1',
      startDate: ls.start_date || stored.startDate || getTodayLocal('Asia/Ho_Chi_Minh'),
      timezone: cloudUser.timezone || 'Asia/Ho_Chi_Minh',
      dailyGoalMinutes: ls.daily_goal_minutes || 30,
      streakCount: typeof ls.streak_count === 'number' ? ls.streak_count : 1,
      lastStudyDate: ls.last_study_date,
    };

    const completedLessons: string[] = Array.isArray(ls.completed_lessons)
      ? ls.completed_lessons
      : [];
    const completedBlocks: string[] = Array.isArray(ls.completed_blocks)
      ? ls.completed_blocks
      : [];

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mergedProfile));
    localStorage.setItem(STORAGE_KEY_COMPLETED_LESSONS, JSON.stringify(completedLessons));
    localStorage.setItem(STORAGE_KEY_COMPLETED_BLOCKS, JSON.stringify(completedBlocks));

    const synced: SyncedStudentState = {
      profile: mergedProfile,
      completedLessons,
      completedBlocks,
    };
    emitStateSynced(synced);
    return synced;
  } catch {
    return null;
  }
}

/**
 * Computes the real-time schedule for days based on the user's start_date and local date
 */
export function getComputedDays(user: UserProfile, completedLessons: string[]): CurriculumDay[] {
  const today = getTodayLocal(user.timezone);
  const startDate = user.startDate || today;

  return DEMO_DAYS.map((day) => {
    const unlockDate = calculateUnlockDate(startDate, day.unlockOffsetDays);
    const isCompleted = completedLessons.length > 0 && false;
    const isRestDay = day.dayType === 'rest_day';
    const computedStatus: DayStatus = calculateDayStatus(today, unlockDate, isCompleted, isRestDay);

    return {
      ...day,
      status: computedStatus,
    };
  });
}
