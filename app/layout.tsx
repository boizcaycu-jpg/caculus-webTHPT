import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PARABOL KHẢO THÍ | Hệ Thống Luyện Đề Toán 12 & Tốt Nghiệp THPT Chuẩn GDPT 2018",
  description: "Nền tảng khảo thí và luyện đề Toán 12 trực tuyến PARABOL KHẢO THÍ. Lộ trình 40 chuyên đề & đề thi Giữa kì, Học kì, Tốt nghiệp THPT tích hợp AI giải chi tiết.",
  icons: {
    icon: "/logo-parabol-icon.png",
    apple: "/logo-parabol-icon.png",
  },
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
