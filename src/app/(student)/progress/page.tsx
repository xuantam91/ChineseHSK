'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Target,
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';
import { getStoredUserProfile } from '@/lib/student-store';

export default function ProgressPage() {
  const [profile, setProfile] = useState(DEMO_USER_PROFILE);

  useEffect(() => {
    setProfile(getStoredUserProfile());
  }, []);

  // 4 Core Skills Breakdown
  const skills = [
    { name: 'Nghe (Listening)', icon: Headphones, percent: 85, progress: 85 },
    { name: 'Nói (Speaking)', icon: Mic, percent: 78, progress: 78 },
    { name: 'Đọc (Reading)', icon: BookOpen, percent: 92, progress: 92 },
    { name: 'Viết (Writing)', icon: PenTool, percent: 70, progress: 70 },
  ];

  // Badges & Achievements
  const achievements = [
    { id: 'ach-1', title: 'Ngữ âm Pinyin', desc: 'Làm chủ 21 thanh mẫu & 36 vận mẫu', icon: Mic, unlocked: true, date: '10/11/2026' },
    { id: 'ach-2', title: 'Chuỗi 5 ngày', desc: 'Học tập liên tục 5 ngày không đứt đoạn', icon: Flame, unlocked: true, date: '12/11/2026' },
    { id: 'ach-3', title: 'Điểm tối đa', desc: 'Đạt 100% trong bài kiểm tra tuần', icon: Target, unlocked: true, date: '11/11/2026' },
    { id: 'ach-4', title: 'Kỹ năng Shadowing', desc: 'Nhại âm 10 câu liên tục đạt chuẩn', icon: Headphones, unlocked: true, date: '13/11/2026' },
    { id: 'ach-5', title: 'Cột mốc 100 từ', desc: 'Tích lũy 100 từ vựng cốt lõi HSK 1', icon: BookOpen, unlocked: false, progress: '48/100' },
    { id: 'ach-6', title: 'Hoàn thành HSK 1', desc: 'Hoàn thành trọn vẹn lộ trình Tháng 1', icon: Award, unlocked: false, progress: '5/28 ngày' },
  ];

  // Mock quiz scores
  const quizHistory = [
    {
      id: 'q-hist-1',
      title: 'Kiểm tra phát âm Pinyin & 4 Thanh điệu',
      score: 100,
      passing: 80,
      date: '10/11/2026',
      status: 'passed',
    },
    {
      id: 'q-hist-2',
      title: 'Nhận diện thanh mẫu b, p, m, f & Quy tắc biến điệu',
      score: 90,
      passing: 80,
      date: '08/11/2026',
      status: 'passed',
    },
    {
      id: 'q-hist-3',
      title: 'Phản xạ chào hỏi & Giới thiệu bản thân',
      score: 85,
      passing: 80,
      date: '06/11/2026',
      status: 'passed',
    },
  ];

  // Calendar activity heat-map (28 days)
  const heatmapDays = [
    { day: 1, count: 35 },
    { day: 2, count: 40 },
    { day: 3, count: 25 },
    { day: 4, count: 30 },
    { day: 5, count: 45 },
    { day: 6, count: 0 },
    { day: 7, count: 30 },
    { day: 8, count: 50 },
    { day: 9, count: 35 },
    { day: 10, count: 25 },
    { day: 11, count: 40 },
    { day: 12, count: 0 },
    { day: 13, count: 30 },
    { day: 14, count: 35 },
    { day: 15, count: 25 },
    { day: 16, count: 45 },
    { day: 17, count: 30 },
    { day: 18, count: 40 },
    { day: 19, count: 0 },
    { day: 20, count: 35 },
    { day: 21, count: 50 },
    { day: 22, count: 30 },
    { day: 23, count: 40 },
    { day: 24, count: 25 },
    { day: 25, count: 35 },
    { day: 26, count: 30 },
    { day: 27, count: 0 },
    { day: 28, count: 45 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Fresh Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-6 sm:p-7 shadow-md shadow-emerald-900/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-extrabold text-lg text-white shadow-2xs shrink-0">
            {profile.displayName?.charAt(0) || 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
                Cấp độ: {profile.currentHskLevel || 'HSK 1'}
              </span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-emerald-100 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{profile.streakCount} ngày liên tục</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-2xs">
              Báo cáo năng lực & Tiến độ học tập
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/25 shadow-xs w-fit relative z-10">
          <Award className="w-5 h-5 text-amber-300 stroke-[1.75]" />
          <div>
            <span className="text-base font-bold text-white block leading-none">1.250 XP</span>
            <span className="text-xs text-emerald-100 font-semibold uppercase">Điểm tích lũy</span>
          </div>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 rounded-xl border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Chuỗi ngày học</span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {profile.streakCount} ngày
          </div>
          <span className="text-xs text-emerald-700 font-medium mt-1 inline-block">
            Đang giữ chuỗi ổn định
          </span>
        </Card>

        <Card className="p-5 rounded-xl border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng thời gian học</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            18.5 giờ
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            Trung bình 32 phút/ngày
          </span>
        </Card>

        <Card className="p-5 rounded-xl border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Từ vựng đã thuộc</span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            48 / 150
          </div>
          <span className="text-xs text-slate-600 font-medium mt-1 inline-block">
            32% từ vựng cốt lõi HSK 1
          </span>
        </Card>

        <Card className="p-5 rounded-xl border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Điểm Quiz trung bình</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            91.7%
          </div>
          <span className="text-xs text-slate-600 font-medium mt-1 inline-block">
            100% đạt chuẩn trên 80%
          </span>
        </Card>
      </div>

      {/* 4 Skills Breakdown */}
      <Card className="rounded-xl border-slate-200 bg-white shadow-2xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Phân tích 4 kỹ năng ngôn ngữ
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Đánh giá tự động từ các bài luyện nói mic, shadowing, từ vựng và trắc nghiệm.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.name} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{skill.percent}%</span>
                </div>
                <Progress value={skill.progress} max={100} size="sm" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Badges & Achievements Showcase */}
      <Card className="rounded-xl border-slate-200 bg-white shadow-2xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Huy hiệu & Cột mốc hoàn thành
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Ghi nhận các mốc quan trọng trong quá trình học tập.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-lg border text-center flex flex-col items-center justify-between transition-colors ${
                  ach.unlocked
                    ? 'bg-white border-slate-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-2">
                  <Icon className="w-4 h-4 text-emerald-700" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{ach.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ach.desc}</p>
                <div className="mt-2.5 pt-2 border-t border-slate-100 w-full">
                  {ach.unlocked ? (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Đã đạt
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 flex items-center justify-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>{ach.progress}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Heatmap Section */}
      <Card className="rounded-xl border-slate-200 bg-white shadow-2xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Biểu đồ chuyên cần (28 ngày)</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Mỗi ô vuông biểu thị thời lượng học theo múi giờ Việt Nam.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Ít</span>
              <span className="w-3 h-3 rounded bg-slate-100 inline-block border border-slate-200" />
              <span className="w-3 h-3 rounded bg-emerald-200 inline-block" />
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              <span className="w-3 h-3 rounded bg-emerald-700 inline-block" />
              <span>Nhiều</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
            {heatmapDays.map((item) => {
              let bg = 'bg-slate-100 text-slate-400 border-slate-200';
              if (item.count >= 40) bg = 'bg-emerald-700 text-white border-emerald-700';
              else if (item.count >= 25) bg = 'bg-emerald-500 text-white border-emerald-500';
              else if (item.count > 0) bg = 'bg-emerald-200 text-emerald-950 border-emerald-300';

              return (
                <div
                  key={item.day}
                  title={`Ngày ${item.day}: ${item.count} phút học`}
                  className={`h-9 rounded-md border flex items-center justify-center text-xs font-bold ${bg}`}
                >
                  {item.day}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quiz History Table */}
      <Card className="rounded-xl border-slate-200 bg-white shadow-2xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">Lịch sử bài kiểm tra trắc nghiệm</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Kết quả các bài đánh giá định kỳ trên hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="divide-y divide-slate-100">
            {quizHistory.map((item) => (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>Ngày: {item.date}</span>
                    <span>•</span>
                    <span>Chuẩn đạt: {item.passing}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Đạt: {item.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
