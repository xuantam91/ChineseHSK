'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Volume2,
  PlayCircle,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  Video,
  ExternalLink,
  Subtitles,
} from 'lucide-react';
import { HSKLesson } from '@/lib/curriculum/hsk1-3-data';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';
import { useTTS } from '@/lib/tts';

const DEFAULT_VIDEO_BY_LEVEL: Record<string, { url: string; title: string }> = {
  HSK1: {
    url: 'https://www.youtube.com/watch?v=MYQrQvbR8Vk',
    title: 'HSK 1–2 (Có sẵn phụ đề Việt / Anh / Trung): Một ngày của tôi (我的一天)',
  },
  HSK2: {
    url: 'https://www.youtube.com/watch?v=PcergOJuC1M',
    title: 'HSK 2 (Có sẵn phụ đề Việt / Anh • Nói chậm): Cuộc sống một tuần (一周的生活)',
  },
  HSK3: {
    url: 'https://www.youtube.com/watch?v=gr-PvRnUIjA',
    title: 'HSK 2–3 (Có sẵn phụ đề Việt / Trung): Bày tỏ cảm xúc bằng tiếng Trung',
  },
  HSK4: {
    url: 'https://www.youtube.com/watch?v=uELIAHpFuMY',
    title: 'HSK 3–4 (Có sẵn phụ đề Trung / Anh): Luyện nghe ShuoshuoChinese',
  },
  HSK5: {
    url: 'https://www.youtube.com/watch?v=tBqHmOH2ycs',
    title: 'HSK 5 (Có sẵn phụ đề YouTube CC): Bài giảng HSK 5 Chuẩn (爱的细节)',
  },
  HSK6: {
    url: 'https://www.youtube.com/watch?v=nV8BcPH43XQ',
    title: 'HSK 6 (Có sẵn phụ đề Tiếng Việt): Luyện nghe chuẩn giáo trình HSK cao cấp',
  },
};

// Topic-matched 100% FREE & YouTube-CC-verified videos for base lessons (HSK1-6)
const LESSON_FREE_VIDEO_MAP: Record<string, { url: string; title: string }> = {
  'hsk1-lesson-01': {
    url: 'https://www.youtube.com/watch?v=MYQrQvbR8Vk',
    title: 'HSK 1–2 (Có sẵn phụ đề Việt / Anh / Trung): Giao tiếp sinh hoạt mỗi ngày',
  },
  'hsk1-lesson-02': {
    url: 'https://www.youtube.com/watch?v=RHY6VB50k74',
    title: 'Grace Mandarin (Có phụ đề Anh): Cách hỏi Ai, Cái gì, Ở đâu, Khi nào',
  },
  'hsk1-lesson-03': {
    url: 'https://www.youtube.com/watch?v=KtffLjFqFPM',
    title: 'Little Fox Chinese (Thiếu nhi • Có phụ đề Anh): Em trai bé nhỏ của tôi (我的小弟弟)',
  },
  'hsk1-lesson-04': {
    url: 'https://www.youtube.com/watch?v=C_wrXDRxuUY',
    title: 'Peppa Pig Tiếng Trung (Thiếu nhi • Có phụ đề Trung / Anh / Pinyin): Học Số đếm',
  },
  'hsk1-lesson-05': {
    url: 'https://www.youtube.com/watch?v=eAe0FFIqeeU',
    title: 'Grace Mandarin (Có phụ đề Anh): Hỏi giá tiền & Đếm số khi mua sắm',
  },
  'hsk2-lesson-01': {
    url: 'https://www.youtube.com/watch?v=aw6oz_WuEHg',
    title: 'Peppa Pig Tiếng Trung (Thiếu nhi • Có phụ đề Trung / Anh / Pinyin): Bữa trưa (午餐)',
  },
  'hsk2-lesson-02': {
    url: 'https://www.youtube.com/watch?v=umGf6u4Oj7E',
    title: 'GamesLearnChinese (Thiếu nhi • Có phụ đề Anh): Phương tiện giao thông',
  },
  'hsk2-lesson-03': {
    url: 'https://www.youtube.com/watch?v=tyo3Rzbtl3w',
    title: 'Little Fox Chinese (Thiếu nhi • Có phụ đề Tiếng Việt): Thời tiết hôm nay thế nào?',
  },
  'hsk2-lesson-04': {
    url: 'https://www.youtube.com/watch?v=P6xnKXTNkUg',
    title: 'Little Fox Chinese (Thiếu nhi • Có phụ đề Anh): Sở thích vận động (我喜欢爬)',
  },
  'hsk2-lesson-05': {
    url: 'https://www.youtube.com/watch?v=PVnybNwHQis',
    title: 'GamesLearnChinese (Thiếu nhi • Có phụ đề Anh): Bộ phận cơ thể & Sức khỏe',
  },
  'hsk3-lesson-01': {
    url: 'https://www.youtube.com/watch?v=o51Dsn7YTjw',
    title: 'Mandarin Click (Có sẵn phụ đề Việt / Anh / Trung): Một ngày của Mary (玛丽的生活)',
  },
  'hsk3-lesson-02': {
    url: 'https://www.youtube.com/watch?v=PcergOJuC1M',
    title: 'Mandarin Click (Có sẵn phụ đề Việt / Anh): Cuộc sống một tuần (一周的生活)',
  },
  'hsk3-lesson-03': {
    url: 'https://www.youtube.com/watch?v=E89enAiDdRQ',
    title: 'Chinese Zero to Hero (Có phụ đề Anh): Ngữ pháp so sánh & 一个都/也不',
  },
  'hsk3-lesson-04': {
    url: 'https://www.youtube.com/watch?v=zTqCTOLTAgY',
    title: 'Peppa Pig Tiếng Trung (Thiếu nhi • Có phụ đề Trung / Anh): Câu lạc bộ bí mật',
  },
  'hsk4-01': {
    url: 'https://www.youtube.com/watch?v=uELIAHpFuMY',
    title: 'ShuoshuoChinese (Có phụ đề Trung / Anh): Luyện nghe thực tế HSK 3–4',
  },
  'hsk4-02': {
    url: 'https://www.youtube.com/watch?v=LlQQZfEAJ_I',
    title: 'ShuoshuoChinese (Có phụ đề Anh): Miêu tả & Giao tiếp công sở',
  },
  'hsk4-03': {
    url: 'https://www.youtube.com/watch?v=uELIAHpFuMY',
    title: 'ShuoshuoChinese (Có phụ đề Trung / Anh): Mua sắm & Đời sống HSK 4',
  },
  'hsk4-04': {
    url: 'https://www.youtube.com/watch?v=o51Dsn7YTjw',
    title: 'Mandarin Click (Có sẵn phụ đề Việt / Anh / Trung): Kể chuyện lưu loát',
  },
  'hsk5-01': {
    url: 'https://www.youtube.com/watch?v=tBqHmOH2ycs',
    title: 'Wenjing-Zhiyuan (Có phụ đề Tiếng Trung CC): Bài giảng HSK 5 (爱的细节)',
  },
  'hsk5-02': {
    url: 'https://www.youtube.com/watch?v=nV8BcPH43XQ',
    title: 'Hanyu CJD (Có phụ đề Tiếng Việt CC): Luyện nghe chuẩn HSK 5',
  },
  'hsk5-03': {
    url: 'https://www.youtube.com/watch?v=uELIAHpFuMY',
    title: 'ShuoshuoChinese (Có phụ đề Trung / Anh): Luyện nghe đọc hiểu nâng cao',
  },
  'hsk5-04': {
    url: 'https://www.youtube.com/watch?v=4KSRNznLeOg',
    title: 'Little Fox Chinese (Có phụ đề Anh): Truyện kể văn hóa (在怪物身上)',
  },
  'hsk6-01': {
    url: 'https://www.youtube.com/watch?v=nV8BcPH43XQ',
    title: 'Hanyu CJD (Có phụ đề Tiếng Việt CC): Luyện nghe hiểu HSK cao cấp',
  },
  'hsk6-02': {
    url: 'https://www.youtube.com/watch?v=tBqHmOH2ycs',
    title: 'Wenjing-Zhiyuan (Có phụ đề CC): Phân tích bài đọc & Từ vựng nâng cao',
  },
  'hsk6-03': {
    url: 'https://www.youtube.com/watch?v=uELIAHpFuMY',
    title: 'ShuoshuoChinese (Có phụ đề Trung / Anh): Đàm thoại tự nhiên nâng cao',
  },
  'hsk6-04': {
    url: 'https://www.youtube.com/watch?v=VzLplLkIFmw',
    title: 'Little Fox Chinese (Có phụ đề Anh): Magic Marker - Nghe hiểu tự nhiên',
  },
};

const DEFAULT_COVER_IMAGE_BY_LEVEL: Record<string, string> = {
  HSK1: '/images/lessons/hsk1_lesson01_greeting.jpg',
  HSK2: '/images/lessons/hsk2_lesson01_restaurant_menu.jpg',
  HSK3: '/images/lessons/hsk3_lesson01_hotel_room.jpg',
  HSK4: '/images/lessons/hsk4_lesson01_interview.jpg',
  HSK5: '/images/lessons/hsk5_lesson01_news_anchor.jpg',
  HSK6: '/images/lessons/hsk6_lesson01_business_negotiation.jpg',
};

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return id || null;
    }
    const v = parsed.searchParams.get('v');
    if (v) return v;
  } catch {
    // ignore
  }
  return null;
}

function extractYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url);
  return id
    ? `https://www.youtube.com/embed/${id}?rel=0&cc_load_policy=1&cc_lang_pref=vi&hl=vi`
    : null;
}

function extractCoverCalligraphy(lesson?: HSKLesson, fallbackTitle?: string): string {
  if (lesson?.coverCalligraphy) return lesson.coverCalligraphy;
  const source = lesson?.title || fallbackTitle || '汉语';
  const match = source.match(/[\u4e00-\u9fff]{2,4}/);
  if (match) return match[0].slice(0, 4);
  const firstWord = lesson?.vocabulary?.[0]?.hanzi;
  return firstWord || '汉语';
}

interface LessonCoverCardProps {
  hskLesson?: HSKLesson;
  fallbackTitle: string;
  fallbackDescription?: string;
  sequenceOrder?: number;
  estimatedMinutes?: number;
  totalLessonsInLevel?: number;
}

export const LessonCoverCard: React.FC<LessonCoverCardProps> = ({
  hskLesson,
  fallbackTitle,
  fallbackDescription = '',
  sequenceOrder = 1,
  estimatedMinutes = 30,
  totalLessonsInLevel = 20,
}) => {
  const { speak } = useTTS();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [isCoverExpanded, setIsCoverExpanded] = useState(true);

  const level = hskLesson?.level || 'HSK1';
  const lessonNum = hskLesson?.lessonNumber || sequenceOrder || 1;
  const title = hskLesson?.title || fallbackTitle;
  const summary = hskLesson?.summaryVi || fallbackDescription;
  const subtitle = hskLesson?.subtitleVi || '';
  const coverImage =
    hskLesson?.imageUrl || DEFAULT_COVER_IMAGE_BY_LEVEL[level] || '/images/lessons/hsk1_lesson01_greeting.jpg';
  const calligraphy = extractCoverCalligraphy(hskLesson, fallbackTitle);

  const videoInfo = hskLesson?.videoUrl
    ? {
        url: hskLesson.videoUrl,
        title: hskLesson.videoTitleVi || `Video bài giảng miễn phí ${level} - Bài ${lessonNum}`,
      }
    : (hskLesson?.id && LESSON_FREE_VIDEO_MAP[hskLesson.id]) ||
      DEFAULT_VIDEO_BY_LEVEL[level] ||
      DEFAULT_VIDEO_BY_LEVEL.HSK1;

  const embedUrl = extractYouTubeEmbedUrl(videoInfo.url);
  const vocabHighlights = (hskLesson?.vocabulary || []).slice(0, 6);
  const grammarHighlights = (hskLesson?.grammarNotes || []).slice(0, 3);
  const firstDialogueLine = hskLesson?.dialogue?.[0];

  return (
    <div className="rounded-3xl overflow-hidden border border-emerald-200/80 bg-white shadow-md">
      {/* TOP VISUAL ARTWORK BANNER */}
      <div className="relative min-h-[230px] sm:min-h-[260px] flex flex-col justify-between p-5 sm:p-7 text-white overflow-hidden bg-slate-900">
        {/* Background Cover Illustration - Sharp & Vibrant */}
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-95 contrast-105 saturate-110 transition-transform duration-700"
        />
        {/* Directional Gradient Overlay: Dark on left/bottom for crisp text, clear on right so artwork shines */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-emerald-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/35" />

        {/* Decorative Chinese Calligraphy Watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-4 bottom-3 text-6xl sm:text-8xl font-black text-white/20 tracking-widest leading-none drop-shadow"
        >
          {calligraphy}
        </div>

        {/* Top Row: Badges + Voice Selector */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {level} • BÀI {lessonNum}/{totalLessonsInLevel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/60 backdrop-blur-xs text-white border border-white/20">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              {estimatedMinutes} phút
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/60 backdrop-blur-xs text-emerald-100 border border-white/20">
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              Giáo trình HSK Chuẩn Quốc tế
            </span>
          </div>

          <div className="shrink-0">
            <TTSVoiceSelector variant="dropdown" />
          </div>
        </div>

        {/* Center/Bottom Row: Lesson Title, Subtitle & Quick Actions */}
        <div className="relative z-10 mt-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-300 drop-shadow">
              <span>TRANG BÌA NỘI DUNG BÀI HỌC</span>
              <span>•</span>
              <span>CHỦ ĐỀ: {calligraphy}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-emerald-50 font-medium leading-relaxed drop-shadow">
              {summary}
            </p>
          </div>

          {/* Action Buttons on Cover */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {firstDialogueLine && (
              <button
                type="button"
                onClick={() => speak(firstDialogueLine.hanzi)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/25 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>Nghe câu mẫu</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowVideoPlayer((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-slate-950" />
              <span>{showVideoPlayer ? 'Ẩn Video Bài Giảng' : 'Xem Video Bài Giảng Online'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCoverExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-black/25 hover:bg-black/40 text-xs font-semibold text-emerald-100 border border-white/10 transition-colors cursor-pointer"
              title="Thu gọn / Mở rộng trang bìa"
            >
              <span>{isCoverExpanded ? 'Thu gọn bìa' : 'Chi tiết bìa'}</span>
              {isCoverExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* EMBEDDED ONLINE VIDEO LECTURE PLAYER (TOGGLED) */}
      {showVideoPlayer && embedUrl && (
        <div className="bg-slate-950 p-4 sm:p-6 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-white">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold">{videoInfo.title}</span>
            </div>
            <a
              href={videoInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200"
            >
              <span>Mở trên YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-lg">
            <iframe
              src={embedUrl}
              title={videoInfo.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Subtitles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                Video hỗ trợ phụ đề gốc của YouTube (<strong className="text-white">CC</strong>). Bấm biểu tượng <strong className="text-amber-300">CC</strong> hoặc <strong className="text-amber-300">⚙️ Cài đặt → Phụ đề</strong> trên góc video để chọn <strong className="text-emerald-300">Tiếng Việt / English / 中文</strong>.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* COLLAPSIBLE MAGAZINE COVER HIGHLIGHTS (VOCAB + GRAMMAR + STRUCTURE OVERVIEW) */}
      {isCoverExpanded && (vocabHighlights.length > 0 || grammarHighlights.length > 0) && (
        <div className="p-4 sm:p-6 bg-gradient-to-b from-emerald-50/50 to-white space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 7 cols: Key Vocabulary Preview */}
            {vocabHighlights.length > 0 && (
              <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    Từ vựng cốt lõi trong bài ({hskLesson?.vocabulary.length || vocabHighlights.length} từ)
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    Bấm vào từ để nghe phát âm
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vocabHighlights.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => speak(v.hanzi)}
                      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left cursor-pointer"
                    >
                      <span className="text-base font-black text-slate-900 group-hover:text-emerald-800">
                        {v.hanzi}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700">
                        {v.pinyin}
                      </span>
                      <span className="text-xs text-slate-600 border-l border-slate-200 pl-2">
                        {v.meaningVi}
                      </span>
                      <Volume2 className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Right 5 cols: Key Grammar & Lesson Highlights */}
            {grammarHighlights.length > 0 && (
              <div className="lg:col-span-5 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 space-y-2.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Trọng điểm ngữ pháp & Mẫu câu
                </div>
                <ul className="space-y-1.5">
                  {grammarHighlights.map((g) => (
                    <li
                      key={g.id}
                      className="text-xs sm:text-sm text-slate-800 flex items-start gap-2"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900">{g.title}: </span>
                        <code className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                          {g.pattern}
                        </code>
                      </div>
                    </li>
                  ))}
                </ul>
                {subtitle && (
                  <p className="text-xs text-slate-600 pt-1 border-t border-amber-200/60">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
