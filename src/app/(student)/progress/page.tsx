'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  TrendingUp,
  Target,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';

export default function ProgressPage() {
  const profile = DEMO_USER_PROFILE;

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
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>Thống kê chi tiết</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Báo cáo Tiến độ Học tập
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Theo dõi chuỗi học, lịch sử kiểm tra và phân tích thói quen học tập của bạn.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Chuỗi ngày học</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            {profile.streakCount} ngày
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Đang giữ chuỗi tốt nhất
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Tổng giờ học</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            18.5 giờ
          </div>
          <span className="text-[11px] text-gray-400 font-medium mt-1 inline-block">
            Trung bình 32 phút/ngày
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Từ vựng đã thuộc</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            48 / 150
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            32% từ vựng HSK 1
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Điểm Quiz trung bình</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            91.7%
          </div>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">
            Tất cả đều đạt chuẩn &gt; 80%
          </span>
        </Card>
      </div>

      {/* Heatmap Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Biểu đồ chuyên cần (Heat-map 28 ngày)</CardTitle>
              <CardDescription className="text-xs">
                Mỗi ô vuông tương ứng một ngày học theo múi giờ Asia/Ho_Chi_Minh.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Ít</span>
              <span className="w-3 h-3 rounded bg-gray-100 inline-block" />
              <span className="w-3 h-3 rounded bg-emerald-200 inline-block" />
              <span className="w-3 h-3 rounded bg-emerald-400 inline-block" />
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
              <span>Nhiều</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
            {heatmapDays.map((item) => {
              let bg = 'bg-gray-100 text-gray-400';
              if (item.count >= 40) bg = 'bg-emerald-600 text-white';
              else if (item.count >= 25) bg = 'bg-emerald-400 text-emerald-950';
              else if (item.count > 0) bg = 'bg-emerald-200 text-emerald-950';

              return (
                <div
                  key={item.day}
                  title={`Ngày ${item.day}: ${item.count} phút học`}
                  className={`h-9 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all hover:scale-105 cursor-pointer ${bg}`}
                >
                  {item.day}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quiz History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lịch sử bài kiểm tra trắc nghiệm</CardTitle>
          <CardDescription className="text-xs">
            Kết quả các bài kiểm tra định kỳ đã được đánh giá an toàn từ phía hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {quizHistory.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>Ngày làm: {item.date}</span>
                    <span>•</span>
                    <span>Chuẩn đạt: {item.passing}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Badge variant="success" size="sm">
                    Đạt: {item.score}%
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
