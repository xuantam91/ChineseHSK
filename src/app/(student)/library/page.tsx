'use client';

import React, { useState } from 'react';
import {
  FolderGit2,
  FileText,
  Headphones,
  Video,
  BookOpen,
  ExternalLink,
  Search,
  Mic,
  Music,
  Sparkles,
  Play,
  Tv,
  Film,
  Smile,
  Compass,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { DEMO_LIBRARY_RESOURCES } from '@/lib/mock-data';
import { sanitizeDriveUrl } from '@/lib/drive';
import {
  CURATED_MEDIA_RESOURCES,
  CuratedMediaItem,
} from '@/lib/curriculum/media-resources';

export interface UnifiedResourceItem {
  id: string;
  title: string;
  titleOriginal?: string;
  description: string;
  category:
    | 'all'
    | 'flashcard'
    | 'song'
    | 'pinyin'
    | 'story'
    | 'reading'
    | 'cartoon'
    | 'pdf'
    | 'audio'
    | 'speech';
  hskLevel: string;
  monthIndex?: number;
  url: string;
  embedUrl?: string;
  isEmbeddable: boolean;
  channelOrAuthor?: string;
  tags?: string[];
  fileSize?: string;
  sourceType: 'curated_media' | 'legacy_drive';
}

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHskLevel, setSelectedHskLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMediaModal, setActiveMediaModal] = useState<UnifiedResourceItem | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả tài nguyên', icon: FolderGit2 },
    { id: 'flashcard', label: 'Flashcard chủ đề', icon: BookOpen },
    { id: 'song', label: 'Bài hát & Nhi ca', icon: Music },
    { id: 'pinyin', label: 'Ngữ âm Pinyin', icon: Mic },
    { id: 'story', label: 'Kể chuyện cổ tích', icon: BookOpen },
    { id: 'reading', label: 'Luyện đọc sách', icon: Compass },
    { id: 'cartoon', label: 'Phim hoạt hình', icon: Film },
    { id: 'pdf', label: 'Giáo trình & Sách PDF', icon: FileText },
    { id: 'audio', label: 'Audio & Shadowing', icon: Headphones },
  ];

  const hskLevels = [
    { id: 'all', label: 'Tất cả cấp độ' },
    { id: 'HSK 1', label: 'HSK 1' },
    { id: 'HSK 2', label: 'HSK 2' },
    { id: 'HSK 3', label: 'HSK 3' },
    { id: 'HSK 4', label: 'HSK 4' },
    { id: 'HSK 5', label: 'HSK 5' },
    { id: 'HSK 6', label: 'HSK 6' },
  ];

  // Map curated media items to UnifiedResourceItem
  const curatedItems: UnifiedResourceItem[] = CURATED_MEDIA_RESOURCES.map((media) => {
    let cat: UnifiedResourceItem['category'] = 'flashcard';
    if (media.category === 'song') cat = 'song';
    else if (media.category === 'pinyin') cat = 'pinyin';
    else if (media.category === 'story') cat = 'story';
    else if (media.category === 'reading') cat = 'reading';
    else if (media.category === 'cartoon') cat = 'cartoon';
    else if (media.category === 'textbook_pdf') cat = 'pdf';

    return {
      id: media.id,
      title: media.title,
      titleOriginal: media.titleOriginal,
      description: media.description,
      category: cat,
      hskLevel: media.hskLevel,
      url: media.sanitizedInfo.safeUrl,
      embedUrl: media.sanitizedInfo.embedUrl,
      isEmbeddable: media.sanitizedInfo.isEmbeddable,
      channelOrAuthor: media.channelOrAuthor,
      tags: media.recommendedTags,
      sourceType: 'curated_media',
    };
  });

  // Map legacy mock resources to UnifiedResourceItem
  const legacyItems: UnifiedResourceItem[] = DEMO_LIBRARY_RESOURCES.map((res) => {
    const driveInfo = sanitizeDriveUrl(res.driveUrl);
    return {
      id: res.id,
      title: res.title,
      description: res.description,
      category: res.category === 'vocab' ? 'flashcard' : (res.category as UnifiedResourceItem['category']),
      hskLevel: res.hskLevel,
      monthIndex: res.monthIndex,
      url: driveInfo.viewUrl,
      isEmbeddable: false,
      channelOrAuthor: 'Tài liệu Globy',
      fileSize: res.fileSize,
      sourceType: 'legacy_drive',
    };
  });

  const additionalItems: UnifiedResourceItem[] = [
    {
      id: 'res-pinyin-chart',
      title: 'Sách & Audio Ngữ Âm Pinyin Cho Người Mới Bắt Đầu (Drive MP3 & PDF)',
      description: 'Trọn bộ sách học phát âm tiếng Trung cho các bé và người mới bắt đầu kèm file âm thanh chuẩn ngữ âm.',
      category: 'pinyin',
      hskLevel: 'HSK 1',
      monthIndex: 1,
      url: 'https://drive.google.com/drive/folders/12_7dgZXgNMDqnOT7vGVT5PgbX7nxjcVr?usp=sharing',
      isEmbeddable: true,
      embedUrl: 'https://drive.google.com/embeddedfolderview?id=12_7dgZXgNMDqnOT7vGVT5PgbX7nxjcVr#grid',
      fileSize: 'Sách & MP3',
      channelOrAuthor: 'Ban Học Liệu Tiếng Trung',
      sourceType: 'curated_media',
    },
    {
      id: 'res-hsk1-shadowing',
      title: 'Kho File Nghe Thụ Động & Shadowing HSK 1 (Loa Craven MP3)',
      description: 'File âm thanh nạp âm thụ động và nhại giọng phản xạ giúp người mới bắt đầu luyện ngữ điệu chuẩn xác.',
      category: 'audio',
      hskLevel: 'HSK 1',
      monthIndex: 1,
      url: 'https://drive.google.com/drive/folders/13ge0qbgNI1yQOBmj_6psALKav-3Iqj_h?usp=sharing',
      isEmbeddable: true,
      embedUrl: 'https://drive.google.com/embeddedfolderview?id=13ge0qbgNI1yQOBmj_6psALKav-3Iqj_h#grid',
      fileSize: 'Kho MP3',
      channelOrAuthor: 'Kho Audio Globy',
      sourceType: 'curated_media',
    },
  ];

  const allResources: UnifiedResourceItem[] = [...curatedItems, ...legacyItems, ...additionalItems];

  const filteredResources = allResources.filter((res) => {
    const matchesCat = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesHsk =
      selectedHskLevel === 'all' ||
      res.hskLevel.toLowerCase().includes(selectedHskLevel.toLowerCase()) ||
      res.hskLevel === 'All Levels';

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      res.title.toLowerCase().includes(searchLower) ||
      (res.titleOriginal && res.titleOriginal.toLowerCase().includes(searchLower)) ||
      res.description.toLowerCase().includes(searchLower) ||
      (res.channelOrAuthor && res.channelOrAuthor.toLowerCase().includes(searchLower)) ||
      (res.tags && res.tags.some((t) => t.toLowerCase().includes(searchLower)));

    return matchesCat && matchesHsk && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flashcard':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'song':
        return <Music className="w-4 h-4 text-pink-600" />;
      case 'pinyin':
      case 'speech':
        return <Mic className="w-4 h-4 text-emerald-600" />;
      case 'audio':
        return <Headphones className="w-4 h-4 text-blue-600" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-600" />;
      case 'cartoon':
        return <Film className="w-4 h-4 text-purple-600" />;
      case 'reading':
        return <Compass className="w-4 h-4 text-indigo-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <FolderGit2 className="w-4 h-4 text-emerald-600" />
          <span>Kho tài nguyên & học liệu chuẩn HSK</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Thư Viện Đa Phương Tiện Tiếng Trung Chuẩn Quốc Tế
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
          Tổng hợp kênh video học Flashcard, ca khúc thiếu nhi, truyện ngụ ngôn, phim hoạt hình và trọn bộ giáo trình chuẩn HSK, Easy Steps, Kuaile Hanyu an toàn.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* HSK Level Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-gray-400 mr-1 whitespace-nowrap">Trình độ:</span>
          {hskLevels.map((lvl) => {
            const isSelected = selectedHskLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedHskLevel(lvl.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài hát, flashcard, truyện..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Result Count Status */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Hiển thị <strong className="text-gray-900 font-bold">{filteredResources.length}</strong> học liệu phù hợp
        </span>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((res) => {
          return (
            <Card
              key={res.id}
              className="flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-gray-50 border border-gray-100">
                      {getCategoryIcon(res.category)}
                    </div>
                    <Badge variant="outline" size="sm" className="font-semibold">
                      {res.hskLevel}
                    </Badge>
                  </div>
                  {res.fileSize && (
                    <span className="text-[11px] font-semibold text-gray-400">{res.fileSize}</span>
                  )}
                  {res.channelOrAuthor && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded truncate max-w-[120px]">
                      {res.channelOrAuthor}
                    </span>
                  )}
                </div>

                <CardTitle className="text-sm sm:text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                  {res.title}
                </CardTitle>

                <CardDescription className="text-xs line-clamp-2 mt-1 leading-relaxed">
                  {res.description}
                </CardDescription>

                {res.tags && res.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {res.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    {res.monthIndex ? `Tháng ${res.monthIndex}` : 'Kho mở rộng'}
                  </span>

                  <div className="flex items-center gap-2">
                    {res.isEmbeddable ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setActiveMediaModal(res)}
                        leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                        className="text-xs py-1 px-3 font-semibold"
                      >
                        Xem ngay
                      </Button>
                    ) : (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <span>{res.category === 'pdf' ? 'Mở Drive' : 'Xem liên kết'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-500">
            Không tìm thấy tài nguyên nào phù hợp với bộ lọc &quot;{searchQuery}&quot;.
          </p>
        </div>
      )}

      {/* Embedded Video/Content Modal Dialog */}
      {activeMediaModal && (
        <Dialog
          isOpen={!!activeMediaModal}
          onClose={() => setActiveMediaModal(null)}
          title={activeMediaModal.title}
          description={activeMediaModal.description}
          className="max-w-3xl"
        >
          <div className="py-2 space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={activeMediaModal.embedUrl}
                title={activeMediaModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Tác giả / Kênh:</span>
                <span>{activeMediaModal.channelOrAuthor || 'Kênh chuẩn'}</span>
              </div>
              <a
                href={activeMediaModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>Mở trong tab mới</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
