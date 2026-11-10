import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chinese Learning Journey — Lộ trình tự học tiếng Trung 12 tháng",
  description: "Webapp LMS tự học tiếng Trung theo lộ trình 12 tháng bài bản, mở bài hằng ngày, tài nguyên Google Drive và bài kiểm tra tương tác.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#fdfbf7] text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
