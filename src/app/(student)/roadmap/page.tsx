'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Sparkles,
  PlayCircle,
  AlertCircle,
  Coffee,
  BookOpen,
  Mic,
  Headphones,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { PinyinChart } from '@/components/lesson/PinyinChart';
import { NotionMethodologySection } from '@/components/roadmap/NotionMethodologySection';
import { DEMO_MONTHS_OVERVIEW, DEMO_DAYS } from '@/lib/mock-data';
import { getStoredUserProfile, getComputedDays, getCompletedLessonIds } from '@/lib/student-store';
import { CurriculumDay, DayStatus } from '@/types';
import { HSK1_LESSONS, HSK2_LESSONS, HSK3_LESSONS } from '@/lib/curriculum/hsk1-3-data';
import { HSK4_LESSONS, HSK5_LESSONS, HSK6_LESSONS, HSK7_TO_9_FRAMEWORK, HSK4_TO_9_OVERVIEWS } from '@/lib/curriculum/hsk4-9-data';

export type HSKViewLevel = 'ALL' | 'HSK1' | 'HSK2' | 'HSK3' | 'HSK4' | 'HSK5' | 'HSK6' | 'HSK7-9';

const LEVEL_TABS: { id: HSKViewLevel; label: string; tier: string }[] = [
  { id: 'ALL', label: '12 Tháng', tier: 'Tổng quan' },
  { id: 'HSK1', label: 'HSK 1', tier: 'Sơ cấp' },
  { id: 'HSK2', label: 'HSK 2', tier: 'Sơ cấp' },
  { id: 'HSK3', label: 'HSK 3', tier: 'Trung cấp' },
  { id: 'HSK4', label: 'HSK 4', tier: 'Trung cấp' },
  { id: 'HSK5', label: 'HSK 5', tier: 'Cao cấp' },
  { id: 'HSK6', label: 'HSK 6', tier: 'Thành thạo' },
  { id: 'HSK7-9', label: 'HSK 7-9', tier: 'Hàn lâm' },
];

export default function RoadmapPage() {
  const [activeLevel, setActiveLevel] = useState<HSKViewLevel>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [openWeek, setOpenWeek] = useState<number>(1);
  const [days, setDays] = useState<CurriculumDay[]>(DEMO_DAYS);
  const [profile, setProfile] = useState(getStoredUserProfile());
  const [isPinyinModalOpen, setIsPinyinModalOpen] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    const p = getStoredUserProfile();
    setProfile(p);
    if (p.currentHskLevel && p.currentHskLevel !== 'HSK1') {
      setActiveLevel(p.currentHskLevel as HSKViewLevel);
    }
    const comp = getCompletedLessonIds();
    setDays(getComputedDays(p, comp));
  }, []);

  const currentMonthData =
    DEMO_MONTHS_OVERVIEW.find((m) => m.monthIndex === selectedMonth) ||
    DEMO_MONTHS_OVERVIEW[0];

  const getStatusBadge = (status: DayStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Hoàn thành</span>
          </span>
        );
      case 'today':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
            <PlayCircle className="w-3 h-3 text-amber-700" />
            <span>Hôm nay</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-700" />
            <span>Tồn đọng</span>
          </span>
        );
      case 'rest_day':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Coffee className="w-3 h-3 text-slate-500" />
            <span>Nghỉ ngơi</span>
          </span>
        );
      case 'locked':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Chưa mở</span>
          </span>
        );
    }
  };

  const getLessonsForLevel = (level: HSKViewLevel) => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Khung năng lực HSK 3.0
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Lộ trình học tập chi tiết 12 tháng
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Tự động mở bài mỗi ngày theo giờ Việt Nam. Học từ ngữ âm căn bản đến tự tin giao tiếp và thi đỗ HSK.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPinyinModalOpen(true)}
            leftIcon={<Mic className="w-3.5 h-3.5 text-slate-300" />}
            className="text-xs font-semibold border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            Bảng ngữ âm Pinyin
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMethodology(!showMethodology)}
            leftIcon={<BookOpen className="w-3.5 h-3.5 text-slate-300" />}
            className="text-xs font-semibold border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            {showMethodology ? 'Đóng cẩm nang' : 'Cẩm nang sư phạm'}
          </Button>
        </div>
      </div>

      {showMethodology && (
        <div className="space-y-2">
          <NotionMethodologySection />
        </div>
      )}

      {/* Level Navigation Filter Tabs */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto scrollbar-none">
        {LEVEL_TABS.map((tab) => {
          const isActive = activeLevel === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLevel(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-white text-slate-900 font-bold shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  isActive ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
                }`}
              >
                {tab.tier}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEW: 12-MONTH CALENDAR (WHEN "ALL" IS SELECTED) */}
      {activeLevel === 'ALL' && (
        <div className="space-y-6">
          {/* Month Selector Carousel */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DEMO_MONTHS_OVERVIEW.map((month) => {
              const isSelected = month.monthIndex === selectedMonth;
              return (
                <button
                  key={month.monthIndex}
                  onClick={() => setSelectedMonth(month.monthIndex)}
                  className={`flex flex-col items-start min-w-[130px] p-3 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? 'border-emerald-600 bg-white text-slate-900 shadow-2xs ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-full flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {month.hskLevel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{month.totalDays}d</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Tháng {month.monthIndex}</span>
                  <span className="text-[11px] text-slate-500 truncate max-w-[110px] mt-0.5">
                    {month.theme}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Month Detail Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Cấp độ mục tiêu: {currentMonthData.hskLevel}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                  {currentMonthData.title}
                </h2>
              </div>
              <div className="text-xs text-slate-500">
                Tổng cộng: <strong className="text-slate-900">{currentMonthData.totalDays} ngày học</strong>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {currentMonthData.description}
            </p>
          </div>

          {/* Week Accordions for the selected month */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((weekIdx) => {
              const isOpen = openWeek === weekIdx;
              const weekDays = weekIdx === 1 ? days : [];

              return (
                <div
                  key={weekIdx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenWeek(isOpen ? 0 : weekIdx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                        W{weekIdx}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Tuần {weekIdx}: {weekIdx === 1 ? 'Khởi động Pinyin & Thanh điệu' : `Chuyên đề tuần ${weekIdx}`}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {weekIdx === 1 ? '7 ngày học • 6 ngày bài mới + 1 ngày ôn tập' : '7 ngày học chuẩn lộ trình'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        {weekIdx === 1 ? '5/7 ngày hoàn thành' : 'Đang chờ mở'}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/40">
                      {weekIdx === 1 && weekDays.length > 0 ? (
                        weekDays.map((day) => {
                          const isLocked = day.status === 'locked';
                          const isRest = day.status === 'rest_day';

                          return (
                            <div
                              key={day.id}
                              id={day.status === 'today' ? 'day-today' : undefined}
                              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                                day.status === 'today'
                                  ? 'bg-amber-50/40 border-l-4 border-l-amber-500'
                                  : isLocked
                                  ? 'opacity-70'
                                  : 'hover:bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-3.5">
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs border ${
                                    day.status === 'completed'
                                      ? 'bg-emerald-700 text-white border-emerald-700'
                                      : day.status === 'today'
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-white text-slate-500 border-slate-200'
                                  }`}
                                >
                                  D{day.dayIndex}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-slate-900">
                                      {day.title}
                                    </h4>
                                    {day.status && getStatusBadge(day.status)}
                                    {day.dayType === 'theory' && (
                                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        Lý thuyết & Thực hành
                                      </span>
                                    )}
                                    {day.dayType === 'review' && (
                                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        Ôn tập & Phản xạ
                                      </span>
                                    )}
                                    {day.dayType === 'assessment' && (
                                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        Đánh giá tuần
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1 font-medium text-slate-700">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      {day.estimatedMinutes} phút
                                    </span>
                                    <span>•</span>
                                    <span>{day.objectives?.length || 0} mục tiêu học</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center">
                                {isLocked ? (
                                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                                    <Lock className="w-3 h-3" />
                                    <span>Mở sau {day.unlockOffsetDays} ngày</span>
                                  </div>
                                ) : isRest ? (
                                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                    Nghỉ ngơi & củng cố
                                  </span>
                                ) : day.status === 'completed' ? (
                                  <Link href={`/learn/${day.id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-50"
                                    >
                                      Ôn lại bài
                                    </Button>
                                  </Link>
                                ) : (
                                  <Link href={`/learn/${day.id}`}>
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                                      className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs"
                                    >
                                      {day.status === 'today' ? 'Học ngay' : 'Vào bài'}
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-xs text-slate-500">
                          Tuần {weekIdx} sẽ được mở theo tiến độ học tập hàng ngày của bạn.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: HSK LEVEL DETAIL VIEW (HSK 1 - 6) */}
      {activeLevel !== 'ALL' && activeLevel !== 'HSK7-9' && (
        <div className="space-y-6">
          {/* Level Header Banner */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 uppercase tracking-wider mb-2">
                  Chuẩn HSK 3.0
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {activeLevel === 'HSK1' && 'HSK Cấp 1 — Nhập môn & Phát âm Pinyin căn bản'}
                  {activeLevel === 'HSK2' && 'HSK Cấp 2 — Giao tiếp & Phản xạ đời sống'}
                  {activeLevel === 'HSK3' && 'HSK Cấp 3 — Đàm thoại & Kể chuyện'}
                  {activeLevel === 'HSK4' && HSK4_TO_9_OVERVIEWS.HSK4.titleVi}
                  {activeLevel === 'HSK5' && HSK4_TO_9_OVERVIEWS.HSK5.titleVi}
                  {activeLevel === 'HSK6' && HSK4_TO_9_OVERVIEWS.HSK6.titleVi}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                  {activeLevel === 'HSK1' && '500 từ vựng cốt lõi, 48 âm tiết chuẩn, quy tắc biến điệu thanh điệu và chào hỏi đàm thoại tự tin.'}
                  {activeLevel === 'HSK2' && '772 từ mới (tổng 1272 từ), đàm thoại gọi món, hỏi đường, thời tiết, sở thích, khám bệnh.'}
                  {activeLevel === 'HSK3' && '973 từ mới (tổng 2245 từ), tự tin đàm thoại khách sạn, du lịch, mẫu câu so sánh phức và kể chuyện.'}
                  {activeLevel === 'HSK4' && HSK4_TO_9_OVERVIEWS.HSK4.targetSkillsVi}
                  {activeLevel === 'HSK5' && HSK4_TO_9_OVERVIEWS.HSK5.targetSkillsVi}
                  {activeLevel === 'HSK6' && HSK4_TO_9_OVERVIEWS.HSK6.targetSkillsVi}
                </p>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700">
                  <Headphones className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Shadowing phản xạ</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700">
                  <Mic className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Chấm mic AI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Grid for Selected HSK Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levelLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Bài {lesson.lessonNumber} • {lesson.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.estimatedMinutes} phút
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {lesson.subtitleVi}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] font-medium text-slate-600">
                    <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      <Headphones className="w-3 h-3 text-slate-500" />
                      {lesson.dialogue.length} câu thoại
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      <Mic className="w-3 h-3 text-slate-500" />
                      {lesson.speechDrills.length} bài nói
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      <BookOpen className="w-3 h-3 text-slate-500" />
                      {lesson.vocabulary.length} từ vựng
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Chuẩn HSK 3.0
                  </span>
                  <Link href={`/lesson/${lesson.id}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      className="text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
                    >
                      Học bài này
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: HSK 7-9 ADVANCED FRAMEWORK */}
      {activeLevel === 'HSK7-9' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs">
            <span className="inline-block text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 uppercase tracking-wider mb-2">
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
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold mb-3">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{module.titleZh}</h3>
                  <h4 className="text-xs font-semibold text-emerald-800 mt-0.5">{module.titleVi}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {module.objectiveVi}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Chuyên đề chính:
                    </span>
                    {module.keyTopics.map((topic, i) => (
                      <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">
                    Khung nghiên cứu HSK 7-9
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pinyin Modal Dialog */}
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
