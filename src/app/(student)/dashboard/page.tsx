'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Compass,
  FolderGit2,
  BarChart3,
  Mic,
  Headphones,
  Award,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Dialog } from '@/components/ui/Dialog';
import { PinyinChart } from '@/components/lesson/PinyinChart';
import {
  getStoredUserProfile,
  getComputedDays,
  getCompletedLessonIds,
} from '@/lib/student-store';
import { getFormattedTodayVi } from '@/lib/timezone';
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

  const totalLessonsDone = completedLessons.length + 5;
  const totalVocabLearned = 48;
  const overallPercentage = Math.round((totalLessonsDone / 280) * 100);

  const weekDayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const weekDayActivity = [true, true, true, true, true, false, false];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Professional Fresh Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-6 sm:p-8 rounded-2xl shadow-md shadow-emerald-900/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-48 -bottom-16 w-48 h-48 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 backdrop-blur-xs px-2.5 py-1 text-white text-xs font-semibold border border-white/20">
              <Calendar className="w-3.5 h-3.5 text-emerald-100" />
              <span>{todayText || 'Hôm nay'}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-400 text-emerald-950 px-2.5 py-1 text-xs font-extrabold shadow-2xs">
              Cấp độ: {profile.currentHskLevel || 'HSK 1'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-2xs">
            Chào mừng trở lại, {profile.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg leading-relaxed">
            Mục tiêu hôm nay: <strong className="text-white underline decoration-amber-400 decoration-2 underline-offset-2">{profile.dailyGoalMinutes} phút</strong> luyện Nghe & Nói theo lộ trình HSK 3.0.
          </p>
        </div>

        {/* Clean Metrics Cluster */}
        <div className="flex items-center gap-3 relative z-10">
          {/* Streak Box */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-3 rounded-xl border border-white/25 shadow-xs">
            <Flame className="w-5 h-5 text-amber-300 fill-amber-300 stroke-[1.75]" />
            <div>
              <div className="text-base font-bold text-white leading-none">
                {profile.streakCount} ngày
              </div>
              <div className="text-[11px] text-emerald-100 font-medium mt-1">
                Chuỗi học
              </div>
            </div>
          </div>

          {/* XP Box */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-3 rounded-xl border border-white/25 shadow-xs">
            <Award className="w-5 h-5 text-amber-300 stroke-[1.75]" />
            <div>
              <div className="text-base font-bold text-white leading-none">
                1.250 XP
              </div>
              <div className="text-[11px] text-emerald-100 font-medium mt-1">
                Điểm tích lũy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backlog Alert if overdue days exist */}
      {backlogDays.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold">
                Có {backlogDays.length} bài học tồn đọng (Backlog)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Bạn có thể học bù vào cuối tuần để giữ trọn vẹn kiến thức.
              </p>
            </div>
          </div>
          <Link href={`/learn/${backlogDays[0].id}`}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs font-semibold whitespace-nowrap self-start sm:self-auto bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50"
            >
              Học bù ngay
            </Button>
          </Link>
        </div>
      )}

      {/* Main Grid: Today's Lesson & Progress */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main "Bài học hôm nay" Card (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white rounded-xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  Bài học hôm nay
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{todayDay.estimatedMinutes} phút</span>
                </div>
              </div>

              <CardTitle className="text-xl font-bold mt-3 text-slate-900 tracking-tight">
                {todayDay.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 pt-4">
              {/* Unified Feature Modules Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Mic className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-900">Luyện nói</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Chấm mic AI</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Headphones className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-900">Shadowing</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Nhại âm bản xứ</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-900">Từ vựng</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Thẻ Flashcard</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-900">+50 XP</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Thưởng bài học</span>
                </div>
              </div>

              {/* Learning Objectives Checklist */}
              {todayDay.objectives && todayDay.objectives.length > 0 && (
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Mục tiêu trọng tâm:
                  </span>
                  <div className="space-y-1.5">
                    {todayDay.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
                  leftIcon={<Mic className="w-3.5 h-3.5 text-slate-600" />}
                  className="w-full sm:w-auto text-xs font-semibold border-slate-300 text-slate-700"
                >
                  Bảng ngữ âm Pinyin
                </Button>

                <Link href={`/learn/${todayDay.id}`} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<Play className="w-3.5 h-3.5 fill-white" />}
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 font-bold text-xs px-6 shadow-xs"
                  >
                    Bắt đầu học ngay
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity Matrix */}
          <Card className="border-slate-200 bg-white rounded-xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500 stroke-[1.75]" />
                  <span>Hoạt động tuần này</span>
                </CardTitle>
                <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  5/7 ngày đã hoàn thành
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-7 gap-2 text-center">
                {weekDayLabels.map((lbl, idx) => {
                  const done = weekDayActivity[idx];
                  return (
                    <div
                      key={lbl}
                      className={`p-2.5 rounded-lg border flex flex-col items-center justify-center transition-colors ${
                        done
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-semibold">{lbl}</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mt-1.5 text-[10px] font-bold ${
                          done ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-400'
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

        {/* Right Sidebar: Progress & Shortcuts (1 column) */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white rounded-xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Tiến độ 12 tháng</CardTitle>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {overallPercentage}%
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Progress value={overallPercentage} max={100} size="sm" />
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Đang ở <strong>Tháng 1</strong> (HSK 1: Ngữ âm & Chào hỏi cơ bản)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Bài học xong</span>
                  <span className="text-lg font-bold text-slate-900">{totalLessonsDone}</span>
                  <span className="text-[10px] text-slate-400 block">/ 280 bài</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Từ vựng</span>
                  <span className="text-lg font-bold text-emerald-800">{totalVocabLearned}</span>
                  <span className="text-[10px] text-slate-400 block">/ 1.200 từ</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">Mục tiêu kế tiếp:</span>
                <span className="text-[11px] text-slate-600">Hoàn thành 150 từ vựng cốt lõi HSK 1 và bài đánh giá tuần 2.</span>
              </div>

              <Link href="/roadmap" className="block pt-1">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-slate-300 text-slate-700">
                  Xem chi tiết lộ trình
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Clean Shortcuts Card */}
          <Card className="border-slate-200 bg-white rounded-xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Lối tắt học tập</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 pt-4">
              <Link
                href="/roadmap"
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex flex-col items-start gap-1"
              >
                <Compass className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-900 mt-1">Lộ trình 12T</span>
                <span className="text-[10px] text-slate-500">Chuẩn HSK 3.0</span>
              </Link>

              <Link
                href="/library"
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex flex-col items-start gap-1"
              >
                <FolderGit2 className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-900 mt-1">Thư viện</span>
                <span className="text-[10px] text-slate-500">Tài liệu & Video</span>
              </Link>

              <Link
                href="/progress"
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex flex-col items-start gap-1"
              >
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-900 mt-1">Tiến độ</span>
                <span className="text-[10px] text-slate-500">Báo cáo học tập</span>
              </Link>

              <button
                onClick={() => setIsPinyinModalOpen(true)}
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex flex-col items-start gap-1 text-left"
              >
                <Mic className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-900 mt-1">Bảng Pinyin</span>
                <span className="text-[10px] text-slate-500">Bảng âm tương tác</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

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
