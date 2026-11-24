// Service Worker for Chinese Learning Journey PWA installability (Mac, Windows, Mobile)
const SW_VERSION = 'chinese-hsk-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Network-first pass-through so Next.js routes, Supabase Auth & lessons stay fresh
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(SW_VERSION);
      const cached = await cache.match(event.request);
      return cached || Response.error();
    })
  );
});
