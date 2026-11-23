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
} from 'lucide-react';
import { HSKLesson } from '@/lib/curriculum/hsk1-3-data';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';
import { VideoSubtitlePanel } from '@/components/lesson/VideoSubtitlePanel';
import { useTTS } from '@/lib/tts';

const DEFAULT_VIDEO_BY_LEVEL: Record<string, { url: string; title: string }> = {
  HSK1: {
    url: 'https://www.youtube.com/watch?v=m_rDIzj6DRE',
    title: 'Little Fox Chinese (Miễn phí • Dễ hiểu): Hello Song & Số đếm tiếng Trung',
  },
  HSK2: {
    url: 'https://www.youtube.com/watch?v=lm7oB_D1is0',
    title: 'Bài giảng HSK 2 Miễn phí (YAYA Mandarin): Giao tiếp & Du lịch cơ bản',
  },
  HSK3: {
    url: 'https://www.youtube.com/watch?v=2e8zAu2_h2w',
    title: 'Bài giảng HSK 3 Miễn phí (YAYA Mandarin): Hội thoại & Ngữ pháp ứng dụng',
  },
  HSK4: {
    url: 'https://www.youtube.com/watch?v=xE3Sh1S2lWM',
    title: 'Bài giảng HSK 4 Miễn phí (YAYA Mandarin): Đàm thoại & Đời sống xã hội',
  },
  HSK5: {
    url: 'https://www.youtube.com/watch?v=tBqHmOH2ycs',
    title: 'Bài giảng HSK 5 Miễn phí: Tiếng Trung giao tiếp & Văn hóa chuyên sâu',
  },
  HSK6: {
    url: 'https://www.youtube.com/watch?v=1s8FMW9wh_0',
    title: 'Bài giảng HSK 6 Miễn phí: Luyện nghe đọc hiểu & Câu chuyện triết lý',
  },
};

// Topic-matched 100% FREE & kid-friendly videos for base lessons (HSK1-6 Lessons 1-5)
const LESSON_FREE_VIDEO_MAP: Record<string, { url: string; title: string }> = {
  'hsk1-lesson-01': {
    url: 'https://www.youtube.com/watch?v=m_rDIzj6DRE',
    title: 'Little Fox Chinese (Thiếu nhi • Miễn phí): Bài hát Chào hỏi & Làm quen (你好歌)',
  },
  'hsk1-lesson-02': {
    url: 'https://www.youtube.com/watch?v=7ZMc8JJYA94',
    title: 'Little Fox Chinese (Thiếu nhi • Miễn phí): Hỏi tên & Quốc tịch (你叫什么名字？)',
  },
  'hsk1-lesson-03': {
    url: 'https://www.youtube.com/watch?v=4TA2iKi_kPY',
    title: 'Little Fox Chinese (Thiếu nhi • Miễn phí): Gia đình & Người thân (手指家庭)',
  },
  'hsk1-lesson-04': {
    url: 'https://www.youtube.com/watch?v=WeYArTD9IHk',
    title: 'GamesLearnChinese (Thiếu nhi • Miễn phí): Số đếm, Thời gian & Ngày tháng',
  },
  'hsk1-lesson-05': {
    url: 'https://www.youtube.com/watch?v=OB5bL3Ow4-c',
    title: 'Little Fox Chinese (Thiếu nhi • Miễn phí): Đi siêu thị & Mua sắm (在超市)',
  },
  'hsk2-lesson-01': {
    url: 'https://www.youtube.com/watch?v=yjeSGzZzc-g',
    title: 'GamesLearnChinese (Thiếu nhi • Miễn phí): Món ăn & Gọi món nhà hàng',
  },
  'hsk2-lesson-02': {
    url: 'https://www.youtube.com/watch?v=umGf6u4Oj7E',
    title: 'GamesLearnChinese (Thiếu nhi • Miễn phí): Phương tiện giao thông & Hỏi đường',
  },
  'hsk2-lesson-03': {
    url: 'https://www.youtube.com/watch?v=eGnHnz9eC9s',
    title: 'Little Fox Chinese (Thiếu nhi • Miễn phí): Thời tiết & Bốn mùa (天气怎么样？)',
  },
  'hsk2-lesson-04': {
    url: 'https://www.youtube.com/watch?v=xkySrEZ4R-U',
    title: 'Little Fox Chinese (Thiếu nhi • Miễn phí): Sở thích & Hoạt động (你喜欢什么？)',
  },
  'hsk2-lesson-05': {
    url: 'https://www.youtube.com/watch?v=0vCnLciboHY',
    title: 'Little Fox Chinese (Thiếu nhi • Miễn phí): Khám bệnh & Sức khỏe (我生病了)',
  },
  'hsk3-lesson-01': {
    url: 'https://www.youtube.com/watch?v=2e8zAu2_h2w',
    title: 'YAYA Mandarin (Miễn phí • Dễ hiểu): Kế hoạch & Đặt phòng HSK 3',
  },
  'hsk3-lesson-02': {
    url: 'https://www.youtube.com/watch?v=Rq5uEhZPpgY',
    title: 'YAYA Mandarin (Miễn phí • Dễ hiểu): Du lịch & Di chuyển HSK 3',
  },
  'hsk3-lesson-03': {
    url: 'https://www.youtube.com/watch?v=ErRStua7wVs',
    title: 'Global Chinese (Miễn phí): Hội thoại HSK 3 Chuẩn Quốc tế',
  },
  'hsk3-lesson-04': {
    url: 'https://www.youtube.com/watch?v=By5ql5a6Y40',
    title: 'Little Fox Chinese (Hoạt hình • Miễn phí): Kể chuyện sinh động bằng tiếng Trung',
  },
  'hsk4-01': {
    url: 'https://www.youtube.com/watch?v=hSA7LNTvIUU',
    title: 'Tao Laoshi (Miễn phí): Bài giảng HSK 4 Chuẩn Phần 1',
  },
  'hsk4-02': {
    url: 'https://www.youtube.com/watch?v=jWsK1SaOxBg',
    title: 'Hanyu CJD (Miễn phí): Luyện nghe & Đàm thoại công sở HSK 4',
  },
  'hsk4-03': {
    url: 'https://www.youtube.com/watch?v=xE3Sh1S2lWM',
    title: 'YAYA Mandarin (Miễn phí): Hội thoại đời sống hiện đại HSK 4',
  },
  'hsk4-04': {
    url: 'https://www.youtube.com/watch?v=d0ylEcJizq8',
    title: 'YAYA Mandarin (Miễn phí): Luyện nghe nói lưu loát HSK 4',
  },
  'hsk5-01': {
    url: 'https://www.youtube.com/watch?v=tBqHmOH2ycs',
    title: 'Wenjing-Zhiyuan (Miễn phí): Bài giảng HSK 5 Chuẩn Phần 1',
  },
  'hsk5-02': {
    url: 'https://www.youtube.com/watch?v=vk3GXa1zRKs',
    title: 'Say Ninhao (Miễn phí): Bài giảng HSK 5 Chuẩn Phần 2',
  },
  'hsk5-03': {
    url: 'https://www.youtube.com/watch?v=hq5zUll0C-8',
    title: 'Xiaolin Chinese (Miễn phí): Đọc hiểu & Phân tích văn bản HSK 5',
  },
  'hsk5-04': {
    url: 'https://www.youtube.com/watch?v=zZHomlS1CrA',
    title: 'Little Fox Chinese (Hoạt hình • Miễn phí): Tây Du Ký 1 - Văn hóa kinh điển dễ hiểu',
  },
  'hsk6-01': {
    url: 'https://www.youtube.com/watch?v=1s8FMW9wh_0',
    title: 'Bài giảng HSK 6 Miễn phí: Luyện nghe đọc hiểu Bài 1 (孩子给我们的启示)',
  },
  'hsk6-02': {
    url: 'https://www.youtube.com/watch?v=P2_gHvSdid8',
    title: 'Bài giảng HSK 6 Miễn phí: Luyện nghe đọc hiểu Bài 2 (父母之爱)',
  },
  'hsk6-03': {
    url: 'https://www.youtube.com/watch?v=nV8BcPH43XQ',
    title: 'Hanyu CJD (Miễn phí): Luyện nghe chuẩn HSK Cao cấp',
  },
  'hsk6-04': {
    url: 'https://www.youtube.com/watch?v=uDFCJFqo1eU',
    title: 'Little Fox Chinese (Hoạt hình • Miễn phí): Tây Du Ký 2 - Thủy Liêm Động',
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

  const videoId = extractYouTubeVideoId(videoInfo.url);
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

          {/* Bilingual Subtitles & Transcript Companion (Tiếng Việt / English / 中文 + Pinyin) */}
          <VideoSubtitlePanel
            videoId={videoId}
            hskLesson={hskLesson}
            title={videoInfo.title}
          />
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
