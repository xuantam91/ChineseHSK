'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  getStoredUserProfile,
  getComputedDays,
  getCompletedLessonIds,
} from '@/lib/student-store';
import { getFormattedTodayVi, getTodayLocal } from '@/lib/timezone';
import { DEMO_DAYS } from '@/lib/mock-data';

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState(getStoredUserProfile());
  const [todayText, setTodayText] = useState('');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [days, setDays] = useState(DEMO_DAYS);

  useEffect(() => {
    const loadedProfile = getStoredUserProfile();
    setProfile(loadedProfile);
    setTodayText(getFormattedTodayVi(loadedProfile.timezone));
    const comp = getCompletedLessonIds();
    setCompletedLessons(comp);
    setDays(getComputedDays(loadedProfile, comp));
  }, []);

  const todayDay = days.find((d) => d.status === 'today') || days[0];
  const backlogDays = days.filter((d) => d.status === 'overdue');

  const totalLessonsDone = completedLessons.length + 5; // Base demo count
  const totalVocabLearned = 48;
  const overallPercentage = Math.round((totalLessonsDone / 280) * 100);

  const weekDayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const weekDayActivity = [true, true, true, true, true, false, false];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-700/60 px-3 py-1 text-emerald-100 text-xs font-semibold border border-emerald-600/50">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              <span>{todayText || 'Hôm nay'} (Asia/Ho_Chi_Minh)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-amber-200 text-xs font-bold border border-amber-400/30">
              <span>Trình độ: {profile.currentHskLevel || 'HSK1'}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Chào mừng trở lại, {profile.displayName}! 👋
          </h1>
          <p className="mt-1 text-sm text-emerald-200/90 max-w-xl">
            Hãy dành {profile.dailyGoalMinutes} phút hôm nay để giữ vững thói quen và hoàn thành mục tiêu cấp độ {profile.currentHskLevel || 'HSK 1'}.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 w-fit">
          <Flame className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce shrink-0" />
          <div>
            <div className="text-xl font-black text-amber-300">{profile.streakCount} Ngày</div>
            <div className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider">
              Chuỗi học liên tục
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <span className="font-chinese text-[180px] font-black">学</span>
        </div>
      </div>

      {/* Backlog Alert if overdue days exist */}
      {backlogDays.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">
                Bạn có {backlogDays.length} bài học tồn đọng (Backlog)
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                Đừng lo lắng! Cơ chế học bù giúp bạn hoàn thành các ngày đã qua bất kỳ lúc nào mà không bị gián đoạn lộ trình.
              </p>
            </div>
          </div>
          <Link href={`/learn/${backlogDays[0].id}`}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="shrink-0 whitespace-nowrap"
            >
              Học bù ngay
            </Button>
          </Link>
        </div>
      )}

      {/* Grid: Prominent Today Card & Overall Progress */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main "Bài học hôm nay" Card (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-emerald-100 shadow-md relative overflow-hidden bg-white">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  Bài học hôm nay
                </span>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{todayDay.estimatedMinutes} phút</span>
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl mt-2 text-gray-900">
                {todayDay.title}
              </CardTitle>
              <CardDescription className="text-sm">
                Nắm vững các thanh mẫu cơ bản và phát âm chuẩn 4 thanh điệu.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Learning objectives checklist */}
              {todayDay.objectives && todayDay.objectives.length > 0 && (
                <div className="rounded-2xl bg-gray-50/80 p-4 border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                    Mục tiêu cần đạt:
                  </h4>
                  <ul className="space-y-2">
                    {todayDay.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Badge variant="success" size="sm">
                    Lý thuyết & Luyện tập
                  </Badge>
                  <span>• 3 bài học con</span>
                </div>

                <Link href={`/learn/${todayDay.id}`} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<Play className="w-4 h-4 fill-white" />}
                    className="w-full sm:w-auto font-bold shadow-md shadow-emerald-700/20"
                  >
                    Bắt đầu học ngay
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Mức độ hoạt động tuần này</CardTitle>
                <span className="text-xs text-emerald-700 font-bold">5/7 ngày đã hoàn thành</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                {weekDayLabels.map((lbl, idx) => {
                  const done = weekDayActivity[idx];
                  return (
                    <div
                      key={lbl}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        done
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      <span className="text-[11px] font-semibold">{lbl}</span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 text-xs font-bold ${
                          done ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {done ? '✓' : '•'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Overall Progress Stats (1 column) */}
        <div className="space-y-4">
          <Card className="border-gray-100">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-base">Tiến độ tổng thể 12 tháng</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Progress value={overallPercentage} max={100} showLabel size="md" />
                <p className="text-xs text-gray-500 mt-1">
                  Đang ở <strong>Tháng 1</strong> (HSK 1: Phát âm & Giao tiếp cơ bản)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[11px] text-gray-500 block">Bài học xong</span>
                  <span className="text-lg font-black text-gray-900">{totalLessonsDone}</span>
                  <span className="text-[10px] text-gray-400 block">/ 280 bài</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[11px] text-gray-500 block">Từ vựng đã học</span>
                  <span className="text-lg font-black text-emerald-700">{totalVocabLearned}</span>
                  <span className="text-[10px] text-gray-400 block">/ 1,200 từ</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950">
                <span className="font-bold">Mục tiêu tiếp theo:</span> Đạt 150 từ vựng cốt lõi HSK 1 và hoàn thành kỳ thi đánh giá tuần 2.
              </div>

              <Link href="/roadmap" className="block pt-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Xem chi tiết lộ trình
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Lối tắt học tập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/library"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700 border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Thư viện giáo trình Drive</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>

              <Link
                href="/progress"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700 border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Báo cáo điểm số & Flashcard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
