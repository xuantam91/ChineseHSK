'use client';

import React, { useEffect, useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  X,
  FileCode,
} from 'lucide-react';
import { Program, ProgramVersion } from '@/types/database';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [versions, setVersions] = useState<ProgramVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [confirmModalVersion, setConfirmModalVersion] = useState<ProgramVersion | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/programs');
      const json = await res.json();
      if (json.success) {
        setPrograms(json.data.programs);
        setVersions(json.data.versions);
      }
    } catch (err) {
      console.error('Failed to load versions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const handlePublish = async (version: ProgramVersion) => {
    try {
      setPublishingId(version.id);
      const res = await fetch(`/api/admin/programs/${version.id}/publish`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.success) {
        setNotification(json.data.message);
        setConfirmModalVersion(null);
        await fetchVersions();
      } else {
        alert(json.error?.message || 'Lỗi khi xuất bản phiên bản');
      }
    } catch {
      alert('Lỗi kết nối khi gửi yêu cầu xuất bản.');
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <GitBranch className="w-6 h-6 mr-2 text-blue-600" />
            Quản Lý Phiên Bản Chương Trình Học
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm soát phát hành, xem mã đối soát Checksum và lịch sử thay đổi phiên bản giáo trình
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Version List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Danh Sách Các Phiên Bản Giáo Trình</h2>
          <span className="text-xs text-slate-500">{versions.length} phiên bản được lưu</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
            Đang tải danh sách phiên bản...
          </div>
        ) : versions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Chưa có phiên bản nào.
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((ver) => {
              const isPublished = ver.status === 'published';
              const isDraft = ver.status === 'draft';

              return (
                <div
                  key={ver.id}
                  className={`p-5 rounded-xl border transition ${
                    isPublished
                      ? 'border-emerald-500/80 bg-emerald-50/20'
                      : isDraft
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 bg-slate-50/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-slate-900 font-mono">
                          {String(ver.version_number)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isPublished
                              ? 'bg-emerald-100 text-emerald-800'
                              : isDraft
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {ver.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        {ver.changelog || 'Không có ghi chú thay đổi.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                        <span>Checksum: <strong className="text-slate-700">{ver.content_checksum?.substring(0, 18)}...</strong></span>
                        {ver.published_at && (
                          <span>
                            Ngày phát hành: <strong>{new Date(ver.published_at).toLocaleDateString('vi-VN')}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      {isDraft && (
                        <button
                          onClick={() => setConfirmModalVersion(ver)}
                          className="inline-flex items-center text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Xuất Bản (Publish)
                        </button>
                      )}

                      {isPublished && (
                        <div className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                          Đang hoạt động (Live)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModalVersion && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Xác Nhận Xuất Bản Giáo Trình</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xuất bản phiên bản{' '}
              <strong className="font-mono text-slate-900">{String(confirmModalVersion.version_number)}</strong>?
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <p>• Phiên bản xuất bản trước đó sẽ được chuyển sang trạng thái <strong>Archived</strong>.</p>
              <p>• Học viên mới đăng ký sẽ học theo phiên bản này.</p>
              <p>• Học viên cũ đang học phiên bản trước vẫn được giữ nguyên tiến độ.</p>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModalVersion(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handlePublish(confirmModalVersion)}
                disabled={publishingId !== null}
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-xs"
              >
                {publishingId ? 'Đang xuất bản...' : 'Đồng Ý Xuất Bản'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
