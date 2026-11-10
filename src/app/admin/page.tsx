'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GitBranch,
  HardDrive,
  AlertTriangle,
  Users,
  FileDown,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface StatsData {
  total_lessons: number;
  total_days: number;
  published_version: string;
  total_versions: number;
  total_assets: number;
  broken_links_count: number;
  active_students_count: number;
  recent_import_jobs_count: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingDrive, setSyncingDrive] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (e) {
      console.error('Failed to load stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const triggerDriveSync = async () => {
    try {
      setSyncingDrive(true);
      setSyncMessage(null);
      const res = await fetch('/api/admin/drive/sync', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setSyncMessage(json.data.message);
      }
    } catch {
      setSyncMessage('Lỗi khi gửi lệnh quét Drive.');
    } finally {
      setSyncingDrive(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ thống Quản trị Giáo trình Tự học Tiếng Trung 12 Tháng</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bảng Điều Khiển Quản Trị Viên (Admin CMS)
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Giám sát toàn bộ tiến độ xuất bản giáo trình, kho tài nguyên Google Drive (PDF/MP3/MP4),
            và hệ thống chấm điểm tự động. Mọi thay đổi nội dung được bảo vệ bởi phiên bản độc lập
            và không gây gián đoạn lộ trình của học viên hiện hữu.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Múi giờ hệ thống: <strong>Asia/Ho_Chi_Minh</strong>
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Chế độ bảo mật: <strong>Server-side Role Enforced</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Lessons */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng số bài học</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : stats?.total_lessons ?? 0}
            </span>
            <span className="ml-2 text-xs text-slate-500">
              bài ({stats?.total_days ?? 0} ngày)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cấu trúc 12 tháng</span>
            <Link href="/admin/curriculum" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Chỉnh sửa &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 2: Published Version */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phiên bản xuất bản</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-2xl font-black text-blue-600 tracking-tight">
              {loading ? '...' : stats?.published_version || 'v1.0.0'}
            </span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
              Live
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tổng {stats?.total_versions ?? 1} phiên bản</span>
            <Link href="/admin/programs" className="text-blue-600 hover:text-blue-700 font-medium">
              Quản lý &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 3: Assets & Google Drive */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tài nguyên Drive</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : stats?.total_assets ?? 0}
            </span>
            <span className="ml-2 text-xs text-slate-500">tệp (Audio / PDF)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Link an toàn sanitized</span>
            <Link href="/admin/assets" className="text-amber-600 hover:text-amber-700 font-medium">
              Kiểm tra &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 4: Broken Link Alert */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cảnh báo link lỗi</span>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                (stats?.broken_links_count ?? 0) > 0
                  ? 'bg-red-50 text-red-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {(stats?.broken_links_count ?? 0) > 0 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span
              className={`text-3xl font-black tracking-tight ${
                (stats?.broken_links_count ?? 0) > 0 ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {loading ? '...' : stats?.broken_links_count ?? 0}
            </span>
            <span className="ml-2 text-xs text-slate-500">tài nguyên lỗi</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {(stats?.broken_links_count ?? 0) > 0 ? 'Cần xử lý ngay' : 'Tất cả link hoạt động'}
            </span>
            <Link href="/admin/assets" className="text-slate-600 hover:text-slate-900 font-medium">
              Chi tiết &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Sync Drive Trigger Notification */}
      {syncMessage && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-start space-x-3">
          <HardDrive className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Thông báo đồng bộ Drive</p>
            <p className="text-xs text-blue-800 mt-0.5">{syncMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Action Hub */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
          Lối tắt thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/import"
            className="group p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <FileDown className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Import Giáo trình Notion</h3>
              <p className="text-xs text-slate-500 mt-1">
                Dán text xuất từ Notion hoặc file JSON, chạy thử nghiệm (Dry-run) và kiểm tra link trước khi commit.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600">
              Mở trang Import <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/admin/curriculum"
            className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Soạn thảo & Sửa bài học</h3>
              <p className="text-xs text-slate-500 mt-1">
                Xem cây giáo trình Tháng → Tuần → Ngày → Bài học. Chỉnh sửa nội dung, thứ tự hoặc thời lượng ước tính.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-600">
              Vào cây giáo trình <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/admin/assets"
            className="group p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Kiểm tra Link Google Drive</h3>
              <p className="text-xs text-slate-500 mt-1">
                Paste link Drive để tự động bóc tách File ID, xác thực MIME type và tạo preview player an toàn.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-600">
              Quản lý kho Drive <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </div>

      {/* System Integrity & Safety Rules */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center mb-3">
          <ShieldAlert className="w-4 h-4 mr-2 text-indigo-600" />
          Nguyên tắc bảo vệ dữ liệu giáo trình (Principles of Curriculum Integrity)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="space-y-1.5 p-3 rounded-lg bg-white border border-slate-200">
            <span className="font-semibold text-slate-800">1. Độc lập phiên bản (Version Isolation)</span>
            <p>
              Khi import giáo trình mới, phiên bản luôn ở trạng thái <strong>Draft</strong>. Học viên cũ tiếp tục
              học trên phiên bản đã đăng ký mà không bị đổi nội dung đột ngột.
            </p>
          </div>
          <div className="space-y-1.5 p-3 rounded-lg bg-white border border-slate-200">
            <span className="font-semibold text-slate-800">2. Bảo mật đáp án trắc nghiệm (Zero Answer Key Leakage)</span>
            <p>
              Đáp án đúng (correct_answer_jsonb) được lưu trên server và chỉ được đối chiếu khi nộp bài. Không
              bao giờ gửi đáp án xuống trình duyệt trước khi học viên nộp.
            </p>
          </div>
          <div className="space-y-1.5 p-3 rounded-lg bg-white border border-slate-200">
            <span className="font-semibold text-slate-800">3. Chống SSRF & Link Google Drive</span>
            <p>
              Hệ thống chỉ chấp nhận host name từ <code>drive.google.com</code> và <code>docs.google.com</code>.
              Mọi URL lạ sẽ bị chặn ở bước validate.
            </p>
          </div>
          <div className="space-y-1.5 p-3 rounded-lg bg-white border border-slate-200">
            <span className="font-semibold text-slate-800">4. Mở bài theo lịch địa phương (Asia/Ho_Chi_Minh)</span>
            <p>
              Thời điểm mở bài hằng ngày được tính theo ngày địa phương YYYY-MM-DD của học viên, không tính bằng
              cách chia số mili-giây UTC để tránh lệch ngày.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
