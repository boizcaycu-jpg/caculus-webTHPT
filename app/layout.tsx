import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phòng Luyện THPTQG - CACULUS",
  description: "Phòng Luyện Thi Tốt Nghiệp THPT Quốc Gia Môn Toán - Hệ Thống Khảo Thí Trực Tuyến CACULUS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 text-base min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
