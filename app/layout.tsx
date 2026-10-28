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
      <body className="min-h-full bg-[#F5F5F7] text-slate-900 text-base flex flex-col font-sans antialiased selection:bg-blue-500/15 selection:text-blue-700" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
