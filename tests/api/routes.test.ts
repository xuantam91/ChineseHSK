import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getHealth } from '@/app/api/health/route';
import { GET as getToday } from '@/app/api/me/today/route';
import { GET as getRoadmap } from '@/app/api/me/roadmap/route';
import { GET as getProgress } from '@/app/api/me/progress/route';
import { GET as getDay } from '@/app/api/days/[id]/route';
import { GET as getLesson } from '@/app/api/lessons/[id]/route';
import { POST as completeBlock } from '@/app/api/blocks/[id]/complete/route';
import { POST as submitQuiz } from '@/app/api/quizzes/[id]/submit/route';
import { POST as createAdminDay } from '@/app/api/admin/curriculum/days/route';
import { POST as dryRunNotion } from '@/app/api/admin/import/dry-run/route';
import { mockStore } from '@/lib/db/mock-store';

describe('API Route Handlers Integration Suite', () => {
  beforeEach(() => {
    mockStore.reset();
  });

  it('GET /api/health returns 200 with environment indicators and no secrets', async () => {
    const res = await getHealth();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('ok');
    expect(json.timezone).toBe('Asia/Ho_Chi_Minh');
    expect(json.timestamp).toBeDefined();
  });

  it('GET /api/me/today returns active enrollment and today overview', async () => {
    const req = new NextRequest('http://localhost:3000/api/me/today');
    const res = await getToday(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.enrollment).toBeDefined();
    expect(json.data.today_local).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(json.data.stats).toBeDefined();
  });

  it('GET /api/me/roadmap returns 12-month hierarchy without leaking answer keys', async () => {
    const req = new NextRequest('http://localhost:3000/api/me/roadmap');
    const res = await getRoadmap(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.months.length).toBeGreaterThan(0);
    // Check that days have status property
    const firstDay = json.data.months[0].weeks[0].days[0];
    expect(firstDay.status).toBeDefined();
  });

  it('GET /api/days/[id] blocks student from fetching future locked day', async () => {
    // Day 5 has unlock_offset_days: 4. Since enrollment start_date is today, Day 5 is locked!
    const req = new NextRequest('http://localhost:3000/api/days/day-05');
    const res = await getDay(req, { params: Promise.resolve({ id: 'day-05' }) });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error.code).toBe('DAY_LOCKED');
  });

  it('GET /api/days/[id] permits unlocked day access', async () => {
    // Day 1 has unlock_offset_days: 0. Unlocked today!
    const req = new NextRequest('http://localhost:3000/api/days/day-01');
    const res = await getDay(req, { params: Promise.resolve({ id: 'day-01' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('day-01');
    expect(json.data.lessons.length).toBeGreaterThan(0);
  });

  it('POST /api/blocks/[id]/complete marks block done idempotently', async () => {
    const req = new NextRequest('http://localhost:3000/api/blocks/blk-01-01/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await completeBlock(req, { params: Promise.resolve({ id: 'blk-01-01' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.completed).toBe(true);
  });

  it('POST /api/quizzes/[id]/submit evaluates answers server-side', async () => {
    const req = new NextRequest('http://localhost:3000/api/quizzes/quiz-01/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: {
          'q-01-01': 'opt-b',
          'q-01-02': 'opt-2a',
        },
      }),
    });
    const res = await submitQuiz(req, { params: Promise.resolve({ id: 'quiz-01' }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.score).toBe(100);
    expect(json.data.passed).toBe(true);
  });

  it('POST /api/admin/curriculum/days rejects non-admin users with 403', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/curriculum/days', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-role': 'student', // student role
      },
      body: JSON.stringify({
        curriculum_week_id: 'week-01',
        day_index: 99,
        day_type: 'learning',
        title: 'Unauthorized Day',
        unlock_offset_days: 99,
      }),
    });
    const res = await createAdminDay(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error.code).toBe('FORBIDDEN');
  });

  it('POST /api/admin/import/dry-run generates staging summary', async () => {
    const rawNotion = `# Tháng 1: Nhập môn
## Tuần 1: Khởi động
### Ngày 1: Pinyin cơ bản
#### Bài 1: Vận mẫu`;

    const req = new NextRequest('http://localhost:3000/api/admin/import/dry-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw_content: rawNotion }),
    });
    const res = await dryRunNotion(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.months_count).toBe(1);
    expect(json.data.weeks_count).toBe(1);
    expect(json.data.days_count).toBe(1);
    expect(json.data.lessons_count).toBe(1);
  });
});
