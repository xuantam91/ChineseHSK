'use client';

import React, { useState } from 'react';
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
  Sparkles,
  Headphones,
  Film,
  FolderGit2,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Play,
  Square,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEMO_MONTHS_OVERVIEW } from '@/lib/mock-data';
import { speakChinese, TTSVoicePersona, TTS_PERSONAS } from '@/lib/tts';

const INTERACTIVE_WORDS = [
  {
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Xin chào bạn (Chào hỏi thông dụng)',
    tip: 'Biến điệu: 2 thanh 3 đi liền nhau, chữ "你" đổi thành thanh 2 (ní hǎo).',
    example: '你好！很高兴认识你。',
    exampleVi: 'Chào bạn! Rất vui được làm quen với bạn.',
  },
  {
    hanzi: '谢谢',
    pinyin: 'xiè xie',
    meaning: 'Cảm ơn bạn (Lời cảm ơn chân thành)',
    tip: 'Thanh 4 rơi dốc gắt từ cao xuống thấp, âm thứ 2 đọc khinh thanh nhẹ.',
    example: '太谢谢你了！',
    exampleVi: 'Cảm ơn bạn rất nhiều!',
  },
  {
    hanzi: '加油',
    pinyin: 'jiā yóu',
    meaning: 'Cố lên! Nỗ lực lên! (Khích lệ)',
    tip: 'Thanh 1 ngân dài đều đặn, thanh 2 vuốt dốc lên cao như dấu sắc.',
    example: '明天考试，加油！',
    exampleVi: 'Ngày mai thi rồi, cố lên nhé!',
  },
  {
    hanzi: '中国',
    pinyin: 'zhōng guó',
    meaning: 'Trung Quốc (Tên quốc gia)',
    tip: 'Âm cong lưỡi "zh" tròn vành rõ chữ, kết hợp thanh 1 và thanh 2.',
    example: '我想去中国旅游。',
    exampleVi: 'Tôi muốn đi du lịch Trung Quốc.',
  },
];

export default function LandingPage() {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<TTSVoicePersona>('female');
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micTested, setMicTested] = useState(false);

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
    }, 1200);
  };

  const featurePillars = [
    {
      badge: 'Chống ngọng ngữ âm',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <Mic className="w-5 h-5 text-emerald-700 stroke-[2]" />,
      title: 'Luyện Phát Âm & Chấm Mic AI',
      desc: 'Công nghệ phân tích âm thanh nhận diện 4 thanh điệu chuẩn giọng Bắc Kinh. Sửa lỗi dính âm, biến điệu 3+3 ngay từ bài đầu tiên.',
    },
    {
      badge: 'Nhịp học sinh học',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: <Clock className="w-5 h-5 text-teal-700 stroke-[2]" />,
      title: 'Vòng Lặp 25 Phút Pomodoro',
      desc: 'Mở khóa bài học mới đúng 0h00 theo giờ Việt Nam. Học đúng 25 phút mỗi ngày giúp não bộ tiếp thu sâu, tuyệt đối không bị quá tải.',
    },
    {
      badge: 'Chống nản bền bỉ',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
      icon: <RotateCcw className="w-5 h-5 text-amber-600 stroke-[2]" />,
      title: 'Học Bù Tồn Đọng (Backlog)',
      desc: 'Bận rộn ngày trong tuần? Hệ thống gom bài chưa học vào danh sách học bù cuối tuần, giữ trọn vẹn chuỗi học tập không bị ngắt quãng.',
    },
    {
      badge: 'Chuẩn học thuật BLCUP',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <BookOpen className="w-5 h-5 text-blue-700 stroke-[2]" />,
      title: 'Giáo Trình Chuẩn HSK 3.0',
      desc: 'Toàn diện 12 tháng từ vựng, ngữ pháp, mẫu câu thi đỗ chứng chỉ HSK 1 đến HSK 6 do Đại học Ngôn ngữ Bắc Kinh biên soạn chính thức.',
    },
  ];

  const roadStages = [
    {
      stage: 'Giai đoạn 1',
      hsk: 'HSK 1 • 0 - 3 Tháng',
      vocab: '500 từ cốt lõi',
      target: 'Làm chủ 21 thanh mẫu, 36 vận mẫu, 4 thanh điệu và đối thoại chào hỏi, mua sắm căn bản.',
      highlight: 'Xây móng ngữ âm vững chắc',
    },
    {
      stage: 'Giai đoạn 2',
      hsk: 'HSK 2 • 4 - 6 Tháng',
      vocab: '1.272 từ vựng',
      target: 'Phản xạ giao tiếp đời sống tự nhiên: gọi món, hỏi đường, thời tiết, đi lại và sinh hoạt.',
      highlight: 'Tự tin du lịch & giao tiếp',
    },
    {
      stage: 'Giai đoạn 3',
      hsk: 'HSK 3 - 4 • 7 - 9 Tháng',
      vocab: '2.245 - 3.245 từ',
      target: 'Làm chủ câu chữ 把, chữ 被, đàm thoại công sở, phỏng vấn xin việc và xem phim có phụ đề.',
      highlight: 'Ứng dụng công việc & du học',
    },
    {
      stage: 'Giai đoạn 4',
      hsk: 'HSK 5 - 6 • 10 - 12 Tháng',
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
        'Phương pháp 25 phút mỗi ngày cực kỳ phù hợp với người đi làm bận rộn như tôi. Trình chấm mic phát âm giúp tôi tự tin phân biệt rành rọt thanh 3 và thanh 4 mà không còn sợ nói sai.',
      hsk: 'Đang chinh phục HSK 2',
      rating: 5,
    },
    {
      name: 'Trần Phương Linh',
      role: 'Sinh viên Ngoại thương • Thi chứng chỉ',
      comment:
        'Lộ trình 12 tháng được phân bổ chi tiết theo chuẩn HSK 3.0 mới nhất. Đặc biệt kho sách PDF và video khẩu hình trong thư viện giúp tôi tiết kiệm hàng triệu đồng mua giáo trình ngoài.',
      hsk: 'Đạt HSK 3 sau 5 tháng',
      rating: 5,
    },
    {
      name: 'Chị Mai Lan & Bé Bảo Nam',
      role: 'Phụ huynh đồng hành cùng con',
      comment:
        'Bé nhà mình rất thích các video bài hát thiếu nhi và flashcard tương tác trên web. Hình ảnh trực quan, phát âm bản xứ chuẩn xác giúp con học tiếng Trung tự nhiên như tiếng mẹ đẻ.',
      hsk: 'Tự tin đàm thoại YCT 2',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-chinese">汉</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-slate-900">
                    Chinese Journey
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    HSK 3.0
                  </span>
                </div>
                <span className="block text-xs text-slate-500 font-medium">
                  Hệ thống tự học tiếng Trung bài bản
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/roadmap"
              className="hidden md:inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Lộ trình 12 tháng
            </Link>
            <Link
              href="/library"
              className="hidden md:inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Thư viện tài liệu
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm font-semibold text-slate-700">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-xs px-4"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Vào học ngay
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 bg-white">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-50 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 rounded-full bg-teal-50 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Khung chuẩn HSK 3.0 • 25 phút mỗi ngày cùng AI</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Chinh Phục Tiếng Trung <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 bg-clip-text text-transparent">
                  Chuẩn Bản Xứ Bắc Kinh
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Không học vẹt, không nản chí. Tự học bài bản từ con số 0 với <strong className="text-slate-900">luyện nói chấm mic AI</strong>, vòng lặp 25 phút mở bài theo múi giờ Việt Nam và kho học liệu video & giáo trình BLCUP chính thống.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-base px-8 py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
                    rightIcon={<ArrowRight className="w-5 h-5 text-emerald-950 stroke-[2.5]" />}
                  >
                    Bắt đầu học thử miễn phí
                  </Button>
                </Link>
                <Link href="/roadmap" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-base font-bold px-6 py-3.5 rounded-xl shadow-2xs"
                  >
                    Xem toàn bộ lộ trình
                  </Button>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-600 font-semibold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Mở bài theo giờ Việt Nam
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Chấm điểm phát âm mic AI
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  100% Khung HSK 3.0 Mới
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Pronunciation & Vocab Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 p-6 shadow-md shadow-emerald-900/5 space-y-5">
                {/* Header of widget */}
                <div className="flex items-center justify-between pb-3.5 border-b border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-slate-900">Thử phát âm trực tiếp</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                    Âm thanh chuẩn bản xứ
                  </span>
                </div>

                {/* Word selector tabs */}
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200">
                  {INTERACTIVE_WORDS.map((item, idx) => (
                    <button
                      key={item.hanzi}
                      onClick={() => setActiveWordIndex(idx)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        idx === activeWordIndex
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      {item.hanzi}
                    </button>
                  ))}
                </div>

                {/* 4 Voice Persona Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-semibold">
                    <span>Chọn giọng đọc bản ngữ:</span>
                    <span className="text-emerald-700 font-bold">{TTS_PERSONAS[selectedPersona].nameVi}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
                    {[
                      { key: 'female', label: '👩 Nữ' },
                      { key: 'male', label: '👨 Nam' },
                      { key: 'adult', label: '🧑‍🏫 Người lớn' },
                      { key: 'child', label: '🧒 Trẻ em' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelectedPersona(item.key as TTSVoicePersona)}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
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

                {/* Active Interactive Card */}
                <div className="rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Mẫu từ vựng #{activeWordIndex + 1}</span>
                    <span className="text-emerald-700 font-semibold">{TTS_PERSONAS[selectedPersona].subtitleVi}</span>
                  </div>

                  {/* Hanzi Large Typography */}
                  <div className="font-chinese text-6xl font-extrabold text-slate-900 tracking-wide drop-shadow-2xs">
                    {activeWord.hanzi}
                  </div>

                  {/* Pinyin */}
                  <div className="text-lg font-bold text-emerald-700 font-mono">
                    {activeWord.pinyin}
                  </div>

                  {/* Meaning */}
                  <div className="text-sm text-slate-700 font-medium">
                    {activeWord.meaning}
                  </div>

                  {/* Phonetic Tip Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mẹo ngữ âm:</span>
                    </div>
                    <p className="leading-relaxed">{activeWord.tip}</p>
                  </div>

                  {/* Pronunciation audio trigger buttons */}
                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(activeWord.hanzi)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-xs active:scale-98 transition-all"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                      <span>{isPlayingAudio ? 'Đang phát âm...' : `Nghe phát âm (${TTS_PERSONAS[selectedPersona].nameVi.split(' ')[1] || 'chuẩn'})`}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePlayAudio(activeWord.example)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/70 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 font-chinese">
                          Ví dụ: &ldquo;{activeWord.example}&rdquo;
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {activeWord.exampleVi}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-emerald-700 shrink-0">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe câu</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Interactive AI Speech Score Demo */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between shadow-2xs gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTestMicDemo}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-all ${
                        isTestingMic
                          ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                      title="Bấm để thử chấm điểm phát âm AI"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block leading-tight">
                        {isTestingMic
                          ? 'Đang phân tích thanh điệu...'
                          : micTested
                          ? `Đã chấm âm "${activeWord.hanzi}": 98%`
                          : 'Thử chấm điểm Micro AI'}
                      </span>
                      <span className="text-xs text-emerald-700 font-semibold">
                        {isTestingMic
                          ? 'Hãy đọc to từ trên...'
                          : 'Nhận diện chuẩn xác 4 thanh điệu Bắc Kinh'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestMicDemo}
                    className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0 transition-colors"
                  >
                    {micTested ? '98% Xuất sắc' : 'Thử nói'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Highlights Grid */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block">
              Phương pháp độc quyền
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Giải Pháp Khoa Học Xóa Bỏ Nỗi Sợ Bỏ Cuộc
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Giải quyết triệt để 3 nguyên nhân thất bại phổ biến: nói ngọng không ai sửa, dồn bài quá tải và tài liệu trôi nổi thiếu hệ thống.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featurePillars.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      {feat.icon}
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Stage Roadmap Overview */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block mb-2">
                Hành trình chinh phục
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                4 Chặng Đường Vươn Tới Đỉnh Cao HSK
              </h2>
            </div>
            <Link href="/roadmap">
              <Button
                variant="outline"
                size="sm"
                className="text-sm font-bold border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Xem chi tiết 12 tháng
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {roadStages.map((stage, idx) => (
              <Link
                key={idx}
                href="/roadmap"
                className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-2xs hover:bg-white hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {stage.stage}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{stage.vocab}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors text-lg mb-1">
                    {stage.hsk}
                  </h3>
                  <div className="text-xs font-bold text-amber-700 mb-3">{stage.highlight}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{stage.target}</p>
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

      {/* Official Media & Textbook Showcase */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block">
              Học liệu chính ngạch
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Kho Tài Nguyên Sách PDF, Video & MP3 Chuẩn BLCUP
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Tích hợp trực tiếp 10 kho tài nguyên Google Drive và hàng trăm video bài giảng, bài hát từ các nhà xuất bản ngôn ngữ uy tín thế giới.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Textbook Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Giáo Trình Chuẩn HSK 1 - 6</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Trọn bộ sách bài học, sách bài tập và tài liệu ngữ pháp chính thức của Đại học Ngôn ngữ Bắc Kinh (BLCUP).
              </p>
              <Link href="/library" className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-2">
                <span>Khám phá kho sách PDF</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Video & Pronunciation Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Video Khẩu Hình & Hoạt Hình</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Giảng viên bản ngữ hướng dẫn đặt vị trí môi, luồng hơi Pinyin kết hợp phim hoạt hình Peppa Pig, Super JoJo sinh động.
              </p>
              <Link href="/library" className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-2">
                <span>Xem kho video bài giảng</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Passive Audio & Loa Craven */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">File Nghe Thụ Động (Loa Craven)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kho âm thanh MP3 nạp phản xạ ngữ điệu tự nhiên cho người mới bắt đầu và trẻ em, học mọi lúc mọi nơi.
              </p>
              <Link href="/library" className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-2">
                <span>Tải trọn bộ file MP3</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block">
              Học viên nói gì
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Câu Chuyện Thành Công Của Học Viên
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-6xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-2xs hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {t.hsk}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{t.role}</p>
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sẵn sàng chinh phục tiếng Trung 2026</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-2xs">
            Bắt đầu hành trình làm chủ Hán ngữ ngay hôm nay
          </h2>
          <p className="mt-4 text-emerald-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            25 phút mỗi ngày với lộ trình khoa học, hướng dẫn khẩu hình Pinyin chi tiết và phản xạ giao tiếp tự nhiên chuẩn HSK 3.0.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3.5">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-base px-8 py-4 rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                Vào học ngay miễn phí
              </Button>
            </Link>
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/15 hover:bg-white/25 border-white/25 text-white backdrop-blur-xs text-base font-bold px-6 py-4 rounded-xl transition-all"
              >
                Xem chi tiết lộ trình 12 tháng
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-700 text-white font-bold text-xs">
              <span className="font-chinese">汉</span>
            </div>
            <span className="font-bold text-slate-800 text-sm">Chinese Journey HSK 3.0</span>
          </div>
          <p className="text-xs text-slate-500">
            Hệ thống học tiếng Trung toàn diện theo chuẩn BLCUP & Bộ Giáo Dục Trung Quốc.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-slate-600">
            <Link href="/roadmap" className="hover:text-slate-900">Lộ trình</Link>
            <Link href="/library" className="hover:text-slate-900">Học liệu</Link>
            <Link href="/settings" className="hover:text-slate-900">Cài đặt</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
