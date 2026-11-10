# Hướng Dẫn Nhập Giáo Trình Notion (Content Import Pipeline)

## 1. Nguyên tắc quan trọng
Theo Nguyên tắc số 1 & số 5 trong tài liệu kiến trúc:
1. **Không tự bịa đặt nội dung thật**: Dữ liệu có sẵn trong mã nguồn chỉ là seed `[DEMO]`. Toàn bộ nội dung thật phải được nhập từ Notion đã xác minh.
2. **Không làm gián đoạn học viên đang học**: Quá trình nhập luôn tạo ra một bản `draft` trong `program_versions`. Chỉ khi quản trị viên bấm "Publish", phiên bản đó mới có hiệu lực cho học viên mới.

---

## 2. Các định dạng Notion được hỗ trợ

### Định dạng A: Notion Markdown Export (Khuyến nghị)
Xuất trang Notion lộ trình dưới dạng Markdown (.md) và nạp vào hệ thống.
Cấu trúc tiêu đề được nhận diện tự động:
```markdown
# Tháng 1: Nhập môn & Bảng phiên âm Pinyin

## Tuần 1: Thanh mẫu, Vận mẫu & 4 Thanh điệu

### Ngày 1: Chào hỏi cơ bản
- Loại ngày: learning
- Thời gian: 30 phút

#### Bài 1: Phát âm 你好 (nǐ hǎo)
Chào mừng bạn đến với bài học đầu tiên!
Quy tắc biến điệu thanh ba: Khi hai âm tiết thanh ba đi liền nhau...

- Từ vựng: 你好 | nǐ hǎo | Xin chào | 你好！很高兴认识你。
- Tài liệu: https://drive.google.com/file/d/1A2B3C4D5E6F/view
```

### Định dạng B: Structured JSON
Dành cho trường hợp import tự động hoặc chuyển đổi từ hệ thống khác:
```json
{
  "title": "Chương trình tự học tiếng Trung 12 tháng",
  "months": [
    {
      "monthIndex": 1,
      "title": "Tháng 1: Nhập môn & Bảng phiên âm Pinyin",
      "weeks": [
        {
          "weekIndex": 1,
          "title": "Tuần 1: Thanh mẫu, Vận mẫu",
          "days": [...]
        }
      ]
    }
  ]
}
```

---

## 3. Quy trình thực hiện Import an toàn

1. Truy cập `/admin/import`.
2. Dán nội dung Markdown hoặc tải file lên.
3. Bấm **Chạy thử nghiệm (Dry Run)**:
   - Hệ thống tiến hành bóc tách cấu trúc cây.
   - Kiểm tra trùng lặp `day_index`.
   - Kiểm tra và xác thực các link Google Drive (phát hiện link hỏng/malicious).
   - Hiển thị bảng tổng kết: số tháng, số tuần, số ngày, số bài học và danh sách cảnh báo.
4. Kiểm tra kỹ báo cáo trước khi nhấn **Xác nhận Import vào Version Mới**.
5. Sau khi import xong, chuyển sang `/admin/curriculum` để xem lại từng khối bài học, sau đó sang `/admin/programs` để xuất bản.
