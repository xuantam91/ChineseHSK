'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  FileText,
  Headphones,
  BookOpen,
  ExternalLink,
  Search,
  Play,
  Film,
  Image as ImageIcon,
  GitFork,
  Layers,
  Volume2,
  ArrowRight,
  Baby,
  GraduationCap,
  Users,
  Subtitles,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { DEMO_LIBRARY_RESOURCES } from '@/lib/mock-data';
import { sanitizeDriveUrl } from '@/lib/drive';
import { CURATED_MEDIA_RESOURCES, LibraryTopicKey } from '@/lib/curriculum/media-resources';
import {
  LIBRARY_MINDMAPS,
  LIBRARY_INFOGRAPHICS,
  LIBRARY_EXTRA_RESOURCES,
  LIBRARY_TOPICS,
  inferMediaTopic,
  LibraryMindmapItem,
  LibraryInfographicItem,
} from '@/lib/curriculum/library-visual-assets';
import {
  InteractiveMindmapViewer,
  MindmapThumbnailPreview,
} from '@/components/library/MindmapViewer';
import { speakChinese } from '@/lib/tts';

type LibraryFormat = 'all' | 'video' | 'mindmap' | 'image' | 'pdf' | 'audio';
type AudienceFilter = 'all' | 'kids' | 'teens_adults';

interface VisualLibraryItem {
  id: string;
  title: string;
  shortLabel?: string;
  format: Exclude<LibraryFormat, 'all'>;
  topic: LibraryTopicKey;
  hskLevel: string;
  targetAudience: 'kids' | 'teens_adults' | 'all';
  thumbnailUrl?: string;
  url?: string;
  embedUrl?: string;
  isEmbeddable: boolean;
  sourceLabel?: string;
  captionLangs?: string[];
  tags: string[];
  mindmapData?: LibraryMindmapItem;
  infographicData?: LibraryInfographicItem;
}

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function withCaptionParams(embedUrl?: string): string | undefined {
  if (!embedUrl) return undefined;
  if (!embedUrl.includes('youtube.com/embed/')) return embedUrl;
  return embedUrl.includes('cc_load_policy=')
    ? embedUrl
    : `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}cc_load_policy=1&cc_lang_pref=vi&hl=vi`;
}

export default function LibraryPage() {
  const [selectedFormat, setSelectedFormat] = useState<LibraryFormat>('all');
  const [selectedTopic, setSelectedTopic] = useState<'all' | LibraryTopicKey>('all');
  const [selectedHsk, setSelectedHsk] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<AudienceFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeVideoModal, setActiveVideoModal] = useState<VisualLibraryItem | null>(null);
  const [activeMindmapModal, setActiveMindmapModal] = useState<LibraryMindmapItem | null>(null);
  const [activeImageModal, setActiveImageModal] = useState<LibraryInfographicItem | null>(null);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const allItems = useMemo<VisualLibraryItem[]>(() => {
    const items: VisualLibraryItem[] = [];
    const seenUrls = new Set<string>();

    // 1. Mindmaps (Featured visual diagrams)
    for (const mm of LIBRARY_MINDMAPS) {
      items.push({
        id: mm.id,
        title: mm.title,
        shortLabel: mm.subtitle,
        format: 'mindmap',
        topic: mm.topic,
        hskLevel: mm.hskLevel,
        targetAudience: mm.targetAudience,
        isEmbeddable: true,
        sourceLabel: `${mm.branches.length} nhánh tư duy`,
        tags: mm.tags,
        mindmapData: mm,
      });
    }

    // 2. Lesson Visual Posters / Infographics (from /images/lessons/*.jpg)
    for (const img of LIBRARY_INFOGRAPHICS) {
      items.push({
        id: img.id,
        title: img.title,
        shortLabel: `${img.keyWords.length} từ khóa có phát âm`,
        format: 'image',
        topic: img.topic,
        hskLevel: img.hskLevel,
        targetAudience: img.targetAudience,
        thumbnailUrl: img.imageUrl,
        isEmbeddable: true,
        sourceLabel: `Tranh ${img.hanziTitle}`,
        tags: img.tags,
        infographicData: img,
      });
    }

    // 3. Curated Media (Videos, Songs, Cartoons, Pinyin, Drive PDFs)
    for (const media of CURATED_MEDIA_RESOURCES) {
      const normUrl = media.sanitizedInfo.safeUrl.replace(/\?usp=sharing$/, '').trim();
      if (seenUrls.has(normUrl)) continue;
      seenUrls.add(normUrl);

      const isPdf = media.category === 'textbook_pdf';
      const ytId = extractYouTubeId(media.url);
      const thumb = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined;
      const format: Exclude<LibraryFormat, 'all'> = isPdf ? 'pdf' : 'video';

      items.push({
        id: media.id,
        title: media.title,
        shortLabel: media.channelOrAuthor || 'Học liệu chọn lọc',
        format,
        topic: inferMediaTopic(media),
        hskLevel: media.hskLevel,
        targetAudience: media.targetAudience,
        thumbnailUrl: thumb,
        url: media.sanitizedInfo.safeUrl,
        embedUrl: withCaptionParams(media.sanitizedInfo.embedUrl),
        isEmbeddable: media.sanitizedInfo.isEmbeddable,
        sourceLabel: media.channelOrAuthor,
        captionLangs: media.captionLangs,
        tags: media.recommendedTags,
      });
    }

    // 4. Extra PDFs, Charts & Audio Packs
    for (const extra of LIBRARY_EXTRA_RESOURCES) {
      const normUrl = extra.url.replace(/\?usp=sharing$/, '').trim();
      if (seenUrls.has(normUrl)) continue;
      seenUrls.add(normUrl);

      items.push({
        id: extra.id,
        title: extra.title,
        shortLabel: extra.shortDesc,
        format: extra.format,
        topic: extra.topic,
        hskLevel: extra.hskLevel,
        targetAudience: extra.targetAudience,
        url: extra.url,
        embedUrl: extra.embedUrl,
        isEmbeddable: extra.isEmbeddable,
        sourceLabel: extra.sourceLabel,
        tags: extra.tags,
      });
    }

    // 5. Legacy Drive PDFs / Audios
    for (const res of DEMO_LIBRARY_RESOURCES) {
      const driveInfo = sanitizeDriveUrl(res.driveUrl);
      const normUrl = driveInfo.viewUrl.replace(/\?usp=sharing$/, '').trim();
      if (seenUrls.has(normUrl)) continue;
      seenUrls.add(normUrl);

      const format: Exclude<LibraryFormat, 'all'> =
        res.category === 'audio' ? 'audio' : res.category === 'video' ? 'video' : 'pdf';

      items.push({
        id: res.id,
        title: res.title,
        shortLabel: res.fileSize || 'Google Drive',
        format,
        topic: inferMediaTopic({ category: res.category, title: res.title }),
        hskLevel: res.hskLevel,
        targetAudience: 'all',
        url: driveInfo.viewUrl,
        isEmbeddable: false,
        sourceLabel: res.fileSize || 'Tài liệu Drive',
        tags: [res.hskLevel],
      });
    }

    return items;
  }, []);

  const formatCounts = useMemo(() => {
    const counts = { all: allItems.length, video: 0, mindmap: 0, image: 0, pdf: 0, audio: 0 };
    for (const item of allItems) {
      counts[item.format]++;
    }
    return counts;
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allItems.filter((item) => {
      if (selectedFormat !== 'all' && item.format !== selectedFormat) return false;
      if (selectedTopic !== 'all' && item.topic !== selectedTopic) return false;

      if (selectedHsk !== 'all') {
        const lvl = item.hskLevel.toLowerCase();
        const target = selectedHsk.toLowerCase();
        const matchesExact =
          lvl === target ||
          lvl === 'all levels' ||
          (target === 'hsk 1' && lvl.includes('hsk 1')) ||
          (target === 'hsk 2' && lvl.includes('hsk 2')) ||
          (target === 'hsk 3' && lvl.includes('hsk 3')) ||
          (target === 'hsk 4' && lvl.includes('hsk 4')) ||
          (target === 'hsk 5' && lvl.includes('hsk 5')) ||
          (target === 'hsk 6' && lvl.includes('hsk 6'));
        if (!matchesExact) return false;
      }

      if (selectedAudience !== 'all') {
        if (item.targetAudience !== 'all' && item.targetAudience !== selectedAudience) {
          return false;
        }
      }

      if (q) {
        const hay = `${item.title} ${item.shortLabel || ''} ${item.sourceLabel || ''} ${item.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [allItems, selectedFormat, selectedTopic, selectedHsk, selectedAudience, searchQuery]);

  const formatTabs: Array<{ id: LibraryFormat; label: string; icon: React.ComponentType<any>; count: number }> = [
    { id: 'all', label: 'Tất cả', icon: Layers, count: formatCounts.all },
    { id: 'video', label: 'Video & Hoạt hình', icon: Film, count: formatCounts.video },
    { id: 'mindmap', label: 'Mindmap Tư duy', icon: GitFork, count: formatCounts.mindmap },
    { id: 'image', label: 'Tranh & Ảnh bài học', icon: ImageIcon, count: formatCounts.image },
    { id: 'pdf', label: 'Sách & PDF', icon: FileText, count: formatCounts.pdf },
    { id: 'audio', label: 'Audio MP3', icon: Headphones, count: formatCounts.audio },
  ];

  const hskLevels = ['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];

  const handleOpenCard = (item: VisualLibraryItem) => {
    if (item.format === 'mindmap' && item.mindmapData) {
      setActiveMindmapModal(item.mindmapData);
      return;
    }
    if (item.format === 'image' && item.infographicData) {
      setActiveImageModal(item.infographicData);
      return;
    }
    if (item.isEmbeddable && item.embedUrl) {
      setActiveVideoModal(item);
      return;
    }
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getFormatBadge = (format: VisualLibraryItem['format']) => {
    switch (format) {
      case 'video':
        return { label: 'Video', cls: 'bg-rose-600 text-white', Icon: Film };
      case 'mindmap':
        return { label: 'Mindmap', cls: 'bg-emerald-700 text-white', Icon: GitFork };
      case 'image':
        return { label: 'Tranh ảnh', cls: 'bg-amber-500 text-slate-950', Icon: ImageIcon };
      case 'pdf':
        return { label: 'Sách PDF', cls: 'bg-indigo-700 text-white', Icon: FileText };
      case 'audio':
        return { label: 'Audio MP3', cls: 'bg-sky-700 text-white', Icon: Headphones };
    }
  };

  const getAudienceBadge = (audience: VisualLibraryItem['targetAudience']) => {
    if (audience === 'kids') return { label: 'Trẻ em', Icon: Baby };
    if (audience === 'teens_adults') return { label: 'Thiếu niên & NL', Icon: GraduationCap };
    return { label: 'Mọi lứa tuổi', Icon: Users };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Compact Visual Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 text-white p-5 sm:p-6 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-300 uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Thư viện trực quan HSK 1–6</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Kho Video, Mindmap, Tranh Ảnh & Sách PDF
            </h1>
          </div>

          {/* Visual Quick Stats Chips */}
          <div className="grid grid-cols-4 gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedFormat('video')}
              className="rounded-xl bg-white/15 hover:bg-white/25 px-3 py-2 text-center transition cursor-pointer"
            >
              <div className="text-base font-black tabular-nums">{formatCounts.video}</div>
              <div className="text-[10px] font-semibold text-emerald-100">🎬 Video</div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat('mindmap')}
              className="rounded-xl bg-white/15 hover:bg-white/25 px-3 py-2 text-center transition cursor-pointer"
            >
              <div className="text-base font-black tabular-nums">{formatCounts.mindmap}</div>
              <div className="text-[10px] font-semibold text-emerald-100">🧠 Mindmap</div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat('image')}
              className="rounded-xl bg-white/15 hover:bg-white/25 px-3 py-2 text-center transition cursor-pointer"
            >
              <div className="text-base font-black tabular-nums">{formatCounts.image}</div>
              <div className="text-[10px] font-semibold text-emerald-100">🖼️ Tranh</div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat('pdf')}
              className="rounded-xl bg-white/15 hover:bg-white/25 px-3 py-2 text-center transition cursor-pointer"
            >
              <div className="text-base font-black tabular-nums">{formatCounts.pdf + formatCounts.audio}</div>
              <div className="text-[10px] font-semibold text-emerald-100">📄 PDF/MP3</div>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Dimension Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        {/* Row 1: Format Tabs + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {formatTabs.map((tab) => {
              const Icon = tab.icon;
              const active = selectedFormat === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFormat(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${
                      active ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm chủ đề, từ khóa, kênh..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Row 2: Lesson Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Chủ đề:
          </span>
          {LIBRARY_TOPICS.map((t) => {
            const active = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTopic(t.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 3: HSK Level + Age Audience */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Cấp độ:
            </span>
            {hskLevels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedHsk(lvl)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  selectedHsk === lvl
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl === 'all' ? 'Tất cả HSK' : lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Lứa tuổi:
            </span>
            {[
              { id: 'all' as const, label: 'Mọi lứa tuổi', Icon: Users },
              { id: 'kids' as const, label: 'Trẻ em (3–11t)', Icon: Baby },
              { id: 'teens_adults' as const, label: 'Thiếu niên & Người lớn', Icon: GraduationCap },
            ].map((aud) => {
              const Icon = aud.Icon;
              const active = selectedAudience === aud.id;
              return (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setSelectedAudience(aud.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    active
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{aud.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Count Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Đang hiển thị <strong className="text-slate-900 font-extrabold">{filteredItems.length}</strong> tài liệu trực quan
        </span>
        {(selectedFormat !== 'all' ||
          selectedTopic !== 'all' ||
          selectedHsk !== 'all' ||
          selectedAudience !== 'all' ||
          searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedFormat('all');
              setSelectedTopic('all');
              setSelectedHsk('all');
              setSelectedAudience('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Visual Gallery Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const fmt = getFormatBadge(item.format);
          const aud = getAudienceBadge(item.targetAudience);
          const AudIcon = aud.Icon;
          const FmtIcon = fmt.Icon;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenCard(item)}
              className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
            >
              {/* 16:9 Visual Thumbnail Header */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                {item.format === 'mindmap' && item.mindmapData ? (
                  <MindmapThumbnailPreview mindmap={item.mindmapData} />
                ) : item.thumbnailUrl ? (
                  <>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/35" />
                  </>
                ) : (
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center p-4 text-white ${
                      item.format === 'pdf'
                        ? 'bg-gradient-to-br from-indigo-700 via-slate-800 to-slate-900'
                        : item.format === 'audio'
                        ? 'bg-gradient-to-br from-sky-700 via-teal-800 to-slate-900'
                        : 'bg-gradient-to-br from-rose-700 via-slate-800 to-slate-900'
                    }`}
                  >
                    <FmtIcon className="w-12 h-12 text-white/85 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white/90 text-center">
                      {item.sourceLabel || fmt.label}
                    </span>
                  </div>
                )}

                {/* Play overlay for playable videos */}
                {item.format === 'video' && item.isEmbeddable && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-emerald-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Top Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold shadow-xs ${fmt.cls}`}
                  >
                    <FmtIcon className="w-3 h-3" />
                    <span>{fmt.label}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    {item.captionLangs && item.captionLangs.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-950/80 text-amber-300 border border-amber-400/30 backdrop-blur-xs">
                        <Subtitles className="w-3 h-3" />
                        <span>{item.captionLangs.includes('vi') ? 'CC Việt' : 'CC Anh/Trung'}</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-950/80 text-white backdrop-blur-xs">
                      {item.hskLevel}
                    </span>
                  </div>
                </div>

                {/* Bottom Hanzi Stamp for Lesson Posters */}
                {item.infographicData && (
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
                    <span className="font-chinese text-2xl font-black drop-shadow">
                      {item.infographicData.hanziTitle}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-600/90 px-2 py-0.5 rounded">
                      {item.infographicData.keyWords.length} từ khóa
                    </span>
                  </div>
                )}
              </div>

              {/* Concise Card Content (Minimal Text, Visual Chips) */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                      <AudIcon className="w-3 h-3 text-emerald-700" />
                      {aud.label}
                    </span>
                    {item.shortLabel && (
                      <span className="truncate max-w-[180px] text-slate-500 font-medium">
                        • {item.shortLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>
                    {item.format === 'mindmap'
                      ? 'Mở Mindmap tương tác'
                      : item.format === 'image'
                      ? 'Phóng to & Nghe từ khóa'
                      : item.isEmbeddable
                      ? 'Mở xem trực tiếp'
                      : 'Mở tài liệu gốc'}
                  </span>
                  {item.isEmbeddable ? (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <p className="text-sm font-semibold text-slate-500">
            Chưa có tài liệu khớp với bộ lọc hiện tại.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedFormat('all');
              setSelectedTopic('all');
              setSelectedHsk('all');
              setSelectedAudience('all');
              setSearchQuery('');
            }}
          >
            Xem toàn bộ thư viện ({allItems.length} tài liệu)
          </Button>
        </div>
      )}

      {/* Modal 1: Video / Google Drive Embedded Player */}
      {activeVideoModal && (
        <Dialog
          isOpen={!!activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          title={activeVideoModal.title}
          description={activeVideoModal.shortLabel}
          className="max-w-4xl"
        >
          <div className="py-2 space-y-3">
            <div
              className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner ${
                activeVideoModal.embedUrl?.includes('drive.google.com')
                  ? 'bg-white border border-slate-200'
                  : 'bg-black'
              }`}
            >
              <iframe
                src={activeVideoModal.embedUrl}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-700">
                Nguồn: {activeVideoModal.sourceLabel || 'Học liệu chuẩn'}
              </span>
              {activeVideoModal.url && (
                <a
                  href={activeVideoModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <span>Mở ở tab mới</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </Dialog>
      )}

      {/* Modal 2: Interactive Visual Mindmap */}
      {activeMindmapModal && (
        <Dialog
          isOpen={!!activeMindmapModal}
          onClose={() => setActiveMindmapModal(null)}
          title={activeMindmapModal.title}
          description={activeMindmapModal.subtitle}
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <InteractiveMindmapViewer mindmap={activeMindmapModal} />
        </Dialog>
      )}

      {/* Modal 3: Visual Poster Lightbox + Clickable Chinese Vocabulary */}
      {activeImageModal && (
        <Dialog
          isOpen={!!activeImageModal}
          onClose={() => setActiveImageModal(null)}
          title={activeImageModal.title}
          description={`${activeImageModal.hskLevel} • Bấm vào từ khóa bên dưới để nghe phát âm`}
          className="max-w-3xl"
        >
          <div className="space-y-4 py-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
              <img
                src={activeImageModal.imageUrl}
                alt={activeImageModal.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 right-4 font-chinese text-5xl font-black text-white/30 pointer-events-none select-none">
                {activeImageModal.hanziTitle}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-2.5">
              {activeImageModal.keyWords.map((kw, i) => {
                const playing = speakingWord === kw.hanzi;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSpeakingWord(kw.hanzi);
                      speakChinese(kw.hanzi, {
                        persona: 'female',
                        onEnd: () => setSpeakingWord(null),
                        onError: () => setSpeakingWord(null),
                      });
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                      playing
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-slate-50/70 hover:border-emerald-300 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-chinese text-lg font-extrabold text-slate-900">
                        {kw.hanzi}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-emerald-700">
                        {kw.pinyin}
                      </div>
                      <div className="text-xs text-slate-600">{kw.meaningVi}</div>
                    </div>
                    <Volume2
                      className={`w-4 h-4 text-emerald-700 shrink-0 ${playing ? 'animate-bounce' : ''}`}
                    />
                  </button>
                );
              })}
            </div>

            {activeImageModal.lessonId && (
              <div className="flex justify-end pt-1">
                <Link href={`/lesson/${activeImageModal.lessonId}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="bg-emerald-700 hover:bg-emerald-800 text-xs font-bold"
                  >
                    Vào học bài tương ứng
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}
