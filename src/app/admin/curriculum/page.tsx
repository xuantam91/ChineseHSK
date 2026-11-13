'use client';

import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  BookOpen,
  Calendar,
  Layers,
  Edit2,
  CheckCircle,
  Clock,
  FileText,
  Video,
  Music,
  HelpCircle,
  ExternalLink,
  Sparkles,
  X,
  Save,
} from 'lucide-react';
import { DayType, BlockType } from '@/types/database';

interface BlockItem {
  id: string;
  type: BlockType;
  payload_jsonb: any;
  is_required: boolean;
  estimated_minutes: number;
  sort_order: number;
}

interface LessonItem {
  id: string;
  title: string;
  description: string;
  estimated_minutes: number;
  is_required: boolean;
  sort_order: number;
  blocks: BlockItem[];
}

interface DayItem {
  id: string;
  day_index: number;
  day_type: DayType;
  title: string;
  estimated_minutes: number;
  unlock_offset_days: number;
  is_required: boolean;
  lessons: LessonItem[];
}

interface WeekItem {
  id: string;
  week_index: number;
  title: string;
  days: DayItem[];
}

interface MonthItem {
  id: string;
  month_index: number;
  title: string;
  weeks: WeekItem[];
}

export default function AdminCurriculumPage() {
  const [months, setMonths] = useState<MonthItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

  // Modals state
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<{
    id?: string;
    curriculum_week_id: string;
    day_index: number;
    day_type: DayType;
    title: string;
    estimated_minutes: number;
    unlock_offset_days: number;
    is_required: boolean;
  } | null>(null);

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{
    id?: string;
    curriculum_day_id: string;
    title: string;
    description: string;
    estimated_minutes: number;
    is_required: boolean;
    sort_order: number;
  } | null>(null);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<{
    lesson_id: string;
    type: BlockType;
    content: string;
    drive_url?: string;
    title?: string;
    estimated_minutes: number;
    is_required: boolean;
  } | null>(null);

  const fetchTree = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/curriculum/tree');
      const json = await res.json();
      if (json.success && json.data.months) {
        setMonths(json.data.months);
        // Default expand first month and first week
        if (json.data.months.length > 0) {
          const firstM = json.data.months[0];
          setExpandedMonths({ [firstM.id]: true });
          if (firstM.weeks.length > 0) {
            setExpandedWeeks({ [firstM.weeks[0].id]: true });
            if (firstM.weeks[0].days.length > 0 && firstM.weeks[0].days[0].lessons.length > 0) {
              setSelectedLesson(firstM.weeks[0].days[0].lessons[0]);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to load curriculum tree', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const toggleMonth = (monthId: string) => {
    setExpandedMonths((prev) => ({ ...prev, [monthId]: !prev[monthId] }));
  };

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekId]: !prev[weekId] }));
  };

  // Save Day Handler
  const handleSaveDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;
    try {
      const res = await fetch('/api/admin/curriculum/days', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDay),
      });
      const json = await res.json();
      if (json.success) {
        setDayModalOpen(false);
        fetchTree();
      } else {
        alert(json.error?.message || 'Lỗi khi lưu ngày học');
      }
    } catch {
      alert('Lỗi kết nối khi lưu ngày học');
    }
  };

  // Save Lesson Handler
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    try {
      const res = await fetch('/api/admin/curriculum/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLesson),
      });
      const json = await res.json();
      if (json.success) {
        setLessonModalOpen(false);
        await fetchTree();
      } else {
        alert(json.error?.message || 'Lỗi khi lưu bài học');
      }
    } catch {
      alert('Lỗi kết nối khi lưu bài học');
    }
  };

  // Save Block Handler
  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;

    let payload: Record<string, any> = {};
    if (editingBlock.type === 'rich_text') {
      payload = { content: editingBlock.content };
    } else if (editingBlock.type === 'video' || editingBlock.type === 'audio' || editingBlock.type === 'pdf') {
      payload = {
        title: editingBlock.title || 'Tài nguyên',
        drive_url: editingBlock.drive_url,
      };
    } else if (editingBlock.type === 'vocabulary') {
      payload = {
        items: [
          {
            hanzi: '你好',
            pinyin: 'nǐ hǎo',
            meaning_vi: 'Xin chào',
            example: '你好！很高兴认识你。',
          },
        ],
      };
    } else {
      payload = { content: editingBlock.content };
    }

    try {
      const res = await fetch('/api/admin/curriculum/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: editingBlock.lesson_id,
          type: editingBlock.type,
          payload_jsonb: payload,
          sort_order: (selectedLesson?.blocks.length || 0) + 1,
          is_required: editingBlock.is_required,
          estimated_minutes: editingBlock.estimated_minutes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setBlockModalOpen(false);
        await fetchTree();
        // Update selectedLesson view
        if (selectedLesson) {
          const updatedBlocks = [...selectedLesson.blocks, json.data];
          setSelectedLesson({ ...selectedLesson, blocks: updatedBlocks });
        }
      } else {
        alert(json.error?.message || 'Lỗi khi lưu khối nội dung');
      }
    } catch {
      alert('Lỗi kết nối khi lưu khối nội dung');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-emerald-600" />
            Cấu Trúc Giáo Trình & Soạn Thảo Bài Học
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý phả hệ phân cấp: Tháng &rarr; Tuần &rarr; Ngày &rarr; Bài học &rarr; Khối nội dung đa phương tiện
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (months.length > 0 && months[0].weeks.length > 0) {
                const firstWeek = months[0].weeks[0];
                setEditingDay({
                  curriculum_week_id: firstWeek.id,
                  day_index: 10,
                  day_type: 'learning',
                  title: 'Ngày mới',
                  estimated_minutes: 30,
                  unlock_offset_days: 10,
                  is_required: true,
                });
                setDayModalOpen(true);
              }
            }}
            className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Thêm Ngày Học
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tree Navigation, Right Lesson Block Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Tree: 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 divide-y divide-slate-100 max-h-[800px] overflow-y-auto">
          <div className="pb-3 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Cây phân cấp học tập</span>
            <span>{months.length} Tháng</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
              Đang tải cây giáo trình...
            </div>
          ) : months.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Chưa có dữ liệu giáo trình. Vui lòng chạy Import Notion.
            </div>
          ) : (
            <div className="pt-3 space-y-2">
              {months.map((m) => {
                const isMonthExpanded = expandedMonths[m.id];
                return (
                  <div key={m.id} className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
                    {/* Month Header */}
                    <button
                      onClick={() => toggleMonth(m.id)}
                      className="w-full px-3 py-2.5 text-left flex items-center justify-between hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center space-x-2 font-bold text-xs text-slate-800">
                        {isMonthExpanded ? (
                          <ChevronDown className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                        <span>{m.title}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold">
                        {m.weeks.length} tuần
                      </span>
                    </button>

                    {/* Weeks in Month */}
                    {isMonthExpanded && (
                      <div className="px-3 pb-3 pt-1 space-y-2 bg-white border-t border-slate-100">
                        {m.weeks.map((w) => {
                          const isWeekExpanded = expandedWeeks[w.id];
                          return (
                            <div key={w.id} className="border border-slate-100 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleWeek(w.id)}
                                className="w-full px-2.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition text-xs font-semibold text-slate-700"
                              >
                                <div className="flex items-center space-x-1.5">
                                  {isWeekExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                  <span>{w.title}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">{w.days.length} ngày</span>
                              </button>

                              {/* Days in Week */}
                              {isWeekExpanded && (
                                <div className="pl-4 pr-2 pb-2 pt-1 space-y-1 bg-slate-50/40">
                                  {w.days.map((d) => (
                                    <div key={d.id} className="p-2 rounded-md bg-white border border-slate-200/60 shadow-2xs space-y-1.5">
                                      <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                                          <Calendar className="w-3 h-3 text-emerald-600" />
                                          <span className="truncate max-w-[180px]">{d.title}</span>
                                        </div>
                                        <span
                                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                            d.day_type === 'rest'
                                              ? 'bg-amber-100 text-amber-700'
                                              : d.day_type === 'quiz'
                                              ? 'bg-purple-100 text-purple-700'
                                              : 'bg-emerald-100 text-emerald-700'
                                          }`}
                                        >
                                          {d.day_type}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                                        <span>Offset: +{d.unlock_offset_days}d ({d.estimated_minutes}p)</span>
                                        <button
                                          onClick={() => {
                                            setEditingLesson({
                                              curriculum_day_id: d.id,
                                              title: `Bài học mới cho ${d.title}`,
                                              description: '',
                                              estimated_minutes: 20,
                                              is_required: true,
                                              sort_order: d.lessons.length + 1,
                                            });
                                            setLessonModalOpen(true);
                                          }}
                                          className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center"
                                        >
                                          <Plus className="w-3 h-3 mr-0.5" /> Bài học
                                        </button>
                                      </div>

                                      {/* Lessons list in Day */}
                                      {d.lessons.length > 0 && (
                                        <div className="pl-2 border-l-2 border-emerald-500 space-y-1 pt-1">
                                          {d.lessons.map((les) => (
                                            <button
                                              key={les.id}
                                              onClick={() => setSelectedLesson(les)}
                                              className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between transition ${
                                                selectedLesson?.id === les.id
                                                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                                                  : 'text-slate-600 hover:bg-slate-100'
                                              }`}
                                            >
                                              <span className="truncate">{les.title}</span>
                                              <span className="text-[10px] text-slate-400">
                                                {les.blocks.length} block
                                              </span>
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Pane: Lesson & Block Manager (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {selectedLesson ? (
            <>
              {/* Selected Lesson Header */}
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold uppercase">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Chi tiết bài học</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedLesson.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedLesson.description || 'Chưa có mô tả ngắn.'} • Dự kiến: {selectedLesson.estimated_minutes} phút
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingBlock({
                      lesson_id: selectedLesson.id,
                      type: 'rich_text',
                      content: '',
                      title: '',
                      estimated_minutes: 5,
                      is_required: true,
                    });
                    setBlockModalOpen(true);
                  }}
                  className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Thêm Khối Nội Dung
                </button>
              </div>

              {/* Block List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Các khối nội dung ({selectedLesson.blocks.length})</span>
                  <span>Thứ tự thực thi</span>
                </div>

                {selectedLesson.blocks.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
                    Bài học này chưa có khối nội dung nào. Bấm &quot;Thêm Khối Nội Dung&quot; để bắt đầu.
                  </div>
                ) : (
                  selectedLesson.blocks.map((b, idx) => {
                    let Icon = FileText;
                    let typeBadge = 'Văn bản (Rich Text)';
                    if (b.type === 'video') {
                      Icon = Video;
                      typeBadge = 'Video Google Drive';
                    } else if (b.type === 'audio') {
                      Icon = Music;
                      typeBadge = 'Audio Google Drive';
                    } else if (b.type === 'quiz') {
                      Icon = HelpCircle;
                      typeBadge = 'Bài tập Quiz';
                    } else if (b.type === 'vocabulary') {
                      Icon = Sparkles;
                      typeBadge = 'Từ vựng (Vocab)';
                    }

                    return (
                      <div
                        key={b.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">{typeBadge}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-medium">
                              {b.estimated_minutes} phút
                            </span>
                            {b.is_required && (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                                Bắt buộc
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content preview */}
                        <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80 font-mono overflow-x-auto max-h-32">
                          {b.payload_jsonb.content ? (
                            <p className="whitespace-pre-wrap">{b.payload_jsonb.content}</p>
                          ) : b.payload_jsonb.drive_url ? (
                            <p className="text-blue-600 underline truncate">{b.payload_jsonb.drive_url}</p>
                          ) : b.payload_jsonb.items ? (
                            <p>{b.payload_jsonb.items.length} từ vựng tiếng Trung</p>
                          ) : (
                            JSON.stringify(b.payload_jsonb)
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium">Chọn một bài học ở cột bên trái để quản lý khối nội dung.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: ADD/EDIT DAY */}
      {dayModalOpen && editingDay && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Thêm / Chỉnh Sửa Ngày Học</h3>
              <button onClick={() => setDayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveDay} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số thứ tự ngày (Day Index)</label>
                <input
                  type="number"
                  value={editingDay.day_index}
                  onChange={(e) => setEditingDay({ ...editingDay, day_index: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tiêu đề ngày học</label>
                <input
                  type="text"
                  value={editingDay.title}
                  onChange={(e) => setEditingDay({ ...editingDay, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Loại ngày (Day Type)</label>
                <select
                  value={editingDay.day_type}
                  onChange={(e) => setEditingDay({ ...editingDay, day_type: e.target.value as DayType })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="learning">Học tập chính (Learning)</option>
                  <option value="review">Ôn tập (Review)</option>
                  <option value="quiz">Kiểm tra mốc (Quiz)</option>
                  <option value="rest">Nghỉ ngơi (Rest)</option>
                  <option value="checkpoint">Cột mốc (Checkpoint)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Độ lệch mở bài (Offset Days)</label>
                  <input
                    type="number"
                    value={editingDay.unlock_offset_days}
                    onChange={(e) =>
                      setEditingDay({ ...editingDay, unlock_offset_days: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thời lượng (Phút)</label>
                  <input
                    type="number"
                    value={editingDay.estimated_minutes}
                    onChange={(e) =>
                      setEditingDay({ ...editingDay, estimated_minutes: parseInt(e.target.value) || 30 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="dayRequired"
                  checked={editingDay.is_required}
                  onChange={(e) => setEditingDay({ ...editingDay, is_required: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="dayRequired" className="font-semibold text-slate-700">
                  Ngày học bắt buộc để tính tiến độ
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDayModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Lưu Ngày Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT LESSON */}
      {lessonModalOpen && editingLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Thêm / Sửa Bài Học</h3>
              <button onClick={() => setLessonModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveLesson} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tiêu đề bài học</label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả tóm tắt</label>
                <textarea
                  value={editingLesson.description}
                  onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thời lượng (Phút)</label>
                  <input
                    type="number"
                    value={editingLesson.estimated_minutes}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, estimated_minutes: parseInt(e.target.value) || 20 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={editingLesson.sort_order}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, sort_order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="lessonRequired"
                  checked={editingLesson.is_required}
                  onChange={(e) => setEditingLesson({ ...editingLesson, is_required: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="lessonRequired" className="font-semibold text-slate-700">
                  Bài học bắt buộc
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLessonModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Lưu Bài Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD BLOCK */}
      {blockModalOpen && editingBlock && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Thêm Khối Nội Dung Mới</h3>
              <button onClick={() => setBlockModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveBlock} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Loại khối nội dung</label>
                <select
                  value={editingBlock.type}
                  onChange={(e) => setEditingBlock({ ...editingBlock, type: e.target.value as BlockType })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value="rich_text">Văn bản / Markdown (Lý thuyết, ghi chú)</option>
                  <option value="video">Video (Google Drive Link)</option>
                  <option value="audio">Âm thanh MP3 (Google Drive Link)</option>
                  <option value="pdf">Tài liệu PDF (Google Drive Link)</option>
                  <option value="vocabulary">Bộ từ vựng (Vocabulary set)</option>
                  <option value="quiz">Bài kiểm tra trắc nghiệm (Quiz)</option>
                </select>
              </div>

              {editingBlock.type === 'rich_text' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nội dung Markdown</label>
                  <textarea
                    value={editingBlock.content}
                    onChange={(e) => setEditingBlock({ ...editingBlock, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    rows={6}
                    placeholder="### Tiêu đề kiến thức&#10;Ghi chú phát âm hoặc cấu trúc câu..."
                    required
                  />
                </div>
              )}

              {(editingBlock.type === 'video' || editingBlock.type === 'audio' || editingBlock.type === 'pdf') && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tên tài nguyên</label>
                    <input
                      type="text"
                      value={editingBlock.title || ''}
                      onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="File nghe phát âm Pinyin..."
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Link Google Drive</label>
                    <input
                      type="url"
                      value={editingBlock.drive_url || ''}
                      onChange={(e) => setEditingBlock({ ...editingBlock, drive_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="https://drive.google.com/file/d/..."
                      required
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thời lượng ước tính (Phút)</label>
                  <input
                    type="number"
                    value={editingBlock.estimated_minutes}
                    onChange={(e) =>
                      setEditingBlock({ ...editingBlock, estimated_minutes: parseInt(e.target.value) || 5 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-5">
                  <input
                    type="checkbox"
                    id="blockRequired"
                    checked={editingBlock.is_required}
                    onChange={(e) => setEditingBlock({ ...editingBlock, is_required: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="blockRequired" className="font-semibold text-slate-700">
                    Bắt buộc hoàn thành
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBlockModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Thêm Khối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
