# Notion to Chinese LMS Content Mapping

## 1. Overview of the Source Roadmap
The source curriculum is hosted on Notion:
`https://judicious-crafter-764.notion.site/L-TR-NH-H-C-TI-NG-TRUNG-CHO-NG-I-M-I-B-T-U-129db0ebd82b4b5cb9c13a343a937567`

It organizes Chinese self-study into 12 monthly milestones:
- **Chuẩn bị & Nhập môn (Phát âm & Pinyin)**: Bảng chữ cái ngữ âm, quy tắc thanh điệu, ghép vần, các lỗi phát âm người Việt hay mắc.
- **Tháng 1 - 3 (Cơ bản & Giao tiếp nền tảng - HSK 1 - 2)**: 150-300 từ vựng cốt lõi, cấu trúc câu căn bản (chủ - vị - tân), số đếm, thời gian, gia đình, mua sắm.
- **Tháng 4 - 6 (Mở rộng & Nâng cao kỹ năng - HSK 3)**: 600 từ vựng, ngữ pháp liên từ, mẫu câu phức, luyện nghe hội thoại đời sống, video clip thực tế.
- **Tháng 7 - 9 (Tự tin giao tiếp & Tăng tốc phản xạ - HSK 4)**: 1200 từ vựng, các cấu trúc câu đặc biệt (câu chữ Ba 把, câu Bị động 被), đọc hiểu đoạn văn dài.
- **Tháng 10 - 12 (Hoàn thiện 4 kỹ năng & Ôn thi chứng chỉ - HSK 4+ / 5)**: 2500+ từ vựng, viết đoạn văn, nghe tin tức, chiến lược làm đề thi HSK.

---

## 2. Structural Hierarchy Mapping

```
Notion Page / Heading Hierarchy      Database Entity
─────────────────────────────────────────────────────────────────
Root Notion Workspace Page      ──>  programs (slug: "chinese-12-months")
Export Snapshot Version         ──>  program_versions (e.g. v1.0.0, draft/published)
Month Section (Tháng 1 .. 12)   ──>  curriculum_months (month_index: 1..12)
Tuần (Tuần 1 .. 4 mỗi tháng)    ──>  curriculum_weeks (week_index: 1..4)
Ngày học / Chặng                ──>  curriculum_days (day_index: 1..N, unlock_offset_days)
Chủ đề bài học                  ──>  lessons (title, description, is_required)
Các khối nội dung Notion        ──>  lesson_blocks (rich_text, audio, video, vocab, quiz)
Google Drive Links              ──>  assets (drive_file_id, mime_type, web_view_link)
```

---

## 3. Lesson Block Types & JSON Schemas

### 1. `rich_text`
```json
{
  "content": "### Quy tắc biến điệu thanh ba (第三声变调)\nKhi hai âm tiết thanh ba đi liền nhau..."
}
```

### 2. `vocabulary`
```json
{
  "items": [
    {
      "hanzi": "你好",
      "pinyin": "nǐ hǎo",
      "meaning_vi": "Xin chào",
      "example": "你好！很高兴认识你。(Chào bạn! Rất vui được quen bạn.)",
      "audio_asset_id": null
    }
  ]
}
```

### 3. `video` & `audio`
```json
{
  "asset_id": "uuid-asset-id",
  "title": "Luyện nghe bài 1",
  "drive_url": "https://drive.google.com/file/d/1A2B3C/view",
  "external_url": null
}
```

### 4. `pdf`
```json
{
  "asset_id": "uuid-asset-id",
  "title": "Giáo trình HSK 1 PDF",
  "drive_url": "https://drive.google.com/file/d/1D2E3F/view",
  "page_count": 42
}
```

### 5. `flashcard_set`
```json
{
  "cards": [
    { "front": "你好", "pinyin": "nǐ hǎo", "back": "Xin chào" },
    { "front": "谢谢", "pinyin": "xièxie", "back": "Cảm ơn" }
  ]
}
```

### 6. `quiz`
Associated with `quizzes` and `quiz_questions` tables for secure server-side scoring.
