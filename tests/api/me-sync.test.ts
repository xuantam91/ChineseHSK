import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as syncGet, POST as syncPost } from '@/app/api/me/sync/route';
import { LOCAL_SESSION_COOKIE } from '@/lib/auth';

function buildRequest(url: string, opts?: { method?: string; body?: unknown; userId?: string }) {
  const headers: Record<string, string> = {};
  if (opts?.body) {
    headers['Content-Type'] = 'application/json';
  }
  if (opts?.userId) {
    headers['Cookie'] = `${LOCAL_SESSION_COOKIE}=${opts.userId}`;
  }
  return new NextRequest(url, {
    method: opts?.method || 'GET',
    headers,
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });
}

describe('/api/me/sync cross-device cloud sync', () => {
  it('rejects invalid sync payloads with 400 BAD_REQUEST', async () => {
    const req = buildRequest('http://localhost:3000/api/me/sync', {
      method: 'POST',
      userId: 'usr-superadmin-01',
      body: {
        mode: 'update_profile',
        daily_goal_minutes: 9999,
      },
    });
    const res = await syncPost(req);
    expect(res.status).toBe(400);
  });

  it('merges completed lessons from Laptop and returns them on Phone for same user', async () => {
    const userId = 'usr-superadmin-01';

    // 1. Laptop uploads Bài 1 & Bài 2 completed
    const laptopReq = buildRequest('http://localhost:3000/api/me/sync', {
      method: 'POST',
      userId,
      body: {
        mode: 'merge',
        completed_lessons: ['hsk1-lesson-01', 'hsk1-lesson-02'],
        completed_blocks: ['hsk1-lesson-01-blk-vocab', 'hsk1-lesson-02-blk-vocab'],
        current_hsk_level: 'HSK1',
      },
    });
    const laptopRes = await syncPost(laptopReq);
    const laptopJson = await laptopRes.json();
    expect(laptopRes.status).toBe(200);
    expect(laptopJson.success).toBe(true);
    expect(laptopJson.data.learning_state.completed_lessons).toEqual([
      'hsk1-lesson-01',
      'hsk1-lesson-02',
    ]);

    // 2. Phone fetches cloud state -> receives exact completed lessons
    const phoneReq = buildRequest('http://localhost:3000/api/me/sync', {
      method: 'GET',
      userId,
    });
    const phoneRes = await syncGet(phoneReq);
    const phoneJson = await phoneRes.json();
    expect(phoneRes.status).toBe(200);
    expect(phoneJson.data.learning_state.completed_lessons).toContain('hsk1-lesson-01');
    expect(phoneJson.data.learning_state.completed_lessons).toContain('hsk1-lesson-02');
    expect(phoneJson.data.learning_state.completed_blocks).toContain('hsk1-lesson-01-blk-vocab');
  });

  it('supports replace_blocks and complete_lesson modes cleanly', async () => {
    const userId = 'usr-superadmin-01';

    // Complete Bài 3
    const completeReq = buildRequest('http://localhost:3000/api/me/sync', {
      method: 'POST',
      userId,
      body: {
        mode: 'complete_lesson',
        completed_lessons: ['hsk1-lesson-01', 'hsk1-lesson-02', 'hsk1-lesson-03'],
        completed_blocks: ['hsk1-lesson-03-blk-vocab'],
      },
    });
    const completeRes = await syncPost(completeReq);
    const completeJson = await completeRes.json();
    expect(completeRes.status).toBe(200);
    expect(completeJson.data.learning_state.completed_lessons).toContain('hsk1-lesson-03');
    expect(completeJson.data.learning_state.last_study_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    // Toggle block off via replace_blocks
    const toggleReq = buildRequest('http://localhost:3000/api/me/sync', {
      method: 'POST',
      userId,
      body: {
        mode: 'replace_blocks',
        completed_blocks: ['hsk1-lesson-01-blk-vocab'],
      },
    });
    const toggleRes = await syncPost(toggleReq);
    const toggleJson = await toggleRes.json();
    expect(toggleRes.status).toBe(200);
    expect(toggleJson.data.learning_state.completed_blocks).toEqual([
      'hsk1-lesson-01-blk-vocab',
    ]);
  });
});
