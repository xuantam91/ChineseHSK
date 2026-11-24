'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock,
  RotateCcw,
  Mic,
  BookOpen,
  ArrowRight,
  Star,
  ChevronRight,
  Volume2,
  Sparkles,
  Headphones,
  Film,
  Menu,
  X,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { speakChinese, TTSVoicePersona, TTS_PERSONAS } from '@/lib/tts';

const INTERACTIVE_WORDS = [
  {
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Xin chào bạn (Chào hỏi thông dụng)',
    tip: 'Biến điệu 3+3: âm đầu "你" đọc thành thanh 2 (ní hǎo).',
    example: '你好！很高兴认识你。',
    exampleVi: 'Chào bạn! Rất vui được làm quen với bạn.',
  },
  {
    hanzi: '谢谢',
    pinyin: 'xiè xie',
    meaning: 'Cảm ơn bạn (Lời cảm ơn chân thành)',
    tip: 'Thanh 4 rơi dốc gắt, âm thứ hai đọc khinh thanh nhẹ.',
    example: '太谢谢你了！',
    exampleVi: 'Cảm ơn bạn rất nhiều!',
  },
  {
    hanzi: '加油',
    pinyin: 'jiā yóu',
    meaning: 'Cố lên! Nỗ lực lên! (Khích lệ)',
    tip: 'Thanh 1 ngân ngang đều, thanh 2 vuốt dốc lên cao.',
    example: '明天考试，加油！',
    exampleVi: 'Ngày mai thi rồi, cố lên nhé!',
  },
  {
    hanzi: '中国',
    pinyin: 'zhōng guó',
    meaning: 'Trung Quốc (Tên quốc gia)',
    tip: 'Âm cong lưỡi "zh" tròn vành rõ chữ, kết hợp thanh 1 + 2.',
    example: '我想去中国旅游。',
    exampleVi: 'Tôi muốn đi du lịch Trung Quốc.',
  },
];

// Streamlined top-level navigation (4 concise items)
const NAV_LINKS = [
  { href: '#phuong-phap', label: 'Phương pháp' },
  { href: '/roadmap', label: 'Lộ trình 120 bài' },
  { href: '/library', label: 'Thư viện' },
  { href: '#faq', label: 'Hỏi đáp' },
];

const FAQS = [
  {
    q: 'Chưa biết gì (mất gốc hoặc bắt đầu từ số 0) có học được không?',
    a: 'Có. Lộ trình HSK 1 khởi đầu từ bảng phiên âm Pinyin chuẩn Bắc Kinh (21 thanh mẫu, 36 vận mẫu, 4 thanh điệu), có hướng dẫn khẩu hình và nghe lặp lại trước khi ghép câu.',
  },
  {
    q: 'Tài khoản Học viên Demo được trải nghiệm những gì?',
    a: 'Bạn được học thử miễn phí 3 bài đầu tiên ở mỗi cấp độ (từ HSK 1 đến HSK 6), đầy đủ flashcard, luyện nói chấm mic AI, mini-quiz và video bài giảng có phụ đề.',
  },
  {
    q: 'Tính năng mở bài lúc 00:00 theo giờ Việt Nam hoạt động thế nào?',
    a: 'Hệ thống tính ngày mở khóa theo múi giờ Asia/Ho_Chi_Minh, mỗi ngày 1 bài ~25 phút để giữ nhịp bền bỉ và gom bài bận vào mục học bù cuối tuần.',
  },
  {
    q: 'Tôi có thể học trên cả MacBook và điện thoại / trình duyệt web không?',
    a: 'Có. Tài khoản đăng ký đồng bộ trên trình duyệt web (hsk.globy.tech) và ứng dụng desktop, hỗ trợ tốt micro luyện nói và phát âm thanh chuẩn trên các trình duyệt hiện đại.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<TTSVoicePersona>('female');
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micTested, setMicTested] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      router.replace(`/auth/callback?code=${encodeURIComponent(code)}`);
    }
  }, [router]);

  const activeWord = INTERACTIVE_WORDS[activeWordIndex];

  const handlePlayAudio = (text: string) => {
    setIsPlayingAudio(true);
    speakChinese(text, {
      persona: selectedPersona,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleTestMicDemo = () => {
    setIsTestingMic(true);
    setMicTested(false);
    setTimeout(() => {
      setIsTestingMic(false);
      setMicTested(true);
    }, 1000);
  };

  const featurePillars = [
    {
      badge: 'Chống ngọng ngữ âm',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <Mic className="w-5 h-5 text-emerald-700 stroke-[2]" />,
      title: 'Luyện Phát Âm & Chấm Mic AI',
      desc: 'Phân tích 4 thanh điệu chuẩn giọng Bắc Kinh, phát hiện lỗi dính âm và biến điệu 3+3 ngay từ bài học đầu tiên.',
    },
    {
      badge: 'Nhịp học sinh học',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: <Clock className="w-5 h-5 text-teal-700 stroke-[2]" />,
      title: 'Vòng Lặp 25 Phút Mỗi Ngày',
      desc: 'Mở khóa bài mới lúc 00:00 giờ Việt Nam. Thời lượng 25 phút cô đọng giúp ghi nhớ sâu mà không bị quá tải.',
    },
    {
      badge: 'Chống nản bền bỉ',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
      icon: <RotateCcw className="w-5 h-5 text-amber-600 stroke-[2]" />,
      title: 'Học Bù Tồn Đọng (Backlog)',
      desc: 'Ngày bận rộn? Hệ thống tự gom bài còn thiếu vào danh sách học bù cuối tuần để duy trì chuỗi tiến độ.',
    },
    {
      badge: 'Chuẩn học thuật BLCUP',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: <BookOpen className="w-5 h-5 text-emerald-800 stroke-[2]" />,
      title: 'Giáo Trình Chuẩn HSK 3.0',
      desc: '120 bài học phân cấp từ HSK 1 đến HSK 6 cùng khung nâng cao HSK 7–9 bám sát tiêu chuẩn Hán ngữ mới.',
    },
  ];

  const roadStages = [
    {
      stage: 'Giai đoạn 1',
      hsk: 'HSK 1 • Tháng 1–3',
      vocab: '500 từ cốt lõi',
      target: 'Làm chủ 21 thanh mẫu, 36 vận mẫu, 4 thanh điệu và đối thoại chào hỏi, mua sắm căn bản.',
      highlight: 'Xây móng ngữ âm vững chắc',
    },
    {
      stage: 'Giai đoạn 2',
      hsk: 'HSK 2 • Tháng 4–6',
      vocab: '1.272 từ vựng',
      target: 'Phản xạ giao tiếp đời sống tự nhiên: gọi món, hỏi đường, thời tiết, đi lại và sinh hoạt.',
      highlight: 'Tự tin du lịch & giao tiếp',
    },
    {
      stage: 'Giai đoạn 3',
      hsk: 'HSK 3–4 • Tháng 7–9',
      vocab: '2.245–3.245 từ',
      target: 'Làm chủ câu chữ 把, chữ 被, đàm thoại công sở, phỏng vấn và xem phim có phụ đề.',
      highlight: 'Ứng dụng công việc & du học',
    },
    {
      stage: 'Giai đoạn 4',
      hsk: 'HSK 5–6 • Tháng 10–12',
      vocab: '5.000+ từ vựng',
      target: 'Đọc hiểu báo chí, diễn thuyết lưu loát, làm việc trực tiếp với đối tác Trung Quốc bản xứ.',
      highlight: 'Thành thạo chuyên sâu học thuật',
    },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Hải Đăng',
      role: 'Kỹ sư phần mềm • Bắt đầu từ số 0',
      comment:
        'Nhịp 25 phút mỗi ngày rất hợp với người đi làm bận rộn. Trình chấm mic phát âm giúp tôi phân biệt rành rọt thanh 3 và thanh 4 mà không còn sợ nói sai.',
      hsk: 'Đang chinh phục HSK 2',
      rating: 5,
    },
    {
      name: 'Trần Phương Linh',
      role: 'Sinh viên Ngoại thương • Thi chứng chỉ',
      comment:
        'Lộ trình 12 tháng phân bổ chi tiết theo chuẩn HSK 3.0. Kho sách PDF và video khẩu hình trong thư viện giúp tôi tự ôn thi rất tiết kiệm và chủ động.',
      hsk: 'Đạt HSK 3 sau 5 tháng',
      rating: 5,
    },
    {
      name: 'Chị Mai Lan & Bé Bảo Nam',
      role: 'Phụ huynh đồng hành cùng con',
      comment:
        'Bé rất thích các video bài hát thiếu nhi và flashcard tương tác trên web. Hình ảnh trực quan, phát âm bản xứ rõ chữ giúp con tiếp thu rất tự nhiên.',
      hsk: 'Tự tin đàm thoại cơ bản',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Clean Sticky Navigation Bar (4 concise links) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 sm:h-16 max-w-[1400px] items-center justify-between px-4 sm:px-8 lg:px-12 gap-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group min-w-0 shrink-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-base sm:text-lg shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <span className="font-chinese">汉</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                  Chinese Journey
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  HSK 3.0
                </span>
              </div>
              <span className="hidden md:block text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Tự học tiếng Trung bài bản
              </span>
            </div>
          </Link>

          {/* Center Desktop Nav — Simplified to 4 clean items */}
          <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((item) =>
              item.href.startsWith('#') ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Auth & CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="text-sm font-semibold text-slate-700 px-3">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs px-3 sm:px-4 whitespace-nowrap"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Vào học ngay
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Mở menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_LINKS.map((item) =>
                item.href.startsWith('#') ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full text-xs font-bold">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full text-xs font-bold bg-emerald-700">
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section — Wide, airy, laptop-fitted, zero horizontal overflow on mobile */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-white lg:min-h-[calc(100dvh-4rem)] flex items-center py-6 sm:py-10 lg:py-8">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-30 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="hidden sm:block absolute -top-24 right-0 w-[34rem] h-[34rem] rounded-full bg-emerald-100/45 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="hidden sm:block absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-50/70 blur-3xl pointer-events-none"
          />

          <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-8 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
              {/* Left Column: Value Proposition (Spacious & Wide) */}
              <div className="lg:col-span-6 xl:col-span-7 min-w-0 text-center lg:text-left space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-[11px] sm:text-xs font-bold text-emerald-900 shadow-2xs max-w-full">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
                  <span className="truncate">Khung chuẩn HSK 3.0 • 25 phút mỗi ngày cùng AI</span>
                </div>

                <h1 className="text-[28px] sm:text-4xl lg:text-5xl xl:text-[56px] font-extrabold text-slate-900 tracking-tight leading-[1.12] text-balance">
                  Chinh Phục Tiếng Trung{' '}
                  <span className="block bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 bg-clip-text text-transparent mt-1">
                    Chuẩn Bản Xứ Bắc Kinh
                  </span>
                </h1>

                <p className="text-sm sm:text-base xl:text-[17px] text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Không học vẹt, không nản chí. Tự học bài bản từ con số 0 với{' '}
                  <strong className="text-slate-900">luyện nói chấm mic AI</strong>, mở bài lúc 00:00 theo giờ Việt Nam cùng kho video có phụ đề và giáo trình BLCUP chính thống.
                </p>

                {/* Primary CTAs */}
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-emerald-950 font-extrabold text-sm sm:text-base px-6 xl:px-7 py-3.5 rounded-xl shadow-md shadow-amber-500/15 transition-all"
                      rightIcon={<ArrowRight className="w-4 h-4 text-emerald-950 stroke-[2.5]" />}
                    >
                      Bắt đầu học thử miễn phí
                    </Button>
                  </Link>
                  <Link href="/roadmap" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-slate-300 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 text-sm sm:text-base font-bold px-5 xl:px-6 py-3.5 rounded-xl shadow-2xs transition-all"
                    >
                      Xem lộ trình 120 bài
                    </Button>
                  </Link>
                </div>

                {/* Compact Structured Trust Metrics (Mobile-safe grid) */}
                <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto lg:mx-0 text-left">
                  <div className="rounded-xl bg-slate-50/90 border border-slate-200/80 px-2.5 sm:px-3.5 py-2 sm:py-2.5 min-w-0">
                    <div className="text-xs sm:text-base font-extrabold text-emerald-800 tabular-nums">
                      120 bài
                    </div>
                    <div className="text-[10px] sm:text-xs font-medium text-slate-600 leading-tight mt-0.5">
                      Chuẩn HSK 1–6
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50/90 border border-slate-200/80 px-2.5 sm:px-3.5 py-2 sm:py-2.5 min-w-0">
                    <div className="text-xs sm:text-base font-extrabold text-emerald-800 tabular-nums">
                      25 phút
                    </div>
                    <div className="text-[10px] sm:text-xs font-medium text-slate-600 leading-tight mt-0.5">
                      Mở bài 00:00 VN
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50/90 border border-slate-200/80 px-2.5 sm:px-3.5 py-2 sm:py-2.5 min-w-0">
                    <div className="text-xs sm:text-base font-extrabold text-emerald-800">
                      Mic AI
                    </div>
                    <div className="text-[10px] sm:text-xs font-medium text-slate-600 leading-tight mt-0.5">
                      Chấm thanh điệu
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Pronunciation Studio Card (Fits laptop viewport cleanly & zero mobile overflow) */}
              <div className="lg:col-span-6 xl:col-span-5 min-w-0 w-full">
                <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/35 p-3.5 sm:p-5 shadow-lg shadow-emerald-950/5 space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-emerald-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        Thử phát âm trực tiếp
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                      Bản xứ Bắc Kinh
                    </span>
                  </div>

                  {/* Word Selector Tabs */}
                  <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200">
                    {INTERACTIVE_WORDS.map((item, idx) => (
                      <button
                        key={item.hanzi}
                        type="button"
                        onClick={() => setActiveWordIndex(idx)}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          idx === activeWordIndex
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        {item.hanzi}
                      </button>
                    ))}
                  </div>

                  {/* Voice Persona Selector (Stacked cleanly on tiny screens, inline on sm+) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                      Giọng đọc bản ngữ:
                    </span>
                    <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200 flex-1">
                      {[
                        { key: 'female', label: 'Nữ' },
                        { key: 'male', label: 'Nam' },
                        { key: 'adult', label: 'Thầy/Cô' },
                        { key: 'child', label: 'Trẻ em' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setSelectedPersona(item.key as TTSVoicePersona)}
                          className={`py-1 px-1 text-[11px] font-bold rounded-md transition-all cursor-pointer truncate ${
                            selectedPersona === item.key
                              ? 'bg-white text-emerald-800 shadow-2xs border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Word Display Panel */}
                  <div className="rounded-xl border border-emerald-100 bg-white p-3.5 sm:p-4 text-center shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span className="tabular-nums shrink-0">Mẫu #{activeWordIndex + 1}/4</span>
                      <span className="text-emerald-700 font-semibold truncate">
                        {TTS_PERSONAS[selectedPersona].subtitleVi}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-center gap-2.5 sm:gap-3 flex-wrap">
                      <span className="font-chinese text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-wide">
                        {activeWord.hanzi}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-emerald-700 font-mono">
                        {activeWord.pinyin}
                      </span>
                    </div>

                    <div className="text-xs sm:text-[13px] text-slate-700 font-medium">
                      {activeWord.meaning}
                    </div>

                    {/* Compact Phonetic Tip */}
                    <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 text-left flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        <strong className="text-slate-800">Mẹo:</strong> {activeWord.tip}
                      </span>
                    </div>

                    {/* Side-by-side Audio Controls */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(activeWord.hanzi)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                        <span>{isPlayingAudio ? 'Đang phát...' : 'Nghe từ chuẩn'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePlayAudio(activeWord.example)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/50 active:scale-[0.98] text-emerald-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Nghe câu ví dụ</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 pt-0.5 leading-snug break-words">
                      <span className="font-chinese font-semibold text-slate-700">
                        “{activeWord.example}”
                      </span>{' '}
                      — {activeWord.exampleVi}
                    </p>
                  </div>

                  {/* Interactive AI Speech Score Bar */}
                  <div className="rounded-xl border border-slate-200 bg-white px-3 sm:px-3.5 py-2.5 flex items-center justify-between shadow-2xs gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={handleTestMicDemo}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 transition-all cursor-pointer ${
                          isTestingMic
                            ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}
                        title="Bấm để thử chấm điểm phát âm AI"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                          {isTestingMic
                            ? 'Đang phân tích thanh điệu...'
                            : micTested
                            ? `Chấm âm "${activeWord.hanzi}": 98% chính xác`
                            : 'Chấm điểm phát âm Micro AI'}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium block truncate">
                          {isTestingMic
                            ? 'Hãy đọc to từ ở trên...'
                            : 'Phản hồi lỗi thanh điệu tức thì'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestMicDemo}
                      className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 shrink-0 transition-colors cursor-pointer tabular-nums"
                    >
                      {micTested ? '98% Tốt' : 'Thử nói'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: 4 Feature Pillars */}
        <section id="phuong-phap" className="py-14 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block">
                Phương pháp khoa học
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
                Giải Pháp Xóa Bỏ Nỗi Sợ Bỏ Cuộc Khi Tự Học
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Khắc phục triệt để 3 rào cản lớn nhất: phát âm sai không người sửa, dồn bài quá tải và tài liệu trôi nổi thiếu hệ thống.
              </p>
            </div>

            <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featurePillars.map((feat, idx) => (
                <article
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        {feat.icon}
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${feat.badgeColor}`}>
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: 4-Stage Roadmap Overview */}
        <section id="lo-trinh" className="py-14 sm:py-20 lg:py-24 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block mb-2">
                  Lộ trình 12 tháng
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  4 Chặng Đường Chinh Phục HSK 1–6
                </h2>
              </div>
              <Link href="/roadmap">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm font-bold border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Mở bản đồ 120 bài học
                </Button>
              </Link>
            </div>

            <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {roadStages.map((stage, idx) => (
                <Link
                  key={idx}
                  href="/roadmap"
                  className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 shadow-2xs hover:bg-white hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {stage.stage}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 tabular-nums">
                        {stage.vocab}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors text-base sm:text-lg mb-1">
                      {stage.hsk}
                    </h3>
                    <div className="text-xs font-bold text-amber-700 mb-2.5">{stage.highlight}</div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{stage.target}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">Khám phá bài học</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Official Media & Textbook Showcase */}
        <section id="hoc-lieu" className="py-14 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block">
                Học liệu chính thống
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Kho Sách PDF, Video Phụ Đề & Audio Chuẩn BLCUP
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Tích hợp kho tài nguyên Google Drive, video giảng dạy miễn phí có phụ đề CC và file nghe thụ động theo từng chủ đề.
              </p>
            </div>

            <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Giáo Trình Chuẩn HSK 1–6</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Trọn bộ sách bài học, bài tập và giải thích ngữ pháp tiếng Việt chi tiết theo giáo trình Đại học Ngôn ngữ Bắc Kinh.
                  </p>
                </div>
                <Link href="/library" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-2">
                  <span>Khám phá kho sách PDF</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                    <Film className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Video Miễn Phí Có Phụ Đề CC</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Toàn bộ video khẩu hình Pinyin, hội thoại thực tế và hoạt hình thiếu nhi đều miễn phí, nhúng trực tiếp và hỗ trợ phụ đề.
                  </p>
                </div>
                <Link href="/library" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-2">
                  <span>Xem kho video bài giảng</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">File Nghe Thụ Động MP3</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Kho âm thanh MP3 nạp phản xạ ngữ điệu tự nhiên kèm bộ đọc TTS 4 chất giọng (Nữ, Nam, Người lớn, Trẻ em) ngay trong từng bài.
                  </p>
                </div>
                <Link href="/library" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-2">
                  <span>Mở thư viện âm thanh</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* Section 4: Testimonials */}
        <section id="hoc-vien" className="py-14 sm:py-20 lg:py-24 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block">
                Trải nghiệm thực tế
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Phản Hồi Từ Học Viên & Phụ Huynh
              </h2>
            </div>

            <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
              {testimonials.map((t, idx) => (
                <article
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-2xs hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        {t.hsk}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm">{t.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: FAQ */}
        <section id="faq" className="py-14 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block">
                Câu hỏi thường gặp
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Giải Đáp Nhanh Trước Khi Bắt Đầu
              </h2>
            </div>

            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
              {FAQS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.q}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative overflow-hidden py-14 sm:py-20 bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white text-center">
          <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Học thử miễn phí ngay hôm nay</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-balance">
              Bắt đầu hành trình làm chủ Hán ngữ bài bản
            </h2>
            <p className="mt-3 text-emerald-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              25 phút mỗi ngày với lộ trình rõ ràng, hướng dẫn phát âm chuẩn Bắc Kinh và hệ thống bài tập phản xạ tự nhiên.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-emerald-950 font-extrabold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-md transition-all"
                >
                  Vào học thử miễn phí
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/15 hover:bg-white/25 active:scale-[0.98] border-white/30 text-white backdrop-blur-xs text-sm sm:text-base font-bold px-6 py-3.5 rounded-xl transition-all"
                >
                  Đăng ký tài khoản chính thức
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Structured Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-600">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white font-bold text-xs">
                <span className="font-chinese">汉</span>
              </div>
              <span className="font-bold text-slate-900 text-sm">Chinese Journey HSK 3.0</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Hệ thống tự học tiếng Trung toàn diện theo chuẩn BLCUP & khung HSK mới, tích hợp luyện nói AI, mở bài theo múi giờ Việt Nam và kho tài liệu chính thống.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Khám phá
            </div>
            <ul className="space-y-1.5 font-medium">
              <li><a href="#phuong-phap" className="hover:text-emerald-700">Phương pháp 25 phút</a></li>
              <li><a href="#lo-trinh" className="hover:text-emerald-700">Lộ trình HSK 1–6</a></li>
              <li><a href="#hoc-lieu" className="hover:text-emerald-700">Kho tài liệu BLCUP</a></li>
              <li><a href="#faq" className="hover:text-emerald-700">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Ứng dụng học tập
            </div>
            <ul className="space-y-1.5 font-medium">
              <li><Link href="/dashboard" className="hover:text-emerald-700">Vào học ngay (Demo)</Link></li>
              <li><Link href="/roadmap" className="hover:text-emerald-700">Bảng lộ trình 120 bài</Link></li>
              <li><Link href="/library" className="hover:text-emerald-700">Thư viện Google Drive</Link></li>
              <li><Link href="/login" className="hover:text-emerald-700">Đăng nhập / Đăng ký</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
