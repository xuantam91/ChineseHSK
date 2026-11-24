import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Chinese Learning Journey — HSK 1-9',
    short_name: 'Chinese HSK',
    description:
      'Ứng dụng tự học tiếng Trung HSK 1-9: 120 bài học bài bản, phát âm 4 giọng bản xứ, chấm mic AI và kho tài liệu chuẩn BLCUP.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#f8fafc',
    theme_color: '#047857',
    lang: 'vi',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Vào học hôm nay',
        short_name: 'Học ngay',
        description: 'Mở bài học hôm nay và theo dõi chuỗi ngày học',
        url: '/dashboard',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Lộ trình 120 bài HSK',
        short_name: 'Lộ trình',
        description: 'Xem lộ trình học HSK 1-6 chi tiết',
        url: '/roadmap',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Thư viện tài liệu',
        short_name: 'Thư viện',
        description: 'Mở kho sách PDF, audio và video',
        url: '/library',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
