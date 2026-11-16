# Hướng dẫn Triển khai Production (Release v1.0.0) lên Supabase & Vercel

Tài liệu này hướng dẫn từng bước để khởi tạo cơ sở dữ liệu trên **Supabase**, cấu hình biến môi trường bảo mật và triển khai ứng dụng **Chinese Learning Journey (HSK 1–9)** lên **Vercel Production**.

---

## 1. Cấu hình Cơ sở dữ liệu & Xác thực trên Supabase

### Bước 1.1: Tạo Project mới trên Supabase
1. Truy cập [https://supabase.com/dashboard](https://supabase.com/dashboard) và bấm **New Project**.
2. Chọn **Organization**, đặt tên dự án (ví dụ: `chinese-hsk-prod`), đặt mật khẩu Database và chọn Region gần người dùng Việt Nam nhất (**Singapore `ap-southeast-1`**).
3. Đợi khoảng 1–2 phút để Supabase khởi tạo xong PostgreSQL database.

### Bước 1.2: Chạy SQL Schema Migration & RLS (Row-Level Security)
1. Trên thanh menu trái của Supabase Dashboard, mở **SQL Editor** → bấm **New query**.
2. Mở file [`supabase/migrations/20261110000000_init_schema.sql`](./supabase/migrations/20261110000000_init_schema.sql) trong kho mã nguồn, sao chép toàn bộ nội dung dán vào SQL Editor và bấm **Run**.
   - Script này sẽ tự động tạo toàn bộ bảng (`profiles`, `programs`, `curriculum_months`, `curriculum_days`, `lessons`, `lesson_blocks`, `student_progress`, `quiz_attempts`, v.v.) cùng toàn bộ chính sách bảo mật **Row-Level Security (RLS)**.
3. *(Tùy chọn)* Để nạp thêm dữ liệu khởi tạo mẫu vào DB, tạo thêm một query mới trong **SQL Editor**, dán nội dung file [`supabase/seed.sql`](./supabase/seed.sql) và bấm **Run**.

### Bước 1.3: Cấu hình Authentication (Đăng ký / Đăng nhập)
1. Vào mục **Authentication** → **Providers** → đảm bảo **Email** đang được bật (**Enabled**).
2. Vào **Authentication** → **URL Configuration**:
   - **Site URL**: Điền domain chính thức của bạn trên Vercel (ví dụ: `https://chinese-hsk.vercel.app`).
   - **Redirect URLs**: Thêm `https://chinese-hsk.vercel.app/**` và `http://localhost:3000/**`.

### Bước 1.4: Lấy thông tin API Keys của Supabase
Vào **Project Settings** (biểu tượng bánh răng) → **API**:
- **Project URL**: Sao chép để gán vào `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key**: Sao chép để gán vào `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role / secret key**: Sao chép để gán vào `SUPABASE_SERVICE_ROLE_KEY` *(Tuyệt đối chỉ lưu trên biến môi trường Server của Vercel, không đưa ra phía client)*.

---

## 2. Triển khai Ứng dụng lên Vercel (Production)

### Bước 2.1: Kết nối GitHub Repository với Vercel
1. Truy cập [https://vercel.com/new](https://vercel.com/new) và đăng nhập bằng tài khoản GitHub của bạn.
2. Tìm repository **`xuantam91/ChineseHSK`** và bấm **Import**.
3. Giữ nguyên cấu hình mặc định của Next.js:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next`

### Bước 2.2: Khai báo Biến môi trường (Environment Variables) trên Vercel
Trong phần **Environment Variables** trên Vercel, thêm đầy đủ các biến sau (áp dụng cho cả `Production`, `Preview`, `Development`):

| Tên biến | Giá trị | Ghi chú |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `https://ten-mien-cua-ban.vercel.app` | URL chính thức của web |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` | Lấy từ Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Anon Public Key từ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Service Role Key (Chỉ dùng ở Server API) |
| `USE_MOCK_SUPABASE` | `false` | Đặt `false` trên Production để dùng Supabase thật (hoặc `true` nếu muốn chạy độc lập không cần DB) |
| `NOTION_API_TOKEN` | *(Tùy chọn)* | Token tích hợp Notion nếu dùng đồng bộ CMS |
| `NOTION_ROOT_PAGE_ID` | `129db0ebd82b4b5cb9c13a343a937567` | ID trang gốc Notion |

### Bước 2.3: Bấm Deploy & Kiểm tra
1. Bấm **Deploy** và đợi khoảng 60–90 giây để Vercel build bản Production.
2. Sau khi deploy xong, mở URL ứng dụng và kiểm tra:
   - **Trang chủ (`/`)**: Hiển thị lộ trình HSK 1–9, nút vào học thử.
   - **Tài khoản Học thử Demo (`/login` → Học viên Demo)**: Chỉ hiển thị và cho phép học thử **3 bài đầu tiên** của mỗi cấp độ HSK (`Bài 1` → `Bài 3`), từ `Bài 4` đến `Bài 20` yêu cầu đăng ký/đăng nhập tài khoản chính thức.
   - **Tài khoản Chính thức (`/register` hoặc đăng nhập email học viên)**: Mở khóa trọn bộ **20 bài học/cấp độ (120 bài từ HSK 1 đến HSK 6)** kèm trang bìa bài học, phát âm tự động 3–1–3, mini-quiz từng phần và video bài giảng online.

---

## 3. Lệnh Kiểm tra Build Cục bộ trước khi Release

Bạn có thể chạy kiểm tra toàn bộ hệ thống trên máy cá nhân bất cứ lúc nào bằng các lệnh:

```bash
# 1. Kiểm tra kiểu dữ liệu TypeScript nghiêm ngặt
npm run typecheck

# 2. Chạy toàn bộ 18 bộ kiểm thử tự động (136 unit & API tests)
npm test

# 3. Build thử bản Production của Next.js
npm run build
```
