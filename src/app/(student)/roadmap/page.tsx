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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DEMO_MONTHS_OVERVIEW, DEMO_DAYS } from '@/lib/mock-data';
import { getStoredUserProfile, getComputedDays, getCompletedLessonIds } from '@/lib/student-store';
import { CurriculumDay, DayStatus } from '@/types';

export default function RoadmapPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [openWeek, setOpenWeek] = useState<number>(1);
  const [days, setDays] = useState<CurriculumDay[]>(DEMO_DAYS);
  const [profile, setProfile] = useState(getStoredUserProfile());

  useEffect(() => {
    const p = getStoredUserProfile();
    setProfile(p);
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
    setSelectedMonth(1);
    setOpenWeek(1);
    const todayElement = document.getElementById('day-today');
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Lộ trình chi tiết</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            12 Tháng Chinh Phục Hán Ngữ [DEMO]
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Mở bài tự động hằng ngày dựa trên ngày bắt đầu ({profile.startDate}) múi giờ Asia/Ho_Chi_Minh.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={jumpToToday}
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
          className="self-start sm:self-auto text-xs"
        >
          Nhảy đến bài hôm nay
        </Button>
      </div>

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
          const weekDays = weekIdx === 1 ? days : []; // Days for week 1 are populated in demo

          return (
            <div
              key={weekIdx}
              className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs transition-all"
            >
              {/* Week Accordion Header */}
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

              {/* Week Days List */}
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
                                <span>Mở sau {(day.unlockOffsetDays)} ngày</span>
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
  );
}
