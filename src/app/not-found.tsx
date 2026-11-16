import React from 'react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-700 text-white text-3xl font-black shadow-md">
          汉
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Không tìm thấy trang (404)
        </h1>
        <p className="text-sm text-slate-600">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-colors"
          >
            Quay về Bảng điều khiển
          </Link>
        </div>
      </div>
    </div>
  );
}
