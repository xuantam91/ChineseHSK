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
  Gem,
  Compass,
  FolderGit2,
  BarChart3,
  Mic,
  Headphones,
  Award,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Dialog } from '@/components/ui/Dialog';
import { PinyinChart } from '@/components/lesson/PinyinChart';
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
  const [isPinyinModalOpen, setIsPinyinModalOpen] = useState(false);

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
      {/* Top Gamified Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-tr from-emerald-900 via-emerald-800 to-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          {/* Quick Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/60 px-3 py-1 text-emerald-100 text-xs font-semibold border border-emerald-600/40">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              <span>{todayText || 'Hôm nay'} (Giờ VN)</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-amber-200 text-xs font-bold border border-amber-400/30">
              <span>🐼 Cấp độ: {profile.currentHskLevel || 'HSK 1'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Chào mừng trở lại, {profile.displayName}! ✨
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg">
            Mục tiêu hôm nay: <strong className="text-white">{profile.dailyGoalMinutes} phút</strong> luyện Nghe & Nói để duy trì chuỗi học tập xuất sắc!
          </p>
        </div>

        {/* Gamification Stats Cluster */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Streak Card */}
          <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/20 shadow-sm">
            <Flame className="w-7 h-7 text-amber-400 fill-amber-400 animate-bounce shrink-0" />
            <div>
              <div className="text-lg font-black text-amber-300 leading-none">
                {profile.streakCount} Ngày
              </div>
              <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider mt-0.5">
                Chuỗi học
              </div>
            </div>
          </div>

          {/* XP Card */}
          <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/20 shadow-sm">
            <Gem className="w-7 h-7 text-indigo-300 fill-indigo-200 animate-pulse shrink-0" />
            <div>
              <div className="text-lg font-black text-indigo-200 leading-none">
                1.250 XP
              </div>
              <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider mt-0.5">
                Kinh nghiệm
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
          <span className="font-chinese text-[180px] font-black">学</span>
        </div>
      </div>

      {/* Backlog Alert if overdue days exist */}
      {backlogDays.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
              <RotateCcw className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold">
                Có {backlogDays.length} bài học tồn đọng (Backlog)
              </h4>
              <p className="text-[11px] sm:text-xs text-amber-800 mt-0.5">
                Bạn có thể học bù bất cứ lúc nào để không bỏ lỡ kiến thức!
              </p>
            </div>
          </div>
          <Link href={`/learn/${backlogDays[0].id}`}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs font-bold whitespace-nowrap self-start sm:self-auto"
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
          <Card className="border-emerald-100 shadow-md relative overflow-hidden bg-white rounded-3xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                  <Play className="w-3 h-3 fill-emerald-700 text-emerald-700" />
                  <span>Bài học hôm nay</span>
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500 font-bold bg-gray-50 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{todayDay.estimatedMinutes} phút</span>
                </div>
              </div>

              <CardTitle className="text-xl sm:text-2xl mt-3 text-gray-900 font-extrabold tracking-tight">
                {todayDay.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Visual Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block leading-tight">3 Luyện nói</span>
                    <span className="text-[10px] text-gray-500">Chấm điểm AI</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                    <Headphones className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block leading-tight">1 Shadowing</span>
                    <span className="text-[10px] text-gray-500">Nhại âm bản xứ</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                  <div className="p-1.5 rounded-lg bg-amber-600 text-white shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block leading-tight">6 Từ vựng</span>
                    <span className="text-[10px] text-gray-500">Flashcard lật</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
                  <div className="p-1.5 rounded-lg bg-purple-600 text-white shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block leading-tight">+50 XP</span>
                    <span className="text-[10px] text-gray-500">Thưởng hoàn thành</span>
                  </div>
                </div>
              </div>

              {/* Learning objectives checklist (concise icons) */}
              {todayDay.objectives && todayDay.objectives.length > 0 && (
                <div className="rounded-2xl bg-gray-50/90 p-3.5 border border-gray-100 space-y-2">
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider block">
                    Mục tiêu chính:
                  </span>
                  <div className="space-y-1.5">
                    {todayDay.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPinyinModalOpen(true)}
                  leftIcon={<Mic className="w-3.5 h-3.5 text-emerald-600" />}
                  className="w-full sm:w-auto text-xs font-bold"
                >
                  Bảng Ngữ Âm Pinyin
                </Button>

                <Link href={`/learn/${todayDay.id}`} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<Play className="w-4 h-4 fill-white" />}
                    className="w-full sm:w-auto font-black shadow-md shadow-emerald-700/25 px-6"
                  >
                    Bắt đầu học ngay
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity Summary (Visual matrix) */}
          <Card className="border-gray-100 rounded-3xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Hoạt động tuần này</span>
                </CardTitle>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  5/7 ngày đã hoàn thành
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                {weekDayLabels.map((lbl, idx) => {
                  const done = weekDayActivity[idx];
                  return (
                    <div
                      key={lbl}
                      className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                        done
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{lbl}</span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 text-xs font-black ${
                          done ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
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
          <Card className="border-gray-100 rounded-3xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-sm sm:text-base font-extrabold">Tiến độ 12 tháng</CardTitle>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {overallPercentage}%
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Progress value={overallPercentage} max={100} size="md" />
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  Đang ở <strong>Tháng 1</strong> (HSK 1: Phát âm & Giao tiếp cơ bản)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bài học xong</span>
                  <span className="text-xl font-black text-gray-900">{totalLessonsDone}</span>
                  <span className="text-[10px] text-gray-400 block">/ 280 bài</span>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Từ vựng</span>
                  <span className="text-xl font-black text-emerald-700">{totalVocabLearned}</span>
                  <span className="text-[10px] text-gray-400 block">/ 1.200 từ</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 flex items-center gap-2.5">
                <span className="text-lg">🎯</span>
                <div className="leading-snug">
                  <span className="font-bold block">Mục tiêu kế tiếp:</span>
                  <span className="text-[11px] text-emerald-800">150 từ vựng cốt lõi HSK 1 & bài test tuần 2.</span>
                </div>
              </div>

              <Link href="/roadmap" className="block pt-1">
                <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl">
                  Xem chi tiết lộ trình
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 4 Visual Shortcut Cards */}
          <Card className="border-gray-100 rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-extrabold text-gray-900">Lối tắt học tập</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link
                href="/roadmap"
                className="p-3 rounded-2xl bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-100 transition-all flex flex-col items-start gap-1 group"
              >
                <div className="p-2 rounded-xl bg-emerald-600 text-white group-hover:scale-105 transition-transform">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 mt-1">Lộ trình 12T</span>
                <span className="text-[10px] text-gray-500">Chuẩn HSK 3.0</span>
              </Link>

              <Link
                href="/library"
                className="p-3 rounded-2xl bg-blue-50/50 hover:bg-blue-100/60 border border-blue-100 transition-all flex flex-col items-start gap-1 group"
              >
                <div className="p-2 rounded-xl bg-blue-600 text-white group-hover:scale-105 transition-transform">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 mt-1">Thư viện</span>
                <span className="text-[10px] text-gray-500">Drive & Video</span>
              </Link>

              <Link
                href="/progress"
                className="p-3 rounded-2xl bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100 transition-all flex flex-col items-start gap-1 group"
              >
                <div className="p-2 rounded-xl bg-purple-600 text-white group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 mt-1">Tiến độ</span>
                <span className="text-[10px] text-gray-500">Điểm & Thống kê</span>
              </Link>

              <button
                onClick={() => setIsPinyinModalOpen(true)}
                className="p-3 rounded-2xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-100 transition-all flex flex-col items-start gap-1 group text-left"
              >
                <div className="p-2 rounded-xl bg-amber-500 text-white group-hover:scale-105 transition-transform">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 mt-1">Ngữ âm</span>
                <span className="text-[10px] text-gray-500">Bảng Pinyin</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

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
