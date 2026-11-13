import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Cloud,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  BookOpen,
  Mic,
  Headphones,
  Flame,
  Award,
  ChevronRight,
  Check,
  Play,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEMO_MONTHS_OVERVIEW } from '@/lib/mock-data';

export default function LandingPage() {
  const featurePillars = [
    {
      icon: <Calendar className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: '⏰ Tự động',
      title: 'Mở bài mỗi ngày 0h00',
      desc: 'Kích hoạt bài học mới theo múi giờ Việt Nam (Asia/Ho_Chi_Minh). 25 phút/ngày giúp bạn duy trì nhịp học ổn định không bao giờ quá tải.',
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: '🔄 Linh hoạt',
      title: 'Học bù thông minh (Backlog)',
      desc: 'Bận rộn lỡ mất bài? Hệ thống tự động chuyển bài vào danh sách học bù cuối tuần, giữ nguyên chuỗi Streak 🔥 mà không lo dồn ứ.',
    },
    {
      icon: <Mic className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      badge: '🎙️ Chấm điểm AI',
      title: 'Luyện nói & Shadowing',
      desc: 'Thu âm đối chiếu giọng bản xứ Bắc Kinh, phân tích thanh điệu và nhận diện điểm phát âm tức thì qua trình chấm mic thông minh.',
    },
    {
      icon: <Cloud className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50 text-sky-600 border-sky-100',
      badge: '📚 Tài liệu sạch',
      title: 'Kho Google Drive an toàn',
      desc: 'Tích hợp toàn bộ sách PDF HSK chuẩn, audio mp3 người bản xứ và video clip giải phẫu khẩu hình mà không lo link hỏng hay mã độc.',
    },
  ];

  const levelBadges: Record<string, { icon: string; tag: string }> = {
    'HSK 1': { icon: '🌱', tag: 'Nhập môn Pinyin' },
    'HSK 2': { icon: '🌿', tag: 'Giao tiếp hàng ngày' },
    'HSK 3': { icon: '🌾', tag: 'Phản xạ đời sống' },
    'HSK 4': { icon: '🌳', tag: 'Thảo luận chuyên sâu' },
    'HSK 4 - 5': { icon: '🌲', tag: 'Tin tức & Thuyết trình' },
    'HSK 5': { icon: '🏔️', tag: 'Luyện đề bứt phá' },
    'HSK 5+': { icon: '👑', tag: 'Làm chủ Hán ngữ' },
  };

  const steps = [
    {
      step: '01',
      emoji: '🔤',
      title: 'Khởi động (5 phút)',
      desc: 'Lướt 6 từ vựng mới bằng Flashcard lật thẻ 3D và nghe phát âm chuẩn.',
    },
    {
      step: '02',
      emoji: '💬',
      title: 'Khám phá (10 phút)',
      desc: 'Đọc hội thoại ngữ cảnh đời sống, xem sơ đồ tư duy ngữ pháp trọng điểm.',
    },
    {
      step: '03',
      emoji: '🎙️',
      title: 'Thực chiến (10 phút)',
      desc: 'Luyện nói AI chấm mic, nhại âm Shadowing và làm trắc nghiệm nhận XP.',
    },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Hải Đăng',
      avatar: '👨‍💻',
      role: 'Kỹ sư phần mềm • Học từ số 0',
      comment:
        'Nhờ cơ chế mở bài mỗi ngày 25 phút, mình không bị ngợp. Trình chấm mic giọng nói và shadowing giúp mình tự tin phát âm đúng thanh 3 và thanh 4!',
      rating: 5,
      hsk: 'Đang học HSK 2',
    },
    {
      name: 'Trần Phương Linh',
      avatar: '👩‍🎓',
      role: 'Sinh viên năm 3 Ngoại thương',
      comment:
        'Lộ trình 12 tháng cực kỳ khoa học và chuẩn HSK 3.0. Flashcard lật thẻ và audio Drive chuẩn giúp mình nhớ mặt chữ Hán siêu nhanh mà không bị chán!',
      rating: 5,
      hsk: 'Đạt HSK 3 sau 5 tháng',
    },
    {
      name: 'Lê Hoàng Nam',
      avatar: '👨‍💼',
      role: 'Chuyên viên xuất nhập khẩu',
      comment:
        'Hệ thống học bù cuối tuần là vị cứu tinh của người đi làm! Lỡ bận 2 ngày trong tuần vẫn không mất Streak lửa 🔥 và bắt kịp tiến độ dễ dàng.',
      rating: 5,
      hsk: 'Đang học HSK 4',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col text-gray-900 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-[#fdfbf7]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 text-white font-black text-xl shadow-md shadow-emerald-600/20">
              <span>🐼</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-gray-900">
                  Chinese Journey
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <span>✨</span> HSK 3.0
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
                Lộ trình 12 tháng tự học thông minh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/roadmap"
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              <span>🗺️</span> Lộ trình
            </Link>
            <Link
              href="/library"
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              <span>📁</span> Kho Drive
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-bold text-gray-700">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-700/20 font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Vào học ngay
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
        {/* Decorative background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-72 bg-linear-to-tr from-emerald-200/40 via-teal-100/30 to-amber-100/40 blur-3xl -z-10 rounded-full" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>Phương Pháp Game Hóa • Tiếng Trung 12 Tháng Chuẩn HSK 3.0</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
                Tự học tiếng Trung{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-600 to-amber-600">
                  dễ như chơi game
                </span>{' '}
                từ con số 0 🎮
              </h1>

              <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Chỉ <strong>25 phút mỗi ngày</strong>: Mở bài theo nhịp sinh học, luyện nói AI chấm mic, nhại âm Shadowing chuẩn Bắc Kinh và tích lũy XP thăng hạng như game nhập vai.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-700/25 font-black text-white px-7"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    🚀 Bắt đầu học ngay (Miễn phí)
                  </Button>
                </Link>
                <Link href="/roadmap" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-gray-200 hover:bg-emerald-50 hover:text-emerald-800 font-bold"
                  >
                    🗺️ Xem toàn bộ lộ trình
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-gray-600">
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-2xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  Mở bài giờ Việt Nam (Asia/Ho_Chi_Minh)
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-2xs">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Streak lửa & XP Gems
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-teal-600" />
                  Đầy đủ HSK 1 đến HSK 6
                </span>
              </div>
            </div>

            {/* Right Column: Gamified Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl border-2 border-emerald-100 bg-white p-5 sm:p-6 shadow-xl shadow-emerald-950/5">
                {/* Card Top Pill */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🐼</span>
                    <div>
                      <p className="text-xs font-black text-gray-900">Nhiệm vụ hôm nay</p>
                      <p className="text-[11px] text-gray-400">Ngày 1: Chào hỏi & Pinyin</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      🔥 5 ngày
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      💎 +50 XP
                    </span>
                  </div>
                </div>

                {/* Hanzi Practice Card */}
                <div className="mt-4 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 p-5 text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-2 -bottom-4 text-7xl font-chinese opacity-15 select-none pointer-events-none">
                    你好
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                      Từ vựng cốt lõi
                    </span>
                    <span className="text-[11px] font-bold text-emerald-100">HSK 1 • #001</span>
                  </div>
                  <div className="text-center py-2">
                    <div className="font-chinese text-4xl sm:text-5xl font-black tracking-wide drop-shadow-xs">
                      你好
                    </div>
                    <div className="text-emerald-100 font-bold text-sm sm:text-base mt-1">
                      nǐ hǎo
                    </div>
                    <div className="text-white/90 text-xs font-medium mt-1">
                      Xin chào bạn! (Chào thân mật)
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/20 text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-4 h-4" /> Giọng Bắc Kinh chuẩn
                    </span>
                    <span className="bg-white text-emerald-800 font-black px-2.5 py-1 rounded-lg text-[11px] shadow-2xs">
                      Phát âm mẫu 🔊
                    </span>
                  </div>
                </div>

                {/* AI Speech Score Widget */}
                <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-100 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-xs">
                      <Mic className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-rose-950">Chấm mic phát âm</span>
                        <span className="text-[10px] font-extrabold bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                          AI
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-800 font-medium">Độ chính xác thanh điệu: 96%</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-600 bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-emerald-100">
                    Xuất sắc ⭐
                  </span>
                </div>

                {/* 7-Day Streak Pills */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-gray-600">Chuỗi học tập tuần này</span>
                    <span className="text-[11px] font-extrabold text-emerald-700">5/7 ngày hoàn thành</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                      <div
                        key={d}
                        className={`py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          i < 5
                            ? 'bg-emerald-500 text-white shadow-2xs'
                            : i === 5
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <div>{d}</div>
                        <div className="text-[9px] mt-0.5">{i < 5 ? '✓' : i === 5 ? '🔥' : '🔒'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button in Card */}
                <Link href="/lesson/hsk1-01" className="block mt-4">
                  <div className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl text-center shadow-md transition-all flex items-center justify-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Học thử Bài 1 ngay bây giờ</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Highlights Grid */}
      <section className="py-14 sm:py-20 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              💎 Trải nghiệm độc bản
            </span>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black text-gray-900">
              Học ít nhưng nhớ sâu, không áp lực
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Giải quyết triệt để 3 nỗi sợ: phát âm sai, lười học dồn bài, và thiếu tài liệu bản ngữ chuẩn.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featurePillars.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-gray-100 bg-[#fdfbf7]/60 p-6 transition-all hover:shadow-lg hover:shadow-emerald-900/5 hover:border-emerald-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl border ${feat.bg} shadow-2xs`}>
                      {feat.icon}
                    </div>
                    <span className="text-[11px] font-extrabold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-100">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Daily Routine */}
      <section className="py-14 sm:py-20 bg-[#fdfbf7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              ⚡ Phương pháp 25 phút
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900">
              Vòng lặp học tập chuẩn khoa học mỗi ngày
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              3 bước khép kín giúp biến kiến thức thụ động thành phản xạ giao tiếp tự nhiên.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs hover:border-emerald-200 transition-all text-center"
              >
                <div className="text-3xl mb-3">{s.emoji}</div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Bước {s.step}
                </span>
                <h3 className="font-extrabold text-gray-900 text-base mt-3 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12-Month Curriculum Roadmap Preview */}
      <section className="py-14 sm:py-20 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                🗺️ Lộ trình 12 tháng
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900">
                12 Cột mốc chinh phục Hán ngữ
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Thiết kế theo chuẩn HSK 3.0 mới nhất từ nhập môn đến HSK 5+.
              </p>
            </div>
            <Link href="/roadmap">
              <Button
                variant="outline"
                size="sm"
                className="font-bold border-gray-200 hover:bg-emerald-50 hover:text-emerald-800"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Xem chi tiết 12 tháng
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_MONTHS_OVERVIEW.slice(0, 6).map((month) => {
              const badge = levelBadges[month.hskLevel] || { icon: '📖', tag: 'Hán ngữ' };
              return (
                <div
                  key={month.monthIndex}
                  className="rounded-3xl border border-gray-100 bg-[#fdfbf7]/80 p-5 shadow-2xs hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-100/70 text-emerald-800">
                        <span>{badge.icon}</span> {month.hskLevel}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold">{month.totalDays} ngày</span>
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-base mb-1.5">{month.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                      {month.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100/80 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{month.theme}</span>
                    </span>
                    <Link
                      href="/roadmap"
                      className="text-xs font-bold text-gray-400 hover:text-emerald-700 flex items-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 sm:py-20 bg-[#fdfbf7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              ⭐ Cảm nhận học viên
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900">
              Học viên nói gì về Chinese Journey?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-6xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                      {t.hsk}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed mb-4">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm">{t.name}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 bg-linear-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white text-center relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-1 text-4xl mb-4">
            <span>🐼</span>
            <span>✨</span>
            <span>🔥</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Sẵn sàng làm chủ tiếng Trung hôm nay?
          </h2>
          <p className="mt-3 text-emerald-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Chỉ với 25 phút mỗi ngày theo múi giờ Việt Nam, tự tin giao tiếp và thi đỗ HSK sau 12 tháng.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-amber-400 text-amber-950 hover:bg-amber-300 font-black shadow-lg shadow-amber-400/20 px-8"
              >
                🚀 Bắt đầu học ngay — Hoàn toàn miễn phí
              </Button>
            </Link>
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-emerald-700 text-emerald-100 hover:bg-emerald-800/50 font-bold"
              >
                🗺️ Khám phá lộ trình chi tiết
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-100 text-center text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-base">🐼</span>
            <span className="font-extrabold text-gray-800">Chinese Journey</span>
            <span className="text-gray-300">•</span>
            <span>Chuẩn HSK 3.0</span>
          </div>
          <p>© 2026 Chinese Learning Journey. Xây dựng cho người tự học tiếng Trung tại Việt Nam.</p>
          <p className="mt-1 text-gray-400">
            Múi giờ Asia/Ho_Chi_Minh • Lộ trình 12 tháng • Bảo vệ dữ liệu người dùng
          </p>
        </div>
      </footer>
    </div>
  );
}
