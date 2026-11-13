'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  Gem,
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  Trophy,
  Sparkles,
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
    { name: 'Nghe (Listening)', icon: Headphones, percent: 85, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100', progress: 85 },
    { name: 'Nói (Speaking)', icon: Mic, percent: 78, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100', progress: 78 },
    { name: 'Đọc (Reading)', icon: BookOpen, percent: 92, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', progress: 92 },
    { name: 'Viết (Writing)', icon: PenTool, percent: 70, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', progress: 70 },
  ];

  // Badges & Achievements
  const achievements = [
    { id: 'ach-1', title: 'Chiến Thần Pinyin', desc: 'Làm chủ 21 thanh mẫu & 36 vận mẫu', icon: '🎙️', unlocked: true, date: '10/11/2026' },
    { id: 'ach-2', title: 'Tuần Lửa Bùng Cháy', desc: 'Giữ vững chuỗi streak 5 ngày liên tục', icon: '🔥', unlocked: true, date: '12/11/2026' },
    { id: 'ach-3', title: 'Xạ Thủ 100 Điểm', desc: 'Đạt điểm tối đa trong bài quiz tuần', icon: '🎯', unlocked: true, date: '11/11/2026' },
    { id: 'ach-4', title: 'Chuyên Gia Shadowing', desc: 'Nhại âm 10 câu liên tục không lỗi', icon: '🎧', unlocked: true, date: '13/11/2026' },
    { id: 'ach-5', title: 'Thợ Săn 100 Từ Vựng', desc: 'Tích lũy 100 từ vựng cốt lõi HSK 1', icon: '🎴', unlocked: false, progress: '48/100' },
    { id: 'ach-6', title: 'Bá Chủ Cấp HSK 1', desc: 'Hoàn thành trọn vẹn lộ trình Tháng 1', icon: '👑', unlocked: false, progress: '5/28 ngày' },
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

  // Mock calendar activity heat-map for past 4 weeks (28 days)
  const heatmapDays = [
    { day: 1, active: true, count: 35 },
    { day: 2, active: true, count: 40 },
    { day: 3, active: true, count: 25 },
    { day: 4, active: true, count: 30 },
    { day: 5, active: true, count: 45 },
    { day: 6, active: false, count: 0 },
    { day: 7, active: true, count: 30 },
    { day: 8, active: true, count: 50 },
    { day: 9, active: true, count: 35 },
    { day: 10, active: true, count: 25 },
    { day: 11, active: true, count: 40 },
    { day: 12, active: false, count: 0 },
    { day: 13, active: true, count: 30 },
    { day: 14, active: true, count: 35 },
    { day: 15, active: true, count: 25 },
    { day: 16, active: true, count: 45 },
    { day: 17, active: true, count: 30 },
    { day: 18, active: true, count: 40 },
    { day: 19, active: false, count: 0 },
    { day: 20, active: true, count: 35 },
    { day: 21, active: true, count: 50 },
    { day: 22, active: true, count: 30 },
    { day: 23, active: true, count: 40 },
    { day: 24, active: true, count: 25 },
    { day: 25, active: true, count: 35 },
    { day: 26, active: true, count: 30 },
    { day: 27, active: false, count: 0 },
    { day: 28, active: true, count: 45 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Level Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shrink-0">
            🐼
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-md">
                Cấp 3: Học Đồ Hán Ngữ
              </span>
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{profile.streakCount} ngày</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Báo Cáo Năng Lực & Thành Tích
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 w-fit">
          <Gem className="w-6 h-6 text-indigo-300 fill-indigo-200" />
          <div>
            <span className="text-lg font-black text-white block leading-none">1.250 XP</span>
            <span className="text-[10px] text-emerald-200 uppercase font-bold">Kinh nghiệm</span>
          </div>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 rounded-3xl border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Chuỗi ngày học</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            {profile.streakCount} ngày
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
            🔥 Đang giữ chuỗi tốt nhất
          </span>
        </Card>

        <Card className="p-5 rounded-3xl border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Tổng giờ học</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            18.5 giờ
          </div>
          <span className="text-[11px] text-gray-500 font-medium mt-1 inline-block">
            Trung bình 32 phút/ngày
          </span>
        </Card>

        <Card className="p-5 rounded-3xl border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Từ vựng đã thuộc</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            48 / 150
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
            32% từ cốt lõi HSK 1
          </span>
        </Card>

        <Card className="p-5 rounded-3xl border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Điểm Quiz trung bình</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            91.7%
          </div>
          <span className="text-[11px] text-purple-600 font-bold mt-1 inline-block">
            ⭐ 100% đạt chuẩn &gt; 80%
          </span>
        </Card>
      </div>

      {/* 4 Skills Breakdown */}
      <Card className="rounded-3xl border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Phân tích 4 Kỹ năng Ngôn ngữ</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Đánh giá tự động từ các bài luyện nói mic, shadowing, từ vựng và trắc nghiệm.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.name} className={`p-4 rounded-2xl border ${skill.bg} space-y-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${skill.color}`} />
                    <span className="text-xs font-extrabold text-gray-900">{skill.name}</span>
                  </div>
                  <span className={`text-xs font-black ${skill.color}`}>{skill.percent}%</span>
                </div>
                <Progress value={skill.progress} max={100} size="sm" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Badges & Achievements Showcase */}
      <Card className="rounded-3xl border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Kho Huy Hiệu & Thành Tích (Achievements)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Mở khóa các cột mốc quan trọng trong hành trình 12 tháng tự học.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                ach.unlocked
                  ? 'bg-amber-50/60 border-amber-200 shadow-2xs hover:scale-105'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-3xl mb-1.5">{ach.icon}</div>
              <h4 className="text-xs font-bold text-gray-900 leading-snug">{ach.title}</h4>
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{ach.desc}</p>
              <div className="mt-2.5 pt-2 border-t border-gray-200/50 w-full">
                {ach.unlocked ? (
                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    ✓ Đã đạt
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-gray-500 flex items-center justify-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>{ach.progress}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Heatmap Section */}
      <Card className="rounded-3xl border-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold">Biểu đồ chuyên cần (Heat-map 28 ngày)</CardTitle>
              <CardDescription className="text-xs">
                Mỗi ô vuông tương ứng một ngày học theo múi giờ Asia/Ho_Chi_Minh.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
              <span>Ít</span>
              <span className="w-3 h-3 rounded bg-gray-100 inline-block" />
              <span className="w-3 h-3 rounded bg-emerald-200 inline-block" />
              <span className="w-3 h-3 rounded bg-emerald-400 inline-block" />
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
              <span>Nhiều 🔥</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
            {heatmapDays.map((item) => {
              let bg = 'bg-gray-100 text-gray-400';
              if (item.count >= 40) bg = 'bg-emerald-600 text-white shadow-xs';
              else if (item.count >= 25) bg = 'bg-emerald-400 text-emerald-950';
              else if (item.count > 0) bg = 'bg-emerald-200 text-emerald-950';

              return (
                <div
                  key={item.day}
                  title={`Ngày ${item.day}: ${item.count} phút học`}
                  className={`h-9 rounded-xl flex items-center justify-center text-[10px] font-black transition-all hover:scale-105 cursor-pointer ${bg}`}
                >
                  {item.day}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quiz History Table */}
      <Card className="rounded-3xl border-gray-100">
        <CardHeader>
          <CardTitle className="text-base font-extrabold">Lịch sử bài kiểm tra trắc nghiệm</CardTitle>
          <CardDescription className="text-xs">
            Kết quả các bài kiểm tra định kỳ được đánh giá an toàn từ phía hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {quizHistory.map((item) => (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">{item.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>Ngày làm: {item.date}</span>
                    <span>•</span>
                    <span>Chuẩn đạt: {item.passing}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Badge variant="success" size="sm" className="font-black">
                    ⭐ Đạt: {item.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
