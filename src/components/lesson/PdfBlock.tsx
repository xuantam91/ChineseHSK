'use client';

import React from 'react';
import { PdfBlockData } from '@/types';
import { FileText, ExternalLink, Download } from 'lucide-react';
import { sanitizeDriveUrl } from '@/lib/drive';

export interface PdfBlockProps {
  data: PdfBlockData;
}

export function PdfBlock({ data }: PdfBlockProps) {
  const driveInfo = sanitizeDriveUrl(data.driveUrl);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900">{data.title}</h3>
            {data.pageCount && (
              <span className="text-xs text-gray-500 font-medium">
                Tài liệu PDF • {data.pageCount} trang
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {driveInfo.downloadUrl && (
            <a
              href={driveInfo.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải xuống</span>
            </a>
          )}
          <a
            href={driveInfo.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 transition-colors"
          >
            <span>Mở trong Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {data.description && (
        <p className="text-xs md:text-sm text-gray-600 mb-4">{data.description}</p>
      )}

      {/* PDF Embedded View Container */}
      <div className="relative w-full h-[450px] sm:h-[550px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner">
        {driveInfo.embedUrl ? (
          <iframe
            src={driveInfo.embedUrl}
            className="w-full h-full border-0"
            title={data.title}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-400 mb-2" />
            <p className="font-semibold text-sm mb-1">Xem tài liệu PDF trên Google Drive</p>
            <p className="text-xs text-gray-400 max-w-sm mb-4">
              Nhấp vào nút bên dưới để mở toàn màn hình và xem trọn vẹn tài liệu giáo trình.
            </p>
            <a
              href={driveInfo.viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              Xem trên Google Drive
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
