'use client';

import React, { useState } from 'react';
import {
  FolderGit2,
  FileText,
  Headphones,
  Video,
  BookOpen,
  ExternalLink,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { DEMO_LIBRARY_RESOURCES } from '@/lib/mock-data';
import { sanitizeDriveUrl } from '@/lib/drive';

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Tất cả tài nguyên' },
    { id: 'pdf', label: 'Giáo trình PDF', icon: FileText },
    { id: 'audio', label: 'Audio MP3', icon: Headphones },
    { id: 'video', label: 'Video bài giảng', icon: Video },
    { id: 'vocab', label: 'Tập từ vựng HSK', icon: BookOpen },
  ];

  const filteredResources = DEMO_LIBRARY_RESOURCES.filter((res) => {
    const matchesCat = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.hskLevel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'audio':
        return <Headphones className="w-5 h-5 text-blue-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'vocab':
      default:
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <FolderGit2 className="w-4 h-4 text-emerald-600" />
          <span>Kho lưu trữ Google Drive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Thư viện Tài liệu & Giáo trình [DEMO]
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Tập hợp đầy đủ file PDF bản quyền, audio bản xứ và video bài giảng Google Drive được phân loại theo tháng.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tài liệu..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((res) => {
          const driveInfo = sanitizeDriveUrl(res.driveUrl);

          return (
            <Card key={res.id} className="flex flex-col justify-between hover:border-emerald-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                      {getCategoryIcon(res.category)}
                    </div>
                    <Badge variant="outline" size="sm">
                      {res.hskLevel}
                    </Badge>
                  </div>
                  {res.fileSize && (
                    <span className="text-[11px] font-semibold text-gray-400">{res.fileSize}</span>
                  )}
                </div>

                <CardTitle className="text-base text-gray-900 leading-snug">
                  {res.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {res.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Tháng {res.monthIndex}
                  </span>

                  <a
                    href={driveInfo.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <span>Mở Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-500">
            Không tìm thấy tài nguyên nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}
    </div>
  );
}
