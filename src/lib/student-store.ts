'use client';

import { useState, useEffect } from 'react';
import { UserProfile, DayStatus, CurriculumDay } from '@/types';
import { DEMO_USER_PROFILE, DEMO_DAYS } from './mock-data';
import { getTodayLocal, calculateUnlockDate, calculateDayStatus } from './timezone';

const STORAGE_KEY_USER = 'chinese_journey_user_profile';
const STORAGE_KEY_COMPLETED_LESSONS = 'chinese_journey_completed_lessons';
const STORAGE_KEY_COMPLETED_BLOCKS = 'chinese_journey_completed_blocks';
const STORAGE_KEY_QUIZ_ATTEMPTS = 'chinese_journey_quiz_attempts';

export const DEMO_MAX_LESSONS = 3;

export function isDemoAccount(profile?: UserProfile | null): boolean {
  if (!profile) return true;
  if (profile.role === 'admin') return false;
  if (typeof profile.isDemo === 'boolean') return profile.isDemo;
  return (
    profile.id === 'usr_demo_student_01' ||
    profile.email?.toLowerCase() === 'student.demo@chinese-journey.edu.vn'
  );
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

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
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
      ids = ids.filter(id => id !== blockId);
    } else {
      ids.push(blockId);
    }
    localStorage.setItem(STORAGE_KEY_COMPLETED_BLOCKS, JSON.stringify(ids));
    return !isCompleted;
  } catch {
    return false;
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
    const isCompleted = false; // or based on completedLessons
    const isRestDay = day.dayType === 'rest_day';
    const computedStatus: DayStatus = calculateDayStatus(today, unlockDate, isCompleted, isRestDay);

    return {
      ...day,
      status: computedStatus,
    };
  });
}
