import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWAInstallManager } from "@/components/common/PWAInstallManager";

export const metadata: Metadata = {
  metadataBase: new URL("https://hsk.globy.tech"),
  title: "GLOBY Chinese – Học tiếng Trung thông minh",
  description:
    "GLOBY Chinese – Học tiếng Trung thông minh với lộ trình tham chiếu HSK 1–6, Hán tự, Pinyin, nghe – nói – đọc – viết, flashcards và tiến độ học rõ ràng.",
  applicationName: "GLOBY Chinese",
  alternates: {
    canonical: "https://hsk.globy.tech/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GLOBY Chinese",
  },
  openGraph: {
    type: "website",
    siteName: "GLOBY Chinese",
    title: "GLOBY Chinese | Học tiếng Trung thông minh",
    description:
      "Học tiếng Trung từng ngày với lộ trình rõ ràng, bài học sinh động, Hán tự & Pinyin và 4 kỹ năng.",
    url: "https://hsk.globy.tech/",
    images: [
      {
        url: "/assets/og-globy-chinese.png",
        width: 1200,
        height: 630,
        alt: "GLOBY Chinese – Học tiếng Trung thông minh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GLOBY Chinese | Học tiếng Trung thông minh",
    description:
      "Học tiếng Trung từng ngày với lộ trình rõ ràng, bài học sinh động, Hán tự & Pinyin và 4 kỹ năng.",
    images: ["/assets/og-globy-chinese.png"],
  },
  icons: {
    icon: [
      { url: "/assets/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/favicon.ico", sizes: "any" },
      { url: "/assets/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/assets/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/assets/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
        <PWAInstallManager />
      </body>
    </html>
  );
}
