# Cẩm Nang Quản Trị Viên (Admin Guide)

## 1. Giới thiệu Giao diện Admin CMS
Hệ thống quản trị LMS được truy cập tại đường dẫn `/admin`.
Chỉ những tài khoản có vai trò `admin` trong bảng `profiles` mới có quyền truy cập vào các tính năng quản lý.

---

## 2. Các phân hệ quản trị

### 2.1 Tổng quan (`/admin`)
- Hiển thị thống kê tổng thể: Tổng số bài học, phiên bản giáo trình đã xuất bản, số tài nguyên Google Drive, cảnh báo liên kết lỗi.
- Đường dẫn thao tác nhanh: Thêm bài học mới, kiểm tra link Drive, Nhập dữ liệu Notion.

### 2.2 Quản lý giáo trình (`/admin/curriculum`)
- Cây cấu trúc trực quan 4 cấp: **Tháng -> Tuần -> Ngày -> Bài học**.
- Thao tác:
  - Thêm / Sửa / Xóa Ngày học (`CurriculumDay`): Đặt loại ngày (`learning`, `review`, `quiz`, `rest`, `checkpoint`), số ngày lệch mở khóa (`unlock_offset_days`), thời gian ước tính.
  - Thêm / Sửa Bài học (`Lesson`): Tiêu đề, mô tả, đánh dấu bắt buộc.
  - Quản lý các khối bài học (`LessonBlock`): Thêm lý thuyết (Markdown), từ vựng, âm thanh, video Drive, file PDF, flashcard hoặc bài kiểm tra.

### 2.3 Quản lý tài nguyên Google Drive (`/admin/assets`)
- Nhập URL Google Drive (hỗ trợ link file, preview, open?id=, Google Docs, Sheets, Slides).
- Hệ thống tự động phân tích và xác thực domain an toàn, chống tấn công SSRF.
- Quản lý trạng thái tài nguyên: `verified` (đã xác thực), `unverified` (chờ kiểm tra), `missing` (lỗi quyền truy cập).

### 2.4 Nhập giáo trình từ Notion (`/admin/import`)
- Hỗ trợ tải lên file Markdown / JSON / CSV xuất từ Notion.
- Cơ chế **Chạy thử nghiệm (Dry Run)**:
  - Phân tích số lượng tháng, tuần, ngày, bài học tìm thấy.
  - Báo cáo lỗi liên kết Drive không hợp lệ hoặc thiếu dữ liệu.
  - Tính toán mã băm checksum SHA-256 đối soát.
- **Xác nhận Import**: Tạo ra một phiên bản giáo trình Dự thảo (`draft`) mới mà không ghi đè hoặc ảnh hưởng đến học viên đang học phiên bản cũ.

### 2.5 Quản lý phiên bản (`/admin/programs`)
- Liệt kê các phiên bản giáo trình: `draft`, `published`, `archived`.
- Nút **Xuất bản (Publish)** phiên bản mới sau khi kiểm tra đầy đủ.
- Học viên mới sẽ đăng ký vào phiên bản mới nhất; học viên cũ giữ nguyên tiến độ trên phiên bản hiện tại.

### 2.6 Quản lý học viên (`/admin/users`)
- Bảng danh sách học viên ẩn danh (bảo vệ quyền riêng tư & COPPA cho trẻ em).
- Xem tiến độ học tập %, chuỗi học tập (streak), và trạng thái học.
