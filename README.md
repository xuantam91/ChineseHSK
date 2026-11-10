# Chinese Learning Journey (LMS Tự Học Tiếng Trung 12 Tháng)

Webapp LMS tự học tiếng Trung theo lộ trình 12 tháng bài bản dựa trên giáo trình Notion và tài nguyên Google Drive. Hệ thống hỗ trợ mở bài hằng ngày theo múi giờ `Asia/Ho_Chi_Minh`, tích lũy bài tồn đọng (backlog) khi bận rộn để học bù, bảo mật Row-Level Security (RLS) trên Supabase, và chấm điểm quiz phía server.

---

## 1. Tính năng nổi bật

- 📅 **Mở bài học hằng ngày theo múi giờ `Asia/Ho_Chi_Minh`**:
  - Mỗi học viên có ngày bắt đầu (`start_date`) và tiến trình mở bài độc lập.
  - Xử lý chính xác ngày lịch, năm nhuận, ranh giới 23:59 và 00:01, không chia mili-giây UTC gây lệch ngày.
- 🔄 **Bài tồn đọng (Backlog) & Học bù**:
  - Nghỉ học không bị mất bài hoặc auto-skip; danh sách bài tồn đọng giúp học viên học bù bất cứ lúc nào.
  - Các bài tương lai vẫn bị khóa an toàn.
- 📚 **Đa dạng dạng khối bài học (Lesson Blocks)**:
  - Khối lý thuyết/ngữ pháp (RichText Markdown sanitize).
  - Khối từ vựng Hán tự, Pinyin chuẩn thanh điệu, giải nghĩa tiếng Việt, câu ví dụ và phát âm.
  - Khối phát âm Media Player (Audio Drive, Video MP4 Drive preview).
  - Khối tài liệu PDF giáo trình tích hợp Drive Viewer.
  - Khối Flashcard lật 3D tương tác.
  - Khối bài tập kiểm tra trắc nghiệm & điền từ.
- 🔒 **Bảo mật & Quyền riêng tư cấp cao**:
  - Row-Level Security (RLS) trên toàn bộ 21 bảng PostgreSQL Supabase.
  - Đáp án đúng của Quiz (`correct_answer_jsonb`) được giữ tuyệt mật ở server; chấm điểm hoàn toàn qua Server Action/API, không lộ xuống client.
  - Cơ chế phòng chống SSRF và URL Injection khi nhúng tài liệu Google Drive.
- 🛠️ **Admin CMS & Notion Importer**:
  - Giao diện Admin quản lý cây giáo trình (Tháng -> Tuần -> Ngày -> Bài học -> Khối).
  - Trình duyệt và kiểm tra link Google Drive.
  - Công cụ Import giáo trình Notion (Markdown/CSV/JSON) với cơ chế Chạy thử nghiệm (Dry-Run), báo cáo đối soát và commit an toàn không đè version đang học.

---

## 2. Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide React icons, TypeScript Strict.
- **Backend**: Next.js Server Actions & Route Handlers, Zod Validation.
- **Database & Auth**: Supabase PostgreSQL with RLS, `@supabase/ssr`, cookie auth PKCE.
- **Mock Fallback**: In-Memory Mock Supabase Adapter (`USE_MOCK_SUPABASE=true`) cho phép chạy test và phát triển ngay mà không cần credentials Supabase.
- **Testing**: Vitest (72 unit & integration tests) covering scheduling, timezone boundary, Google Drive parsing, quiz grading, and Notion importer.

---

## 3. Khởi chạy ứng dụng

### Yêu cầu môi trường
- Node.js >= 18 (Khuyến nghị Node.js 20+)
- npm hoặc pnpm

### Cài đặt và chạy Local
```bash
# 1. Cài đặt dependencies
npm install

# 2. Tạo file cấu hình môi trường
cp .env.example .env.local

# 3. Chạy môi trường phát triển (Mặc định dùng Mock Adapter không cần key Supabase)
npm run dev
```

Truy cập: [http://localhost:3000](http://localhost:3000)

### Tài khoản Demo dùng thử
Tại trang đăng nhập `/login`, bạn có thể bấm nhanh vào các nút tài khoản mẫu:
- **Học viên**: `student@demo.hsk` / mật khẩu bất kỳ
- **Quản trị viên**: `admin@demo.hsk` / mật khẩu bất kỳ

---

## 4. Các lệnh kiểm thử & Build

```bash
# Kiểm tra kiểu TypeScript
npm run typecheck

# Chạy toàn bộ 72 Unit & Integration Tests với Vitest
npm run test

# Build ứng dụng cho Production
npm run build
```

---

## 5. Cấu trúc thư mục

```
src/
├── app/
│   ├── (auth)/          # /login, /register, /forgot-password
│   ├── (student)/       # /dashboard, /roadmap, /learn, /lesson, /practice, /library, /progress, /settings
│   ├── admin/           # /admin/curriculum, /admin/assets, /admin/import, /admin/programs, /admin/users
│   ├── api/             # /api/me/*, /api/days/*, /api/lessons/*, /api/quizzes/*, /api/admin/*, /api/health
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page giới thiệu lộ trình 12 tháng
├── components/
│   ├── ui/              # Button, Card, Progress, Badge, Dialog, Toast, Skeleton
│   ├── layout/          # Header, Sidebar, MobileNav, StudentLayout
│   └── lesson/          # RichTextBlock, VocabBlock, MediaBlock, PdfBlock, FlashcardBlock, QuizBlock
├── lib/
│   ├── supabase/        # Browser, Server, Admin & Mock Adapter
│   ├── scheduling/      # Calendar, Unlock rules, Backlog, Progress (Asia/Ho_Chi_Minh)
│   ├── google-drive/    # Safe URL parser, SSRF prevention, Provider
│   ├── notion-import/   # Notion export parser, Staging validator, Dry-run & Commit
│   ├── quiz/            # Server-side grading engine
│   └── validations/     # Zod schemas (enrollment, quiz, curriculum)
└── types/               # Database definitions & JSON payload types
supabase/
├── migrations/          # 20261110000000_init_schema.sql (21 tables + RLS + Triggers)
└── seed.sql             # [DEMO] Month 1 curriculum fixtures
docs/                    # Toàn bộ tài liệu kỹ thuật, kiến trúc và hướng dẫn
```

---

## 6. Tài liệu chi tiết trong `docs/`

- [`docs/IMPLEMENTATION_PLAN.md`](file:///Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/docs/IMPLEMENTATION_PLAN.md): Kế hoạch thực thi và tiêu chí nghiệm thu.
- [`docs/ARCHITECTURE.md`](file:///Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/docs/ARCHITECTURE.md): Kiến trúc hệ thống, sơ đồ luồng dữ liệu và thiết kế bảo mật.
- [`docs/DB_SCHEMA.md`](file:///Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/docs/DB_SCHEMA.md): Chi tiết 21 bảng, RLS policies, trigger và kiểu dữ liệu.
- [`docs/API.md`](file:///Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/docs/API.md): Tài liệu đặc tả REST API endpoints và schemas.
- [`docs/CONTENT_MAPPING.md`](file:///Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/docs/CONTENT_MAPPING.md): Ánh xạ giáo trình Notion sang các bảng dữ liệu LMS.
- [`docs/CONTENT_IMPORT.md`](file:///Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/docs/CONTENT_IMPORT.md): Hướng dẫn nhập giáo trình Notion an toàn.
- [`docs/ADMIN_GUIDE.md`](file:///Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/docs/ADMIN_GUIDE.md): Cẩm nang hướng dẫn sử dụng giao diện quản trị Admin CMS.
- [`docs/DEPLOYMENT.md`](file:///Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/docs/DEPLOYMENT.md): Hướng dẫn triển khai lên Supabase và Vercel.
- [`docs/TEST_REPORT.md`](file:///Users/tamtran/Documents/WorkSpace/Globy/ChineseHSK/docs/TEST_REPORT.md): Báo cáo chi tiết kết quả chạy kiểm thử tự động.
