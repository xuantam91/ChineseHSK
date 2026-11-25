import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'GLOBY Chinese',
    short_name: 'GLOBY Chinese',
    description: 'Học tiếng Trung thông minh',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#FFFFFF',
    theme_color: '#047857',
    lang: 'vi',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/assets/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/assets/app-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Vào học hôm nay',
        short_name: 'Học ngay',
        description: 'Mở bài học hôm nay và theo dõi chuỗi ngày học',
        url: '/dashboard',
        icons: [{ src: '/assets/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Lộ trình 120 bài HSK',
        short_name: 'Lộ trình',
        description: 'Xem lộ trình học HSK 1-6 chi tiết',
        url: '/roadmap',
        icons: [{ src: '/assets/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Thư viện tài liệu',
        short_name: 'Thư viện',
        description: 'Mở kho sách PDF, audio và video',
        url: '/library',
        icons: [{ src: '/assets/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
