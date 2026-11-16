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
  BookOpen,
  Target,
  Zap,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toast } from '@/components/ui/Toast';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';
import { AgeGroup, HSKLevel } from '@/types';
import { getStoredUserProfile, saveUserProfile } from '@/lib/student-store';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';

const HSK_LEVEL_OPTIONS: {
  level: HSKLevel;
  title: string;
  badge: string;
  description: string;
  vocabTarget: string;
  recommendedAudience: string;
}[] = [
  {
    level: 'HSK1',
    title: 'Khởi đầu • HSK 1',
    badge: '150 - 500 từ',
    description: 'Chưa từng học tiếng Trung. Học ngữ âm Pinyin, 4 thanh điệu, chào hỏi và số đếm cơ bản.',
    vocabTarget: '500 từ vựng',
    recommendedAudience: 'Người mới bắt đầu',
  },
  {
    level: 'HSK2',
    title: 'Sơ cấp • HSK 2',
    badge: '1.272 từ',
    description: 'Đã vững Pinyin. Giao tiếp đời sống: gọi món, mua sắm, hỏi đường, thời tiết và sức khỏe.',
    vocabTarget: '1.272 từ vựng',
    recommendedAudience: 'Đã học 1 - 2 tháng',
  },
  {
    level: 'HSK3',
    title: 'Trung cấp sơ kỳ • HSK 3',
    badge: '2.245 từ',
    description: 'Tự tin đàm thoại du lịch, khách sạn và làm chủ câu chữ 把, câu so sánh chữ 比.',
    vocabTarget: '2.245 từ vựng',
    recommendedAudience: 'Giao tiếp đời sống tự tin',
  },
  {
    level: 'HSK4',
    title: 'Trung cấp • HSK 4',
    badge: '3.245 từ',
    description: 'Đàm thoại công sở, phỏng vấn xin việc, họp dự án và dịch vụ logistics hiện đại.',
    vocabTarget: '3.245 từ vựng',
    recommendedAudience: 'Làm việc trong cty Trung Quốc',
  },
  {
    level: 'HSK5',
    title: 'Cao cấp • HSK 5',
    badge: '4.316 từ',
    description: 'Đọc hiểu báo chí thời sự, tin tức kinh tế tài chính, văn hóa trà đạo và thuyết trình.',
    vocabTarget: '4.316 từ vựng',
    recommendedAudience: 'Du học & Doanh nghiệp',
  },
  {
    level: 'HSK6',
    title: 'Thành thạo • HSK 6',
    badge: '5.456 từ',
    description: 'Làm chủ thành ngữ kinh điển (成语), triết lý văn hóa và tư duy phản biện ngôn ngữ sâu.',
    vocabTarget: '5.456 từ vựng',
    recommendedAudience: 'Gần như người bản ngữ',
  },
  {
    level: 'HSK7-9',
    title: 'Hàn lâm • HSK 7 - 9',
    badge: '11.092 từ',
    description: 'Nghiên cứu học thuật chuyên sâu, bảo vệ luận án, dịch thuật cabin và ngoại giao.',
    vocabTarget: '11.092 từ vựng',
    recommendedAudience: 'Phiên dịch viên cao cấp',
  },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState(DEMO_USER_PROFILE);
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
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Toast feedback */}
      {showToast && (
        <Toast
          message="Đã lưu cài đặt và cập nhật trình độ học tập thành công."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cài đặt tài khoản & Trình độ học
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tùy chỉnh thông tin cá nhân, cấp độ HSK và lịch học hàng ngày.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Info */}
        <Card className="rounded-xl border-slate-200 bg-white shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" />
              <span>Thông tin cá nhân</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email tài khoản
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nhóm tuổi
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="w-full sm:w-64 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 bg-white"
              >
                <option value="kids_6_11">Trẻ em (6 - 11 tuổi)</option>
                <option value="teens_12_17">Thanh thiếu niên (12 - 17 tuổi)</option>
                <option value="adults_18_plus">Người lớn (18+ tuổi)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* HSK Level Selection Card */}
        <Card className="rounded-xl border-slate-200 bg-white shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Cấp độ & Trình độ HSK hiện tại</span>
              </CardTitle>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Đang chọn: {currentHskLevel}
              </span>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Chọn trình độ để hệ thống sắp xếp bài giảng tương ứng, không bắt bạn học lại kiến thức đã vững.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {HSK_LEVEL_OPTIONS.map((opt) => {
                const isSelected = currentHskLevel === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => setCurrentHskLevel(opt.level)}
                    className={`cursor-pointer rounded-xl p-4 border transition-colors text-left flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-2xs ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <span>{opt.title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Đối tượng: <strong className="text-slate-800">{opt.recommendedAudience}</strong></span>
                      <span className="font-semibold text-emerald-800">{opt.vocabTarget}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* TTS Voice Persona & Speed Customization */}
        <Card className="rounded-xl border-slate-200 bg-white shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>Giọng đọc & Phát âm AI (TTS Engine)</span>
              </CardTitle>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Tiếng Trung Phổ Thông (普通话)
              </span>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Chọn chất giọng phù hợp với sở thích của bạn: Giọng Nữ thanh lịch, Giọng Nam trầm ấm, Giọng Người Lớn sư phạm hoặc Giọng Trẻ Em trong trẻo.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <TTSVoiceSelector variant="full" showSpeedControl={true} />
          </CardContent>
        </Card>

        {/* Timezone & Daily Goal */}
        <Card className="rounded-xl border-slate-200 bg-white shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>Múi giờ & Mục tiêu thời gian</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Múi giờ Asia/Ho_Chi_Minh đảm bảo bài học mới tự động mở khóa chính xác lúc 00:00 mỗi ngày.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Múi giờ địa phương
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full sm:w-72 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 bg-white"
              >
                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7, Việt Nam)</option>
                <option value="Asia/Shanghai">Asia/Shanghai (GMT+8, Trung Quốc)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT+9, Nhật Bản)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mục tiêu thời gian mỗi ngày
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { mins: 15, label: '15 phút / ngày', sub: 'Nhẹ nhàng duy trì thói quen' },
                  { mins: 30, label: '30 phút / ngày', sub: 'Chuẩn theo lộ trình 12 tháng' },
                  { mins: 45, label: '45 phút / ngày', sub: 'Tốc độ cao bứt phá nhanh' },
                ].map((item) => {
                  const isSelected = dailyGoalMinutes === item.mins;
                  return (
                    <button
                      key={item.mins}
                      type="button"
                      onClick={() => setDailyGoalMinutes(item.mins)}
                      className={`p-3 rounded-xl border text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-2xs ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">{item.sub}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Badge */}
        <div className="flex items-center gap-2.5 p-3.5 bg-slate-100 rounded-xl text-xs text-slate-700 border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Bảo mật dữ liệu: Toàn bộ thông tin học viên và tiến trình học tập được lưu trữ an toàn theo tiêu chuẩn.</span>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="w-full sm:w-auto font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs px-6"
          >
            Lưu thay đổi cài đặt
          </Button>
        </div>
      </form>
    </div>
  );
}
