import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  getAuthenticatedUser,
  isUsingRealSupabase,
  jsonError,
  jsonSuccess,
} from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { db } from '@/lib/db';
import { getLocalToday } from '@/lib/scheduling';
import { AgeGroup, HSKLevel } from '@/types';

export interface CloudLearningState {
  completed_lessons: string[];
  completed_blocks: string[];
  current_hsk_level: HSKLevel;
  daily_goal_minutes: number;
  start_date?: string;
  age_group?: AgeGroup;
  streak_count: number;
  last_study_date?: string;
  updated_at: string;
}

const SyncPayloadSchema = z.object({
  mode: z
    .enum(['merge', 'replace_blocks', 'complete_lesson', 'update_profile'])
    .default('merge'),
  completed_lessons: z.array(z.string().max(120)).max(500).optional(),
  completed_blocks: z.array(z.string().max(160)).max(2500).optional(),
  current_hsk_level: z
    .enum(['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7-9'])
    .optional(),
  daily_goal_minutes: z.number().int().min(5).max(180).optional(),
  start_date: z.string().max(20).optional(),
  age_group: z.enum(['kids_6_11', 'teens_12_17', 'adults_18_plus']).optional(),
  display_name: z.string().trim().min(1).max(120).optional(),
  streak_count: z.number().int().min(0).max(3650).optional(),
  last_study_date: z.string().max(20).optional(),
});

// In-memory store for mock/test mode when real Supabase is disabled
const mockLearningStates = new Map<string, CloudLearningState>();

function mapAgeGroupToDb(ageGroup?: AgeGroup): 'kid' | 'teen' | 'adult' {
  if (ageGroup === 'kids_6_11') return 'kid';
  if (ageGroup === 'teens_12_17') return 'teen';
  return 'adult';
}

function mapDbAgeGroupToClient(dbAge?: string | null): AgeGroup {
  if (dbAge === 'kid' || dbAge === 'kids') return 'kids_6_11';
  if (dbAge === 'teen' || dbAge === 'teens') return 'teens_12_17';
  return 'adults_18_plus';
}

function uniqueStrings(arr: string[]): string[] {
  return Array.from(new Set(arr.filter((x) => typeof x === 'string' && x.trim().length > 0)));
}

function buildDefaultState(dbAgeGroup?: string | null): CloudLearningState {
  return {
    completed_lessons: [],
    completed_blocks: [],
    current_hsk_level: 'HSK1',
    daily_goal_minutes: 30,
    age_group: mapDbAgeGroupToClient(dbAgeGroup),
    streak_count: 1,
    updated_at: new Date().toISOString(),
  };
}

async function readCloudState(userId: string, dbAgeGroup?: string | null): Promise<{
  state: CloudLearningState;
  existingUserMeta: Record<string, any>;
}> {
  if (!isUsingRealSupabase()) {
    const existing = mockLearningStates.get(userId) || buildDefaultState(dbAgeGroup);
    return { state: existing, existingUserMeta: {} };
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.getUserById(userId);
  if (error || !data?.user) {
    return { state: buildDefaultState(dbAgeGroup), existingUserMeta: {} };
  }

  const meta = (data.user.user_metadata || {}) as Record<string, any>;
  const raw = (meta.learning_state || {}) as Partial<CloudLearningState>;

  const state: CloudLearningState = {
    completed_lessons: Array.isArray(raw.completed_lessons)
      ? uniqueStrings(raw.completed_lessons)
      : [],
    completed_blocks: Array.isArray(raw.completed_blocks)
      ? uniqueStrings(raw.completed_blocks)
      : [],
    current_hsk_level: (raw.current_hsk_level as HSKLevel) || 'HSK1',
    daily_goal_minutes:
      typeof raw.daily_goal_minutes === 'number' ? raw.daily_goal_minutes : 30,
    start_date: typeof raw.start_date === 'string' ? raw.start_date : undefined,
    age_group:
      (raw.age_group as AgeGroup) || mapDbAgeGroupToClient(dbAgeGroup),
    streak_count: typeof raw.streak_count === 'number' ? raw.streak_count : 1,
    last_study_date:
      typeof raw.last_study_date === 'string' ? raw.last_study_date : undefined,
    updated_at:
      typeof raw.updated_at === 'string' ? raw.updated_at : new Date().toISOString(),
  };

  return { state, existingUserMeta: meta };
}

async function writeCloudState(
  userId: string,
  state: CloudLearningState,
  existingUserMeta: Record<string, any>,
  profileUpdates?: { display_name?: string; age_group?: AgeGroup }
): Promise<void> {
  if (!isUsingRealSupabase()) {
    mockLearningStates.set(userId, state);
    if (profileUpdates?.display_name || profileUpdates?.age_group) {
      const existing = await db.getProfile(userId);
      if (existing) {
        await db.upsertProfile({
          ...existing,
          display_name: profileUpdates.display_name || existing.display_name,
          age_group: profileUpdates.age_group
            ? (mapAgeGroupToDb(profileUpdates.age_group) as any)
            : existing.age_group,
          updated_at: new Date().toISOString(),
        });
      }
    }
    return;
  }

  const adminClient = createAdminClient();
  const nextMeta: Record<string, any> = {
    ...existingUserMeta,
    learning_state: state,
  };
  if (profileUpdates?.display_name) {
    nextMeta.display_name = profileUpdates.display_name;
  }

  const { error: authErr } = await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: nextMeta,
  });
  if (authErr) {
    throw new Error(`Không thể lưu tiến độ lên Supabase Auth: ${authErr.message}`);
  }

  if (profileUpdates?.display_name || profileUpdates?.age_group) {
    const dbPatch: {
      updated_at: string;
      display_name?: string;
      age_group?: 'kid' | 'teen' | 'adult';
    } = {
      updated_at: new Date().toISOString(),
    };
    if (profileUpdates.display_name) {
      dbPatch.display_name = profileUpdates.display_name;
    }
    if (profileUpdates.age_group) {
      dbPatch.age_group = mapAgeGroupToDb(profileUpdates.age_group);
    }
    await adminClient.from('profiles').update(dbPatch as any).eq('id', userId);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return jsonError(401, 'UNAUTHORIZED', 'Chưa đăng nhập tài khoản.');
    }

    const { state } = await readCloudState(user.id, user.age_group);

    return jsonSuccess({
      user: {
        id: user.id,
        email: user.email || null,
        display_name: user.display_name,
        role: user.role,
        timezone: user.timezone || 'Asia/Ho_Chi_Minh',
        age_group: state.age_group || mapDbAgeGroupToClient(user.age_group),
      },
      learning_state: state,
    });
  } catch (err: any) {
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err?.message || 'Lỗi đồng bộ tiến độ.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return jsonError(401, 'UNAUTHORIZED', 'Chưa đăng nhập tài khoản.');
    }

    const body = await req.json().catch(() => ({}));
    const parsed = SyncPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(400, 'BAD_REQUEST', 'Dữ liệu đồng bộ không hợp lệ.', parsed.error.flatten());
    }

    const input = parsed.data;
    const { state: current, existingUserMeta } = await readCloudState(user.id, user.age_group);
    const todayLocal = getLocalToday(user.timezone || 'Asia/Ho_Chi_Minh');

    let nextLessons = current.completed_lessons;
    let nextBlocks = current.completed_blocks;

    if (input.mode === 'replace_blocks') {
      if (input.completed_blocks) {
        nextBlocks = uniqueStrings(input.completed_blocks);
      }
      if (input.completed_lessons) {
        nextLessons = uniqueStrings([...current.completed_lessons, ...input.completed_lessons]);
      }
    } else {
      if (input.completed_lessons) {
        nextLessons = uniqueStrings([...current.completed_lessons, ...input.completed_lessons]);
      }
      if (input.completed_blocks) {
        nextBlocks = uniqueStrings([...current.completed_blocks, ...input.completed_blocks]);
      }
    }

    let nextStreak = current.streak_count;
    let nextLastStudy = current.last_study_date;

    if (input.mode === 'complete_lesson') {
      if (current.last_study_date !== todayLocal) {
        nextStreak = Math.max(1, current.streak_count + (current.last_study_date ? 1 : 0));
      } else {
        nextStreak = Math.max(1, current.streak_count);
      }
      nextLastStudy = todayLocal;
    } else if (typeof input.streak_count === 'number') {
      nextStreak = Math.max(current.streak_count, input.streak_count);
      if (input.last_study_date) {
        nextLastStudy = input.last_study_date;
      }
    }

    const nextHskLevel: HSKLevel =
      input.mode === 'update_profile'
        ? input.current_hsk_level || current.current_hsk_level
        : current.current_hsk_level || input.current_hsk_level || 'HSK1';

    const nextState: CloudLearningState = {
      completed_lessons: nextLessons,
      completed_blocks: nextBlocks,
      current_hsk_level: nextHskLevel,
      daily_goal_minutes:
        input.mode === 'update_profile' && typeof input.daily_goal_minutes === 'number'
          ? input.daily_goal_minutes
          : current.daily_goal_minutes || input.daily_goal_minutes || 30,
      start_date:
        input.mode === 'update_profile' && input.start_date
          ? input.start_date
          : current.start_date || input.start_date,
      age_group:
        input.mode === 'update_profile' && input.age_group
          ? input.age_group
          : current.age_group || input.age_group,
      streak_count: nextStreak,
      last_study_date: nextLastStudy,
      updated_at: new Date().toISOString(),
    };

    await writeCloudState(
      user.id,
      nextState,
      existingUserMeta,
      input.mode === 'update_profile'
        ? { display_name: input.display_name, age_group: input.age_group }
        : undefined
    );

    return jsonSuccess({
      user: {
        id: user.id,
        email: user.email || null,
        display_name:
          input.mode === 'update_profile' && input.display_name
            ? input.display_name
            : user.display_name,
        role: user.role,
        timezone: user.timezone || 'Asia/Ho_Chi_Minh',
        age_group: nextState.age_group || mapDbAgeGroupToClient(user.age_group),
      },
      learning_state: nextState,
    });
  } catch (err: any) {
    return jsonError(500, 'INTERNAL_SERVER_ERROR', err?.message || 'Lỗi khi lưu tiến độ.');
  }
}
