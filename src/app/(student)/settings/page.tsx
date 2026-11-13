'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Settings,
  Globe,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
  GraduationCap,
  Layers,
  Sparkles,
  BookOpen,
  Award,
  Flame,
  Zap,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toast } from '@/components/ui/Toast';
import { AgeGroup, HSKLevel } from '@/types';
import { getStoredUserProfile, saveUserProfile } from '@/lib/student-store';

const HSK_LEVEL_OPTIONS: {
  level: HSKLevel;
  title: string;
  badge: string;
  icon: string;
  description: string;
  vocabTarget: string;
  recommendedAudience: string;
}[] = [
  {
    level: 'HSK1',
    title: 'Khởi đầu • HSK 1',
    icon: '🌱',
    badge: '150 - 500 từ',
    description: 'Chưa từng học tiếng Trung. Học ngữ âm Pinyin, 4 thanh điệu, chào hỏi và số đếm cơ bản.',
    vocabTarget: '500 từ vựng',
    recommendedAudience: 'Người mới bắt đầu',
  },
  {
    level: 'HSK2',
    title: 'Sơ cấp • HSK 2',
    icon: '🌿',
    badge: '1.272 từ',
    description: 'Đã vững Pinyin. Giao tiếp đời sống: gọi món, mua sắm, hỏi đường, thời tiết và sức khỏe.',
    vocabTarget: '1.272 từ vựng',
    recommendedAudience: 'Đã học 1 - 2 tháng',
  },
  {
    level: 'HSK3',
    title: 'Trung cấp sơ kỳ • HSK 3',
    icon: '🌾',
    badge: '2.245 từ',
    description: 'Tự tin đàm thoại du lịch, khách sạn và làm chủ câu chữ 把, câu so sánh chữ 比.',
    vocabTarget: '2.245 từ vựng',
    recommendedAudience: 'Giao tiếp đời sống tự tin',
  },
  {
    level: 'HSK4',
    title: 'Trung cấp • HSK 4',
    icon: '🌳',
    badge: '3.245 từ',
    description: 'Đàm thoại công sở, phỏng vấn xin việc, họp dự án và dịch vụ logistics hiện đại.',
    vocabTarget: '3.245 từ vựng',
    recommendedAudience: 'Làm việc trong cty Trung Quốc',
  },
  {
    level: 'HSK5',
    title: 'Cao cấp • HSK 5',
    icon: '🌲',
    badge: '4.316 từ',
    description: 'Đọc hiểu báo chí thời sự, tin tức kinh tế tài chính, văn hóa trà đạo và thuyết trình.',
    vocabTarget: '4.316 từ vựng',
    recommendedAudience: 'Du học & Doanh nghiệp',
  },
  {
    level: 'HSK6',
    title: 'Thành thạo • HSK 6',
    icon: '🏔️',
    badge: '5.456 từ',
    description: 'Làm chủ thành ngữ kinh điển (成语), triết lý văn hóa và tư duy phản biện ngôn ngữ sâu.',
    vocabTarget: '5.456 từ vựng',
    recommendedAudience: 'Gần như người bản ngữ',
  },
  {
    level: 'HSK7-9',
    title: 'Hàn lâm • HSK 7 - 9',
    icon: '👑',
    badge: '11.092 từ',
    description: 'Nghiên cứu học thuật chuyên sâu, bảo vệ luận án, dịch thuật cabin và ngoại giao.',
    vocabTarget: '11.092 từ vựng',
    recommendedAudience: 'Phiên dịch viên cao cấp',
  },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState(getStoredUserProfile());
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(profile.ageGroup);
  const [currentHskLevel, setCurrentHskLevel] = useState<HSKLevel>(profile.currentHskLevel || 'HSK1');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(profile.dailyGoalMinutes);
  const [timezone, setTimezone] = useState(profile.timezone || 'Asia/Ho_Chi_Minh');
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const p = getStoredUserProfile();
    setProfile(p);
    setDisplayName(p.displayName);
    setAgeGroup(p.ageGroup);
    setCurrentHskLevel(p.currentHskLevel || 'HSK1');
    setDailyGoalMinutes(p.dailyGoalMinutes);
    setTimezone(p.timezone || 'Asia/Ho_Chi_Minh');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedProfile = {
      ...profile,
      displayName,
      ageGroup,
      currentHskLevel,
      dailyGoalMinutes,
      timezone,
    };

    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);

    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Toast feedback */}
      {showToast && (
        <Toast
          message="Đã lưu cài đặt và cập nhật trình độ học tập thành công! ✨"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 text-emerald-600" />
          <span>Tùy chỉnh tài khoản & Lộ trình</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Cài Đặt Hồ Sơ & Trình Độ HSK
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Thiết lập cấp độ hiện tại để hệ thống đề xuất bài học chính xác theo năng lực của bạn.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details Card */}
        <Card className="rounded-3xl border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Thông tin cá nhân</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email đăng ký (Cố định)
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Nhóm tuổi
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="w-full sm:w-64 px-3.5 py-2.5 text-sm rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="kids_6_11">Trẻ em (6 - 11 tuổi)</option>
                <option value="teens_12_17">Thanh thiếu niên (12 - 17 tuổi)</option>
                <option value="adults_18_plus">Người lớn (18+ tuổi)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* HSK Level Selection Card */}
        <Card className="rounded-3xl border-emerald-100 shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-black flex items-center gap-2 text-gray-900">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>Cấp độ & Trình độ HSK Hiện Tại</span>
              </CardTitle>
              <Badge variant="default" className="bg-emerald-600 text-white font-black text-xs">
                Đang chọn: {currentHskLevel}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Chọn trình độ để hệ thống tự động tối ưu hóa bài giảng, không bắt bạn học lại kiến thức đã vững.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {HSK_LEVEL_OPTIONS.map((opt) => {
                const isSelected = currentHskLevel === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => setCurrentHskLevel(opt.level)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/25 scale-[1.01]'
                        : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm text-gray-900 flex items-center gap-2">
                          <span className="text-lg">{opt.icon}</span>
                          <span>{opt.title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />}
                        </span>
                        <Badge
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          className={isSelected ? 'bg-emerald-700 text-white font-black text-[10px]' : 'text-gray-500 text-[10px]'}
                        >
                          {opt.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {opt.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                      <span>Đối tượng: <strong className="text-gray-800">{opt.recommendedAudience}</strong></span>
                      <span className="font-black text-emerald-700">{opt.vocabTarget}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Timezone & Daily Goal */}
        <Card className="rounded-3xl border-gray-100">
          <CardHeader>
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Múi giờ & Mục tiêu thời gian</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Múi giờ Asia/Ho_Chi_Minh đảm bảo bài học mới tự động mở khóa chính xác lúc 00:00 mỗi ngày.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Múi giờ địa phương
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full sm:w-72 px-3.5 py-2.5 text-sm rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7, Việt Nam)</option>
                <option value="Asia/Shanghai">Asia/Shanghai (GMT+8, Trung Quốc)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT+9, Nhật Bản)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Mục tiêu thời gian mỗi ngày
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { mins: 15, label: 'Nhẹ nhàng', icon: Zap, sub: 'Giữ thói quen' },
                  { mins: 30, label: 'Chuẩn lộ trình', icon: Target, sub: 'Khuyên dùng ✨' },
                  { mins: 45, label: 'Tốc độ cao', icon: Flame, sub: 'Bứt phá nhanh' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = dailyGoalMinutes === item.mins;
                  return (
                    <button
                      key={item.mins}
                      type="button"
                      onClick={() => setDailyGoalMinutes(item.mins)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/25'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">
                            {item.mins} phút / ngày
                          </span>
                          <span className="text-[10px] text-gray-500 font-semibold">{item.sub}</span>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Security Badge */}
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50/80 rounded-2xl text-xs text-emerald-900 font-bold border border-emerald-200/80 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Bảo mật an toàn: Dữ liệu học tập & kết quả bài thi được xác thực bảo vệ trực tiếp trên hệ thống máy chủ.</span>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="w-full sm:w-auto font-black shadow-md shadow-emerald-700/20 px-8"
          >
            Lưu thay đổi cài đặt
          </Button>
        </div>
      </form>
    </div>
  );
}
