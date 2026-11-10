# MASTER PROMPT — XÂY DỰNG CHINESE LEARNING LMS

> Dán toàn bộ nội dung từ phần **BẮT ĐẦU PROMPT** đến **KẾT THÚC PROMPT** vào Codex hoặc Google Antigravity ở chế độ lập trình có quyền đọc/ghi repository và chạy terminal. Có thể dùng một repository Git duy nhất để làm việc qua lại giữa hai công cụ.

---

# BẮT ĐẦU PROMPT

Bạn là **Principal Software Architect + Senior Full-stack Engineer + Product Designer + QA Lead + DevOps Engineer**. Hãy trực tiếp **xây dựng mã nguồn, migration, tests, UI và tài liệu triển khai** cho một webapp LMS tự học tiếng Trung hoàn chỉnh ở mức MVP production-ready. Không chỉ viết tư vấn, thiết kế giả hoặc prototype giao diện. Chủ động kiểm tra repository, tạo/sửa file, cài package, chạy build/test, kiểm tra từng bước và sửa các lỗi phát hiện được.

## 0. NGUYÊN TẮC LÀM VIỆC VỚI CODING AGENT

1. Khảo sát trạng thái repository trước khi code. Nếu repo trống, khởi tạo dự án. Nếu đã có code, đọc và bảo toàn phần hoạt động tốt; không xóa bừa.
2. Trước tiên tạo `docs/IMPLEMENTATION_PLAN.md` với kiến trúc, milestone, dependency, risks, acceptance criteria; tạo `docs/CONTENT_MAPPING.md` giải thích cách ánh xạ Notion sang bài học. Sau đó **triển khai thật**, không dừng ở kế hoạch.
3. Làm việc tuần tự theo các phase bên dưới, mỗi phase phải có mã chạy được, migration và test liên quan. Nếu có thể thực hiện nhiều phase trong phiên làm việc thì tiếp tục cho đến khi đạt MVP; nếu bị giới hạn môi trường thì dừng ở trạng thái an toàn và ghi rõ những gì cần để tiếp tục.
4. Đừng hỏi những quyết định nhỏ. Dùng mặc định được mô tả ở đây. Chỉ hỏi khi thiếu thông tin không thể suy ra và không thể dùng placeholder an toàn, ví dụ credentials, project ID hoặc tệp export nội dung gốc.
5. **Không bịa nội dung giáo trình Notion.** Không ngụy tạo dữ liệu 12 tháng/365 ngày và gọi đó là nội dung thật. Nếu chưa truy cập được các trang con/tài liệu: tạo seed **DEMO** tối thiểu được gắn nhãn rõ ràng; cung cấp hệ thống import và dashboard thể hiện “Chưa có nội dung thật”.
6. Không tự cho rằng kết nối dịch vụ thật đã thành công. Chỉ xác nhận tích hợp khi thực sự kiểm tra. Nếu thiếu credentials, cung cấp `.env.example`, mock adapters được chỉ định rõ để phát triển, hướng dẫn cấu hình và kiểm tra khi có credentials.
7. Chọn **các phiên bản stable tương thích tại thời điểm thực thi**, tham khảo tài liệu chính thức và lock dependencies. Không sử dụng API/libraries deprecated. Với Next.js 16+, dùng `proxy.ts` khi cần (không dùng middleware cũ theo thói quen); authorization vẫn phải thực thi trong mọi API/server action.
8. Không bao giờ commit secret, OAuth refresh token, service-role key, hoặc tài liệu người dùng riêng tư vào Git. Không lộ secret trong UI/client bundle/log. Không thực hiện thao tác phá hủy database production nếu chưa được phép.
9. Ưu tiên đơn giản, rõ ràng, dễ bảo trì, không thêm microservices không cần thiết.
10. Cuối mỗi phase báo: file đã thay đổi; API/DB/UI đã làm; các test/build đã chạy và kết quả thực; các blocker còn lại. Không tự tuyên bố “đã chạy production” nếu chưa deploy và verify.

## 1. TỔNG QUAN SẢN PHẨM

**Tên tạm thời:** Chinese Learning Journey (dễ đổi thương hiệu).

**Mục tiêu:** Người dùng đăng ký/đăng nhập, chọn ngày bắt đầu và nhóm độ tuổi, sau đó **mỗi ngày vào học theo đúng chương trình học tiếng Trung 12 tháng**. Mỗi ngày có thể gồm lý thuyết, phát âm/Pinyin, nghe MP3, video MP4, PDF, flashcard, luyện 4 kỹ năng và bài kiểm tra. Ứng dụng nhớ tiến độ từng người, hiển thị bài hôm nay, bài tồn đọng, lịch học và kết quả học. Admin nhập/cập nhật chương trình, gắn tài liệu Google Drive, xuất bản bài.

**Nguồn lộ trình chính:**
https://judicious-crafter-764.notion.site/L-TR-NH-H-C-TI-NG-TRUNG-CHO-NG-I-M-I-B-T-U-129db0ebd82b4b5cb9c13a343a937567

Các nhóm đã có thể thấy trên trang gốc gồm: chuẩn bị; xác định độ tuổi; các bước tự học; các lỗi cần tránh; tổng hợp kênh học; video/tài liệu phát âm; nghe thụ động, bài hát, flashcard; lộ trình 12 tháng; tài nguyên từ vựng MP3/MP4/PDF; giáo trình bổ trợ 4 kỹ năng. **Chi tiết của các trang con phải được nhập/xác minh, không được phỏng đoán.**

**Hạ tầng bắt buộc:**
- Vercel: triển khai webapp Next.js, route handlers/server functions.
- Supabase: Auth + PostgreSQL + RLS; có thể dùng Storage cho ảnh đại diện nếu cần, không dùng để thay thế Drive làm nguồn học liệu gốc.
- Google Drive: nguồn chứa PDF, MP3, MP4, hình và tài liệu. Có chế độ thêm link thủ công ở MVP; hỗ trợ Drive API sync sau khi chủ sở hữu cấu hình quyền.
- Notion là nguồn tham khảo/nội dung nhập, **không** phụ thuộc Notion API cho mỗi request của học viên.

**Ngôn ngữ giao diện:** tiếng Việt; nội dung tiếng Trung hỗ trợ Hán tự, Pinyin có dấu, phiên âm, dịch Việt và âm thanh. Giao diện responsive mobile-first, đẹp và phù hợp người mới học; hỗ trợ dark mode nếu không gây trễ MVP.

**Phạm vi P0 (phải hoàn thành):** Auth, onboarding, enrollment, kế hoạch theo tháng/tuần/ngày, unlock bài theo lịch, học bù, lesson viewer, links/preview Drive, quiz, completion/progress, thống kê đơn giản, CMS admin, import Notion/export, RLS, tests, deploy config.

**P1 (thiết kế sẵn nhưng không chặn MVP):** flashcard spaced repetition, XP/streak, nhắc học, báo cáo phụ huynh, nhánh độ tuổi, tiến độ 4 kỹ năng.

**P2 (không tự triển khai API tốn phí nếu chưa có keys):** AI tutor, voice chat, ASR/đánh giá thanh điệu, gợi ý ôn tập. Thiết kế service interface để tích hợp sau, không đưa UI giả vờ chạy AI.

## 2. TECH STACK VÀ QUY ƯỚC

- Next.js App Router + React + TypeScript strict.
- Tailwind CSS + shadcn/ui + Lucide icons, thiết kế component dễ tái sử dụng.
- Supabase `@supabase/supabase-js` + `@supabase/ssr` đúng hướng dẫn chính thức; browser client và server client tách biệt; cookies SSR/PKCE; refresh session đúng theo phiên bản Next.js.
- PostgreSQL migrations thông qua Supabase CLI, có RLS policies, indexes, constraints, triggers/functions nếu cần. Generate DB TypeScript types.
- Zod validation cho env, forms và server request.
- TanStack Query hoặc cơ chế server-data Next.js hợp lý; không lạm dụng client state.
- React Hook Form cho form nhiều trường nếu phù hợp.
- Vitest cho unit/integration logic; Playwright cho E2E; ESLint + TypeScript + Prettier.
- Dùng `date` và timezone một cách chính xác. Mặc định `Asia/Ho_Chi_Minh` cho lịch của người dùng Việt Nam; lưu `DATE` cho ngày học và `TIMESTAMPTZ` cho thời điểm sự kiện. Không tính lịch bằng cách chia chênh lệch UTC milliseconds cho 86.400.000 trong mọi trường hợp vì có thể sai múi giờ/DST.
- Dùng các package stable, không hardcode version trong tài liệu nếu việc đó gây xung đột thực tế.
- Có `README.md`, `.env.example`, `docs/ARCHITECTURE.md`, `docs/DB_SCHEMA.md`, `docs/DEPLOYMENT.md`, `docs/ADMIN_GUIDE.md`, `docs/CONTENT_IMPORT.md`, `docs/TEST_REPORT.md`, `AGENTS.md` (quy tắc chung cho coding agents).

## 3. VAI TRÒ VÀ QUYỀN HẠN

### student
- Đăng ký/đăng nhập bằng email/password; cấu hình Google OAuth nếu có credentials.
- Xem/sửa hồ sơ cá nhân và ngày bắt đầu học theo policy được quy định.
- Xem bài đang được mở, bài đã học, các bài tồn, progress và kết quả quiz của chính mình.
- Không sửa đáp án bài thi, nội dung giáo trình, progress của người khác, trạng thái publish hoặc quyền admin.

### admin
- Quản lý programs/versions/calendar/lessons/lesson blocks/quiz/assets.
- Import chương trình, preview trước publish, kiểm tra tài liệu lỗi, kiểm tra số lượng mục, xuất bản và duy trì phiên bản cũ cho người đang học.
- Xem thống kê tổng quan phù hợp; hạn chế tối đa thông tin cá nhân.
- Chỉ admin server-side được truy cập tác vụ import/sync/cron.

### guardian (P1)
- Có thể liên kết có sự đồng ý với tài khoản trẻ em; không tự tạo quan hệ giả. Hướng phát triển: theo dõi kết quả, quản lý đồng ý và thời gian học.

### Chính sách trẻ em
- Không thu thập ngày sinh chính xác nếu không cần; dùng nhóm tuổi.
- Nếu ứng dụng phục vụ trẻ em, thiết kế luồng đồng ý của phụ huynh và kiểm tra yêu cầu pháp lý của khu vực triển khai trước khi launch; không bật mặc định upload giọng nói, public profile, chat cộng đồng, hoặc chia sẻ dữ liệu trẻ em cho AI bên ngoài.

## 4. CONTENT MODEL — NOTION → DATABASE

Lộ trình **12 tháng không đồng nghĩa bắt buộc có đúng 365 bài**. Thiết kế lịch có số ngày/chặng thực tế xác định bởi dữ liệu đã xác minh. Mỗi ngày chương trình có thể là `learning`, `review`, `quiz`, `rest`, `checkpoint`.

Cấu trúc thứ bậc:
`Program → ProgramVersion → CurriculumMonth → CurriculumWeek → CurriculumDay → Lesson → LessonBlock → Asset`.

**Các kiểu LessonBlock bắt buộc hỗ trợ:**
- rich_text/markdown đã sanitize;
- video (Drive link, URL ngoài whitelist phù hợp);
- audio (Drive link);
- pdf/document preview hoặc link mở;
- image;
- vocabulary (hanzi, pinyin, meaning_vi, example, optional audio);
- flashcard set (ban đầu có thể là flip/review thủ công);
- instructions/checklist;
- quiz (multiple_choice, single_choice, true_false, fill_blank nếu chấm chính xác được);
- external_resource.

Mỗi lesson/block có `sort_order`, `is_required`, `estimated_minutes`, `status`. Giữ `source_url`, `source_external_id`, `source_hash`, `source_updated_at` để đối soát import, tránh tạo trùng. Rich text phải được sanitize để ngăn XSS; không render raw HTML từ Notion/Markdown chưa xử lý.

**Import strategy:**
1. Nếu được cung cấp Notion API integration token và quyền trang: đọc page root + child pages + child blocks, xử lý pagination, depth/loop protection, rate limits, retry hợp lý.
2. Nếu không có token: nhận Notion export Markdown/HTML/CSV + thư mục tài nguyên liên quan dưới dạng file upload admin hoặc import CLI. Cần parser và preview mapping; không giả vờ đọc được private subpages.
3. Hiển thị staging import: số tháng, tuần, ngày, bài, block, số tài liệu, URL missing/ambiguous, lỗi format, duplicate; cho admin review trước publish.
4. Import phải idempotent theo nguồn + ID + hash, hỗ trợ dry-run, validation report và rollback/abort an toàn.
5. Không override nội dung một `program_version` đã published nếu ảnh hưởng học viên; tạo draft version mới và publish sau kiểm tra.
6. Nếu bản export chỉ có danh mục mà không có lịch chi tiết, đánh dấu `content_incomplete` và ghi rõ admin cần bổ sung; không sinh bài giả thay thế dữ liệu nguồn.

## 5. DATABASE — SUPABASE POSTGRESQL

Viết migrations thật, không chỉ liệt kê schema. Dùng UUID PK, FK, unique indexes, check constraints, updated_at, NOT NULL và ON DELETE hợp lý. Schema gợi ý, được quyền bổ sung nếu cần:

- `profiles`: `id` (FK auth.users), `display_name`, `age_group`, `timezone`, `role` (kiểm soát nâng quyền), `created_at`, `updated_at`.
- `programs`: `id`, `slug`, `title`, `description`, `target_age_group`, `status`.
- `program_versions`: `id`, `program_id`, `version_number`, `status` (`draft/published/archived`), `published_at`, `source_url`, `content_checksum`.
- `curriculum_months`: `id`, `program_version_id`, `month_index`, `title`, `sort_order`.
- `curriculum_weeks`: `id`, `curriculum_month_id`, `week_index`, `title`, `sort_order`.
- `curriculum_days`: `id`, `curriculum_week_id`, `day_index` (unique **within program version**, tuần/tháng có thể khác), `day_type`, `title`, `estimated_minutes`, `unlock_offset_days`, `is_required`, `sort_order`.
- `lessons`: `id`, `curriculum_day_id`, `title`, `description`, `sort_order`, `estimated_minutes`, `is_required`.
- `lesson_blocks`: `id`, `lesson_id`, `type`, `payload_jsonb`, `sort_order`, `is_required`, `estimated_minutes`.
- `assets`: `id`, `provider='google_drive'`, `drive_file_id`, `name`, `mime_type`, `web_view_link`, `resource_key` (optional), `access_mode`, `status`, `last_checked_at`, `source_url`, `metadata_jsonb`. Dùng provider/files table cho future storage/CDN.
- `lesson_assets` hoặc block↔asset associations: `lesson_block_id`, `asset_id`, `sort_order`.
- `enrollments`: `id`, `user_id`, `program_version_id`, `start_date`, `timezone`, `status` (`active/paused/completed/cancelled`), `paused_at`, `pause_total_days`, `created_at`; quy định chỉ một enrollment active cho một program/user.
- `enrollment_schedule_adjustments` hoặc bảng tương đương: event/interval pause để tính lại lịch deterministically, không dựa vào một trường cộng dồn dễ sai.
- `lesson_progress`: `id`, `enrollment_id`, `lesson_id`, `status`, `started_at`, `completed_at`, `completed_required_blocks`, `score`, `updated_at`, unique(enrollment_id,lesson_id).
- `block_progress`: `enrollment_id`, `lesson_block_id`, `completed_at`, optional metadata; unique key.
- `quizzes`: `id`, `lesson_id`, `title`, `passing_score`, `attempt_limit`, `status`.
- `quiz_questions`: `id`, `quiz_id`, `type`, `prompt_jsonb`, `correct_answer_jsonb` (không expose cho student), `explanation_jsonb`, `points`, `sort_order`.
- `quiz_attempts`: `id`, `enrollment_id`, `quiz_id`, `attempt_no`, `submitted_at`, `score`, `passed`.
- `quiz_answers`: `attempt_id`, `question_id`, `answer_jsonb`, `is_correct`, `awarded_points`.
- `import_jobs`: `id`, `initiated_by`, `source_kind`, `status`, `summary_jsonb`, `error_jsonb`, `created_at`.
- `source_mappings`: `id`, `source_type`, `source_id`, `target_type`, `target_id`, `source_hash`, unique(source_type,source_id, target_type).
- `audit_logs`: `id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `summary_jsonb`, `created_at` (không lưu secrets, nội dung quiz riêng tư quá mức).

RLS bật cho **mọi public table chứa dữ liệu người dùng**. Student chỉ đọc bài published mà enrollment cho phép; không thể lấy bài future bằng cách gọi API trực tiếp. Admin access sử dụng trusted role được xác lập bằng server-side policy/claims, không tin vào request JSON; user không được self-update role. Sensitive answer keys không gửi xuống trình duyệt, có thể tách bảng/schema và chỉ chấm qua server RPC.

Tạo SQL policies, trigger tạo profile khi auth.user tạo, indexes, DB types và seed tối thiểu để test. Có script/README hướng dẫn áp migration vào Supabase local + hosted. Tạo tests bảo đảm cross-user isolation và role escalation bị chặn.

## 6. QUY TẮC MỞ BÀI HẰNG NGÀY — RẤT QUAN TRỌNG

Mỗi enrollment có `start_date`, `timezone` và `program_version_id` cố định. Không gắn số thứ tự ngày vào ngày lịch cố định chung cho mọi user.

### Định nghĩa
- `calendar_today`: ngày địa phương trong timezone enrollment.
- `planned_day`: ngày của chương trình có `unlock_offset_days` tính từ start_date. Nếu chương trình có ngày nghỉ, ôn tập hoặc checkpoint, giữ đúng cấu hình dữ liệu.
- `available`: bài đã tới ngày mở, người dùng có quyền đọc.
- `overdue`: bài đã mở ở ngày trước nhưng chưa hoàn thành; không đánh dấu xong tự động.
- `today`: bài có lịch mở đúng hôm nay; nếu hôm nay là rest day, hiển thị lịch nghỉ và đề xuất ôn tập, không tự tạo bài mới.
- `upcoming/locked`: bài chưa tới lịch; không trả nội dung chi tiết cho student nếu chính sách khóa yêu cầu.
- `completed`: tất cả block bắt buộc hoàn tất và quiz đạt điểm khi bài yêu cầu quiz.

### Quy tắc
1. Hai user cùng chương trình, start_date khác nhau sẽ được mở lịch khác nhau.
2. Người học bỏ 2 ngày vẫn thấy bài tồn; không mất bài, không auto-skip.
3. Người học có thể mở nhiều bài đã đến hạn và học bù; bài tương lai vẫn khóa.
4. Có tùy chọn `strict_sequence`: nếu bật, muốn đánh dấu ngày N hoàn thành phải hoàn thành prerequisites; nếu tắt, có thể hoàn thành bài đến hạn theo thứ tự tự chọn. Mặc định: **mở theo ngày lịch, cho phép học bù, không khóa bài đến hạn chỉ vì bài trước chưa xong**.
5. Ngày khóa dựa vào local DATE, không phụ thuộc giờ/offset UTC; test ở thời điểm 23:59 và 00:01.
6. Việc tạm dừng/lùi lịch (P1 hoặc có thể từ P0 nếu đơn giản) phải được định nghĩa rõ, lưu adjustment events và không phá tiến độ cũ.
7. Tính progress trong server/database, không chấp nhận client tự gửi `status=completed` nếu thiếu điều kiện.
8. Chống ghi đè race-condition và gửi lại request bằng idempotent upsert/transaction.
9. Chương trình được publish phiên bản mới không tự thay enrollment hiện có sang phiên bản mới.
10. Nếu chưa có nội dung thực của một ngày, thông báo rõ “Bài chưa được xuất bản”; không hiện một bài giả là bài chính thức.

Viết module `lib/scheduling/*` thuần TypeScript và unit tests cover leap year, timezone, days off, incomplete lessons, different start dates, backlogs, version changes, invalid enrollment.

## 7. UX/UI — MOBILE-FIRST, CẦN TRÔNG NHƯ SẢN PHẨM THẬT

Thiết kế đẹp, sạch, thân thiện; tham khảo phong cách Duolingo ở mức gamification **nhưng không sao chép thương hiệu/giao diện**. Hệ thống màu gợi ý: xanh ngọc hoặc xanh dương + màu nhấn ấm; card bo góc, icon rõ ràng, typography hỗ trợ Unicode tiếng Việt/Trung, WCAG AA tối thiểu cho contrast. Có empty/loading/error/success states, responsive iPhone/Android/desktop, keyboard accessible.

### Public
- `/`: landing với mô tả lợi ích, minh họa cách học, nút bắt đầu, truy cập không cần login.
- `/login`, `/register`, `/forgot-password`, `/auth/callback`.

### Student
- `/onboarding`: tên hiển thị, nhóm tuổi, trình độ ban đầu (mặc định beginner), ngày bắt đầu (mặc định hôm nay theo timezone), mục tiêu học/phút mỗi ngày; enrollment program version đã publish.
- `/dashboard`: lời chào, bài hôm nay, tiến độ ngày/tuần/tháng, bài quá hạn, giờ học dự kiến, nút **Bắt đầu học**, streak nếu có dữ liệu đáng tin, tổng từ học (nếu nguồn thống kê được).
- `/roadmap`: lộ trình 12 tháng > tuần > ngày, trạng thái locked/available/in_progress/completed/review/rest; chọn tháng/tuần, xem lại bài.
- `/learn/[dayId]`: danh sách lesson của ngày, checklist, learning objectives; lesson blocks theo thứ tự, hỗ trợ video/audio/pdf/external link, từ vựng, flashcard/quiz.
- `/lesson/[lessonId]`: trình đọc toàn màn hình tập trung; lưu tiến độ khi thực sự hoàn thành điều kiện.
- `/practice/[quizId]`: làm bài, nộp, hiển thị điểm, câu trả lời và giải thích phù hợp; không leak answer key trước submit.
- `/library`: tài liệu được phép xem, filter theo tháng, kỹ năng, loại tài liệu.
- `/progress`: calendar, % lessons completed (mẫu số xác định rõ), kết quả quiz, biểu đồ tuần, backlog, đề xuất học tiếp.
- `/settings`: hồ sơ, timezone, ngôn ngữ UI, thay đổi mật khẩu, chính sách quyền riêng tư, xóa tài khoản (có xác nhận phù hợp).

### Admin
- `/admin`: tổng quan program version draft/published, số bài, links hỏng, import jobs.
- `/admin/curriculum`: tree month/week/day/lesson, drag-and-drop hoặc up/down order, thêm/sửa/xóa (có confirmation), content editor cho LessonBlock.
- `/admin/assets`: thêm Drive URL, parse File ID/resource key, kiểm tra loại file và tình trạng quyền truy cập, liên kết bài, sửa link.
- `/admin/import`: import Notion export hoặc cấu hình Notion API token qua env, preview/cảnh báo mapping, dry-run, confirm publish.
- `/admin/programs`: tạo version draft từ published, compare, publish/rollback theo cách không phá enrollment.
- `/admin/users`: thống kê mức tối thiểu, không làm lộ thông tin trẻ em không cần thiết.

UI không được chỉ là mockup: mọi nút quan trọng đều phải hoạt động. Skeleton loading, toasts, empty states, error boundaries, confirm dialog, retry và mobile navigation đầy đủ.

## 8. GOOGLE DRIVE INTEGRATION

Thiết kế abstraction `AssetProvider` với tối thiểu `resolveFromUrl`, `getMetadata`, `getViewerUrl`, `checkAccess`, `listFolderChildren`. MVP **không buộc mọi học viên đăng nhập Google**.

### A. Thêm file thủ công (P0)
- Admin paste link Google Drive hoặc ID; parser hỗ trợ các dạng `/file/d/{id}/view`, `open?id=...`, link Google Docs/Sheets/Slides nếu phù hợp, giữ `resourceKey` nếu tồn tại.
- Chỉ chấp nhận hostnames Google Drive/Google Docs hợp lệ; URL sanitize, chống SSRF/open redirect. Không tự tải URL bất kỳ trên server.
- Lưu metadata nếu có quyền Google API; nếu không có thì lưu link và status `unverified`.
- PDF/video có thể hiển thị bằng Google Drive preview/embed khi quyền chia sẻ cho phép; audio có fallback “Mở trong Google Drive”. Không cam kết tùy chỉnh player cho mọi file. Nếu iframe bị chặn/không xem được, hiển thị nút mở an toàn.
- Phân biệt file public/anyone-with-link và restricted. **Không mô tả tài liệu public là an toàn riêng tư.** Không cố vượt ACL Google Drive.
- Nếu file không accessible, hiển thị thông báo và báo lỗi cho admin, không crash lesson.

### B. Đồng bộ Drive API (P1, thiết kế interface ngay từ P0)
- Dùng OAuth2 refresh token của admin hoặc service account được cấp quyền hợp lệ; credentials chỉ server-side. Không mặc định cho service account có quyền với My Drive nếu chưa chia sẻ/cấu hình.
- Root folder cấu hình từ `GOOGLE_DRIVE_ROOT_FOLDER_ID`.
- `files.list` có pagination và recursive traversal vì query parents chỉ trả con trực tiếp; xử lý folder nested, rate limits, retries, deleted/moved files, shared drive options khi cần.
- Dùng fields tối thiểu: id,name,mimeType,parents,webViewLink,size,modifiedTime,description,resourceKey nếu có.
- Đồng bộ idempotent, không xóa link lesson chỉ vì file tạm lỗi API; đánh dấu `missing`/`permission_denied` và log.
- Không phát tán OAuth token hoặc tạo endpoint file proxy tự do có thể bị lạm dụng download.

## 9. QUIZ VÀ LEARNING PROGRESS

- Quiz hỗ trợ multiple choice một/nhiều lựa chọn, đúng/sai, điền đơn giản; `passing_score` theo từng quiz.
- Server xác minh enrollment, unlock và quyền; lấy correct answers server-side, chấm tại server/DB transaction, lưu attempt + answers.
- Client không được phép yêu cầu tự cấp điểm; không leak answers trước submit (kể cả JSON payload/UI).
- `lesson_progress` complete chỉ khi required blocks/required quiz đủ điều kiện.
- Người học có thể làm lại theo `attempt_limit`; lưu lịch sử và hiển thị best/latest score theo chính sách thống nhất.
- Với audio/video, MVP có thể dùng nút xác nhận đã học, không giả vờ phát hiện người học đã xem đủ thời gian nếu không đo được.
- Xác định rõ tiến độ: `completed_required_lessons / total_required_published_lessons` theo phiên bản enrollment; progress theo ngày cũng tính bài thực tế.

## 10. API / SERVER ROUTES

Dùng Next.js Route Handlers hoặc Server Actions có contract rõ, Zod validated, standard error shape, xác thực server-side. Tối thiểu:

- `GET /api/me/today` — day, backlog, active enrollment, current plan, content readiness.
- `GET /api/me/roadmap` — month/week/day summary với statuses, không leak locked content.
- `GET /api/me/progress` — day/week/month summary, quiz results.
- `POST /api/me/enrollments` — onboarding/enroll, validate version and start_date.
- `GET /api/days/[id]`, `GET /api/lessons/[id]` — access-controlled lesson content.
- `POST /api/blocks/[id]/complete` — mark block complete (server validation + idempotent).
- `POST /api/quizzes/[id]/submit` — chấm và lưu attempt, enforce rate limit phù hợp.
- `GET /api/assets/[id]` — metadata/viewer link for accessible content, không phải generic proxy.
- Admin CRUD route handlers for program/version/month/week/day/lesson/blocks/assets (hoặc server actions nếu documented).
- `POST /api/admin/import/dry-run`, `/api/admin/import/commit` — staging + import confirmed.
- `POST /api/admin/drive/sync` — admin only, credentials secured.
- `GET /api/health` — health đơn giản không chứa secret.

Có ít nhất một ví dụ request/response JSON trong `docs/API.md`; tránh trùng business logic giữa API và Server Actions.

## 11. CẤU TRÚC REPOSITORY ĐỀ XUẤT

```
src/
  app/
    (public)/
    (auth)/
    (student)/
    admin/
    api/
  components/
    ui/
    layout/
    dashboard/
    curriculum/
    lesson/
    media/
    quiz/
  lib/
    supabase/
    auth/
    permissions/
    scheduling/
    curriculum/
    notion-import/
    google-drive/
    validations/
    utils/
  types/
supabase/
  migrations/
  seed.sql
scripts/
tests/
  unit/
  integration/
  e2e/
docs/
public/
.env.example
README.md
AGENTS.md
```

Cấu trúc có thể thay đổi nếu có lý do rõ nhưng phải nhất quán. Viết repository abstraction/service layer hợp lý, tránh mọi trang gọi query raw thiếu kiểm soát.

## 12. ENVIRONMENT VARIABLES

Tạo `.env.example` với placeholder + giải thích **client-safe** vs **server-only**. Gợi ý:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NOTION_API_TOKEN=
NOTION_ROOT_PAGE_ID=129db0ebd82b4b5cb9c13a343a937567
GOOGLE_DRIVE_ROOT_FOLDER_ID=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REFRESH_TOKEN=
CRON_SECRET=
```

Không yêu cầu hết keys để chạy app P0 locally nếu có seed demo; các phần thiếu credentials phải báo `Not configured` một cách chính xác. Giải thích rõ tài khoản Supabase project, redirect URLs cho Google OAuth, Vercel env và Supabase Auth URL config.

## 13. SECURITY + RELIABILITY + PERFORMANCE

- Supabase session cookie SSR, `@supabase/ssr`, server-side trusted user lookup/claims, auth redirect không tạo open redirect.
- Server actions/API validate authorization independently of proxy; RLS defense-in-depth.
- Service role key không bao giờ chạy ở browser; admin API check role thật tại server.
- Row-level isolation, password reset secure, CSRF/session considerations theo framework, input validation, HTML/Markdown sanitize, no public quiz answers.
- Log không ghi passwords, child PII, Google OAuth tokens hoặc confidential data.
- Admin writes có audit events; import jobs có error/summary.
- Có indexes cho progress/enrollment lookup, metadata fields tối thiểu, pagination admin.
- Không cache response chứa dữ liệu cá nhân công khai/shared cache; dùng no-store hoặc cache đúng phạm vi.
- Retry/backoff có giới hạn cho Notion/Google APIs; không chạy sync nặng trong request ngắn nếu vượt giới hạn Vercel, sử dụng background job/queue về sau, MVP CLI import là đủ.
- Trạng thái offline/online tối thiểu graceful; PWA tùy chọn, không cache tài liệu private sai cách.
- Không dùng Vercel Cron để tự động tăng `day_index` theo user mỗi đêm; ngày mở bài phải **tính từ start_date + timezone + lịch**, nên không phụ thuộc cron để hoạt động đúng. Cron chỉ phục vụ reminders/sync khi thật cần.

## 14. TEST PLAN — KHÔNG BỎ QUA

### Unit tests
- `getLocalToday`, `getUnlockDate`, `getDayStatus`, `calculateBacklog`.
- Hai user khác start_date; 23:59/00:01; leap-year; missed days; rest/review days; future lock; stale version.
- Parser Google Drive links (valid/invalid, malicious URLs), Notion source normalization/duplicate handling.
- Quiz grading and completion criteria.

### Integration/DB tests
- Supabase migrations apply cleanly, FK/unique/check constraints.
- Student A không thể select/update progress B.
- Student không thể tự nâng role admin hoặc sửa published lessons.
- Student không thể fetch locked lesson trực tiếp qua API.
- Quiz correct answers không xuất hiện ở public response trước submit.
- Admin import dry-run không sửa DB; commit idempotent.

### Playwright E2E
1. Đăng ký → xác thực phù hợp → onboarding → dashboard hiển thị ngày học đầu tiên.
2. Bắt đầu lesson → đánh dấu required blocks → quiz → lesson complete → progress cập nhật.
3. Đăng xuất/đăng nhập lại vẫn lưu tiến độ.
4. Người học ngày bắt đầu khác nhau nhận lịch khác nhau.
5. Bỏ học và học bù không mất bài cũ, future lessons bị khóa.
6. Admin tạo draft lesson, gắn URL Drive, preview, publish; student thấy đúng bài.
7. Mobile viewport 390px, tablet và desktop; không overflow, nút bấm hoạt động, trạng thái lỗi rõ ràng.
8. Tài liệu Drive thiếu quyền hiển thị lỗi thân thiện thay vì crash.

Cuối mỗi phase chạy các lệnh phù hợp như `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run test:e2e` (khi môi trường hỗ trợ). Không tuyên bố test pass nếu chưa thực sự chạy.

## 15. LỘ TRÌNH THỰC THI, THỨ TỰ ƯU TIÊN

**PHASE A — FOUNDATION**
- Audit repo / setup Next.js/TS/Tailwind/shadcn/ui.
- Supabase clients/env validation/auth + basic navigation.
- Schema migrations, RLS và seeds DEMO.
- Đăng ký, đăng nhập, reset password, onboarding.
- Tests auth/RLS.

**PHASE B — CORE DAILY LEARNING**
- Modeling program/version/calendar/day/lesson.
- Enrollment schedule, today/backlog/unlock rules.
- Dashboard, roadmap, day detail, lesson player, progress storage.
- Tests scheduling + API security.

**PHASE C — DRIVE + QUIZ**
- Admin add/validate Google Drive URL, asset metadata/provider abstraction.
- Lesson block renderers: rich text, PDF, audio, video, vocabulary, flashcards, external links.
- Quiz submission/grading/progress.
- E2E for daily learning.

**PHASE D — ADMIN + CONTENT IMPORT**
- CMS for curriculum and draft version, content editor, publish flow.
- Notion export importer and/or Notion API integration adapter, preview + dry-run + commit.
- Drive folder sync adapter if credentials available; document limitations and tested states.
- Content completeness and link health reports.

**PHASE E — HARDEN + DELIVERY**
- Responsive polish, loading/errors/empty state, accessibility, perf.
- Full lint/typecheck/tests/build, security review/RLS checks.
- `.env.example`, docs, migrations, seed, deployment checklist.
- Deploy to Vercel **chỉ khi có quyền project và được cấp credentials**, verify link và critical flows; nếu không, hướng dẫn deploy chính xác và ghi chưa deploy.

## 16. DEFINITION OF DONE — TIÊU CHÍ NGHIỆM THU MVP

MVP chỉ coi là hoàn thành khi:

1. Có repository Next.js chạy local được và build pass.
2. Có migrations Supabase thực sự, RLS và user auth.
3. Admin có thể tạo/publish một chương trình/bài hoàn chỉnh qua UI.
4. Người dùng A và B khác ngày bắt đầu có lịch độc lập.
5. User đăng nhập ngày kế tiếp thấy đúng bài hôm đó theo local date; bài cũ vẫn hiện khi chưa hoàn thành.
6. Student không truy cập nội dung chưa unlock hoặc dữ liệu học viên khác qua URL/API trực tiếp.
7. Bài có tài liệu Drive render preview hoặc fallback external link hợp lệ; file lỗi không crash app.
8. Bài kiểm tra chấm server-side, lưu attempt, không leak answer key trước submit.
9. Hoàn thành lesson lưu vào DB và được phục hồi sau refresh/re-login.
10. Import Notion export hoạt động với sample fixture và cho preview/dry-run/commit; không bịa nội dung gốc.
11. UI mobile hoàn chỉnh, không còn placeholder buttons cho P0.
12. Có README/.env.example/DB migrations/deploy guide/tests, kèm trạng thái test thực.

## 17. CÁCH BÁO CÁO VÀ TIẾP TỤC

Bắt đầu bằng:
1. Kiểm tra repo/current environment.
2. Tạo implementation plan/architecture.
3. Lập danh sách input còn thiếu: Supabase URL/key, Google Drive permissions/credentials, Notion export/API access, Vercel project. Các phần chưa được cung cấp **không làm dừng phát triển code độc lập**.
4. Tiến hành PHASE A và tiếp tục các phase kế tiếp khi có điều kiện.

Sau mỗi phase, cung cấp bảng: `Đã xong | Đang thiếu | Kiểm thử đã chạy | Bước tiếp theo`, bao gồm file paths và command để tôi tự chạy. Không chỉ mô tả code dự kiến: hãy sửa/tạo source files trong workspace và cung cấp kết quả thực.

**BÂY GIỜ HÃY BẮT ĐẦU TRIỂN KHAI ỨNG DỤNG THEO PHASE A; khi Phase A pass thì tiếp tục Phase B/C/D/E đến khi không còn phần nào có thể thực hiện hợp lý trong môi trường hiện tại.**

# KẾT THÚC PROMPT

---

## PROMPT TIẾP TỤC SAU KHI AI CODE BỊ NGẮT

Dán đoạn này ở cùng repository nếu Codex/Antigravity dừng giữa chừng:

> Tiếp tục triển khai project Chinese Learning Journey từ code hiện tại. Trước tiên đọc `AGENTS.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/TEST_REPORT.md`, kiểm tra git diff và trạng thái build/tests; xác định phase nào hoàn thành trên thực tế. Không làm lại hoặc xóa code hoạt động tốt. Triển khai phase chưa hoàn thành có ưu tiên cao nhất, chạy migration/tests/build liên quan, sửa lỗi và cập nhật docs. Không bịa bài từ Notion, không giả vờ có credentials hoặc đã deploy. Mục tiêu đạt tất cả tiêu chí MVP trong master prompt.

## PROMPT AUDIT CUỐI DỰ ÁN

> Hãy đóng vai security auditor + QA lead độc lập. Audit toàn bộ repository: Supabase RLS, server-side auth, role escalation, future lesson access, cross-user data leaks, quiz answer leaks, secrets, Google Drive permissions, Notion import idempotency, SSR caching, scheduling timezone, date arithmetic, responsive UX, Vercel deployment, migration reproducibility. Với mỗi lỗi: severity, cách tái hiện, file/line, bản sửa trực tiếp và test regression. Sau đó chạy lint/typecheck/unit/integration/E2E/build; phân biệt rõ PASS/FAIL/NOT RUN; lập production launch checklist.

## LINK TÀI LIỆU CHÍNH THỨC

- Next.js: https://nextjs.org/docs
- Supabase SSR: https://supabase.com/docs/guides/auth/server-side
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Vercel: https://vercel.com/docs
- Google Drive API: https://developers.google.com/workspace/drive/api/guides/about-sdk
- Google Drive search files: https://developers.google.com/workspace/drive/api/guides/search-files
- Notion API: https://developers.notion.com/reference/intro
- Antigravity: https://antigravity.google/docs/home
