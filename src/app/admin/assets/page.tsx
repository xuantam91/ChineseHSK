'use client';

import React, { useEffect, useState } from 'react';
import {
  HardDrive,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  FileText,
  Music,
  Video,
  Copy,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Asset } from '@/types/database';

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputUrl, setInputUrl] = useState('');
  const [assetName, setAssetName] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/assets');
      const json = await res.json();
      if (json.success) {
        setAssets(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleValidateUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;

    try {
      setValidating(true);
      setErrorMessage(null);
      setValidationResult(null);

      const res = await fetch('/api/admin/assets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl, name: assetName || undefined }),
      });

      const json = await res.json();
      if (json.success) {
        setValidationResult(json.data);
        setInputUrl('');
        setAssetName('');
        fetchAssets();
      } else {
        setErrorMessage(json.error?.message || 'Link không hợp lệ hoặc bị từ chối');
      }
    } catch {
      setErrorMessage('Lỗi kết nối khi kiểm tra link Google Drive.');
    } finally {
      setValidating(false);
    }
  };

  const filteredAssets = assets.filter((a) => {
    if (filterType === 'all') return true;
    if (filterType === 'audio') return a.mime_type?.includes('audio');
    if (filterType === 'video') return a.mime_type?.includes('video');
    if (filterType === 'pdf') return a.mime_type?.includes('pdf');
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <HardDrive className="w-6 h-6 mr-2 text-amber-600" />
            Quản Lý Tài Nguyên Google Drive (Vault Assets)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm tra an toàn SSRF, tự động trích xuất File ID và tạo URL xem trước (Embed Preview) chuẩn hóa
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Chống SSRF: Chỉ chấp nhận <code>drive.google.com</code> & <code>docs.google.com</code></span>
        </div>
      </div>

      {/* URL Validation Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center">
          <Plus className="w-4 h-4 mr-1.5 text-emerald-600" />
          Thêm & Kiểm Tra Link Google Drive Mới
        </h2>

        <form onSubmit={handleValidateUrl} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link chia sẻ Google Drive (PDF / MP3 / MP4 / Folder)
              </label>
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên hiển thị tài liệu (Tùy chọn)
              </label>
              <input
                type="text"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="VD: Audio Vận Mẫu Đơn Pinyin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Hỗ trợ các dạng: <code>/file/d/&#123;id&#125;/view</code>, <code>open?id=&#123;id&#125;</code>, <code>/document/d/&#123;id&#125;</code>
            </span>
            <button
              type="submit"
              disabled={validating}
              className="inline-flex items-center text-xs font-semibold px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition disabled:opacity-50"
            >
              {validating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Kiểm tra & Lưu Link
                </>
              )}
            </button>
          </div>
        </form>

        {/* Success feedback */}
        {validationResult && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              Link Google Drive hợp lệ và đã được đăng ký thành công!
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-700 font-mono">
              <div>File ID: <strong className="text-slate-900">{validationResult.parsed_details.file_id}</strong></div>
              <div>MIME: <strong className="text-slate-900">{validationResult.parsed_details.mime_type}</strong></div>
              <div>Quyền: <span className="text-emerald-700 font-semibold">Verified</span></div>
              <div className="truncate">
                <a
                  href={validationResult.parsed_details.preview_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  Xem preview <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Error feedback */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Không thể xác thực link Google Drive</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Asset Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Danh Mục Tài Nguyên Đã Đăng Ký</h3>
            <p className="text-xs text-slate-500">Tổng cộng {assets.length} tệp đã xác thực trong hệ thống</p>
          </div>
          <div className="flex items-center space-x-2">
            {['all', 'audio', 'video', 'pdf'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition ${
                  filterType === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'all' ? 'Tất cả' : t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
            Đang tải kho tài nguyên...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Chưa có tài nguyên nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tên tài liệu</th>
                  <th className="py-3 px-4">Loại tệp</th>
                  <th className="py-3 px-4">File ID Google</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Xem tệp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => {
                  let Icon = FileText;
                  if (asset.mime_type?.includes('audio')) Icon = Music;
                  if (asset.mime_type?.includes('video')) Icon = Video;

                  return (
                    <tr key={asset.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate max-w-[240px]">{asset.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {asset.mime_type || 'octet-stream'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {asset.drive_file_id || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            asset.status === 'verified' || asset.status === 'valid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : asset.status === 'broken' || asset.status === 'restricted'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={asset.web_view_link || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          Mở link <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
