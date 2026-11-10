-- ==============================================================================
-- Chinese Learning Journey — Seed Data
-- File: supabase/seed.sql
-- Description: Realistic DEMO curriculum for Month 1 (Week 1, Days 1, 2, 3, 7)
-- All demo records are explicitly labeled with [DEMO] as required by Project Principles.
-- ==============================================================================

-- 1. DEMO PROGRAM
INSERT INTO public.programs (
  id,
  slug,
  title,
  description,
  target_age_group,
  status,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'chinese-hsk-foundation',
  '[DEMO] Hành trình Chinh phục Tiếng Trung Toàn diện (HSK 1 - HSK 3)',
  '[DEMO] Chương trình học tiếng Trung từ số 0, chuẩn âm Bắc Kinh, bám sát khung HSK mới và giao tiếp thực chiến 365 ngày.',
  'all',
  'published',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 2. DEMO PROGRAM VERSION 1 (Published)
INSERT INTO public.program_versions (
  id,
  program_id,
  version_number,
  status,
  published_at,
  source_url,
  content_checksum,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  1,
  'published',
  now(),
  'https://notion.so/chinese-curriculum-demo-staging',
  'sha256-demo-v1-initial-seed-checksum',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 3. DEMO CURRICULUM MONTH 1
INSERT INTO public.curriculum_months (
  id,
  program_version_id,
  month_index,
  title,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000100',
  '00000000-0000-0000-0000-000000000010',
  1,
  '[DEMO] Tháng 1: Nhập môn & Bảng phiên âm Pinyin chuẩn',
  1,
  now()
) ON CONFLICT (id) DO NOTHING;

-- 4. DEMO CURRICULUM WEEK 1
INSERT INTO public.curriculum_weeks (
  id,
  curriculum_month_id,
  week_index,
  title,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000001000',
  '00000000-0000-0000-0000-000000000100',
  1,
  '[DEMO] Tuần 1: Thanh mẫu, Vận mẫu & 4 Thanh điệu cơ bản',
  1,
  now()
) ON CONFLICT (id) DO NOTHING;

-- 5. DEMO CURRICULUM DAYS
-- Day 1 (Learning, offset 0 days)
INSERT INTO public.curriculum_days (
  id,
  curriculum_week_id,
  program_version_id,
  day_index,
  day_type,
  title,
  estimated_minutes,
  unlock_offset_days,
  is_required,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000010001',
  '00000000-0000-0000-0000-000000001000',
  '00000000-0000-0000-0000-000000000010',
  1,
  'learning',
  '[DEMO] Ngày 1: Chào hỏi cơ bản (你好 - Xin chào)',
  25,
  0,
  true,
  1,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Day 2 (Learning, offset 1 day)
INSERT INTO public.curriculum_days (
  id,
  curriculum_week_id,
  program_version_id,
  day_index,
  day_type,
  title,
  estimated_minutes,
  unlock_offset_days,
  is_required,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000010002',
  '00000000-0000-0000-0000-000000001000',
  '00000000-0000-0000-0000-000000000010',
  2,
  'learning',
  '[DEMO] Ngày 2: Cảm ơn & Tạm biệt (谢谢, 再见)',
  20,
  1,
  true,
  2,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Day 3 (Review, offset 2 days)
INSERT INTO public.curriculum_days (
  id,
  curriculum_week_id,
  program_version_id,
  day_index,
  day_type,
  title,
  estimated_minutes,
  unlock_offset_days,
  is_required,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000010003',
  '00000000-0000-0000-0000-000000001000',
  '00000000-0000-0000-0000-000000000010',
  3,
  'review',
  '[DEMO] Ngày 3: Ôn tập Thanh điệu & Nghe thụ động',
  15,
  2,
  false,
  3,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Day 7 (Checkpoint & Rest, offset 6 days)
INSERT INTO public.curriculum_days (
  id,
  curriculum_week_id,
  program_version_id,
  day_index,
  day_type,
  title,
  estimated_minutes,
  unlock_offset_days,
  is_required,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000010007',
  '00000000-0000-0000-0000-000000001000',
  '00000000-0000-0000-0000-000000000010',
  7,
  'checkpoint',
  '[DEMO] Ngày 7: Checkpoint Tuần 1 & Nghỉ ngơi tích cực',
  30,
  6,
  true,
  7,
  now()
) ON CONFLICT (id) DO NOTHING;

-- 6. DEMO LESSONS
-- Lesson 1.1 (Day 1)
INSERT INTO public.lessons (
  id,
  curriculum_day_id,
  title,
  description,
  sort_order,
  estimated_minutes,
  is_required,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000100001',
  '00000000-0000-0000-0000-000000010001',
  '[DEMO] Bài 1.1: Phát âm chuẩn Ni Hao (你好) & Biến điệu Thanh 3',
  '[DEMO] Khám phá lời chào phổ biến nhất thế giới bằng tiếng Trung, nắm vững 4 thanh điệu và quy tắc biến điệu hai thanh 3 đi liền nhau.',
  1,
  25,
  true,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 2.1 (Day 2)
INSERT INTO public.lessons (
  id,
  curriculum_day_id,
  title,
  description,
  sort_order,
  estimated_minutes,
  is_required,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000100002',
  '00000000-0000-0000-0000-000000010002',
  '[DEMO] Bài 2.1: Cách nói Cảm ơn và Đáp lại lịch thiệp',
  '[DEMO] Học cách biểu đạt lòng biết ơn qua 谢谢 (xièxie) và các mẫu câu phản hồi tự nhiên như 不客气 (bú kèqi).',
  1,
  20,
  true,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 3.1 (Day 3)
INSERT INTO public.lessons (
  id,
  curriculum_day_id,
  title,
  description,
  sort_order,
  estimated_minutes,
  is_required,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000100003',
  '00000000-0000-0000-0000-000000010003',
  '[DEMO] Bài 3.1: Luyện tai phản xạ & Nghe thanh điệu thụ động',
  '[DEMO] Buổi ôn tập củng cố nhận thức âm học, giúp não bộ quen với các cao độ thanh 1, 2, 3, 4 trong ngữ cảnh thực tế.',
  1,
  15,
  false,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 7.1 (Day 7)
INSERT INTO public.lessons (
  id,
  curriculum_day_id,
  title,
  description,
  sort_order,
  estimated_minutes,
  is_required,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000100007',
  '00000000-0000-0000-0000-000000010007',
  '[DEMO] Bài 7.1: Checkpoint Đánh giá Năng lực Tuần 1',
  '[DEMO] Bài kiểm tra tổng hợp tuần 1 và hướng dẫn nghỉ ngơi, phục hồi năng lượng học tập.',
  1,
  30,
  true,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 7. DEMO ASSETS (Safe External & Google Drive references)
INSERT INTO public.assets (
  id,
  provider,
  drive_file_id,
  name,
  mime_type,
  web_view_link,
  resource_key,
  access_mode,
  status,
  last_checked_at,
  source_url,
  metadata_jsonb,
  created_at,
  updated_at
) VALUES
(
  '00000000-0000-0000-0000-0000000a0001',
  'google_drive',
  'demo-drive-video-pinyin-intro',
  '[DEMO] Video Hướng dẫn Phát âm Pinyin & Thanh điệu',
  'video/mp4',
  'https://drive.google.com/file/d/demo-drive-video-pinyin-intro/preview',
  NULL,
  'embed',
  'valid',
  now(),
  'https://drive.google.com/file/d/demo-drive-video-pinyin-intro/view',
  '{"duration_seconds": 180, "resolution": "1080p", "safe_preview": true}'::jsonb,
  now(),
  now()
),
(
  '00000000-0000-0000-0000-0000000a0002',
  'google_drive',
  'demo-drive-audio-nihao-pronounce',
  '[DEMO] Audio Phát âm chuẩn: nǐ hǎo (thanh 3 + thanh 3)',
  'audio/mpeg',
  'https://drive.google.com/file/d/demo-drive-audio-nihao-pronounce/preview',
  NULL,
  'embed',
  'valid',
  now(),
  'https://drive.google.com/file/d/demo-drive-audio-nihao-pronounce/view',
  '{"duration_seconds": 12, "sample_rate": 44100, "speaker": "Bắc Kinh bản xứ"}'::jsonb,
  now(),
  now()
),
(
  '00000000-0000-0000-0000-0000000a0003',
  'google_drive',
  'demo-drive-pdf-cheatsheet-pinyin',
  '[DEMO] Bảng tra cứu Thanh mẫu & Vận mẫu Pinyin (PDF)',
  'application/pdf',
  'https://drive.google.com/file/d/demo-drive-pdf-cheatsheet-pinyin/preview',
  NULL,
  'fallback_link',
  'valid',
  now(),
  'https://drive.google.com/file/d/demo-drive-pdf-cheatsheet-pinyin/view',
  '{"pages": 2, "file_size_kb": 340}'::jsonb,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 8. DEMO LESSON BLOCKS (Day 1 - Lesson 1.1)
INSERT INTO public.lesson_blocks (
  id,
  lesson_id,
  type,
  payload_jsonb,
  sort_order,
  is_required,
  estimated_minutes,
  created_at
) VALUES
-- Block 1: Rich Text Introduction
(
  '00000000-0000-0000-0000-0000000b0001',
  '00000000-0000-0000-0000-000000100001',
  'rich_text',
  '{
    "title": "Chào mừng bạn đến với tiếng Trung Quốc!",
    "content_markdown": "### Lời chào đầu tiên: 你好 (Nǐ hǎo)\n\nTrong tiếng Trung, **你好** (nǐ hǎo) là câu chào phổ biến nhất, tương đương với *Hello* trong tiếng Anh hay *Xin chào* trong tiếng Việt.\n\n#### Cấu tạo chữ Hán:\n- **你 (nǐ)**: Bạn, anh, chị (đại từ nhân xưng ngôi thứ 2)\n- **好 (hǎo)**: Tốt, lành, khỏe mạnh, đẹp đẽ\n\n#### Quy tắc biến điệu quan trọng:\nKhi hai âm tiết mang **thanh 3** đi liền nhau (nǐ + hǎo), âm tiết thứ nhất sẽ chuyển cách đọc thành **thanh 2**:\n> `nǐ hǎo` -> phát âm thực tế là **`ní hǎo`**."
  }'::jsonb,
  1,
  true,
  4,
  now()
),
-- Block 2: Video Asset
(
  '00000000-0000-0000-0000-0000000b0002',
  '00000000-0000-0000-0000-000000100001',
  'video',
  '{
    "title": "[DEMO] Video khẩu hình miệng & 4 thanh điệu tiếng Trung",
    "asset_id": "00000000-0000-0000-0000-0000000a0001",
    "embed_url": "https://drive.google.com/file/d/demo-drive-video-pinyin-intro/preview",
    "caption": "Theo dõi chuyển động môi và độ rung thanh quản của giáo viên bản xứ."
  }'::jsonb,
  2,
  true,
  5,
  now()
),
-- Block 3: Audio Pronunciation
(
  '00000000-0000-0000-0000-0000000b0003',
  '00000000-0000-0000-0000-000000100001',
  'audio',
  '{
    "title": "[DEMO] Nghe phát âm chuẩn: 你好 (ní hǎo)",
    "asset_id": "00000000-0000-0000-0000-0000000a0002",
    "audio_url": "https://drive.google.com/file/d/demo-drive-audio-nihao-pronounce/preview",
    "speaker": "Giọng chuẩn Bắc Kinh",
    "repeat_recommended": 3
  }'::jsonb,
  3,
  true,
  3,
  now()
),
-- Block 4: Vocabulary Block
(
  '00000000-0000-0000-0000-0000000b0004',
  '00000000-0000-0000-0000-000000100001',
  'vocabulary',
  '{
    "title": "Từ vựng cốt lõi Ngày 1",
    "items": [
      {
        "hanzi": "你好",
        "pinyin": "nǐ hǎo",
        "meaning_vi": "Xin chào (thông dụng)",
        "tone_breakdown": "3 + 3 -> đọc thành 2 + 3",
        "example_sentence": "你好！很高兴认识你。(Nǐ hǎo! Hěn gāoxìng rènshí nǐ.)"
      },
      {
        "hanzi": "您好",
        "pinyin": "nín hǎo",
        "meaning_vi": "Chào ngài / Chào thầy cô (kính ngữ trang trọng)",
        "tone_breakdown": "2 + 3",
        "example_sentence": "老师，您好！(Lǎoshī, nín hǎo!)"
      },
      {
        "hanzi": "你",
        "pinyin": "nǐ",
        "meaning_vi": "Bạn, anh, chị (ngôi thứ 2)",
        "tone_breakdown": "Thanh 3 (trầm xuống rồi lên)"
      },
      {
        "hanzi": "好",
        "pinyin": "hǎo",
        "meaning_vi": "Tốt, đẹp, khỏe, được",
        "tone_breakdown": "Thanh 3"
      }
    ]
  }'::jsonb,
  4,
  true,
  5,
  now()
),
-- Block 5: Flashcard Set Block
(
  '00000000-0000-0000-0000-0000000b0005',
  '00000000-0000-0000-0000-000000100001',
  'flashcard_set',
  '{
    "title": "Bộ Flashcard Ghi nhớ Nhanh",
    "cards": [
      {
        "id": "card-1",
        "front": "你好",
        "pinyin": "nǐ hǎo",
        "back": "Xin chào",
        "note": "Biến điệu thanh 3: đọc là ní hǎo"
      },
      {
        "id": "card-2",
        "front": "您好",
        "pinyin": "nín hǎo",
        "back": "Chào ngài / Chào bạn (kính ngữ)",
        "note": "Dùng cho người lớn tuổi, khách sáo, cấp trên"
      },
      {
        "id": "card-3",
        "front": "好",
        "pinyin": "hǎo",
        "back": "Tốt, khỏe, hoàn hảo",
        "note": "Rất phổ biến trong khẩu ngữ"
      }
    ]
  }'::jsonb,
  5,
  true,
  4,
  now()
),
-- Block 6: Quiz Block
(
  '00000000-0000-0000-0000-0000000b0006',
  '00000000-0000-0000-0000-000000100001',
  'quiz',
  '{
    "title": "Kiểm tra kiến thức: Chào hỏi & Thanh điệu",
    "quiz_id": "00000000-0000-0000-0000-0000000c0001",
    "passing_score": 80,
    "questions_count": 3
  }'::jsonb,
  6,
  true,
  5,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Associate Assets with Lesson Blocks
INSERT INTO public.lesson_assets (id, lesson_block_id, asset_id, sort_order, created_at)
VALUES
(
  '00000000-0000-0000-0000-0000000d0001',
  '00000000-0000-0000-0000-0000000b0002',
  '00000000-0000-0000-0000-0000000a0001',
  1,
  now()
),
(
  '00000000-0000-0000-0000-0000000d0002',
  '00000000-0000-0000-0000-0000000b0003',
  '00000000-0000-0000-0000-0000000a0002',
  1,
  now()
) ON CONFLICT (id) DO NOTHING;

-- 9. DEMO LESSON BLOCKS (Day 2 - Lesson 2.1)
INSERT INTO public.lesson_blocks (
  id,
  lesson_id,
  type,
  payload_jsonb,
  sort_order,
  is_required,
  estimated_minutes,
  created_at
) VALUES
(
  '00000000-0000-0000-0000-0000000b0021',
  '00000000-0000-0000-0000-000000100002',
  'rich_text',
  '{
    "title": "Nói lời Cảm ơn: 谢谢 (Xièxie)",
    "content_markdown": "Khi nhận được sự giúp đỡ, hãy nói **谢谢** (xièxie).\n\nĐáp lại một cách khiêm tốn:\n- **不客气 (bú kèqi)**: Đừng khách sáo / Không có gì.\n\nKhi chia tay nhau ra về:\n- **再见 (zàijiàn)**: Hẹn gặp lại / Tạm biệt (Tái kiến)."
  }'::jsonb,
  1,
  true,
  5,
  now()
),
(
  '00000000-0000-0000-0000-0000000b0022',
  '00000000-0000-0000-0000-000000100002',
  'vocabulary',
  '{
    "title": "Từ vựng Ngày 2",
    "items": [
      { "hanzi": "谢谢", "pinyin": "xièxie", "meaning_vi": "Cảm ơn (thanh 4 + thanh nhẹ)" },
      { "hanzi": "不客气", "pinyin": "bú kèqi", "meaning_vi": "Không có chi / Đừng khách sáo" },
      { "hanzi": "再见", "pinyin": "zàijiàn", "meaning_vi": "Tạm biệt / Hẹn gặp lại" }
    ]
  }'::jsonb,
  2,
  true,
  5,
  now()
),
(
  '00000000-0000-0000-0000-0000000b0023',
  '00000000-0000-0000-0000-000000100002',
  'quiz',
  '{
    "title": "Luyện tập Ngày 2: Cảm ơn & Tạm biệt",
    "quiz_id": "00000000-0000-0000-0000-0000000c0002",
    "passing_score": 80,
    "questions_count": 2
  }'::jsonb,
  3,
  true,
  5,
  now()
) ON CONFLICT (id) DO NOTHING;

-- 10. DEMO QUIZZES & QUESTIONS
-- Quiz 1 (Day 1)
INSERT INTO public.quizzes (
  id,
  lesson_id,
  title,
  passing_score,
  attempt_limit,
  status,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-0000000c0001',
  '00000000-0000-0000-0000-000000100001',
  '[DEMO] Bài kiểm tra Ngày 1: Nhận diện Thanh điệu & Chào hỏi',
  80,
  5,
  'published',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Quiz 1 Question 1: single_choice
INSERT INTO public.quiz_questions (
  id,
  quiz_id,
  type,
  prompt_jsonb,
  correct_answer_jsonb,
  explanation_jsonb,
  points,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-0000000q0001',
  '00000000-0000-0000-0000-0000000c0001',
  'single_choice',
  '{
    "question": "Khi hai thanh 3 đi liền nhau (ví dụ: 你 nǐ + 好 hǎo), từ thứ nhất sẽ được biến điệu thành thanh mấy?",
    "options": [
      { "id": "thanh_1", "text": "Thanh 1 (âm bổng, ngang bằng)" },
      { "id": "thanh_2", "text": "Thanh 2 (âm đi lên, dấu sắc)" },
      { "id": "thanh_4", "text": "Thanh 4 (âm dứt khoát từ cao rơi xuống)" },
      { "id": "giu_nguyen", "text": "Giữ nguyên không thay đổi" }
    ]
  }'::jsonb,
  '"thanh_2"'::jsonb,
  '{
    "explanation": "Quy tắc biến điệu: 3 + 3 -> 2 + 3. Do đó nǐ hǎo được phát âm thực tế thành ní hǎo để tạo sự liền mạch dễ phát âm."
  }'::jsonb,
  10,
  1,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Quiz 1 Question 2: multiple_choice
INSERT INTO public.quiz_questions (
  id,
  quiz_id,
  type,
  prompt_jsonb,
  correct_answer_jsonb,
  explanation_jsonb,
  points,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-0000000q0002',
  '00000000-0000-0000-0000-0000000c0001',
  'multiple_choice',
  '{
    "question": "Những cách chào hỏi nào sau đây là đúng và lịch thiệp trong giao tiếp tiếng Trung? (Chọn tất cả các đáp án đúng)",
    "options": [
      { "id": "ni_hao", "text": "你好 (Nǐ hǎo - Chào thông dụng)" },
      { "id": "nin_hao", "text": "您好 (Nín hǎo - Chào kính ngữ dành cho người lớn tuổi, cấp trên)" },
      { "id": "zaijian_chao", "text": "再见 (Dùng để chào khi mới gặp lần đầu)" },
      { "id": "xie_xie", "text": "谢谢 (Dùng để thay cho lời chào)" }
    ]
  }'::jsonb,
  '["ni_hao", "nin_hao"]'::jsonb,
  '{
    "explanation": "你好 là lời chào phổ thông; 您好 là kính ngữ trang trọng. 再见 mang nghĩa tạm biệt và 谢谢 mang nghĩa cảm ơn."
  }'::jsonb,
  10,
  2,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Quiz 1 Question 3: fill_blank
INSERT INTO public.quiz_questions (
  id,
  quiz_id,
  type,
  prompt_jsonb,
  correct_answer_jsonb,
  explanation_jsonb,
  points,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-0000000q0003',
  '00000000-0000-0000-0000-0000000c0001',
  'fill_blank',
  '{
    "question": "Điền phiên âm pinyin chính xác (kèm dấu thanh) cho chữ Hán: 好 (nghĩa là tốt, khỏe)",
    "placeholder": "Nhập pinyin..."
  }'::jsonb,
  '"hǎo"'::jsonb,
  '{
    "explanation": "Chữ 好 mang phiên âm pinyin là hǎo (thanh 3)."
  }'::jsonb,
  10,
  3,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Quiz 2 (Day 2)
INSERT INTO public.quizzes (
  id,
  lesson_id,
  title,
  passing_score,
  attempt_limit,
  status,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-0000000c0002',
  '00000000-0000-0000-0000-000000100002',
  '[DEMO] Bài kiểm tra Ngày 2: Cảm ơn & Lịch sự giao tiếp',
  80,
  5,
  'published',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (
  id,
  quiz_id,
  type,
  prompt_jsonb,
  correct_answer_jsonb,
  explanation_jsonb,
  points,
  sort_order,
  created_at
) VALUES (
  '00000000-0000-0000-0000-0000000q0021',
  '00000000-0000-0000-0000-0000000c0002',
  'single_choice',
  '{
    "question": "Khi ai đó nói '谢谢' (xièxie) với bạn, câu đáp lại lịch sự và phổ biến nhất là:",
    "options": [
      { "id": "bu_keqi", "text": "不客气 (Bú kèqi - Đừng khách sáo / Không có gì)" },
      { "id": "zai_jian", "text": "再见 (Zàijiàn - Tạm biệt)" },
      { "id": "ni_hao", "text": "你好 (Nǐ hǎo - Xin chào)" },
      { "id": "bu_hao", "text": "不好 (Bù hǎo - Không tốt)" }
    ]
  }'::jsonb,
  '"bu_keqi"'::jsonb,
  '{
    "explanation": "Câu đáp lễ chuẩn mực nhất khi nhận lời cảm ơn là 不客气 (Bú kèqi)."
  }'::jsonb,
  10,
  1,
  now()
) ON CONFLICT (id) DO NOTHING;
