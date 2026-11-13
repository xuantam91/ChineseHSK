'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { AgeGroup, HSKLevel } from '@/types';
import { getTodayLocal } from '@/lib/timezone';
import { saveUserProfile, getStoredUserProfile } from '@/lib/student-store';
import { Calendar, Clock, Smile, Sparkles, ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const todayLocal = getTodayLocal();

  const [displayName, setDisplayName] = useState('Minh Thư');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adults_18_plus');
  const [currentHskLevel, setCurrentHskLevel] = useState<HSKLevel>('HSK1');
  const [startDate, setStartDate] = useState(todayLocal);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const existing = getStoredUserProfile();
    saveUserProfile({
      ...existing,
      displayName,
      ageGroup,
      currentHskLevel,
      startDate,
      dailyGoalMinutes,
      timezone: 'Asia/Ho_Chi_Minh',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 600);
  };

  const ageGroupOptions: { id: AgeGroup; label: string; desc: string }[] = [
    {
      id: 'kids_6_11',
      label: 'Trẻ em (6 - 11 tuổi)',
      desc: 'Nhiều hình ảnh sinh động, học qua âm nhạc và phát âm trực quan.',
    },
    {
      id: 'teens_12_17',
      label: 'Thanh thiếu niên (12 - 17 tuổi)',
      desc: 'Cân bằng giao tiếp tự nhiên và chuẩn bị các chứng chỉ HSK sơ cấp.',
    },
    {
      id: 'adults_18_plus',
      label: 'Người lớn (18+ tuổi)',
      desc: 'Tập trung phản xạ giao tiếp công việc, du lịch và thi chứng chỉ HSK 4 - 5.',
    },
  ];

  const goalOptions = [
    { value: 15, label: '15 phút / ngày', desc: 'Thong thả, tạo thói quen mỗi ngày' },
    { value: 30, label: '30 phút / ngày', desc: 'Chuẩn lộ trình (Được khuyến nghị)', popular: true },
    { value: 45, label: '45 phút / ngày', desc: 'Tăng tốc phản xạ và về đích sớm' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-emerald-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bước thiết lập ban đầu</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Cá nhân hóa lộ trình 12 tháng của bạn
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">
          Hệ thống sẽ điều chỉnh lịch mở bài hằng ngày và gợi ý thời lượng học phù hợp nhất với bạn.
        </p>
      </div>

      <form onSubmit={handleEnroll} className="space-y-6">
        {/* Name input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Smile className="w-4 h-4 text-emerald-600" />
              <span>1. Tên hiển thị của bạn</span>
            </CardTitle>
            <CardDescription>Tên gọi để trợ lý học tập và giảng viên đồng hành xưng hô.</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ví dụ: Minh Thư"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </CardContent>
        </Card>

        {/* Age group selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>2. Nhóm tuổi học viên</span>
            </CardTitle>
            <CardDescription>Giúp tối ưu hóa phương pháp truyền đạt và ví dụ minh họa.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {ageGroupOptions.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setAgeGroup(opt.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  ageGroup === opt.id
                    ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">{opt.label}</h4>
                  {ageGroup === opt.id && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* HSK Level Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>3. Cấp độ HSK hiện tại của bạn</span>
            </CardTitle>
            <CardDescription>
              Chọn điểm xuất phát: Người mới bắt đầu (HSK 1) hoặc trình độ bạn đã đạt được (HSK 2, 3, 4, 5, 6, 7-9).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2.5 sm:grid-cols-2">
            {[
              { id: 'HSK1', title: 'Khởi đầu / HSK 1', desc: 'Chưa học tiếng Trung hoặc bắt đầu từ số 0 (Pinyin & Chào hỏi).' },
              { id: 'HSK2', title: 'Sơ cấp / HSK 2', desc: 'Đã biết Pinyin, giao tiếp đơn giản: mua sắm, gọi món, hỏi đường.' },
              { id: 'HSK3', title: 'Trung cấp sơ kỳ / HSK 3', desc: 'Giao tiếp đời sống tự tin, du lịch, câu chữ 把, so sánh 比.' },
              { id: 'HSK4', title: 'Trung cấp / HSK 4', desc: 'Đàm thoại công sở, phỏng vấn xin việc, họp dự án, thương mại.' },
              { id: 'HSK5', title: 'Cao cấp / HSK 5', desc: 'Đọc hiểu tin tức thời sự kinh tế, thuyết trình, văn hóa trà đạo.' },
              { id: 'HSK6', title: 'Thành thạo / HSK 6', desc: 'Thành ngữ kinh điển, triết lý văn hóa, tranh biện chuyên sâu.' },
              { id: 'HSK7-9', title: 'Chuyên gia / HSK 7-9', desc: 'Học thuật, bảo vệ luận án, dịch cabin, ngoại giao đa phương.' },
            ].map((lvl) => (
              <button
                type="button"
                key={lvl.id}
                onClick={() => setCurrentHskLevel(lvl.id as HSKLevel)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentHskLevel === lvl.id
                    ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-gray-900">{lvl.title}</h4>
                  {currentHskLevel === lvl.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">{lvl.desc}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Start date & timezone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>4. Ngày bắt đầu & Múi giờ</span>
            </CardTitle>
            <CardDescription>
              Mỗi ngày học tiếp theo sẽ được mở khóa tự động lúc 00:00 (Asia/Ho_Chi_Minh).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Chọn ngày bắt đầu Ngày 1:
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Múi giờ chuẩn:</strong> Asia/Ho_Chi_Minh (GMT+7). Bạn có thể học vào bất kỳ lúc nào trong ngày, nếu lỡ bài hệ thống sẽ tự ghi nhận bài tồn đọng để bạn học bù.
            </div>
          </CardContent>
        </Card>

        {/* Daily Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>5. Mục tiêu thời gian mỗi ngày</span>
            </CardTitle>
            <CardDescription>Duy trì tính nhất quán là chìa khóa thành công.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {goalOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setDailyGoalMinutes(opt.value)}
                className={`relative p-4 rounded-xl border text-left transition-all ${
                  dailyGoalMinutes === opt.value
                    ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {opt.popular && (
                  <span className="absolute -top-2.5 right-3 text-[10px] font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-xs">
                    Gợi ý
                  </span>
                )}
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-gray-900">{opt.label}</h4>
                  {dailyGoalMinutes === opt.value && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Enroll Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full text-base font-bold shadow-md shadow-emerald-700/20"
          >
            Kích hoạt lộ trình học tập của tôi
          </Button>
        </div>
      </form>
    </div>
  );
}
