'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import {
  FileText,
  Download,
  Users,
  ExternalLink,
  Sparkles,
  MessageCircle,
  PlaySquare,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function DocumentsPage() {
  const documents = [
    {
      id: 'doc-thptqg-1',
      title: 'Bộ 10 Đề Thi Minh Họa TN THPT Quốc Gia Môn Toán 2027 (Có Đáp Án & Lời Giải Chi Tiết)',
      category: 'Đề Thi Thử THPTQG',
      fileSize: '5.6 MB',
      updatedAt: '01/06/2026',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'doc-thptqg-2',
      title: 'Sổ Tay Công Thức Toán 12 Trọng Tâm Thi THPTQG (Hàm Số, Mũ-Logarit, Tích Phân, Oxyz)',
      category: 'Công Thức Toán 12',
      fileSize: '3.4 MB',
      updatedAt: '10/06/2026',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'doc-thptqg-3',
      title: 'Chuyên Đề Tổng Ôn 8+ & 9+ Môn Toán THPTQG (Tuyển Tập Dạng Bài Vận Dụng Cao)',
      category: 'Tổng Ôn 9+',
      fileSize: '7.2 MB',
      updatedAt: '15/06/2026',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'doc-thptqg-4',
      title: 'Phương Pháp Giải Nhanh Câu Hỏi Trắc Nghiệm Đúng/Sai & Trả Lời Ngắn Môn Toán 2027',
      category: 'Phương Pháp Giải',
      fileSize: '4.1 MB',
      updatedAt: '20/06/2026',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const handleDownload = (title: string) => {
    alert(`Đang bắt đầu tải tài liệu PDF: "${title}"`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.12),transparent)] flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-500/15 selection:text-blue-700">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Glass Banner */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-white/75 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Kho Học Liệu Số • Môn Toán 12</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-600" />
            <span>Tài Liệu Toán 12 & Đề Thi Chuẩn Bộ GD&ĐT</span>
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
            Tải miễn phí các bộ tài liệu tuyển chọn, chuyên đề 8+, sổ tay công thức cốt lõi và tuyển tập đề thi thử bám sát cấu trúc đề tốt nghiệp THPT Quốc Gia mới nhất.
          </p>
        </div>

        {/* 2 Apple Spatial Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: YouTube Video Lectures */}
          <div className="rounded-[24px] p-6 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white shadow-[0_12px_36px_rgba(30,58,138,0.25)] flex flex-col justify-between space-y-5 relative overflow-hidden">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-bold tracking-wide">
                <PlaySquare className="w-3.5 h-3.5 text-blue-200" />
                <span>BÀI GIẢNG VIDEO CHỮA ĐỀ CHI TIẾT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                Kênh Bài Giảng Giải Đề THPTQG
              </h2>
              <p className="text-xs text-blue-100 leading-relaxed opacity-90">
                Tổng hợp video chữa chi tiết các đề thi thử Toán 12, phân tích bẫy đề thi và phương pháp giải nhanh Trắc nghiệm Đúng/Sai & Điền số chuẩn cấu trúc 2027.
              </p>
            </div>

            <a
              href="https://www.youtube.com/@siiuuuu77777"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 text-blue-700 font-semibold text-xs px-5 py-2.5 transition-all shadow-sm active:scale-95 w-fit"
            >
              <span>Xem Kênh YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Zalo Study Support Community */}
          <div className="rounded-[24px] p-6 bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-800 text-white shadow-[0_12px_36px_rgba(37,99,235,0.25)] flex flex-col justify-between space-y-5 relative overflow-hidden">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-bold tracking-wide">
                <Users className="w-3.5 h-3.5 text-sky-200" />
                <span>CỘNG ĐỒNG HỌC TẬP TOÁN 12</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                Cộng Đồng Hỏi Đáp & Trao Đổi Bài Tập
              </h2>
              <p className="text-xs text-blue-100 leading-relaxed opacity-90">
                Tham gia nhóm Zalo để trao đổi giải bài tập khó hàng ngày, nhận tài liệu tổng ôn vận dụng cao và giải đáp thắc mắc trực tiếp cùng thầy cô và bạn học.
              </p>
            </div>

            <a
              href="https://zalo.me/g/mw6rrjaosw86oamzaxy1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 text-indigo-700 font-semibold text-xs px-5 py-2.5 transition-all shadow-sm active:scale-95 w-fit"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Tham gia Nhóm Zalo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* PDF Downloads Section */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-white/75 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Danh Sách Tài Liệu PDF Miễn Phí</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Cập nhật định kỳ 2026-2027</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-[20px] p-5 bg-white/90 border border-white/90 ring-1 ring-slate-900/[0.04] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${doc.badgeColor}`}
                  >
                    {doc.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span>Dung lượng: <strong className="text-slate-700">{doc.fileSize}</strong></span>
                    <span>•</span>
                    <span>Cập nhật: {doc.updatedAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(doc.title)}
                  className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 transition-all active:scale-95 shadow-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải tài liệu PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
