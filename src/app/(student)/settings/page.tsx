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
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';
import { AgeGroup } from '@/types';
import { getStoredUserProfile, saveUserProfile } from '@/lib/student-store';

export default function SettingsPage() {
  const [profile, setProfile] = useState(getStoredUserProfile());
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(profile.ageGroup);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(profile.dailyGoalMinutes);
  const [timezone, setTimezone] = useState(profile.timezone || 'Asia/Ho_Chi_Minh');
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loaded = getStoredUserProfile();
    setProfile(loaded);
    setDisplayName(loaded.displayName);
    setAgeGroup(loaded.ageGroup);
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
      dailyGoalMinutes,
      timezone,
    };

    saveUserProfile(updated);
    setProfile(updated);

    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm">
          <Toast
            type="success"
            title="Đã lưu thành công!"
            message="Thông tin cài đặt tài khoản của bạn đã được cập nhật."
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
          Cài đặt Cá nhân [DEMO]
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Quản lý thông tin hồ sơ, nhóm tuổi, múi giờ mở bài và thông báo học tập.
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
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
}
