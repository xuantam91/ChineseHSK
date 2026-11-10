'use client';

import React, { useState } from 'react';
import {
  FileDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Play,
  RotateCcw,
  FileCode,
} from 'lucide-react';
import { DryRunSummary } from '@/types/api';

const SAMPLE_NOTION_MARKDOWN = `# Tháng 1: Nhập môn & Phát âm Pinyin
## Tuần 1: Thanh mẫu & Vận mẫu cơ bản
### Ngày 1: Làm quen 6 Vận mẫu đơn (a, o, e, i, u, ü)
#### Bài 1: Khẩu hình chuẩn 6 vận mẫu đơn
Học viên chú ý mở rộng khuôn miệng với âm 'a' và giữ tròn môi khi phát âm 'ü'.
https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sTuV/view

### Ngày 2: 8 Thanh mẫu cơ bản (b, p, m, f, d, t, n, l)
#### Bài 2: Phân biệt âm bật hơi p và âm không bật hơi b
Luyện tập bật hơi dứt khoát bằng cách để một tờ giấy mỏng trước miệng.

### Ngày 3: Ghép vần & 4 Thanh điệu cơ bản
#### Bài 3: Nguyên tắc đánh dấu thanh điệu trên vận mẫu
Thanh 1 (ngang cao), Thanh 2 (lên giọng), Thanh 3 (xuống rồi lên), Thanh 4 (dứt khoát từ cao xuống thấp).

### Ngày 4: Ngày nghỉ ngơi & Nghe thụ động Pinyin
Nghe podcast hoặc bài hát tiếng Trung chậm để quen với ngữ điệu.

### Ngày 5: Kiểm tra tuần 1
#### Bài 5: Làm bài kiểm tra phân biệt âm Pinyin
`;

export default function AdminImportPage() {
  const [content, setContent] = useState('');
  const [versionLabel, setVersionLabel] = useState('v1.1.0-draft');
  const [isRunningDryRun, setIsRunningDryRun] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [dryRunReport, setDryRunReport] = useState<DryRunSummary | null>(null);
  const [commitResult, setCommitResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDryRun = async () => {
    if (!content.trim()) {
      setErrorMsg('Vui lòng dán nội dung xuất từ Notion trước khi chạy kiểm tra.');
      return;
    }

    try {
      setIsRunningDryRun(true);
      setErrorMsg(null);
      setCommitResult(null);

      const res = await fetch('/api/admin/import/dry-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_content: content }),
      });

      const json = await res.json();
      if (json.success) {
        setDryRunReport(json.data);
      } else {
        setErrorMsg(json.error?.message || 'Lỗi khi chạy thử nghiệm import.');
      }
    } catch {
      setErrorMsg('Lỗi kết nối khi gửi yêu cầu dry-run.');
    } finally {
      setIsRunningDryRun(false);
    }
  };

  const handleCommit = async () => {
    if (!content.trim()) return;

    try {
      setIsCommitting(true);
      setErrorMsg(null);

      const res = await fetch('/api/admin/import/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_content: content,
          version_label: versionLabel,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCommitResult(json.data);
      } else {
        setErrorMsg(json.error?.message || 'Lỗi khi commit giáo trình.');
      }
    } catch {
      setErrorMsg('Lỗi kết nối khi xác nhận commit.');
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <FileDown className="w-6 h-6 mr-2 text-emerald-600" />
            Nhập Giáo Trình Từ Notion (Staging Pipeline)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình nhập 2 bước an toàn: Kiểm tra cấu trúc (Dry-run) &rarr; Xác nhận tạo phiên bản dự thảo (Draft Version)
          </p>
        </div>
        <button
          onClick={() => setContent(SAMPLE_NOTION_MARKDOWN)}
          className="inline-flex items-center text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          <FileCode className="w-4 h-4 mr-1.5 text-slate-500" />
          Nạp mẫu Markdown chuẩn
        </button>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Nội dung Markdown hoặc JSON xuất từ Notion
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Tên phiên bản dự thảo:</span>
            <input
              type="text"
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-mono font-semibold"
            />
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="# Tháng 1: Nhập môn...&#10;## Tuần 1: Phát âm...&#10;### Ngày 1: Làm quen Vận mẫu...&#10;#### Bài 1: Lý thuyết phát âm..."
          className="w-full p-4 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-400">
            Hỗ trợ phân cấp tiêu đề chuẩn: <code># Tháng</code> &rarr; <code>## Tuần</code> &rarr; <code>### Ngày</code> &rarr; <code>#### Bài học</code>
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setContent('');
                setDryRunReport(null);
                setCommitResult(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-700 px-3 py-2"
            >
              Xóa trắng
            </button>
            <button
              onClick={handleDryRun}
              disabled={isRunningDryRun || !content.trim()}
              className="inline-flex items-center text-xs font-bold px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition disabled:opacity-50"
            >
              {isRunningDryRun ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Đang phân tích cấu trúc...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Chạy Thử Nghiệm (Dry Run)
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Lỗi trong quá trình xử lý</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* Staging Diff & Completeness Report */}
      {dryRunReport && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
              Báo Cáo Kiểm Tra Toàn Vẹn & Khớp Cấu Trúc (Staging Report)
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Dry Run Hoàn Tất
            </span>
          </div>

          {/* Counts Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl font-black text-slate-900">{dryRunReport.months_count}</span>
              <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Tháng</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl font-black text-slate-900">{dryRunReport.weeks_count}</span>
              <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Tuần</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl font-black text-slate-900">{dryRunReport.days_count}</span>
              <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Ngày học</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl font-black text-slate-900">{dryRunReport.lessons_count}</span>
              <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Bài học</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className={`text-xl font-black ${dryRunReport.broken_links_count > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {dryRunReport.broken_links_count}
              </span>
              <p className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Link lỗi</p>
            </div>
          </div>

          {/* Warnings List */}
          {dryRunReport.warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1.5">
              <div className="font-bold flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" />
                Cảnh báo kiểm tra cấu trúc ({dryRunReport.warnings.length}):
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-2">
                {dryRunReport.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Completeness Report & Commit Action */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900">
                Sẵn sàng import vào phiên bản dự thảo: <span className="font-mono text-emerald-700">{versionLabel}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Quá trình commit là an toàn và không gây ảnh hưởng đến tiến trình học hiện tại của học viên.
              </p>
            </div>

            <button
              onClick={handleCommit}
              disabled={isCommitting}
              className="inline-flex items-center text-xs font-bold px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition disabled:opacity-50"
            >
              {isCommitting ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Đang ghi vào database...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Xác Nhận Import Vào Version Mới
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Commit Result Success Card */}
      {commitResult && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-3">
          <div className="flex items-center text-emerald-900 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
            {commitResult.message}
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <p>Mã phiên bản mới: <strong className="font-mono text-slate-900">{commitResult.version?.version_number}</strong></p>
            <p>Trạng thái: <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold uppercase text-[10px]">Draft (Chưa xuất bản)</span></p>
            <p>Mã kiểm tra nội dung: <span className="font-mono text-slate-600">{commitResult.version?.content_checksum}</span></p>
          </div>
          <div className="pt-2">
            <a
              href="/admin/programs"
              className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
            >
              Đi tới trang Quản lý Phiên bản để xem xét & xuất bản &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
