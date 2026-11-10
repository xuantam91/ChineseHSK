'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MediaBlockData } from '@/types';
import { Play, Pause, RotateCcw, ExternalLink, Volume2, FastForward } from 'lucide-react';
import { sanitizeDriveUrl } from '@/lib/drive';
import { Button } from '@/components/ui/Button';

export interface MediaBlockProps {
  data: MediaBlockData;
}

export function MediaBlock({ data }: MediaBlockProps) {
  const isVideo = data.mediaType === 'video';
  const driveInfo = sanitizeDriveUrl(data.driveUrl);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(data.durationSeconds || 180);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Fallback or simulation if mock url cannot be decoded by browser
        simulatePlayback();
      });
    }
    setIsPlaying(!isPlaying);
  };

  const simulatePlayback = () => {
    // If browser cannot load synthetic mock drive audio in offline/mock mode, simulate progress smoothly
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / playbackRate);
  };

  const changeRate = () => {
    const rates = [0.8, 1.0, 1.25];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">{data.title}</h3>
          {data.description && (
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">{data.description}</p>
          )}
        </div>
        <a
          href={driveInfo.viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 transition-colors w-fit"
        >
          <span>Mở trong Google Drive</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {isVideo ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 shadow-inner">
          {driveInfo.embedUrl ? (
            <iframe
              src={driveInfo.embedUrl}
              className="h-full w-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={data.title}
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-300">
              <Play className="w-12 h-12 text-emerald-500 mb-3" />
              <p className="text-sm font-medium mb-3">Xem video bài giảng trên Google Drive</p>
              <a
                href={driveInfo.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700"
              >
                Mở video trực tiếp
              </a>
            </div>
          )}
        </div>
      ) : (
        /* Custom Audio Player */
        <div className="rounded-xl bg-gray-50 border border-gray-200/80 p-4">
          <audio
            ref={audioRef}
            src={driveInfo.downloadUrl || undefined}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || duration)}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-700/20 hover:bg-emerald-700 active:scale-95 transition-all"
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát audio'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentTime(val);
                  if (audioRef.current) {
                    audioRef.current.currentTime = val;
                  }
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={restart}
                title="Nghe lại từ đầu"
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 transition-colors"
                aria-label="Nghe lại"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={changeRate}
                title="Tốc độ phát"
                className="px-2.5 py-1 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                {playbackRate}x
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
