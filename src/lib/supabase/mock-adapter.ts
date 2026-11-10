// ==============================================================================
// Chinese Learning Journey — In-Memory Mock Supabase Client Adapter
// File: src/lib/supabase/mock-adapter.ts
// Description: Full in-memory Supabase adapter adhering to @supabase/supabase-js
//              contract with pre-loaded realistic [DEMO] seed data matching seed.sql.
// ==============================================================================

import { Database } from '@/types/database';

type TableName = keyof Database['public']['Tables'];
type RowType<T extends TableName> = Database['public']['Tables'][T]['Row'];

// ------------------------------------------------------------------------------
// Realistic [DEMO] Seed Fixture
// ------------------------------------------------------------------------------
const DEMO_SEED: { [K in TableName]?: any[] } = {
  programs: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      slug: 'chinese-hsk-foundation',
      title: '[DEMO] Hành trình Chinh phục Tiếng Trung Toàn diện (HSK 1 - HSK 3)',
      description:
        '[DEMO] Chương trình học tiếng Trung từ số 0, chuẩn âm Bắc Kinh, bám sát khung HSK mới và giao tiếp thực chiến 365 ngày.',
      target_age_group: 'all',
      status: 'published',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  program_versions: [
    {
      id: '00000000-0000-0000-0000-000000000010',
      program_id: '00000000-0000-0000-0000-000000000001',
      version_number: 1,
      status: 'published',
      published_at: '2026-01-01T00:00:00.000Z',
      source_url: 'https://notion.so/chinese-curriculum-demo-staging',
      content_checksum: 'sha256-demo-v1-initial-seed-checksum',
      changelog: '[DEMO] Bản phát hành khởi tạo',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  curriculum_months: [
    {
      id: '00000000-0000-0000-0000-000000000100',
      program_version_id: '00000000-0000-0000-0000-000000000010',
      month_index: 1,
      title: '[DEMO] Tháng 1: Nhập môn & Bảng phiên âm Pinyin chuẩn',
      sort_order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  curriculum_weeks: [
    {
      id: '00000000-0000-0000-0000-000000001000',
      curriculum_month_id: '00000000-0000-0000-0000-000000000100',
      week_index: 1,
      title: '[DEMO] Tuần 1: Thanh mẫu, Vận mẫu & 4 Thanh điệu cơ bản',
      sort_order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  curriculum_days: [
    {
      id: '00000000-0000-0000-0000-000000010001',
      curriculum_week_id: '00000000-0000-0000-0000-000000001000',
      program_version_id: '00000000-0000-0000-0000-000000000010',
      day_index: 1,
      day_type: 'learning',
      title: '[DEMO] Ngày 1: Chào hỏi cơ bản (你好 - Xin chào)',
      estimated_minutes: 25,
      unlock_offset_days: 0,
      is_required: true,
      sort_order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-000000010002',
      curriculum_week_id: '00000000-0000-0000-0000-000000001000',
      program_version_id: '00000000-0000-0000-0000-000000000010',
      day_index: 2,
      day_type: 'learning',
      title: '[DEMO] Ngày 2: Cảm ơn & Tạm biệt (谢谢, 再见)',
      estimated_minutes: 20,
      unlock_offset_days: 1,
      is_required: true,
      sort_order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-000000010003',
      curriculum_week_id: '00000000-0000-0000-0000-000000001000',
      program_version_id: '00000000-0000-0000-0000-000000000010',
      day_index: 3,
      day_type: 'review',
      title: '[DEMO] Ngày 3: Ôn tập Thanh điệu & Nghe thụ động',
      estimated_minutes: 15,
      unlock_offset_days: 2,
      is_required: false,
      sort_order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-000000010007',
      curriculum_week_id: '00000000-0000-0000-0000-000000001000',
      program_version_id: '00000000-0000-0000-0000-000000000010',
      day_index: 7,
      day_type: 'checkpoint',
      title: '[DEMO] Ngày 7: Checkpoint Tuần 1 & Nghỉ ngơi tích cực',
      estimated_minutes: 30,
      unlock_offset_days: 6,
      is_required: true,
      sort_order: 7,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  lessons: [
    {
      id: '00000000-0000-0000-0000-000000100001',
      curriculum_day_id: '00000000-0000-0000-0000-000000010001',
      title: '[DEMO] Bài 1.1: Phát âm chuẩn Ni Hao (你好) & Biến điệu Thanh 3',
      description:
        '[DEMO] Khám phá lời chào phổ biến nhất thế giới bằng tiếng Trung, nắm vững 4 thanh điệu và quy tắc biến điệu hai thanh 3 đi liền nhau.',
      sort_order: 1,
      estimated_minutes: 25,
      is_required: true,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-000000100002',
      curriculum_day_id: '00000000-0000-0000-0000-000000010002',
      title: '[DEMO] Bài 2.1: Cách nói Cảm ơn và Đáp lại lịch thiệp',
      description:
        '[DEMO] Học cách biểu đạt lòng biết ơn qua 谢谢 (xièxie) và các mẫu câu phản hồi tự nhiên như 不客气 (bú kèqi).',
      sort_order: 1,
      estimated_minutes: 20,
      is_required: true,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-000000100003',
      curriculum_day_id: '00000000-0000-0000-0000-000000010003',
      title: '[DEMO] Bài 3.1: Luyện tai phản xạ & Nghe thanh điệu thụ động',
      description:
        '[DEMO] Buổi ôn tập củng cố nhận thức âm học, giúp não bộ quen với các cao độ thanh 1, 2, 3, 4 trong ngữ cảnh thực tế.',
      sort_order: 1,
      estimated_minutes: 15,
      is_required: false,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-000000100007',
      curriculum_day_id: '00000000-0000-0000-0000-000000010007',
      title: '[DEMO] Bài 7.1: Checkpoint Đánh giá Năng lực Tuần 1',
      description:
        '[DEMO] Bài kiểm tra tổng hợp tuần 1 và hướng dẫn nghỉ ngơi, phục hồi năng lượng học tập.',
      sort_order: 1,
      estimated_minutes: 30,
      is_required: true,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  lesson_blocks: [
    {
      id: '00000000-0000-0000-0000-0000000b0001',
      lesson_id: '00000000-0000-0000-0000-000000100001',
      type: 'rich_text',
      payload_jsonb: {
        title: 'Chào mừng bạn đến với tiếng Trung Quốc!',
        content_markdown:
          '### Lời chào đầu tiên: 你好 (Nǐ hǎo)\n\nTrong tiếng Trung, **你好** (nǐ hǎo) là câu chào phổ biến nhất.\n\n#### Quy tắc biến điệu quan trọng:\n`nǐ hǎo` -> phát âm thực tế là **`ní hǎo`**.',
      },
      sort_order: 1,
      is_required: true,
      estimated_minutes: 4,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-0000000b0002',
      lesson_id: '00000000-0000-0000-0000-000000100001',
      type: 'video',
      payload_jsonb: {
        title: '[DEMO] Video khẩu hình miệng & 4 thanh điệu tiếng Trung',
        asset_id: '00000000-0000-0000-0000-0000000a0001',
        embed_url: 'https://drive.google.com/file/d/demo-drive-video-pinyin-intro/preview',
      },
      sort_order: 2,
      is_required: true,
      estimated_minutes: 5,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-0000000b0003',
      lesson_id: '00000000-0000-0000-0000-000000100001',
      type: 'audio',
      payload_jsonb: {
        title: '[DEMO] Nghe phát âm chuẩn: 你好 (ní hǎo)',
        asset_id: '00000000-0000-0000-0000-0000000a0002',
        audio_url: 'https://drive.google.com/file/d/demo-drive-audio-nihao-pronounce/preview',
      },
      sort_order: 3,
      is_required: true,
      estimated_minutes: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-0000000b0004',
      lesson_id: '00000000-0000-0000-0000-000000100001',
      type: 'vocabulary',
      payload_jsonb: {
        title: 'Từ vựng cốt lõi Ngày 1',
        items: [
          { hanzi: '你好', pinyin: 'nǐ hǎo', meaning_vi: 'Xin chào' },
          { hanzi: '您好', pinyin: 'nín hǎo', meaning_vi: 'Chào ngài (kính ngữ)' },
          { hanzi: '你', pinyin: 'nǐ', meaning_vi: 'Bạn, anh, chị' },
          { hanzi: '好', pinyin: 'hǎo', meaning_vi: 'Tốt, khỏe' },
        ],
      },
      sort_order: 4,
      is_required: true,
      estimated_minutes: 5,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-0000000b0005',
      lesson_id: '00000000-0000-0000-0000-000000100001',
      type: 'flashcard_set',
      payload_jsonb: {
        title: 'Bộ Flashcard Ghi nhớ Nhanh',
        cards: [
          { id: 'card-1', front: '你好', pinyin: 'nǐ hǎo', back: 'Xin chào' },
          { id: 'card-2', front: '您好', pinyin: 'nín hǎo', back: 'Chào kính ngữ' },
        ],
      },
      sort_order: 5,
      is_required: true,
      estimated_minutes: 4,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-0000000b0006',
      lesson_id: '00000000-0000-0000-0000-000000100001',
      type: 'quiz',
      payload_jsonb: {
        title: 'Kiểm tra kiến thức: Chào hỏi & Thanh điệu',
        quiz_id: '00000000-0000-0000-0000-0000000c0001',
        passing_score: 80,
      },
      sort_order: 6,
      is_required: true,
      estimated_minutes: 5,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  assets: [
    {
      id: '00000000-0000-0000-0000-0000000a0001',
      provider: 'google_drive',
      drive_file_id: 'demo-drive-video-pinyin-intro',
      name: '[DEMO] Video Hướng dẫn Phát âm Pinyin & Thanh điệu',
      mime_type: 'video/mp4',
      web_view_link: 'https://drive.google.com/file/d/demo-drive-video-pinyin-intro/preview',
      access_mode: 'embed',
      status: 'valid',
      source_url: 'https://drive.google.com/file/d/demo-drive-video-pinyin-intro/view',
      metadata_jsonb: { duration_seconds: 180, resolution: '1080p', safe_preview: true },
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-0000000a0002',
      provider: 'google_drive',
      drive_file_id: 'demo-drive-audio-nihao-pronounce',
      name: '[DEMO] Audio Phát âm chuẩn: nǐ hǎo (thanh 3 + thanh 3)',
      mime_type: 'audio/mpeg',
      web_view_link: 'https://drive.google.com/file/d/demo-drive-audio-nihao-pronounce/preview',
      access_mode: 'embed',
      status: 'valid',
      source_url: 'https://drive.google.com/file/d/demo-drive-audio-nihao-pronounce/view',
      metadata_jsonb: { duration_seconds: 12, speaker: 'Bắc Kinh bản xứ' },
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  quizzes: [
    {
      id: '00000000-0000-0000-0000-0000000c0001',
      lesson_id: '00000000-0000-0000-0000-000000100001',
      title: '[DEMO] Bài kiểm tra Ngày 1: Nhận diện Thanh điệu & Chào hỏi',
      passing_score: 80,
      attempt_limit: 5,
      status: 'published',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  quiz_questions: [
    {
      id: '00000000-0000-0000-0000-0000000q0001',
      quiz_id: '00000000-0000-0000-0000-0000000c0001',
      type: 'single_choice',
      prompt_jsonb: {
        question: 'Khi hai thanh 3 đi liền nhau (ví dụ: 你 nǐ + 好 hǎo), từ thứ nhất sẽ được biến điệu thành thanh mấy?',
        options: [
          { id: 'thanh_1', text: 'Thanh 1' },
          { id: 'thanh_2', text: 'Thanh 2' },
          { id: 'thanh_4', text: 'Thanh 4' },
          { id: 'giu_nguyen', text: 'Giữ nguyên' },
        ],
      },
      correct_answer_jsonb: 'thanh_2',
      explanation_jsonb: { explanation: 'Quy tắc biến điệu: 3 + 3 -> 2 + 3 (nǐ hǎo -> ní hǎo).' },
      points: 10,
      sort_order: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-0000000q0002',
      quiz_id: '00000000-0000-0000-0000-0000000c0001',
      type: 'multiple_choice',
      prompt_jsonb: {
        question: 'Những cách chào hỏi nào sau đây là đúng và lịch thiệp?',
        options: [
          { id: 'ni_hao', text: '你好 (Nǐ hǎo)' },
          { id: 'nin_hao', text: '您好 (Nín hǎo)' },
          { id: 'zai_jian', text: '再见' },
        ],
      },
      correct_answer_jsonb: ['ni_hao', 'nin_hao'],
      explanation_jsonb: { explanation: '你好 là chào thông thường, 您好 là kính ngữ.' },
      points: 10,
      sort_order: 2,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: '00000000-0000-0000-0000-0000000q0003',
      quiz_id: '00000000-0000-0000-0000-0000000c0001',
      type: 'fill_blank',
      prompt_jsonb: {
        question: 'Điền phiên âm pinyin chính xác (kèm dấu thanh) cho chữ Hán: 好 (tốt, khỏe)',
      },
      correct_answer_jsonb: 'hǎo',
      explanation_jsonb: { explanation: 'Chữ 好 phát âm là hǎo.' },
      points: 10,
      sort_order: 3,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  profiles: [
    {
      id: 'usr-admin-demo',
      display_name: 'Admin Giảng Viên [DEMO]',
      age_group: 'adult',
      timezone: 'Asia/Ho_Chi_Minh',
      role: 'admin',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr-student-demo',
      display_name: 'Học Viên Demo [DEMO]',
      age_group: 'adult',
      timezone: 'Asia/Ho_Chi_Minh',
      role: 'student',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  enrollments: [
    {
      id: 'enr-student-demo-01',
      user_id: 'usr-student-demo',
      program_version_id: '00000000-0000-0000-0000-000000000010',
      start_date: '2026-01-01',
      timezone: 'Asia/Ho_Chi_Minh',
      status: 'active',
      paused_at: null,
      pause_total_days: 0,
      target_minutes_per_day: 25,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  ],
  lesson_progress: [],
  block_progress: [],
  quiz_attempts: [],
  quiz_answers: [],
  import_jobs: [],
  source_mappings: [],
  audit_logs: [],
  enrollment_schedule_adjustments: [],
  lesson_assets: [],
};

// ------------------------------------------------------------------------------
// In-Memory Storage
// ------------------------------------------------------------------------------
class MockDatabaseState {
  tables: Map<string, any[]> = new Map();

  constructor() {
    this.reset();
  }

  reset() {
    this.tables.clear();
    for (const [table, rows] of Object.entries(DEMO_SEED)) {
      this.tables.set(table, JSON.parse(JSON.stringify(rows)));
    }
  }

  getTable(table: string): any[] {
    if (!this.tables.has(table)) {
      this.tables.set(table, []);
    }
    return this.tables.get(table)!;
  }
}

export const mockState = new MockDatabaseState();

// ------------------------------------------------------------------------------
// Fluent Query Builder
// ------------------------------------------------------------------------------
export class MockQueryBuilder<T = any> {
  private tableName: string;
  private filters: Array<(row: any) => boolean> = [];
  private orderField?: string;
  private orderAscending = true;
  private limitCount?: number;
  private isSingle = false;
  private isMaybeSingle = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(_columns = '*'): this {
    return this;
  }

  eq(column: string, value: any): this {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  neq(column: string, value: any): this {
    this.filters.push((row) => row[column] !== value);
    return this;
  }

  in(column: string, values: any[]): this {
    this.filters.push((row) => values.includes(row[column]));
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}): this {
    this.orderField = column;
    this.orderAscending = options.ascending ?? true;
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  single(): Promise<{ data: T | null; error: any }> {
    this.isSingle = true;
    return this.execute() as any;
  }

  maybeSingle(): Promise<{ data: T | null; error: any }> {
    this.isMaybeSingle = true;
    return this.execute() as any;
  }

  async insert(values: any | any[]): Promise<{ data: T | null; error: any }> {
    const table = mockState.getTable(this.tableName);
    const toInsert = Array.isArray(values) ? values : [values];
    const created: any[] = [];

    for (const val of toInsert) {
      const row = {
        id: val.id || `mock-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        created_at: val.created_at || new Date().toISOString(),
        updated_at: val.updated_at || new Date().toISOString(),
        ...val,
      };
      table.push(row);
      created.push(row);
    }

    const result = Array.isArray(values) ? created : created[0];
    return { data: result, error: null };
  }

  async upsert(values: any | any[]): Promise<{ data: T | null; error: any }> {
    const table = mockState.getTable(this.tableName);
    const toUpsert = Array.isArray(values) ? values : [values];
    const results: any[] = [];

    for (const val of toUpsert) {
      const idx = table.findIndex((r) => r.id === val.id);
      if (idx >= 0) {
        table[idx] = { ...table[idx], ...val, updated_at: new Date().toISOString() };
        results.push(table[idx]);
      } else {
        const row = {
          id: val.id || `mock-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          created_at: val.created_at || new Date().toISOString(),
          updated_at: val.updated_at || new Date().toISOString(),
          ...val,
        };
        table.push(row);
        results.push(row);
      }
    }

    return { data: Array.isArray(values) ? results : results[0], error: null };
  }

  async update(values: any): Promise<{ data: T | null; error: any }> {
    const table = mockState.getTable(this.tableName);
    let matched: any[] = [];

    for (let i = 0; i < table.length; i++) {
      if (this.filters.every((fn) => fn(table[i]))) {
        table[i] = { ...table[i], ...values, updated_at: new Date().toISOString() };
        matched.push(table[i]);
      }
    }

    return { data: matched as any, error: null };
  }

  async delete(): Promise<{ data: T | null; error: any }> {
    const table = mockState.getTable(this.tableName);
    const remaining: any[] = [];
    const removed: any[] = [];

    for (const row of table) {
      if (this.filters.every((fn) => fn(row))) {
        removed.push(row);
      } else {
        remaining.push(row);
      }
    }

    mockState.tables.set(this.tableName, remaining);
    return { data: removed as any, error: null };
  }

  private async execute(): Promise<{ data: any; error: any }> {
    let rows = mockState.getTable(this.tableName);

    // Apply filters
    for (const filter of this.filters) {
      rows = rows.filter(filter);
    }

    // Apply order
    if (this.orderField) {
      rows = [...rows].sort((a, b) => {
        const valA = a[this.orderField!];
        const valB = b[this.orderField!];
        if (valA < valB) return this.orderAscending ? -1 : 1;
        if (valA > valB) return this.orderAscending ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    if (this.limitCount !== undefined) {
      rows = rows.slice(0, this.limitCount);
    }

    if (this.isSingle) {
      if (rows.length === 0) {
        return { data: null, error: { message: 'Row not found', code: 'PGRST116' } };
      }
      return { data: rows[0], error: null };
    }

    if (this.isMaybeSingle) {
      return { data: rows.length > 0 ? rows[0] : null, error: null };
    }

    return { data: rows, error: null };
  }

  // Promise-like resolution when awaiting query builder directly
  then(onfulfilled?: (value: { data: T[]; error: any }) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled as any, onrejected);
  }
}

// ------------------------------------------------------------------------------
// Mock Supabase Client Class
// ------------------------------------------------------------------------------
export class MockSupabaseClient {
  auth = {
    async getUser() {
      return {
        data: {
          user: {
            id: 'usr-student-demo',
            email: 'student@demo.example.com',
            user_metadata: {
              display_name: 'Học Viên Demo [DEMO]',
              role: 'student',
            },
          },
        },
        error: null,
      };
    },
    async getSession() {
      return {
        data: {
          session: {
            access_token: 'mock-access-token',
            user: {
              id: 'usr-student-demo',
              email: 'student@demo.example.com',
            },
          },
        },
        error: null,
      };
    },
    async signInWithPassword({ email }: { email: string; password?: string }) {
      const role = email.includes('admin') ? 'admin' : 'student';
      const userId = role === 'admin' ? 'usr-admin-demo' : 'usr-student-demo';
      return {
        data: {
          user: {
            id: userId,
            email,
            user_metadata: { role },
          },
          session: { access_token: `mock-token-${role}` },
        },
        error: null,
      };
    },
    async signOut() {
      return { error: null };
    },
    async signUp({ email, options }: any) {
      const userId = `usr-${Date.now()}`;
      return {
        data: {
          user: {
            id: userId,
            email,
            user_metadata: options?.data || {},
          },
          session: null,
        },
        error: null,
      };
    },
  };

  from<T extends TableName>(table: T): MockQueryBuilder<RowType<T>> {
    return new MockQueryBuilder<RowType<T>>(table);
  }

  async rpc(functionName: string, args: Record<string, any> = {}) {
    if (functionName === 'is_admin') {
      return { data: true, error: null };
    }
    if (functionName === 'is_day_unlocked') {
      return { data: true, error: null };
    }
    if (functionName === 'submit_quiz_attempt') {
      return {
        data: {
          attempt_id: `att-mock-${Date.now()}`,
          score: 100,
          passed: true,
          passing_score: 80,
        },
        error: null,
      };
    }
    return { data: null, error: { message: `Mock RPC function ${functionName} not implemented` } };
  }
}

/**
 * Creates or retrieves the singleton mock Supabase client.
 */
export function createMockSupabaseClient() {
  return new MockSupabaseClient();
}

/**
 * Admin client variant with elevated permissions.
 */
export function createMockSupabaseAdminClient() {
  const client = new MockSupabaseClient();
  client.auth.getUser = async () => ({
    data: {
      user: {
        id: 'usr-admin-demo',
        email: 'admin@demo.example.com',
        user_metadata: { display_name: 'Admin Giảng Viên [DEMO]', role: 'admin' },
      },
    },
    error: null,
  });
  return client;
}
