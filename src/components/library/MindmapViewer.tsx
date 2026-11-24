'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { speakChinese } from '@/lib/tts';
import type { LibraryMindmapItem, MindmapBranch } from '@/lib/curriculum/library-visual-assets';

const BRANCH_COLORS: Record<
  MindmapBranch['color'],
  { card: string; header: string; pill: string; line: string }
> = {
  emerald: {
    card: 'border-emerald-200 bg-emerald-50/40',
    header: 'bg-emerald-700 text-white',
    pill: 'bg-white border-emerald-200 hover:border-emerald-400 text-emerald-950',
    line: '#047857',
  },
  amber: {
    card: 'border-amber-200 bg-amber-50/40',
    header: 'bg-amber-600 text-white',
    pill: 'bg-white border-amber-200 hover:border-amber-400 text-amber-950',
    line: '#d97706',
  },
  sky: {
    card: 'border-sky-200 bg-sky-50/40',
    header: 'bg-sky-700 text-white',
    pill: 'bg-white border-sky-200 hover:border-sky-400 text-sky-950',
    line: '#0369a1',
  },
  rose: {
    card: 'border-rose-200 bg-rose-50/40',
    header: 'bg-rose-700 text-white',
    pill: 'bg-white border-rose-200 hover:border-rose-400 text-rose-950',
    line: '#be123c',
  },
  indigo: {
    card: 'border-indigo-200 bg-indigo-50/40',
    header: 'bg-indigo-700 text-white',
    pill: 'bg-white border-indigo-200 hover:border-indigo-400 text-indigo-950',
    line: '#4338ca',
  },
  teal: {
    card: 'border-teal-200 bg-teal-50/40',
    header: 'bg-teal-700 text-white',
    pill: 'bg-white border-teal-200 hover:border-teal-400 text-teal-950',
    line: '#0f766e',
  },
};

/**
 * Compact visual radial SVG thumbnail for Library Mindmap cards
 */
export function MindmapThumbnailPreview({ mindmap }: { mindmap: LibraryMindmapItem }) {
  const b0 = mindmap.branches[0];
  const b1 = mindmap.branches[1];
  const b2 = mindmap.branches[2];
  const b3 = mindmap.branches[3];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-center overflow-hidden p-3">
      <svg
        viewBox="0 0 320 180"
        className="w-full h-full"
        role="img"
        aria-label={`Sơ đồ tư duy ${mindmap.centerTitle}`}
      >
        {/* Radial connector branches */}
        <path d="M160 90 C 120 90, 105 45, 72 40" stroke="#34d399" strokeWidth="2.2" fill="none" opacity="0.8" />
        <path d="M160 90 C 200 90, 215 45, 248 40" stroke="#fbbf24" strokeWidth="2.2" fill="none" opacity="0.8" />
        <path d="M160 90 C 120 90, 105 135, 72 140" stroke="#38bdf8" strokeWidth="2.2" fill="none" opacity="0.8" />
        <path d="M160 90 C 200 90, 215 135, 248 140" stroke="#fb7185" strokeWidth="2.2" fill="none" opacity="0.8" />

        {/* 4 branch nodes */}
        {b0 && (
          <g transform="translate(12, 22)">
            <rect width="104" height="30" rx="8" fill="#065f46" stroke="#34d399" strokeWidth="1" />
            <text x="52" y="19" textAnchor="middle" fill="#ecfdf5" fontSize="9.5" fontWeight="700">
              {b0.title.slice(0, 16)}
            </text>
          </g>
        )}
        {b1 && (
          <g transform="translate(204, 22)">
            <rect width="104" height="30" rx="8" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
            <text x="52" y="19" textAnchor="middle" fill="#fef3c7" fontSize="9.5" fontWeight="700">
              {b1.title.slice(0, 16)}
            </text>
          </g>
        )}
        {b2 && (
          <g transform="translate(12, 128)">
            <rect width="104" height="30" rx="8" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
            <text x="52" y="19" textAnchor="middle" fill="#e0f2fe" fontSize="9.5" fontWeight="700">
              {b2.title.slice(0, 16)}
            </text>
          </g>
        )}
        {b3 && (
          <g transform="translate(204, 128)">
            <rect width="104" height="30" rx="8" fill="#881337" stroke="#fb7185" strokeWidth="1" />
            <text x="52" y="19" textAnchor="middle" fill="#ffe4e6" fontSize="9.5" fontWeight="700">
              {b3.title.slice(0, 16)}
            </text>
          </g>
        )}

        {/* Center root node */}
        <circle cx="160" cy="90" r="34" fill="#047857" stroke="#fde68a" strokeWidth="2.5" />
        <text x="160" y="88" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800">
          {mindmap.centerHanzi}
        </text>
        <text x="160" y="104" textAnchor="middle" fill="#fde68a" fontSize="8" fontWeight="700">
          MINDMAP
        </text>
      </svg>
    </div>
  );
}

/**
 * Full interactive Mindmap Modal content with click-to-speak TTS on every node
 */
export function InteractiveMindmapViewer({ mindmap }: { mindmap: LibraryMindmapItem }) {
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const handleSpeak = (rawHanzi: string) => {
    const cleanText = rawHanzi.replace(/\(.*?\)/g, '').replace(/[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ0-9/+→\s]+/g, (m) =>
      /[\u4e00-\u9fff]/.test(m) ? m : ' '
    ).trim() || rawHanzi;

    setSpeakingText(rawHanzi);
    speakChinese(cleanText, {
      persona: 'female',
      onEnd: () => setSpeakingText(null),
      onError: () => setSpeakingText(null),
    });
  };

  return (
    <div className="space-y-5 py-2">
      {/* Center Root Hub */}
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md border-2 border-amber-300/70">
          <span className="font-chinese text-3xl font-black tracking-wide">{mindmap.centerHanzi}</span>
          <div className="text-left">
            <div className="text-sm font-extrabold">{mindmap.centerTitle}</div>
            <div className="text-[11px] text-emerald-100">{mindmap.subtitle}</div>
          </div>
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bấm vào từng thẻ chữ Hán để nghe phát âm bản xứ</span>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mindmap.branches.map((branch, idx) => {
          const theme = BRANCH_COLORS[branch.color];
          return (
            <div
              key={branch.id}
              className={`rounded-2xl border p-4 space-y-3 ${theme.card}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-extrabold ${theme.header}`}>
                  Nhánh {idx + 1}: {branch.title}
                </span>
                <span className="text-[11px] font-bold text-slate-500">{branch.items.length} nút</span>
              </div>

              <div className="space-y-2">
                {branch.items.map((node, nIdx) => {
                  const isPlaying = speakingText === node.hanzi;
                  return (
                    <button
                      key={nIdx}
                      type="button"
                      onClick={() => handleSpeak(node.hanzi)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${theme.pill} ${
                        isPlaying ? 'ring-2 ring-emerald-500 shadow-sm' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-chinese text-base font-extrabold">{node.hanzi}</span>
                          <span className="text-xs font-mono font-bold text-emerald-700">
                            {node.pinyin}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">{node.meaningVi}</div>
                      </div>
                      <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-emerald-700">
                        <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
