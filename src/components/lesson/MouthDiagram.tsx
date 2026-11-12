'use client';

import React from 'react';
import { Wind, Info } from 'lucide-react';

export type ArticulationZone =
  | 'bilabial' // b, p, m
  | 'labiodental' // f
  | 'alveolar' // d, t, n, l
  | 'velar' // g, k, h
  | 'palatal' // j, q, x
  | 'retroflex' // zh, ch, sh, r
  | 'dental_sibilant'; // z, c, s

interface MouthDiagramProps {
  zone: ArticulationZone;
  phoneme: string;
  vietnameseGuide?: string;
  mouthTip?: string;
  className?: string;
}

const ZONE_DESCRIPTIONS: Record<
  ArticulationZone,
  { nameVi: string; focusArea: string; airflowTip: string; color: string }
> = {
  bilabial: {
    nameVi: 'Âm Hai Môi (b, p, m)',
    focusArea: 'Hai môi khép chặt chặn luồng hơi rồi mở nhanh.',
    airflowTip: 'Âm "b" không bật hơi, âm "p" bật hơi mạnh đẩy luồng khí ra.',
    color: '#10b981', // emerald
  },
  labiodental: {
    nameVi: 'Âm Răng Môi (f)',
    focusArea: 'Răng cửa trên tiếp xúc nhẹ với viền môi dưới.',
    airflowTip: 'Luồng hơi ma sát thoát ra qua khe hở giữa răng và môi.',
    color: '#06b6d4', // cyan
  },
  alveolar: {
    nameVi: 'Âm Đầu Lưỡi Giữa (d, t, n, l)',
    focusArea: 'Đầu lưỡi áp chặt vào chân răng trên (lợi trên).',
    airflowTip: 'Đầu lưỡi hạ xuống đột ngột để luồng khí thoát ra (t: bật hơi).',
    color: '#3b82f6', // blue
  },
  velar: {
    nameVi: 'Âm Cuống Lưỡi (g, k, h)',
    focusArea: 'Phần cuống lưỡi (sau) nâng lên áp sát ngạc mềm.',
    airflowTip: 'Ngăn luồng khí ở sâu trong họng rồi mở đột ngột (k: bật hơi).',
    color: '#8b5cf6', // purple
  },
  palatal: {
    nameVi: 'Âm Mặt Lưỡi (j, q, x)',
    focusArea: 'Mặt trước của lưỡi nâng cao áp sát vòm ngạc cứng.',
    airflowTip: 'Đầu lưỡi hạ thấp áp vào chân răng dưới, luồng khí cọ xát thoát ra.',
    color: '#ec4899', // pink
  },
  retroflex: {
    nameVi: 'Âm Uốn Lưỡi (zh, ch, sh, r)',
    focusArea: 'Đầu lưỡi uốn cong ngược lên hướng về vòm ngạc cứng.',
    airflowTip: 'Khẩu hình tròn nhẹ, không để đầu lưỡi chạm vào ngạc.',
    color: '#f59e0b', // amber
  },
  dental_sibilant: {
    nameVi: 'Âm Đầu Lưỡi Trước (z, c, s)',
    focusArea: 'Đầu lưỡi vươn thẳng chạm mặt sau của răng cửa trên.',
    airflowTip: 'Lưỡi phẳng, luồng khí ma sát qua khe răng (c: bật hơi mạnh).',
    color: '#f97316', // orange
  },
};

export function MouthDiagram({
  zone,
  phoneme,
  vietnameseGuide,
  mouthTip,
  className = '',
}: MouthDiagramProps) {
  const info = ZONE_DESCRIPTIONS[zone] || ZONE_DESCRIPTIONS.bilabial;

  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-4 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: info.color }}
          />
          <span className="text-xs font-bold text-gray-900">{info.nameVi}</span>
        </div>
        <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-gray-100 text-gray-800">
          /{phoneme}/
        </span>
      </div>

      {/* SVG Sơ đồ mặt cắt thanh quản và vòm miệng */}
      <div className="relative w-full h-44 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 240 160" className="w-full h-full max-w-[240px]">
          {/* Background Head Profile Contour */}
          <path
            d="M 40 20 C 70 15, 140 15, 170 30 C 190 40, 200 65, 195 90 C 190 120, 160 145, 130 150"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Hard Palate (Ngạc cứng - vòm trên) */}
          <path
            d="M 70 65 C 100 50, 140 50, 170 70"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="110" y="45" fill="#64748b" fontSize="8" fontWeight="bold">
            Ngạc cứng (Vòm trên)
          </text>

          {/* Upper Teeth & Lip */}
          <path
            d="M 68 65 L 65 78 C 60 76, 50 78, 45 80"
            fill="none"
            stroke="#64748b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Lower Lip & Teeth */}
          <path
            d="M 45 105 C 55 105, 62 100, 68 95"
            fill="none"
            stroke="#64748b"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* DYNAMIC TONGUE (Lưỡi biến đổi theo từng nhóm âm) */}
          {zone === 'bilabial' && (
            <>
              {/* Lips pressed tight */}
              <circle cx="50" cy="85" r="7" fill={info.color} opacity="0.8" />
              <path
                d="M 75 110 C 90 95, 130 95, 160 110"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </>
          )}

          {zone === 'labiodental' && (
            <>
              {/* Upper teeth to lower lip */}
              <circle cx="60" cy="88" r="6" fill={info.color} opacity="0.8" />
              <path
                d="M 75 110 C 95 100, 130 98, 160 110"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="6"
              />
            </>
          )}

          {zone === 'alveolar' && (
            <>
              {/* Tongue tip touching upper alveolar ridge */}
              <circle cx="75" cy="65" r="7" fill={info.color} opacity="0.8" />
              <path
                d="M 75 68 C 85 90, 120 100, 160 110"
                fill="none"
                stroke={info.color}
                strokeWidth="5"
                strokeLinecap="round"
              />
            </>
          )}

          {zone === 'retroflex' && (
            <>
              {/* Tongue curled backward towards roof */}
              <path
                d="M 105 60 C 95 62, 85 75, 95 90 C 110 100, 135 105, 160 110"
                fill="none"
                stroke={info.color}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="62" r="7" fill={info.color} opacity="0.8" />
            </>
          )}

          {zone === 'palatal' && (
            <>
              {/* Body of tongue raised against hard palate */}
              <path
                d="M 72 90 C 95 65, 130 65, 160 110"
                fill="none"
                stroke={info.color}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="115" cy="65" r="8" fill={info.color} opacity="0.8" />
            </>
          )}

          {zone === 'velar' && (
            <>
              {/* Back of tongue raised towards soft palate */}
              <path
                d="M 72 105 C 100 100, 140 68, 160 110"
                fill="none"
                stroke={info.color}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="145" cy="72" r="8" fill={info.color} opacity="0.8" />
            </>
          )}

          {zone === 'dental_sibilant' && (
            <>
              {/* Tongue flat and forward near front teeth */}
              <path
                d="M 68 80 C 85 85, 120 95, 160 110"
                fill="none"
                stroke={info.color}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="68" cy="80" r="6" fill={info.color} opacity="0.8" />
            </>
          )}

          {/* Airflow Arrow Indicator */}
          <path
            d="M 140 120 C 120 100, 90 90, 50 85"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        </svg>

        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <Wind className="w-3 h-3 text-amber-600" />
          <span>Luồng khí phát âm</span>
        </div>
      </div>

      {/* Guidance Notes */}
      <div className="mt-3 space-y-1.5 text-xs">
        <p className="text-gray-700 font-medium">
          <strong className="text-gray-900">Khẩu hình: </strong>
          {mouthTip || info.focusArea}
        </p>
        <p className="text-emerald-700 font-semibold">
          <strong className="text-emerald-800">Mẹo âm thanh: </strong>
          {vietnameseGuide || info.airflowTip}
        </p>
      </div>
    </div>
  );
}
