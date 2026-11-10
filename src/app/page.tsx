import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Cloud,
  Layers,
  Clock,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  Star,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEMO_MONTHS_OVERVIEW } from '@/lib/mock-data';

export default function LandingPage() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-emerald-600" />,
      title: 'Mở bài thông minh mỗi ngày',
      desc: 'Lịch học tự động kích hoạt từng ngày dựa trên ngày bạn bắt đầu (Asia/Ho_Chi_Minh), giúp bạn duy trì nhịp học ổn định không quá tải.',
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      title: 'Học bù linh hoạt (Backlog)',
      desc: 'Bận rộn lỡ mất bài? Hệ thống tự động xếp vào danh sách bài tồn đọng để bạn học bù cuối tuần mà không bị mất dấu hay dồn ứ.',
    },
    {
      icon: <Cloud className="w-6 h-6 text-blue-600" />,
      title: 'Tích hợp Google Drive trực quan',
      desc: 'Toàn bộ giáo trình PDF chuẩn HSK, file audio giọng đọc bản xứ và video clip khẩu hình được kết nối an toàn, xem ngay trong app.',
    },
    {
      icon: <Layers className="w-6 h-6 text-purple-600" />,
      title: 'Lộ trình Notion chuẩn xác',
      desc: 'Toàn bộ 12 tháng được xây dựng dựa trên giáo trình tự học bài bản từ Pinyin nhập môn đến tự tin giao tiếp HSK 4 - 5.',
    },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Hải Đăng',
      role: 'Người đi làm (Bắt đầu từ số 0)',
      comment:
        'Nhờ cơ chế mở bài mỗi ngày 25 phút, mình không bị nản như khi tự xem sách giáo trình dày cộp. Sau 3 tháng đã tự tin nghe nói cơ bản!',
      rating: 5,
    },
    {
      name: 'Trần Phương Linh',
      role: 'Sinh viên năm 3',
      comment:
        'Hệ thống flashcard lật thẻ và audio Drive chuẩn giúp mình nhớ mặt chữ Hán cực kỳ nhanh. Tính năng học bù rất hợp với sinh viên!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col text-gray-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-[#fdfbf7]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-sm shadow-emerald-700/20">
              <span className="font-chinese text-xl">汉</span>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-gray-900">
                Chinese Journey
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Lộ trình 12 tháng
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Bắt đầu học ngay
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Hệ thống Tự học Tiếng Trung Thế hệ Mới</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Hành trình 12 tháng làm chủ tiếng Trung tự học từ{' '}
            <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy">
              con số 0
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Lộ trình mở bài hằng ngày theo múi giờ Việt Nam, tài nguyên Google Drive phong phú, flashcard phản xạ, bài kiểm tra không rò rỉ đáp án và cơ chế học bù linh hoạt.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Bắt đầu lộ trình miễn phí
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Khám phá bản Demo [DEMO]
              </Button>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              12 Tháng toàn diện
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Từ Pinyin đến HSK 5
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Tích hợp Google Drive an toàn
            </span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Được thiết kế tối ưu cho thói quen tự học
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Giải quyết triệt để 3 nguyên nhân bỏ cuộc: không biết bắt đầu từ đâu, mất phương hướng và bị dồn bài.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-gray-100 bg-[#fdfbf7]/50 p-6 transition-all hover:shadow-md hover:border-emerald-200"
              >
                <div className="p-3 bg-white rounded-xl shadow-xs w-fit mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12-Month Curriculum Roadmap Preview */}
      <section className="py-16 bg-[#fdfbf7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                Lộ trình chi tiết
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                12 Cột mốc chinh phục Hán ngữ
              </h2>
            </div>
            <Link href="/roadmap">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Xem toàn bộ lộ trình
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_MONTHS_OVERVIEW.slice(0, 6).map((month) => (
              <div
                key={month.monthIndex}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs hover:border-emerald-200 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                    {month.hskLevel}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{month.totalDays} ngày</span>
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-1.5">{month.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{month.description}</p>
                <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{month.theme}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Học viên nói gì về Chinese Journey?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-gray-100 bg-[#fdfbf7] p-6 shadow-xs"
              >
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed mb-4">
                  &ldquo;{t.comment}&rdquo;
                </p>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-emerald-900 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Sẵn sàng bắt đầu hành trình của bạn hôm nay?
          </h2>
          <p className="mt-3 text-emerald-200 text-sm sm:text-base max-w-xl mx-auto">
            Chỉ với 25-30 phút mỗi ngày theo múi giờ Việt Nam, tự tin làm chủ tiếng Trung sau 12 tháng.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold">
                Tạo lộ trình học của tôi ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-100 text-center text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4">
          <p>© 2026 Chinese Learning Journey. Xây dựng cho người tự học tiếng Trung tại Việt Nam.</p>
          <p className="mt-1 text-gray-400">
            Dữ liệu mẫu demo tuân thủ nguyên tắc giáo dục • Asia/Ho_Chi_Minh Timezone
          </p>
        </div>
      </footer>
    </div>
  );
}
