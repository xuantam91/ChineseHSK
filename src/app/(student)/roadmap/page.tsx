'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Play,
  BookOpen,
  Mic,
  Headphones,
  Award,
  Volume2,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Dialog } from '@/components/ui/Dialog';
import { PinyinChart } from '@/components/lesson/PinyinChart';
import { NotionMethodologySection } from '@/components/roadmap/NotionMethodologySection';
import { DEMO_MONTHS_OVERVIEW, DEMO_USER_PROFILE } from '@/lib/mock-data';
import {
  getStoredUserProfile,
  saveUserProfile,
  getCompletedLessonIds,
  isDemoAccount,
  DEMO_MAX_LESSONS,
} from '@/lib/student-store';
import { HSKLevel } from '@/types';
import { HSK1_LESSONS, HSK2_LESSONS, HSK3_LESSONS, HSKLesson } from '@/lib/curriculum/hsk1-3-data';
import {
  HSK4_LESSONS,
  HSK5_LESSONS,
  HSK6_LESSONS,
  HSK7_TO_9_FRAMEWORK,
  HSK4_TO_9_OVERVIEWS,
} from '@/lib/curriculum/hsk4-9-data';
import { speakChinese } from '@/lib/tts';

export type HSKViewLevel = 'HSK1' | 'HSK2' | 'HSK3' | 'HSK4' | 'HSK5' | 'HSK6' | 'HSK7-9' | 'ALL';

const LEVEL_TABS: { id: HSKViewLevel; label: string; tier: string; vocab: string }[] = [
  { id: 'HSK1', label: 'HSK 1', tier: 'Nhập môn', vocab: '500 từ' },
  { id: 'HSK2', label: 'HSK 2', tier: 'Sơ cấp', vocab: '1.272 từ' },
  { id: 'HSK3', label: 'HSK 3', tier: 'Giao tiếp', vocab: '2.245 từ' },
  { id: 'HSK4', label: 'HSK 4', tier: 'Trung cấp', vocab: '3.245 từ' },
  { id: 'HSK5', label: 'HSK 5', tier: 'Cao cấp', vocab: '4.316 từ' },
  { id: 'HSK6', label: 'HSK 6', tier: 'Thành thạo', vocab: '5.456 từ' },
  { id: 'HSK7-9', label: 'HSK 7-9', tier: 'Hàn lâm', vocab: '11.092 từ' },
  { id: 'ALL', label: 'Tổng quan 12 Tháng', tier: 'Kế hoạch năm', vocab: '365 ngày' },
];

export default function RoadmapPage() {
  const [activeLevel, setActiveLevel] = useState<HSKViewLevel>('HSK1');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [profile, setProfile] = useState(DEMO_USER_PROFILE);
  const [isPinyinModalOpen, setIsPinyinModalOpen] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    const p = getStoredUserProfile();
    setProfile(p);
    if (p.currentHskLevel) {
      setActiveLevel(p.currentHskLevel as HSKViewLevel);
    }
    setCompletedLessons(getCompletedLessonIds());
  }, []);

  const handleSelectLevelTab = (level: HSKViewLevel) => {
    setActiveLevel(level);
    if (level !== 'ALL') {
      const updated = { ...profile, currentHskLevel: level as HSKLevel };
      setProfile(updated);
      saveUserProfile(updated);
    }
  };

  const getLessonsForLevel = (level: HSKViewLevel): HSKLesson[] => {
    switch (level) {
      case 'HSK1':
        return HSK1_LESSONS;
      case 'HSK2':
        return HSK2_LESSONS;
      case 'HSK3':
        return HSK3_LESSONS;
      case 'HSK4':
        return HSK4_LESSONS;
      case 'HSK5':
        return HSK5_LESSONS;
      case 'HSK6':
        return HSK6_LESSONS;
      default:
        return [];
    }
  };

  const levelLessons = getLessonsForLevel(activeLevel);
  const isDemo = isDemoAccount(profile);
  const visibleLessons = isDemo
    ? levelLessons.slice(0, DEMO_MAX_LESSONS)
    : levelLessons;
  const completedInLevel = visibleLessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;
  const progressPct =
    visibleLessons.length > 0
      ? Math.round((completedInLevel / visibleLessons.length) * 100)
      : 0;

  const nextLessonInLevel =
    visibleLessons.find((l) => !completedLessons.includes(l.id)) || visibleLessons[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 via-emerald-700 to-emerald-800 text-white p-6 sm:p-7 shadow-md shadow-emerald-900/10 border border-emerald-600/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
              Lộ trình từng bước • Chuẩn HSK 3.0
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Lộ trình học Tiếng Trung rõ ràng từ HSK 1 đến HSK 9
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
            Chọn cấp độ của bạn và bắt đầu học ngay từng bài theo thứ tự từ dễ đến khó.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0 relative z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPinyinModalOpen(true)}
            leftIcon={<Mic className="w-3.5 h-3.5 text-white" />}
            className="text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border-white/25"
          >
            Bảng Pinyin
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMethodology(!showMethodology)}
            leftIcon={<BookOpen className="w-3.5 h-3.5 text-white" />}
            className="text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border-white/25"
          >
            {showMethodology ? 'Ẩn phương pháp' : 'Phương pháp học'}
          </Button>
        </div>
      </div>

      {showMethodology && (
        <div className="space-y-2">
          <NotionMethodologySection />
        </div>
      )}

      {/* Clear Level Navigation Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 overflow-x-auto scrollbar-none">
        {LEVEL_TABS.map((tab) => {
          const isActive = activeLevel === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectLevelTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {tab.tier}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: SPECIFIC HSK LEVEL (HSK 1 - HSK 6) — CLEAR STEP-BY-STEP PATH */}
      {activeLevel !== 'ALL' && activeLevel !== 'HSK7-9' && (
        <div className="space-y-6">
          {/* Level Header + Progress + 1-Click Continue */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase">
                    {activeLevel}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Hoàn thành {completedInLevel}/{levelLessons.length} bài ({progressPct}%)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeLevel === 'HSK1' && 'HSK 1 — Làm chủ Phát âm Pinyin & Giao tiếp nền tảng'}
                  {activeLevel === 'HSK2' && 'HSK 2 — Phản xạ Giao tiếp đời sống hàng ngày'}
                  {activeLevel === 'HSK3' && 'HSK 3 — Đàm thoại Du lịch, Mua sắm & Xã giao'}
                  {activeLevel === 'HSK4' && HSK4_TO_9_OVERVIEWS.HSK4.titleVi}
                  {activeLevel === 'HSK5' && HSK4_TO_9_OVERVIEWS.HSK5.titleVi}
                  {activeLevel === 'HSK6' && HSK4_TO_9_OVERVIEWS.HSK6.titleVi}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  {activeLevel === 'HSK1' && '500 từ vựng cốt lõi, 4 thanh điệu chuẩn và các mẫu câu chào hỏi, giới thiệu bản thân, gia đình.'}
                  {activeLevel === 'HSK2' && '1.272 từ vựng, tự tin gọi món, hỏi đường, nói về thời tiết, sở thích và đi khám bệnh.'}
                  {activeLevel === 'HSK3' && '2.245 từ vựng, làm chủ câu chữ 把, câu so sánh 比 và giao tiếp lưu loát trong đời sống.'}
                  {activeLevel === 'HSK4' && HSK4_TO_9_OVERVIEWS.HSK4.targetSkillsVi}
                  {activeLevel === 'HSK5' && HSK4_TO_9_OVERVIEWS.HSK5.targetSkillsVi}
                  {activeLevel === 'HSK6' && HSK4_TO_9_OVERVIEWS.HSK6.targetSkillsVi}
                </p>
              </div>

              {nextLessonInLevel && (
                <Link href={`/lesson/${nextLessonInLevel.id}`} className="shrink-0">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<Play className="w-4 h-4 fill-white" />}
                    className="w-full md:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 shadow-sm"
                  >
                    Học ngay Bài {nextLessonInLevel.lessonNumber}
                  </Button>
                </Link>
              )}
            </div>

            <Progress value={progressPct} max={100} size="sm" />
          </div>

          {/* Vivid Lesson Cover Cards (Demo: 3 Trial Lessons | Full Account: 20 Lessons per HSK Level) */}
          <div className="space-y-4">
            {visibleLessons.map((lesson) => {
              const isDone = completedLessons.includes(lesson.id);
              const isNext = nextLessonInLevel?.id === lesson.id;
              const coverImg =
                lesson.imageUrl || '/images/lessons/hsk1_lesson01_greeting.jpg';
              const coverHanzi =
                lesson.coverCalligraphy ||
                lesson.vocabulary?.[0]?.hanzi ||
                lesson.title.match(/[\u4e00-\u9fff]{2,4}/)?.[0] ||
                '汉语';

              return (
                <div
                  key={lesson.id}
                  className={`rounded-2xl border bg-white overflow-hidden transition-all flex flex-col md:flex-row md:items-stretch justify-between ${
                    isNext
                      ? 'border-2 border-emerald-600 shadow-md'
                      : 'border-slate-200 hover:border-emerald-300 shadow-2xs'
                  }`}
                >
                  {/* Left Visual Lesson Cover Thumbnail - Crisp & Vibrant */}
                  <Link
                    href={`/lesson/${lesson.id}`}
                    className="relative md:w-60 lg:w-68 min-h-[155px] bg-slate-900 text-white p-4 flex flex-col justify-between overflow-hidden shrink-0 group"
                  >
                    <img
                      src={coverImg}
                      alt={lesson.title}
                      onError={(e) => {
                        e.currentTarget.src = '/images/lessons/hsk1_lesson01_greeting.jpg';
                      }}
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-95 contrast-105 saturate-110 group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Subtle top/bottom scrims so the center of the cover artwork stays 100% sharp */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-slate-950/55" />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none select-none absolute right-2 bottom-1 text-4xl font-black text-white/25 tracking-widest drop-shadow"
                    >
                      {coverHanzi}
                    </div>

                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-2xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isNext
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-950/70 text-white border border-white/25 backdrop-blur-xs'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3 h-3" />}
                        BÀI {lesson.lessonNumber}/{levelLessons.length}
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-300 bg-slate-950/60 px-2 py-0.5 rounded-md border border-white/15">
                        {lesson.level}
                      </span>
                    </div>

                    <div className="relative z-10 mt-3">
                      <div className="text-xl font-black text-white tracking-wide drop-shadow-md">
                        {coverHanzi}
                      </div>
                      <div className="text-[11px] text-emerald-50 font-semibold line-clamp-1 drop-shadow">
                        Trang bìa Bài {lesson.lessonNumber} • {lesson.estimatedMinutes} phút
                      </div>
                    </div>
                  </Link>

                  {/* Center Content Summary, Vocab & Grammar Preview */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/lesson/${lesson.id}`}
                          className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-emerald-700 transition-colors"
                        >
                          {lesson.title}
                        </Link>
                        {isDone && (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            Đã hoàn thành
                          </span>
                        )}
                        {isNext && !isDone && (
                          <span className="text-xs font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                            Bài tiếp theo của bạn
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-medium ml-auto md:ml-0">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {lesson.estimatedMinutes} phút
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {lesson.subtitleVi} — {lesson.summaryVi}
                      </p>

                      {/* Grammar Highlights */}
                      {lesson.grammarNotes && lesson.grammarNotes.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-semibold text-amber-800 mr-1">
                            Ngữ pháp:
                          </span>
                          {lesson.grammarNotes.slice(0, 2).map((g) => (
                            <span
                              key={g.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-900"
                            >
                              {g.title}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Interactive Vocabulary Preview Chips */}
                      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-xs font-semibold text-slate-400 mr-1">
                            Từ vựng:
                          </span>
                          {lesson.vocabulary.slice(0, 5).map((v, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => speakChinese(v.hanzi)}
                              title="Bấm để nghe phát âm"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs transition-colors cursor-pointer"
                            >
                              <Volume2 className="w-3 h-3 text-emerald-700" />
                              <span className="font-chinese font-bold text-slate-900">
                                {v.hanzi}
                              </span>
                              <span className="font-semibold text-emerald-700">
                                {v.pinyin}
                              </span>
                              <span className="text-slate-500">{v.meaningVi}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Direct 1-Click Start Lesson Button */}
                    <div className="self-end md:self-center shrink-0 w-full md:w-auto">
                      <Link href={`/lesson/${lesson.id}`} className="block">
                        <Button
                          variant={isDone ? 'outline' : 'primary'}
                          size="md"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                          className={
                            isDone
                              ? 'w-full md:w-auto text-xs font-bold border-slate-300 text-slate-700'
                              : 'w-full md:w-auto text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-5 shadow-2xs'
                          }
                        >
                          {isDone ? 'Ôn lại bài' : 'Vào học ngay'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {isDemo && levelLessons.length > DEMO_MAX_LESSONS && (
              <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/70 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-900">
                    <span>🔒 Chế độ Tài khoản Học thử (Demo: Hiển thị {DEMO_MAX_LESSONS}/{levelLessons.length} bài đầu)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Mở khóa tiếp {levelLessons.length - DEMO_MAX_LESSONS} bài học chuyên sâu ({activeLevel}: Bài 4 — Bài {levelLessons.length})
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Tài khoản Demo giới hạn học thử 3 bài đầu tiên của mỗi cấp độ. Đăng ký hoặc đăng nhập tài khoản chính thức để học trọn bộ 120 bài HSK 1–6.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="md"
                      className="text-xs font-bold border-emerald-600 text-emerald-800 hover:bg-emerald-50"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-5"
                    >
                      Đăng ký mở khóa
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: HSK 7-9 ADVANCED FRAMEWORK */}
      {activeLevel === 'HSK7-9' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs">
            <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider mb-2">
              Khung HSK Cao Cấp (7 — 9)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {HSK4_TO_9_OVERVIEWS['HSK7-9'].titleVi}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Tổng cộng 11.092 từ vựng (5.636 từ nâng cao), chuyên sâu về học thuật, tranh biện logic, và dịch thuật ngoại giao.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HSK7_TO_9_FRAMEWORK.map((module) => (
              <div
                key={module.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => speakChinese(module.titleZh)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs font-semibold text-emerald-800 transition-colors"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Nghe</span>
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{module.titleZh}</h3>
                  <h4 className="text-xs font-semibold text-emerald-800 mt-0.5">{module.titleVi}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {module.objectiveVi}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Chuyên đề chính:
                    </span>
                    {module.keyTopics.map((topic, i) => (
                      <div key={i} className="text-xs text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: 12-MONTH OVERVIEW (Clean 12-month cards that jump straight to the right HSK level) */}
      {activeLevel === 'ALL' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_MONTHS_OVERVIEW.map((month) => {
            const targetLevel = (month.hskLevel.replace(/\s+/g, '') || 'HSK1') as HSKViewLevel;
            return (
              <div
                key={month.monthIndex}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      Tháng {month.monthIndex} • {month.hskLevel}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {month.totalDays} ngày
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {month.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {month.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {month.theme}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleSelectLevelTab(
                        ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].includes(targetLevel)
                          ? targetLevel
                          : 'HSK1'
                      )
                    }
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="text-xs font-bold text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                  >
                    Xem các bài học
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pinyin Modal */}
      <Dialog
        isOpen={isPinyinModalOpen}
        onClose={() => setIsPinyinModalOpen(false)}
        title="Bảng Ngữ Âm Pinyin Tương Tác"
        className="max-w-4xl"
      >
        <div className="py-2">
          <PinyinChart defaultTab="initials" />
        </div>
      </Dialog>
    </div>
  );
}
