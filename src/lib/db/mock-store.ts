import {
  Profile,
  Program,
  ProgramVersion,
  CurriculumMonth,
  CurriculumWeek,
  CurriculumDay,
  Lesson,
  LessonBlock,
  Asset,
  Enrollment,
  LessonProgress,
  BlockProgress,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  QuizAnswer,
  ImportJob,
  AuditLog,
} from '@/types/database';

class MockDataStore {
  profiles: Map<string, Profile> = new Map();
  programs: Map<string, Program> = new Map();
  programVersions: Map<string, ProgramVersion> = new Map();
  curriculumMonths: Map<string, CurriculumMonth> = new Map();
  curriculumWeeks: Map<string, CurriculumWeek> = new Map();
  curriculumDays: Map<string, CurriculumDay> = new Map();
  lessons: Map<string, Lesson> = new Map();
  lessonBlocks: Map<string, LessonBlock> = new Map();
  assets: Map<string, Asset> = new Map();
  enrollments: Map<string, Enrollment> = new Map();
  lessonProgress: Map<string, LessonProgress> = new Map(); // key: `${enrollment_id}_${lesson_id}`
  blockProgress: Map<string, BlockProgress> = new Map(); // key: `${enrollment_id}_${block_id}`
  quizzes: Map<string, Quiz> = new Map();
  quizQuestions: Map<string, QuizQuestion> = new Map();
  quizAttempts: Map<string, QuizAttempt> = new Map();
  quizAnswers: Map<string, QuizAnswer> = new Map();
  importJobs: Map<string, ImportJob> = new Map();
  auditLogs: AuditLog[] = [];

  constructor() {
    this.seedDemoData();
  }

  reset() {
    this.profiles.clear();
    this.programs.clear();
    this.programVersions.clear();
    this.curriculumMonths.clear();
    this.curriculumWeeks.clear();
    this.curriculumDays.clear();
    this.lessons.clear();
    this.lessonBlocks.clear();
    this.assets.clear();
    this.enrollments.clear();
    this.lessonProgress.clear();
    this.blockProgress.clear();
    this.quizzes.clear();
    this.quizQuestions.clear();
    this.quizAttempts.clear();
    this.quizAnswers.clear();
    this.importJobs.clear();
    this.auditLogs = [];
    this.seedDemoData();
  }

  seedDemoData() {
    // 1. Profiles
    const adminUser: Profile = {
      id: 'usr-admin-01',
      display_name: 'Admin Giảng Viên [DEMO]',
      age_group: 'adults',
      timezone: 'Asia/Ho_Chi_Minh',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const studentUser: Profile = {
      id: 'usr-student-01',
      display_name: 'Học Viên Nguyễn Văn A [DEMO]',
      age_group: 'adults',
      timezone: 'Asia/Ho_Chi_Minh',
      role: 'student',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.profiles.set(adminUser.id, adminUser);
    this.profiles.set(studentUser.id, studentUser);

    // 2. Program
    const program: Program = {
      id: 'prg-chinese-12m',
      slug: 'chinese-12-months',
      title: 'Lộ trình Tiếng Trung 12 Tháng [DEMO]',
      description: 'Chương trình tự học tiếng Trung 12 tháng từ vỡ lòng Pinyin đến HSK 4-5.',
      target_age_group: 'adults',
      status: 'published',
      created_at: '2026-01-01T00:00:00.000Z',
    };
    this.programs.set(program.id, program);

    // 3. Program Version v1.0.0 (Published)
    const version1: ProgramVersion = {
      id: 'ver-1-0-0',
      program_id: program.id,
      version_number: 'v1.0.0',
      status: 'published',
      published_at: '2026-01-01T00:00:00.000Z',
      source_url: 'https://judicious-crafter-764.notion.site/L-TR-NH-H-C-TI-NG-TRUNG-CHO-NG-I-M-I-B-T-U-129db0ebd82b4b5cb9c13a343a937567',
      content_checksum: 'demo-sha256-v1-0-0',
      created_at: '2026-01-01T00:00:00.000Z',
    };
    this.programVersions.set(version1.id, version1);

    // 4. Months
    const month1: CurriculumMonth = {
      id: 'month-01',
      program_version_id: version1.id,
      month_index: 1,
      title: 'Tháng 1: Nhập môn & Phát âm Pinyin [DEMO]',
      sort_order: 1,
    };
    const month2: CurriculumMonth = {
      id: 'month-02',
      program_version_id: version1.id,
      month_index: 2,
      title: 'Tháng 2: Từ vựng sinh hoạt & Cấu trúc cơ bản [DEMO]',
      sort_order: 2,
    };
    this.curriculumMonths.set(month1.id, month1);
    this.curriculumMonths.set(month2.id, month2);

    // 5. Weeks
    const week1: CurriculumWeek = {
      id: 'week-01',
      curriculum_month_id: month1.id,
      week_index: 1,
      title: 'Tuần 1: Thanh mẫu & Vận mẫu cơ bản [DEMO]',
      sort_order: 1,
    };
    const week2: CurriculumWeek = {
      id: 'week-02',
      curriculum_month_id: month1.id,
      week_index: 2,
      title: 'Tuần 2: 4 Thanh điệu & Biến điệu [DEMO]',
      sort_order: 2,
    };
    this.curriculumWeeks.set(week1.id, week1);
    this.curriculumWeeks.set(week2.id, week2);

    // 6. Days for Week 1
    const day1: CurriculumDay = {
      id: 'day-01',
      curriculum_week_id: week1.id,
      day_index: 1,
      day_type: 'learning',
      title: 'Ngày 1: Làm quen 6 Vận mẫu đơn và 4 Thanh điệu [DEMO]',
      estimated_minutes: 30,
      unlock_offset_days: 0,
      is_required: true,
      sort_order: 1,
    };
    const day2: CurriculumDay = {
      id: 'day-02',
      curriculum_week_id: week1.id,
      day_index: 2,
      day_type: 'learning',
      title: 'Ngày 2: Nhóm Thanh mẫu môi & đầu lưỡi (b, p, m, f, d, t, n, l) [DEMO]',
      estimated_minutes: 35,
      unlock_offset_days: 1,
      is_required: true,
      sort_order: 2,
    };
    const day3: CurriculumDay = {
      id: 'day-03',
      curriculum_week_id: week1.id,
      day_index: 3,
      day_type: 'learning',
      title: 'Ngày 3: Ghép vần cơ bản & Chào hỏi đầu tiên [DEMO]',
      estimated_minutes: 40,
      unlock_offset_days: 2,
      is_required: true,
      sort_order: 3,
    };
    const day4: CurriculumDay = {
      id: 'day-04',
      curriculum_week_id: week1.id,
      day_index: 4,
      day_type: 'rest',
      title: 'Ngày 4: Ngày nghỉ ngơi & Nghe thụ động [DEMO]',
      estimated_minutes: 15,
      unlock_offset_days: 3,
      is_required: false,
      sort_order: 4,
    };
    const day5: CurriculumDay = {
      id: 'day-05',
      curriculum_week_id: week1.id,
      day_index: 5,
      day_type: 'quiz',
      title: 'Ngày 5: Kiểm tra mốc Pinyin tuần 1 [DEMO]',
      estimated_minutes: 25,
      unlock_offset_days: 4,
      is_required: true,
      sort_order: 5,
    };

    this.curriculumDays.set(day1.id, day1);
    this.curriculumDays.set(day2.id, day2);
    this.curriculumDays.set(day3.id, day3);
    this.curriculumDays.set(day4.id, day4);
    this.curriculumDays.set(day5.id, day5);

    // 7. Assets (Google Drive)
    const assetAudio1: Asset = {
      id: 'asset-audio-01',
      provider: 'google_drive',
      drive_file_id: '1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sTuV',
      name: 'Audio Vận Mẫu Đơn Pinyin.mp3 [DEMO]',
      mime_type: 'audio/mpeg',
      web_view_link: 'https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sTuV/view?usp=sharing',
      resource_key: null,
      access_mode: 'anyone_with_link',
      status: 'verified',
      last_checked_at: new Date().toISOString(),
      source_url: 'https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sTuV/view',
      metadata_jsonb: {},
    };
    const assetPdf1: Asset = {
      id: 'asset-pdf-01',
      provider: 'google_drive',
      drive_file_id: '1xY2zA3bC4dE5fG6hI7jK8lM9nO0pQrS',
      name: 'Bang-Chu-Cai-Pinyin-Chuan.pdf [DEMO]',
      mime_type: 'application/pdf',
      web_view_link: 'https://drive.google.com/file/d/1xY2zA3bC4dE5fG6hI7jK8lM9nO0pQrS/view?usp=sharing',
      resource_key: null,
      access_mode: 'anyone_with_link',
      status: 'verified',
      last_checked_at: new Date().toISOString(),
      source_url: 'https://drive.google.com/file/d/1xY2zA3bC4dE5fG6hI7jK8lM9nO0pQrS/view',
      metadata_jsonb: {},
    };
    this.assets.set(assetAudio1.id, assetAudio1);
    this.assets.set(assetPdf1.id, assetPdf1);

    // 8. Lessons for Day 1
    const lesson1: Lesson = {
      id: 'les-01',
      curriculum_day_id: day1.id,
      title: 'Bài 1: Phát âm 6 Vận mẫu đơn (a, o, e, i, u, ü) [DEMO]',
      description: 'Nắm vững khẩu hình miệng, luồng hơi và vị trí lưỡi chuẩn cho 6 nguyên âm tiếng Trung.',
      sort_order: 1,
      estimated_minutes: 20,
      is_required: true,
    };
    this.lessons.set(lesson1.id, lesson1);

    // Blocks for Lesson 1
    const block1_1: LessonBlock = {
      id: 'blk-01-01',
      lesson_id: lesson1.id,
      type: 'rich_text',
      payload_jsonb: {
        content: `### 1. Tổng quan về Vận Mẫu Đơn [DEMO]
Tiếng Trung có 6 vận mẫu đơn cốt lõi: **a, o, e, i, u, ü**.
- **a**: Miệng mở rộng, lưỡi hạ thấp tự nhiên (giống âm 'a' trong tiếng Việt).
- **o**: Môi tròn, khẩu hình thu nhỏ vừa phải.
- **e**: Khẩu hình nửa mở, khóe miệng kéo nhẹ sang hai bên (hơi giống 'ơ'/'ưa' Việt Nam).
- **i**: Khóe miệng kéo dẹt sang hai bên như đang cười.
- **u**: Môi chúm tròn nhô ra phía trước.
- **ü**: Giữ khẩu hình tròn của âm 'u' nhưng phát âm 'i' (âm tròn môi).`,
      },
      sort_order: 1,
      is_required: true,
      estimated_minutes: 5,
    };

    const block1_2: LessonBlock = {
      id: 'blk-01-02',
      lesson_id: lesson1.id,
      type: 'audio',
      payload_jsonb: {
        asset_id: assetAudio1.id,
        title: 'File nghe phát âm 6 vận mẫu đơn [DEMO]',
        drive_url: assetAudio1.web_view_link,
      },
      sort_order: 2,
      is_required: true,
      estimated_minutes: 5,
    };

    const block1_3: LessonBlock = {
      id: 'blk-01-03',
      lesson_id: lesson1.id,
      type: 'vocabulary',
      payload_jsonb: {
        items: [
          {
            hanzi: '你好',
            pinyin: 'nǐ hǎo',
            meaning_vi: 'Xin chào',
            example: '你好！很高兴认识你。(Xin chào! Rất vui được quen bạn.)',
          },
          {
            hanzi: '谢谢',
            pinyin: 'xièxie',
            meaning_vi: 'Cảm ơn',
            example: '太谢谢你了！(Cảm ơn bạn rất nhiều!)',
          },
        ],
      },
      sort_order: 3,
      is_required: true,
      estimated_minutes: 5,
    };

    const block1_4: LessonBlock = {
      id: 'blk-01-04',
      lesson_id: lesson1.id,
      type: 'quiz',
      payload_jsonb: {
        title: 'Quiz nhanh kiểm tra vận mẫu [DEMO]',
      },
      sort_order: 4,
      is_required: true,
      estimated_minutes: 5,
    };

    this.lessonBlocks.set(block1_1.id, block1_1);
    this.lessonBlocks.set(block1_2.id, block1_2);
    this.lessonBlocks.set(block1_3.id, block1_3);
    this.lessonBlocks.set(block1_4.id, block1_4);

    // Quiz for Lesson 1
    const quiz1: Quiz = {
      id: 'quiz-01',
      lesson_id: lesson1.id,
      title: 'Kiểm tra nhận diện Vận Mẫu Đơn [DEMO]',
      passing_score: 80,
      attempt_limit: 5,
      status: 'active',
    };
    this.quizzes.set(quiz1.id, quiz1);

    const question1: QuizQuestion = {
      id: 'q-01-01',
      quiz_id: quiz1.id,
      type: 'single_choice',
      prompt_jsonb: {
        question: 'Vận mẫu "ü" trong tiếng Trung có khẩu hình miệng như thế nào?',
        options: [
          { id: 'opt-a', text: 'Mở rộng miệng tự nhiên như âm A' },
          { id: 'opt-b', text: 'Giữ khuôn môi tròn như âm U nhưng phát âm I' },
          { id: 'opt-c', text: 'Kéo dẹt môi sang hai bên như âm E' },
          { id: 'opt-d', text: 'Khép chặt hai môi' },
        ],
      },
      correct_answer_jsonb: 'opt-b', // SERVER-SIDE ONLY
      explanation_jsonb: {
        text: 'Âm "ü" là âm tròn môi: giữ môi tròn như phát âm "u", đẩy luồng hơi và vị trí lưỡi phát âm "i".',
      },
      points: 50,
      sort_order: 1,
    };

    const question2: QuizQuestion = {
      id: 'q-01-02',
      quiz_id: quiz1.id,
      type: 'single_choice',
      prompt_jsonb: {
        question: 'Vận mẫu đơn nào sau đây tương đương âm "a" trong tiếng Việt?',
        options: [
          { id: 'opt-2a', text: 'a' },
          { id: 'opt-2b', text: 'o' },
          { id: 'opt-2c', text: 'e' },
          { id: 'opt-2d', text: 'u' },
        ],
      },
      correct_answer_jsonb: 'opt-2a', // SERVER-SIDE ONLY
      explanation_jsonb: {
        text: 'Vận mẫu đơn "a" phát âm mở to miệng, lưỡi hạ thấp tự nhiên, tương đồng âm "a" tiếng Việt.',
      },
      points: 50,
      sort_order: 2,
    };

    this.quizQuestions.set(question1.id, question1);
    this.quizQuestions.set(question2.id, question2);

    // 9. Demo Student Enrollment
    const today = new Date().toISOString().slice(0, 10);
    const demoEnrollment: Enrollment = {
      id: 'enr-student-01',
      user_id: studentUser.id,
      program_version_id: version1.id,
      start_date: today, // started today
      timezone: 'Asia/Ho_Chi_Minh',
      status: 'active',
      target_minutes_per_day: 30,
      paused_at: null,
      pause_total_days: 0,
      created_at: new Date().toISOString(),
    };
    this.enrollments.set(demoEnrollment.id, demoEnrollment);
  }
}

// Global singleton for in-memory development & tests
const globalForMock = global as unknown as { mockDataStore?: MockDataStore };
export const mockStore = globalForMock.mockDataStore ?? new MockDataStore();
if (process.env.NODE_ENV !== 'production') globalForMock.mockDataStore = mockStore;
