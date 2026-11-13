'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  AlertTriangle,
  Users,
  Compass,
  Radio,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  Tv,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  EQUIPMENT_CHECKLIST,
  FIVE_STEP_LEARNING_PROCESS,
  CRITICAL_MISTAKES_TO_AVOID,
  AGE_TIER_ROADMAPS,
  TEXTBOOK_SELECTION_MATRIX,
} from '@/lib/curriculum/methodology-guide';

export function NotionMethodologySection() {
  const [activeTab, setActiveTab] = useState<'steps' | 'mistakes' | 'age_tiers' | 'textbooks' | 'equipment'>('steps');

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Phương Pháp Sư Phạm Chuẩn Notion</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Cẩm Nang Tự Học Tiếng Trung Cho Người Mới Bắt Đầu
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
            Toàn bộ phương pháp sư phạm, quy trình 5 bước tại nhà, 7 lỗi quan trọng cần tránh và lộ trình phân hóa theo lứa tuổi được đúc kết từ giáo trình Notion chính thức.
          </p>
        </div>

        <a
          href="https://judicious-crafter-764.notion.site/L-TR-NH-H-C-TI-NG-TRUNG-CHO-NG-I-M-I-B-T-U-129db0ebd82b4b5cb9c13a343a937567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50 px-3.5 py-2 rounded-xl border border-gray-200 transition-colors w-fit shrink-0"
        >
          <span>Xem Notion Gốc</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'steps', label: '1. Quy trình 5 bước tự học', icon: Compass },
          { id: 'mistakes', label: '2. 7 Lỗi cần tránh', icon: ShieldAlert },
          { id: 'age_tiers', label: '3. Phân hóa theo độ tuổi', icon: Users },
          { id: 'textbooks', label: '4. Ma trận giáo trình', icon: BookOpen },
          { id: 'equipment', label: '5. Học cụ & Loa Craven', icon: Radio },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: 5-Step Learning Process */}
      {activeTab === 'steps' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed flex items-center justify-between">
            <span>
              <strong>Nguyên tắc vàng:</strong> Luôn tuân theo trình tự tự nhiên của loài người: <strong className="text-emerald-800">NGHE ➔ NÓI ➔ ĐỌC ➔ VIẾT</strong>. Không đảo lộn quy trình để đạt phản xạ ngôn ngữ nhanh nhất.
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FIVE_STEP_LEARNING_PROCESS.map((step) => (
              <div
                key={step.stepNumber}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                      {step.stepNumber}
                    </span>
                    <Badge variant="outline" size="sm" className="font-semibold text-[10px]">
                      {step.recommendedDuration}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">
                    {step.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    {step.fullGuide}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Hành động cụ thể:
                  </span>
                  {step.actionChecklist.map((act, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 7 Critical Mistakes */}
      {activeTab === 'mistakes' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="grid gap-3 sm:grid-cols-2">
            {CRITICAL_MISTAKES_TO_AVOID.map((mis, idx) => (
              <div
                key={mis.id}
                className="rounded-2xl border border-rose-100 bg-rose-50/20 p-5 hover:border-rose-300 transition-all space-y-2"
              >
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                      Sai lầm #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {mis.mistakeTitle}
                    </h4>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-rose-100 text-xs text-gray-600">
                  <strong className="text-rose-900">Tác hại:</strong> {mis.impactWhyBad}
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950">
                  <strong className="text-emerald-800">Giải pháp đúng:</strong> {mis.solutionHowToFix}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Age-Tiered Roadmaps */}
      {activeTab === 'age_tiers' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid gap-4 sm:grid-cols-2">
            {AGE_TIER_ROADMAPS.map((tier) => (
              <div
                key={tier.ageRange}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-emerald-700 text-white font-bold">
                    {tier.ageRange}
                  </Badge>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {tier.dailyRoutine}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {tier.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {tier.coreMethodology}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-2">
                  <div>
                    <span className="font-bold text-gray-700">Lưu ý về Pinyin:</span>
                    <p className="text-gray-600 mt-0.5">{tier.pinyinGuidance}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-700">Giáo trình đề xuất:</span>
                    <ul className="list-disc list-inside text-gray-600 mt-0.5 space-y-0.5">
                      {tier.recommendedTextbooks.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Kênh bổ trợ phù hợp:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tier.recommendedChannels.map((ch, i) => (
                      <a
                        key={i}
                        href={ch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg"
                      >
                        <span>{ch.name}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Textbook Selection Matrix */}
      {activeTab === 'textbooks' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="space-y-3">
            {TEXTBOOK_SELECTION_MATRIX.map((rec, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {rec.targetStage}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 leading-snug">
                    {rec.recommendedBook}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Ưu điểm:</strong> {rec.strengths}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    <strong>Thứ tự học chuẩn:</strong> {rec.learningPathOrder}
                  </p>
                </div>

                {rec.driveFolderUrl && (
                  <a
                    href={rec.driveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 w-fit"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Mở kho sách Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Equipment & Loa Craven */}
      {activeTab === 'equipment' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid gap-4 sm:grid-cols-2">
            {EQUIPMENT_CHECKLIST.map((eq) => (
              <div
                key={eq.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-emerald-300 transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-emerald-600" />
                      {eq.name}
                    </span>
                    <Badge
                      variant={eq.importance === 'bắt buộc' ? 'default' : 'outline'}
                      size="sm"
                      className={eq.importance === 'bắt buộc' ? 'bg-rose-600 text-white font-bold' : ''}
                    >
                      {eq.importance}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">
                    {eq.purpose}
                  </p>
                  <div className="p-2.5 rounded-xl bg-gray-50 text-[11px] text-gray-700 leading-relaxed">
                    💡 <strong>Mẹo áp dụng:</strong> {eq.practicalTip}
                  </div>
                </div>

                {eq.tutorialUrl && (
                  <div className="pt-2">
                    <a
                      href={eq.tutorialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>Xem video hướng dẫn chép MP3</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
