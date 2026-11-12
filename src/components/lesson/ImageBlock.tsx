'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, Info, ExternalLink } from 'lucide-react';
import { ImagePayload } from '@/types/database';

export interface ImageBlockProps {
  data: ImagePayload | {
    url?: string;
    caption?: string;
    altText?: string;
    promptReference?: string;
  };
}

export function ImageBlock({ data }: ImageBlockProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const url = data.url;
  const caption = data.caption;
  const altText = (data as any).altText || (data as any).alt_text || caption || 'Hình ảnh bài học';
  const promptRef = (data as any).promptReference;

  if (!url || imageError) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-2">
          <ImageIcon className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-gray-700">Hình ảnh minh họa chủ đề bài học</p>
        {caption && <p className="text-[11px] text-gray-500 mt-0.5">{caption}</p>}
        {promptRef && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Info className="w-3 h-3 text-emerald-600" />
            <span>Prompt: {promptRef}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
        <img
          src={String(url)}
          alt={altText}
          onError={() => setImageError(true)}
          className={`w-full object-cover max-h-[420px] transition-transform duration-300 ${
            isZoomed ? 'scale-105' : 'group-hover:scale-[1.02]'
          }`}
        />
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          title="Thu phóng ảnh"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {caption && (
        <p className="text-xs text-center text-gray-500 font-medium italic">
          {caption}
        </p>
      )}
    </div>
  );
}
