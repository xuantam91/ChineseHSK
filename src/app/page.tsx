import React from 'react';
import Link from 'next/link';
import {
  Clock,
  RotateCcw,
  Mic,
  BookOpen,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
  Volume2,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEMO_MONTHS_OVERVIEW } from '@/lib/mock-data';

export default function LandingPage() {
  const featurePillars = [
    {
      icon: <Calendar className="w-5 h-5 text-emerald-700 stroke-[1.75]" />,
      title: 'Mở bài tự động mỗi ngày',
      desc: 'Kích hoạt bài học mới lúc 0h00 theo múi giờ Việt Nam (Asia/Ho_Chi_Minh). 25 phút mỗi ngày duy trì nhịp học ổn định, tránh quá tải.',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-emerald-700 stroke-[1.75]" />,
      title: 'Cơ chế học bù (Backlog)',
      desc: 'Tự động tổng hợp các ngày chưa hoàn thành vào danh sách học bù cuối tuần, giữ trọn vẹn chuỗi học tập mà không bị dồn ứ.',
    },
    {
      icon: <Mic className="w-5 h-5 text-emerald-700 stroke-[1.75]" />,
      title: 'Luyện nói & Shadowing AI',
      desc: 'Công nghệ phân tích âm thanh trực tiếp qua micro, nhận diện độ chuẩn xác thanh điệu và luyện nhại giọng theo phát âm Bắc Kinh.',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-700 stroke-[1.75]" />,
      title: 'Giáo trình chuẩn HSK 3.0',
      desc: 'Hệ thống hóa toàn bộ từ vựng, ngữ pháp và hội thoại từ HSK 1 đến HSK 6 theo tiêu chuẩn khảo thí mới nhất của Bộ Giáo dục Trung Quốc.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Khởi động (5 phút)',
      desc: 'Nắm vững từ vựng mới qua thẻ lật hai mặt, phiên âm Pinyin và audio phát âm người bản xứ.',
    },
    {
      step: '02',
      title: 'Khám phá (10 phút)',
      desc: 'Đọc hiểu ngữ cảnh hội thoại đời sống, sơ đồ tư duy ngữ pháp và phân tích nét chữ Hán.',
    },
    {
      step: '03',
      title: 'Thực chiến (10 phút)',
      desc: 'Luyện nói chấm điểm trực tiếp qua micro, luyện nhại âm Shadowing và làm trắc nghiệm phản xạ.',
    },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Hải Đăng',
      role: 'Kỹ sư phần mềm • Bắt đầu từ số 0',
      comment:
        'Cơ chế mở bài đúng 25 phút mỗi ngày giúp tôi duy trì thói quen học bền bỉ mà không bị ngợp. Trình chấm mic phát âm giúp tôi tự tin phân biệt rõ thanh 3 và thanh 4.',
      hsk: 'Đang học HSK 2',
    },
    {
      name: 'Trần Phương Linh',
      role: 'Sinh viên Ngoại thương',
      comment:
        'Lộ trình 12 tháng được phân chia rất khoa học theo chuẩn HSK 3.0 mới. Giao diện trực quan, dễ theo dõi tiến độ và hệ thống bài kiểm tra phản xạ rất thực tế.',
      hsk: 'Đạt HSK 3 sau 5 tháng',
    },
    {
      name: 'Lê Hoàng Nam',
      role: 'Chuyên viên xuất nhập khẩu',
      comment:
        'Tính năng học bù cuối tuần rất phù hợp với người đi làm bận rộn. Bỏ lỡ ngày trong tuần vẫn có thể bù đắp kiến thức mà không bị mất nhịp học.',
      hsk: 'Đang học HSK 4',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white font-bold text-lg shadow-xs">
              <span className="font-chinese">汉</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-900">
                  Chinese Journey
                </span>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  HSK 3.0
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/roadmap"
              className="hidden md:inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              Lộ trình học
            </Link>
            <Link
              href="/library"
              className="hidden md:inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              Thư viện tài liệu
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-700">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Vào học ngay
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Lộ trình HSK 3.0 • Tự học có hướng dẫn</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Làm chủ tiếng Trung tự học sau 12 tháng bài bản
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Chỉ <strong>25 phút mỗi ngày</strong>: Mở bài theo giờ sinh học Việt Nam, luyện nói chấm điểm AI, luyện phản xạ Shadowing và tích lũy kiến thức từ con số 0 đến tự tin giao tiếp.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 shadow-sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Bắt đầu học ngay
                  </Button>
                </Link>
                <Link href="/roadmap" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                  >
                    Xem chi tiết lộ trình
                  </Button>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Mở bài theo giờ Việt Nam
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Theo chuẩn khảo thí HSK 3.0
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Luyện nói chấm mic AI
                </span>
              </div>
            </div>

            {/* Right Column: Clean Product Mockup */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Bài học hôm nay</span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Ngày 1 • HSK 1
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">25 phút</span>
                </div>

                {/* Vocabulary Card */}
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/50 p-6 text-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Từ vựng cốt lõi #01
                  </span>
                  <div className="font-chinese text-5xl font-bold text-slate-900 tracking-wide">
                    你好
                  </div>
                  <div className="text-emerald-700 font-bold text-base mt-2">
                    nǐ hǎo
                  </div>
                  <div className="text-slate-600 text-sm mt-1">
                    Xin chào bạn (Chào hỏi thông dụng)
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Volume2 className="w-4 h-4 text-emerald-700" /> Giọng đọc bản xứ
                    </span>
                    <span className="font-semibold text-emerald-700">Nghe mẫu</span>
                  </div>
                </div>

                {/* Speech Metric Box */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Chấm điểm phát âm</span>
                      <span className="text-[11px] text-slate-500">Độ chuẩn thanh điệu: 96%</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Đạt chuẩn
                  </span>
                </div>

                {/* 7-Day Matrix */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="font-semibold text-slate-700">Tiến độ tuần này</span>
                    <span className="text-slate-500">5 / 7 ngày hoàn thành</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                      <div
                        key={d}
                        className={`py-1.5 rounded text-xs font-semibold ${
                          i < 5
                            ? 'bg-emerald-700 text-white'
                            : i === 5
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <div>{d}</div>
                        <div className="text-[10px] mt-0.5">{i < 5 ? '✓' : i === 5 ? '•' : '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/lesson/hsk1-01" className="block mt-5">
                  <Button
                    size="sm"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 rounded-lg shadow-2xs"
                  >
                    Xem bài học mẫu
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Highlights Grid */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Phương pháp thiết kế tối ưu cho thói quen tự học
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Giải quyết triệt để 3 nguyên nhân bỏ cuộc: phát âm sai không có người chỉnh, dồn bài quá tải và tài liệu thiếu hệ thống.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featurePillars.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    {feat.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Daily Methodology */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Quy trình học tập
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              3 Bước 25 phút mỗi ngày
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Khép kín vòng lặp Tiếp thu — Luyện tập — Kiểm chứng để kiến thức chuyển hóa thành phản xạ tự nhiên.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 shadow-2xs"
              >
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  Bước {s.step}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-4 mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12-Month Curriculum Roadmap Preview */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Lộ trình 12 tháng
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Cột mốc từng tháng theo chuẩn HSK 3.0
              </h2>
            </div>
            <Link href="/roadmap">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold border-slate-300 text-slate-700 hover:bg-white"
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Xem chi tiết 12 tháng
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_MONTHS_OVERVIEW.slice(0, 6).map((month) => (
              <div
                key={month.monthIndex}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {month.hskLevel}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{month.totalDays} ngày</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{month.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                    {month.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-medium">
                    {month.theme}
                  </span>
                  <Link
                    href="/roadmap"
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Phản hồi từ học viên
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-6xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {t.hsk}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Fresh Banner */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 text-white text-center">
        {/* Subtle decorative glow */}
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Sẵn sàng chinh phục tiếng Trung</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-2xs">
            Bắt đầu hành trình làm chủ Hán ngữ ngay hôm nay
          </h2>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            25 phút mỗi ngày với lộ trình khoa học, hướng dẫn khẩu hình Pinyin chi tiết và phản xạ giao tiếp tự nhiên.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm px-8 py-3 rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                Vào học ngay miễn phí
              </Button>
            </Link>
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/15 hover:bg-white/25 border-white/25 text-white backdrop-blur-xs text-sm font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Xem chi tiết lộ trình 12 tháng
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4">
          <p>© 2026 Chinese Learning Journey. Hệ thống tự học tiếng Trung theo chuẩn HSK 3.0.</p>
          <p className="mt-1 text-slate-400">
            Múi giờ Asia/Ho_Chi_Minh • Bảo vệ dữ liệu học viên
          </p>
        </div>
      </footer>
    </div>
  );
}
