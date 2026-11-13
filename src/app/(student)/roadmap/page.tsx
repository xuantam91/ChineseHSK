'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Lock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Coffee,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  ArrowRight,
  Mic,
  Headphones,
  BookOpen,
  Volume2,
  Layers,
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
          <Badge variant="success" size="sm" className="gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Hoàn thành</span>
          </Badge>
        );
      case 'today':
        return (
          <Badge variant="warning" size="sm" className="gap-1 animate-pulse">
            <PlayCircle className="w-3 h-3 text-amber-600" />
            <span>Hôm nay</span>
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="destructive" size="sm" className="gap-1">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>Tồn đọng</span>
          </Badge>
        );
      case 'rest_day':
        return (
          <Badge variant="outline" size="sm" className="gap-1">
            <Coffee className="w-3 h-3 text-gray-500" />
            <span>Nghỉ ngơi</span>
          </Badge>
        );
      case 'locked':
      default:
        return (
          <Badge variant="locked" size="sm" className="gap-1">
            <Lock className="w-3 h-3 text-gray-400" />
            <span>Chưa mở</span>
          </Badge>
        );
    }
  };

  const jumpToToday = () => {
    setActiveLevel('ALL');
    setSelectedMonth(1);
    setOpenWeek(1);
    const todayElement = document.getElementById('day-today');
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Get lessons based on active level
  const getLevelLessons = () => {
    switch (activeLevel) {
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

  const levelLessons = getLevelLessons();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Lộ trình chuẩn HSK 3.0 (Cấp 1 — 9)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Lộ Trình Tự Học Tiếng Trung Toàn Diện
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Toàn diện 4 kỹ năng — Tập trung đột phá <strong className="text-emerald-700">Nghe & Nói</strong> với công nghệ thu âm chấm điểm và Shadowing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={showMethodology ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowMethodology(!showMethodology)}
            leftIcon={<BookOpen className="w-3.5 h-3.5" />}
            className="text-xs font-semibold"
          >
            {showMethodology ? 'Đóng Cẩm Nang' : 'Cẩm Nang Phương Pháp'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPinyinModalOpen(true)}
            leftIcon={<Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
            className="text-xs font-semibold"
          >
            Bảng Ngữ Âm Pinyin
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={jumpToToday}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            className="self-start sm:self-auto text-xs"
          >
            Bài hôm nay
          </Button>
        </div>
      </div>

      {/* Notion Methodology Section (Expanded or Quick Banner) */}
      {!showMethodology && (
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                Phương pháp 5 bước tại nhà & Lộ trình phân hóa theo lứa tuổi (Từ Notion)
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Nạp âm thụ động qua loa Craven, tương tác flashcard 2 chiều, 7 lỗi cần tránh và ma trận giáo trình chuẩn.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMethodology(true)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-bold text-emerald-800 border-emerald-300 hover:bg-emerald-100/60 shrink-0 self-start sm:self-auto"
          >
            Xem Cẩm Nang Sư Phạm
          </Button>
        </div>
      )}

      {showMethodology && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              onClick={() => setShowMethodology(false)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
            >
              <span>Thu gọn cẩm nang</span>
              <span>✕</span>
            </button>
          </div>
          <NotionMethodologySection />
        </div>
      )}

      {/* HSK Level Navigation Filter Tabs */}
      <div className="flex gap-1.5 p-1.5 rounded-2xl bg-gray-100/90 border border-gray-200 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveLevel('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeLevel === 'ALL'
              ? 'bg-white text-emerald-800 shadow-xs border border-gray-200/60'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Lịch 12 Tháng
        </button>

        {(['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7-9'] as HSKViewLevel[]).map((lvl) => {
          const isActive = activeLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              {lvl === 'HSK1' && 'HSK 1 (Sơ cấp)'}
              {lvl === 'HSK2' && 'HSK 2'}
              {lvl === 'HSK3' && 'HSK 3'}
              {lvl === 'HSK4' && 'HSK 4 (Trung cấp)'}
              {lvl === 'HSK5' && 'HSK 5'}
              {lvl === 'HSK6' && 'HSK 6'}
              {lvl === 'HSK7-9' && 'HSK 7-9 (Cao cấp)'}
            </button>
          );
        })}
      </div>

      {/* VIEW: 12-MONTH CALENDAR (WHEN "ALL" IS SELECTED) */}
      {activeLevel === 'ALL' && (
        <div className="space-y-6">
          {/* Month Selector Carousel / Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DEMO_MONTHS_OVERVIEW.map((month) => {
              const isSelected = month.monthIndex === selectedMonth;
              return (
                <button
                  key={month.monthIndex}
                  onClick={() => setSelectedMonth(month.monthIndex)}
                  className={`flex flex-col items-start min-w-[130px] p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 ${
                      isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {month.hskLevel}
                  </span>
                  <span className="text-xs font-bold leading-tight">Tháng {month.monthIndex}</span>
                  <span
                    className={`text-[11px] truncate max-w-[110px] mt-0.5 ${
                      isSelected ? 'text-emerald-100' : 'text-gray-400'
                    }`}
                  >
                    {month.theme}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Month Detail Header Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Cấp độ mục tiêu: {currentMonthData.hskLevel}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
                  {currentMonthData.title}
                </h2>
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                Tổng cộng: <strong className="text-gray-900">{currentMonthData.totalDays} ngày học</strong>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
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
                  className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenWeek(isOpen ? 0 : weekIdx)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                        W{weekIdx}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          Tuần {weekIdx}: {weekIdx === 1 ? 'Ngữ âm cơ bản & 4 Thanh điệu' : `Chủ đề mở rộng tuần ${weekIdx}`}
                        </h3>
                        <p className="text-xs text-gray-500">
                          7 Ngày • 1 bài kiểm tra tuần
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 divide-y divide-gray-100 bg-[#fdfbf7]/40">
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
                                  ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                                  : isLocked
                                  ? 'opacity-65'
                                  : 'hover:bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-3.5">
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                                    day.status === 'completed'
                                      ? 'bg-emerald-600 text-white'
                                      : day.status === 'today'
                                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  D{day.dayIndex}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="text-sm sm:text-base font-bold text-gray-900">
                                      {day.title}
                                    </h4>
                                    {day.status && getStatusBadge(day.status)}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      {day.estimatedMinutes} phút
                                    </span>
                                    <span>•</span>
                                    <span>{day.objectives?.length || 0} mục tiêu học</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center">
                                {isLocked ? (
                                  <div className="flex items-center gap-1 text-xs text-gray-400 font-medium px-3 py-1.5 rounded-xl bg-gray-100">
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Mở sau {day.unlockOffsetDays} ngày</span>
                                  </div>
                                ) : isRest ? (
                                  <span className="text-xs text-gray-500 font-medium italic">
                                    Nghỉ ngơi & củng cố
                                  </span>
                                ) : (
                                  <Link href={`/learn/${day.id}`}>
                                    <Button
                                      variant={day.status === 'today' ? 'primary' : 'outline'}
                                      size="sm"
                                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
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
                        <div className="p-8 text-center text-xs text-gray-500">
                          Nội dung Tuần {weekIdx} sẽ được mở khóa theo lịch trình tự học.
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

      {/* VIEW: HSK LEVEL LESSONS (HSK 1 - 6) */}
      {activeLevel !== 'ALL' && activeLevel !== 'HSK7-9' && (
        <div className="space-y-6">
          {/* Level Header Banner */}
          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  Chuẩn HSK 3.0 Mới
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {activeLevel === 'HSK1' && 'HSK Cấp 1 — Nhập Môn & Phát Âm Pinyin Căn Bản'}
                  {activeLevel === 'HSK2' && 'HSK Cấp 2 — Giao Tiếp & Phản Xạ Đời Sống'}
                  {activeLevel === 'HSK3' && 'HSK Cấp 3 — Tự Tin Kể Chuyện & Đàm Thoại'}
                  {activeLevel === 'HSK4' && HSK4_TO_9_OVERVIEWS.HSK4.titleVi}
                  {activeLevel === 'HSK5' && HSK4_TO_9_OVERVIEWS.HSK5.titleVi}
                  {activeLevel === 'HSK6' && HSK4_TO_9_OVERVIEWS.HSK6.titleVi}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
                  {activeLevel === 'HSK1' && '500 từ vựng cốt lõi, 48 âm tiết chuẩn, làm chủ quy tắc biến điệu thanh điệu và chào hỏi tự tin.'}
                  {activeLevel === 'HSK2' && '772 từ mới (tổng 1272 từ), đàm thoại gọi món, hỏi đường, thời tiết, sở thích, khám bệnh.'}
                  {activeLevel === 'HSK3' && '973 từ mới (tổng 2245 từ), tự tin đàm thoại khách sạn, du lịch, mẫu câu so sánh phức và kể chuyện.'}
                  {activeLevel === 'HSK4' && HSK4_TO_9_OVERVIEWS.HSK4.targetSkillsVi}
                  {activeLevel === 'HSK5' && HSK4_TO_9_OVERVIEWS.HSK5.targetSkillsVi}
                  {activeLevel === 'HSK6' && HSK4_TO_9_OVERVIEWS.HSK6.targetSkillsVi}
                </p>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-white/90 border border-emerald-100 px-3 py-2 rounded-2xl shadow-2xs">
                  <Headphones className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-gray-700">Nghe Shadowing</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 border border-emerald-100 px-3 py-2 rounded-2xl shadow-2xs">
                  <Mic className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-gray-700">Chấm Nói Mic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Grid for Selected HSK Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levelLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Bài {lesson.lessonNumber} • {lesson.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.estimatedMinutes} phút
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                    {lesson.subtitleVi}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-[11px] font-medium text-gray-600">
                    <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md">
                      <Headphones className="w-3 h-3 text-emerald-600" />
                      {lesson.dialogue.length} lượt thoại
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md">
                      <Mic className="w-3 h-3 text-blue-600" />
                      {lesson.speechDrills.length} bài luyện nói
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md">
                      <BookOpen className="w-3 h-3 text-purple-600" />
                      {lesson.vocabulary.length} từ vựng
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600">
                    Sẵn sàng luyện tập
                  </span>
                  <Link href={`/learn/demo-day-1`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
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
          <div className="rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 via-indigo-50/30 to-white p-6 sm:p-8 shadow-xs">
            <span className="inline-block text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Chuẩn HSK 3.0 Cấp Cao Nhất (7 — 9)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {HSK4_TO_9_OVERVIEWS['HSK7-9'].titleVi}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
              Tổng cộng 11.092 từ vựng (5.636 từ nâng cao), chuyên sâu về học thuật, tranh biện logic, và dịch thuật ngoại giao.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HSK7_TO_9_FRAMEWORK.map((module) => (
              <div
                key={module.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 font-bold mb-4">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{module.titleZh}</h3>
                  <h4 className="text-xs font-semibold text-purple-700 mt-1">{module.titleVi}</h4>
                  <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">
                    {module.objectiveVi}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Chuyên đề chính:
                    </span>
                    {module.keyTopics.map((topic, i) => (
                      <div key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-400">
                    Khung chuyên sâu HSK 7-9
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Pinyin Modal Dialog */}
      <Dialog
        isOpen={isPinyinModalOpen}
        onClose={() => setIsPinyinModalOpen(false)}
        title="Bảng Ngữ Âm Pinyin Tương Tác Chuẩn Bản Ngữ"
        className="max-w-4xl"
      >
        <div className="py-2">
          <PinyinChart defaultTab="initials" />
        </div>
      </Dialog>
    </div>
  );
}
