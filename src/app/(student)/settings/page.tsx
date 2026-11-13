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
  description: string;
  vocabTarget: string;
  recommendedAudience: string;
}[] = [
  {
    level: 'HSK1',
    title: 'Khởi đầu / HSK 1',
    badge: '150 từ vựng',
    description: 'Chưa từng học tiếng Trung hoặc bắt đầu lại từ đầu. Học bảng chữ cái Pinyin, 4 thanh điệu, các câu chào hỏi và số đếm.',
    vocabTarget: '150 từ',
    recommendedAudience: 'Người mới bắt đầu',
  },
  {
    level: 'HSK2',
    title: 'Sơ cấp / HSK 2',
    badge: '300 từ vựng',
    description: 'Đã nắm chắc ngữ âm Pinyin cơ bản. Học giao tiếp sinh hoạt: gọi món, mua sắm, hỏi đường, thời tiết và sức khỏe.',
    vocabTarget: '300 từ',
    recommendedAudience: 'Đã học 1 - 2 tháng',
  },
  {
    level: 'HSK3',
    title: 'Trung cấp sơ kỳ / HSK 3',
    badge: '600 từ vựng',
    description: 'Tự tin giao tiếp du lịch, đặt vé máy bay, thuê khách sạn và nắm vững ngữ pháp câu chữ 把, so sánh 比.',
    vocabTarget: '600 từ',
    recommendedAudience: 'Giao tiếp đời sống tự tin',
  },
  {
    level: 'HSK4',
    title: 'Trung cấp / HSK 4',
    badge: '1200 từ vựng',
    description: 'Đàm thoại công sở, trả lời phỏng vấn xin việc, họp dự án, thương mại điện tử và dịch vụ logistics.',
    vocabTarget: '1200 từ',
    recommendedAudience: 'Đi làm trong công ty Trung Quốc',
  },
  {
    level: 'HSK5',
    title: 'Cao cấp / HSK 5',
    badge: '2500 từ vựng',
    description: 'Đọc hiểu báo chí thời sự, tin tức kinh tế tài chính, văn hóa trà đạo, thuyết trình và phát triển bền vững.',
    vocabTarget: '2500 từ',
    recommendedAudience: 'Du học & Chuyên viên doanh nghiệp',
  },
  {
    level: 'HSK6',
    title: 'Thành thạo / HSK 6',
    badge: '5000+ từ vựng',
    description: 'Làm chủ thành ngữ kinh điển (成语), triết lý văn hóa, nghệ thuật giao tiếp đỉnh cao và tư duy phản biện sâu.',
    vocabTarget: '5000+ từ',
    recommendedAudience: 'Gần như người bản ngữ',
  },
  {
    level: 'HSK7-9',
    title: 'Chuyên gia / HSK 7 - 9',
    badge: '11000+ từ vựng',
    description: 'Nghiên cứu học thuật chuyên sâu, bảo vệ luận án tiến sĩ, dịch song song (cabin) và đàm phán ngoại giao.',
    vocabTarget: '11000+ từ',
    recommendedAudience: 'Nghiên cứu sinh & Phiên dịch viên cao cấp',
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
    const loaded = getStoredUserProfile();
    setProfile(loaded);
    setDisplayName(loaded.displayName);
    setAgeGroup(loaded.ageGroup);
    setCurrentHskLevel(loaded.currentHskLevel || 'HSK1');
    setDailyGoalMinutes(loaded.dailyGoalMinutes);
    setTimezone(loaded.timezone || 'Asia/Ho_Chi_Minh');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updated = {
      ...profile,
      displayName,
      ageGroup,
      currentHskLevel,
      dailyGoalMinutes,
      timezone,
    };

    saveUserProfile(updated);
    setProfile(updated);

    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm">
          <Toast
            type="success"
            title="Đã lưu thành công!"
            message="Thông tin cấp độ và cài đặt học tập đã được cập nhật."
            onClose={() => setShowToast(false)}
          />
        </div>
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 text-emerald-600" />
          <span>Tài khoản & Thiết lập</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Cài đặt Cá nhân & Trình độ Học viên
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Tùy chỉnh hồ sơ học viên, chọn cấp độ HSK xuất phát điểm (HSK 1 đến HSK 7-9), múi giờ mở bài và mục tiêu thời gian mỗi ngày.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Hồ sơ người dùng</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Thông tin hiển thị trong hệ thống và giao diện học tập.
            </CardDescription>
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
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
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
                className="w-full sm:w-64 px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="kids_6_11">Trẻ em (6 - 11 tuổi)</option>
                <option value="teens_12_17">Thanh thiếu niên (12 - 17 tuổi)</option>
                <option value="adults_18_plus">Người lớn (18+ tuổi)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* HSK Level Selection Card */}
        <Card className="border-emerald-200 shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>Cấp độ & Trình độ HSK Hiện Tại</span>
              </CardTitle>
              <Badge variant="default" className="bg-emerald-600 text-white font-bold">
                Đang chọn: {currentHskLevel}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Chọn trình độ phù hợp với năng lực hiện tại của bạn. Hệ thống sẽ tối ưu hóa đề xuất bài học trên Lộ trình và Trang chủ để bạn không phải học lại kiến thức đã biết.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {HSK_LEVEL_OPTIONS.map((opt) => {
                const isSelected = currentHskLevel === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => setCurrentHskLevel(opt.level)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all text-left relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/30'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />}
                          {opt.title}
                        </span>
                        <Badge
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          className={isSelected ? 'bg-emerald-700 text-white font-bold' : 'text-gray-600'}
                        >
                          {opt.badge}
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed mb-2">
                        {opt.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Đối tượng: <strong className="text-gray-700">{opt.recommendedAudience}</strong></span>
                      <span className="font-semibold text-emerald-700">{opt.vocabTarget}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Timezone & Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Múi giờ & Lịch mở bài</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Múi giờ dùng để xác định chính xác thời điểm chuyển ngày và mở bài học mới (00:00).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Múi giờ khu vực
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full sm:w-64 px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7, Việt Nam)</option>
                <option value="Asia/Shanghai">Asia/Shanghai (GMT+8, Trung Quốc)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT+9, Nhật Bản)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Mục tiêu thời gian mỗi ngày (phút)
              </label>
              <div className="flex gap-3">
                {[15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyGoalMinutes(mins)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      dailyGoalMinutes === mins
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Compliance Notice */}
        <Card className="bg-emerald-50/40 border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Chính sách Bảo mật & Quyền riêng tư</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-950 leading-relaxed">
            Hệ thống Chinese Learning Journey cam kết bảo vệ dữ liệu học tập cá nhân.
            Toàn bộ câu trả lời bài kiểm tra được chấm tự động phía máy chủ và không bao giờ để rò rỉ đáp án trước khi nộp bài. Dữ liệu Google Drive được kết nối an toàn qua sandbox.
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="w-full sm:w-auto font-bold shadow-md shadow-emerald-700/20"
          >
            Lưu thay đổi cài đặt
          </Button>
        </div>
      </form>
    </div>
  );
}
