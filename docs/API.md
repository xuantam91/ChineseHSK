# Chinese Learning Journey — REST API Documentation

This document describes all API Route Handlers implemented under `src/app/api/`.

---

## 1. Core Principles & Security Architecture

1. **Strict Timezone Handling (`Asia/Ho_Chi_Minh`)**:
   - Every student's daily progression is calculated relative to their enrollment's local calendar date (`YYYY-MM-DD`).
   - Time calculations never divide UTC timestamps by 86,400,000 ms.
2. **Server-Side Authorization & Anti-Tampering**:
   - Access to days and lessons requires active enrollment and checks calendar unlock offset days.
   - Future locked days return `403 Forbidden` (`DAY_LOCKED`).
   - Admin routes require a verified `admin` role server-side; client role claims in request bodies are ignored.
3. **Zero Answer Key Leakage**:
   - `quiz_questions.correct_answer_jsonb` and `explanation_jsonb` are never sent in student lesson or quiz responses prior to submission.
   - Grading is performed entirely on the server; the result includes score, pass/fail status, and explanation only after submit.
4. **Google Drive Asset Sanitization & Anti-SSRF**:
   - Links must originate from `drive.google.com` or `docs.google.com`.
   - All internal IPs, non-Google hosts, and unsafe schemes are rejected.

---

## 2. Standard Response Envelope

### Success Response (`status: 200` or `201`)
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response (`status: 4xx` or `5xx`)
```json
{
  "success": false,
  "error": {
    "code": "DAY_LOCKED",
    "message": "Ngày học này chưa được mở khóa theo lịch trình cá nhân của bạn.",
    "details": null
  }
}
```

Standard Error Codes:
- `400 BAD_REQUEST / VALIDATION_ERROR`: Invalid request payload.
- `401 UNAUTHORIZED`: Missing or invalid session cookie/header.
- `403 FORBIDDEN / DAY_LOCKED / LESSON_LOCKED`: Access denied by schedule or role.
- `404 NOT_FOUND / ENROLLMENT_NOT_FOUND`: Resource does not exist.
- `422 UNPROCESSABLE_ENTITY / INVALID_DRIVE_URL`: Failed validation.
- `500 INTERNAL_SERVER_ERROR`: Server error.

---

## 3. Student Endpoints (`/api/*`)

### `GET /api/health`
Health check status endpoint.
- **Auth**: None
- **Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-03-05T12:00:00.000Z",
  "service": "chinese-learning-journey-api",
  "environment": "development",
  "version": "0.1.0",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

---

### `GET /api/me/today`
Returns the current student's active enrollment, today's local date, active day, backlog overdue days, streak, and completion progress.
- **Auth**: Authenticated student
- **Response**:
```json
{
  "success": true,
  "data": {
    "today_local": "2026-03-05",
    "enrollment": {
      "id": "enr-student-01",
      "user_id": "usr-student-01",
      "program_version_id": "ver-1-0-0",
      "start_date": "2026-03-05",
      "timezone": "Asia/Ho_Chi_Minh",
      "status": "active",
      "target_minutes_per_day": 30
    },
    "current_day": {
      "id": "day-01",
      "day_index": 1,
      "day_type": "learning",
      "title": "Ngày 1: Làm quen 6 Vận mẫu đơn [DEMO]",
      "estimated_minutes": 30,
      "unlock_offset_days": 0,
      "unlock_date": "2026-03-05",
      "status": "today",
      "is_required": true,
      "lesson_count": 1,
      "completed_lesson_count": 0
    },
    "overdue_days": [],
    "streak": 1,
    "stats": {
      "completed_lessons": 0,
      "total_required_lessons": 1,
      "completion_percentage": 0
    }
  }
}
```

---

### `GET /api/me/roadmap`
Returns 12-month curriculum hierarchy (months -> weeks -> days) with day status (`locked`, `today`, `overdue`, `completed`, `rest`). Future locked days contain only summary metadata.
- **Auth**: Authenticated student
- **Response**:
```json
{
  "success": true,
  "data": {
    "program_version": {
      "id": "ver-1-0-0",
      "version_number": "v1.0.0",
      "title": "Lộ trình Tiếng Trung 12 Tháng [DEMO]"
    },
    "enrollment": {
      "start_date": "2026-03-05",
      "timezone": "Asia/Ho_Chi_Minh",
      "status": "active"
    },
    "today_local": "2026-03-05",
    "months": [
      {
        "id": "month-01",
        "month_index": 1,
        "title": "Tháng 1: Nhập môn & Phát âm Pinyin [DEMO]",
        "weeks": [
          {
            "id": "week-01",
            "week_index": 1,
            "title": "Tuần 1: Thanh mẫu & Vận mẫu cơ bản [DEMO]",
            "days": [
              {
                "id": "day-01",
                "day_index": 1,
                "day_type": "learning",
                "title": "Ngày 1: Làm quen 6 Vận mẫu đơn",
                "estimated_minutes": 30,
                "unlock_offset_days": 0,
                "unlock_date": "2026-03-05",
                "status": "today",
                "is_required": true,
                "lesson_count": 1,
                "completed_lesson_count": 0
              },
              {
                "id": "day-05",
                "day_index": 5,
                "day_type": "quiz",
                "title": "Ngày 5: Kiểm tra tuần 1",
                "estimated_minutes": 25,
                "unlock_offset_days": 4,
                "unlock_date": "2026-03-09",
                "status": "locked",
                "is_required": true,
                "lesson_count": 1,
                "completed_lesson_count": 0
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

### `GET /api/me/progress`
Returns overall stats, total required lessons, quiz attempts history, and backlog count.
- **Auth**: Authenticated student
- **Response**:
```json
{
  "success": true,
  "data": {
    "total_required_lessons": 1,
    "completed_lessons": 1,
    "completion_percentage": 100,
    "quiz_history": [
      {
        "quiz_id": "quiz-01",
        "quiz_title": "Kiểm tra nhận diện Vận Mẫu Đơn [DEMO]",
        "lesson_title": "Bài 1: Phát âm 6 Vận mẫu đơn [DEMO]",
        "attempt_no": 1,
        "score": 100,
        "passed": true,
        "submitted_at": "2026-03-05T12:30:00.000Z"
      }
    ],
    "streak": 1,
    "backlog_count": 0
  }
}
```

---

### `POST /api/me/enrollments`
Creates or updates an active enrollment for onboarding.
- **Auth**: Authenticated student
- **Request Body**:
```json
{
  "program_version_id": "ver-1-0-0",
  "start_date": "2026-03-05",
  "timezone": "Asia/Ho_Chi_Minh",
  "target_minutes_per_day": 30
}
```
- **Response**: `201 Created`

---

### `GET /api/days/[id]`
Returns day details and lessons. Validates that the day is unlocked according to the student's enrollment schedule.
- **Auth**: Authenticated student
- **Response (Unlocked)**:
```json
{
  "success": true,
  "data": {
    "id": "day-01",
    "day_index": 1,
    "day_type": "learning",
    "title": "Ngày 1: Làm quen 6 Vận mẫu đơn [DEMO]",
    "estimated_minutes": 30,
    "unlock_offset_days": 0,
    "status": "today",
    "lessons": [
      {
        "id": "les-01",
        "title": "Bài 1: Phát âm 6 Vận mẫu đơn [DEMO]",
        "description": "Nắm vững khẩu hình miệng",
        "estimated_minutes": 20,
        "is_required": true,
        "progress_status": "not_started"
      }
    ]
  }
}
```
- **Response (Future Locked Day)**: `403 Forbidden` (`DAY_LOCKED`)

---

### `GET /api/lessons/[id]`
Returns lesson and its blocks. Verifies day is unlocked. Does NOT return quiz answer keys.
- **Auth**: Authenticated student
- **Response**:
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": "les-01",
      "curriculum_day_id": "day-01",
      "title": "Bài 1: Phát âm 6 Vận mẫu đơn [DEMO]",
      "description": "Nắm vững khẩu hình miệng",
      "estimated_minutes": 20,
      "is_required": true
    },
    "blocks": [
      {
        "id": "blk-01-01",
        "lesson_id": "les-01",
        "type": "rich_text",
        "payload_jsonb": { "content": "..." },
        "is_required": true,
        "estimated_minutes": 5
      }
    ],
    "quiz": {
      "id": "quiz-01",
      "title": "Kiểm tra nhận diện Vận Mẫu Đơn [DEMO]",
      "passing_score": 80,
      "attempt_limit": 5,
      "questions": [
        {
          "id": "q-01-01",
          "type": "single_choice",
          "prompt_jsonb": {
            "question": "Vận mẫu 'ü' có khẩu hình thế nào?",
            "options": [{ "id": "opt-a", "text": "..." }, { "id": "opt-b", "text": "..." }]
          },
          "points": 50,
          "sort_order": 1
        }
      ]
    },
    "completed_block_ids": []
  }
}
```

---

### `POST /api/blocks/[id]/complete`
Marks a block completed for the enrollment. Idempotent upsert.
- **Auth**: Authenticated student
- **Request Body**:
```json
{
  "metadata": { "time_spent_seconds": 180 }
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "block_id": "blk-01-01",
    "completed": true,
    "lesson_status": "in_progress"
  }
}
```

---

### `POST /api/quizzes/[id]/submit`
Submits student answers, calculates score on server, and records the attempt.
- **Auth**: Authenticated student
- **Request Body**:
```json
{
  "answers": {
    "q-01-01": "opt-b",
    "q-01-02": "opt-2a"
  }
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "attempt_id": "att-1773000-1",
    "attempt_no": 1,
    "score": 100,
    "passing_score": 80,
    "passed": true,
    "question_results": [
      {
        "question_id": "q-01-01",
        "is_correct": true,
        "awarded_points": 50,
        "correct_answer": "opt-b",
        "explanation": "Âm ü là âm tròn môi..."
      }
    ],
    "lesson_completed": true
  }
}
```

---

### `GET /api/assets/[id]`
Returns metadata and safe viewer/embed URL for Google Drive assets.
- **Auth**: Authenticated student or admin
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "asset-audio-01",
    "name": "Audio Vận Mẫu Đơn Pinyin.mp3 [DEMO]",
    "mime_type": "audio/mpeg",
    "access_mode": "anyone_with_link",
    "status": "verified",
    "viewer_url": "https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sTuV/preview",
    "web_view_url": "https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sTuV/view?usp=sharing",
    "is_folder": false
  }
}
```

---

## 4. Admin Endpoints (`/api/admin/*`)
All endpoints in this section require server-verified `admin` role. Returns `403 FORBIDDEN` for students.

### `POST /api/admin/import/dry-run`
Runs staging parser and validator without mutating the database.
- **Request Body**:
```json
{
  "raw_content": "# Tháng 1: Nhập môn\n## Tuần 1: Khởi động\n### Ngày 1: Pinyin..."
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "months_count": 1,
    "weeks_count": 1,
    "days_count": 1,
    "lessons_count": 1,
    "blocks_count": 2,
    "assets_count": 0,
    "broken_links_count": 0,
    "warnings": []
  }
}
```

---

### `POST /api/admin/import/commit`
Idempotently commits staging curriculum into a new draft `program_version`.
- **Request Body**:
```json
{
  "raw_content": "...",
  "version_label": "v1.1.0-draft"
}
```
- **Response**: `201 Created`

---

### `POST /api/admin/programs/[id]/publish`
Publishes a draft version and transitions the previous active version to `archived`.
- **Response**:
```json
{
  "success": true,
  "data": {
    "message": "Đã xuất bản thành công phiên bản v1.1.0-draft.",
    "version": { ... }
  }
}
```

---

### `POST /api/admin/curriculum/days`
Creates or updates a curriculum day.
- **Request Body**:
```json
{
  "curriculum_week_id": "week-01",
  "day_index": 6,
  "day_type": "learning",
  "title": "Ngày 6: Ôn tập thanh điệu",
  "estimated_minutes": 30,
  "unlock_offset_days": 5,
  "is_required": true
}
```

---

### `POST /api/admin/curriculum/lessons`
Creates or updates a lesson.
- **Request Body**:
```json
{
  "curriculum_day_id": "day-01",
  "title": "Bài 2: Thực hành biến điệu thanh ba",
  "description": "...",
  "estimated_minutes": 20,
  "is_required": true
}
```

---

### `POST /api/admin/curriculum/blocks`
Creates or updates a lesson block.
- **Request Body**:
```json
{
  "lesson_id": "les-01",
  "type": "rich_text",
  "payload_jsonb": { "content": "..." },
  "estimated_minutes": 5,
  "is_required": true
}
```

---

### `POST /api/admin/assets/validate`
Validates Google Drive link, tests SSRF whitelist, extracts File ID, and registers asset.
- **Request Body**:
```json
{
  "url": "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view",
  "name": "Audio Phát Âm Vận Mẫu"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "asset": { "id": "ast-1A2B3C4D5E6F7G8H", ... },
    "parsed_details": {
      "file_id": "1A2B3C4D5E6F7G8H9I0J",
      "mime_type": "audio/mpeg",
      "preview_url": "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/preview",
      "access_status": "verified"
    }
  }
}
```

---

### `POST /api/admin/drive/sync`
Triggers Google Drive folder scan. Gracefully handles unconfigured OAuth credentials in manual mode.
- **Response**:
```json
{
  "success": true,
  "data": {
    "synced": false,
    "status": "manual_mode_only",
    "message": "Google Drive OAuth2 / Service Account chưa được cấu hình. Chế độ xác thực link thủ công đang hoạt động bình thường."
  }
}
```

---

### `GET /api/admin/stats`
Dashboard metrics aggregator (total lessons, days, assets, broken link alerts, active students).

### `GET /api/admin/curriculum/tree`
Fetches full curriculum tree (Month -> Week -> Day -> Lesson -> Blocks) for the Admin CMS editor.

### `GET /api/admin/users`
Returns privacy-compliant anonymized student table (user short ID, age group, enrollment start date, streak, and completion %).
