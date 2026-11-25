'use client';

import React, { useEffect, useState } from 'react';
import { Download, MonitorSmartphone, X, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_STORAGE_KEY = 'chinesehsk_pwa_banner_dismissed_v1';

export function triggerInstallPromptModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chinesehsk:request-install'));
  }
}

export function PWAInstallManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showFloatingPrompt, setShowFloatingPrompt] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platformHint, setPlatformHint] = useState<'ios' | 'mac_safari' | 'desktop_chromium' | 'other'>('desktop_chromium');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect if already running as installed standalone app / Mac desktop wrapper
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // Detect platform hint for fallback instructions (Safari Mac / iOS)
    const ua = window.navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|Firefox|OPR/i.test(ua);
    const isMac = /Macintosh|Mac OS X/i.test(ua);

    if (isIOS) {
      setPlatformHint('ios');
    } else if (isMac && isSafari) {
      setPlatformHint('mac_safari');
    } else if (/Chrome|Chromium|Edg/i.test(ua)) {
      setPlatformHint('desktop_chromium');
    } else {
      setPlatformHint('other');
    }

    // Register Service Worker so Chrome/Edge unlock the address-bar Install icon
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = sessionStorage.getItem(DISMISS_STORAGE_KEY) === '1';
      if (!dismissed) {
        setShowFloatingPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowFloatingPrompt(false);
      setShowGuideModal(false);
    };

    const handleCustomRequest = async () => {
      if (deferredPrompt) {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setShowFloatingPrompt(false);
          setDeferredPrompt(null);
        }
      } else {
        setShowGuideModal(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('chinesehsk:request-install', handleCustomRequest);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('chinesehsk:request-install', handleCustomRequest);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowFloatingPrompt(false);
        setDeferredPrompt(null);
      }
      return;
    }
    setShowGuideModal(true);
  };

  const handleDismiss = () => {
    setShowFloatingPrompt(false);
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, '1');
    } catch {
      // ignore storage errors
    }
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Subtle bottom-right install shortcut toast when browser reports installable */}
      {showFloatingPrompt && (
        <div
          role="dialog"
          aria-label="Cài đặt shortcut ứng dụng"
          className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm rounded-2xl border border-emerald-200 bg-white/95 backdrop-blur-md p-3.5 shadow-xl shadow-slate-900/10 flex items-center gap-3"
        >
          <img
            src="/assets/app-icon.svg"
            alt="GLOBY Chinese"
            width={40}
            height={40}
            className="w-10 h-auto block shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-extrabold text-slate-900 truncate">
              Cài shortcut GLOBY Chinese
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              Mở nhanh như app riêng trên Mac & Windows
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cài đặt</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Đóng thông báo cài đặt"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cross-platform fallback guide modal (Safari Mac, iOS, Edge/Chrome) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/app-icon.svg"
                  alt="GLOBY Chinese"
                  width={40}
                  height={40}
                  className="w-10 h-auto block shrink-0"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Cài Shortcut về máy tính / điện thoại
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mở ứng dụng độc lập ngoài màn hình chính không cần mở tab trình duyệt
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              {platformHint === 'ios' ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="font-bold text-emerald-900">Trên iPhone / iPad (Safari):</div>
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li className="flex items-center gap-1.5 flex-wrap">
                      Bấm nút <Share className="w-3.5 h-3.5 text-emerald-700 inline" /> <strong>Chia sẻ (Share)</strong> ở thanh dưới Safari.
                    </li>
                    <li className="flex items-center gap-1.5 flex-wrap">
                      Chọn <PlusSquare className="w-3.5 h-3.5 text-emerald-700 inline" /> <strong>Thêm vào MH chính (Add to Home Screen)</strong> → <strong>Thêm</strong>.
                    </li>
                  </ol>
                </div>
              ) : platformHint === 'mac_safari' ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="font-bold text-emerald-900">Trên MacBook (Safari):</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Trên thanh menu Safari phía trên màn hình, chọn <strong>Tệp (File) → Thêm vào Dock (Add to Dock...)</strong>.</li>
                    <li>Bấm <strong>Thêm (Add)</strong> để ghim icon app vào thanh Dock Mac.</li>
                  </ol>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="font-bold text-emerald-900">Trên Chrome / Edge (Windows & Mac):</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Nhìn góc phải thanh địa chỉ URL, bấm biểu tượng <strong>Install (Cài đặt)</strong> giống ứng dụng Facebook.</li>
                    <li>Hoặc bấm menu <code>⋮</code> (góc trên phải) → <strong>Cast, save, and share / Apps → Install GLOBY Chinese</strong>.</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
