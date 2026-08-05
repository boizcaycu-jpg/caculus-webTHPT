'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { FileText, Download, Users, ExternalLink, Sparkles, MessageCircle, PlaySquare, BookOpen } from 'lucide-react';

export default function DocumentsPage() {
  const documents = [
    {
      id: 'doc-thptqg-1',
      title: 'Bộ 10 Đề Thi Minh Họa TN THPT Quốc Gia Môn Toán 2025-2026 (Có Đáp Án & Lời Giải Chi Tiết)',
      category: 'Đề Thi Thử THPTQG',
      fileSize: '5.6 MB',
      updatedAt: '01/06/2026',
      downloadUrl: '#',
    },
    {
      id: 'doc-thptqg-2',
      title: 'Sổ Tay Công Thức Toán 12 Trọng Tâm Thi THPTQG (Hàm Số, Mũ-Logarit, Tích Phân, Oxyz)',
      category: 'Công Thức Toán 12',
      fileSize: '3.4 MB',
      updatedAt: '10/06/2026',
      downloadUrl: '#',
    },
    {
      id: 'doc-thptqg-3',
      title: 'Chuyên Đề Tổng Ôn 8+ & 9+ Môn Toán THPTQG (Tuyển Tập Dạng Bài Vận Dụng Cao)',
      category: 'Tổng Ôn 9+',
      fileSize: '7.2 MB',
      updatedAt: '15/06/2026',
      downloadUrl: '#',
    },
    {
      id: 'doc-thptqg-4',
      title: 'Phương Pháp Giải Nhanh Câu Hỏi Trắc Nghiệm Đúng/Sai & Trả Lời Ngắn Môn Toán',
      category: 'Phương Pháp Giải',
      fileSize: '4.1 MB',
      updatedAt: '20/06/2026',
      downloadUrl: '#',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2 border-l-4 border-l-[#0052cc]">
          <div className="flex items-center gap-2 text-[#0052cc] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Trung tâm tài nguyên học tập CACULUS THPTQG
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#0052cc]" />
            Kho Tài Liệu Toán 12 & Đề Thi Mẫu THPT Quốc Gia
          </h1>
          <p className="text-xs text-slate-500">Tải tài liệu chuyên đề Toán 12 dạng PDF trực tuyến để xem offline và rèn luyện kỹ năng giải toán trắc nghiệm</p>
        </div>

        {/* Channel & Community Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: YouTube Reference Channel */}
          <div className="bg-gradient-to-br from-blue-950 via-[#0052cc] to-blue-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="space-y-3 z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                <PlaySquare className="w-4 h-4 text-blue-200" />
                HỆ THỐNG BÀI GIẢNG VIDEO TOÁN 12
              </div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                Kênh Bài Giảng Chữa Đề THPTQG
              </h2>
              <p className="text-xs text-blue-100 leading-relaxed">
                Tổng hợp video chữa chi tiết đề thi thử THPT Quốc Gia môn Toán, phương pháp giải nhanh Trắc nghiệm Đúng/Sai & Điền số từ thầy cô chuyên môn.
              </p>
            </div>

            <div className="pt-2 z-10">
              <a
                href="https://www.youtube.com/@siiuuuu77777"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-[#0052cc] font-black text-xs px-6 py-3 rounded-2xl transition shadow-md w-full sm:w-auto"
              >
                <PlaySquare className="w-4 h-4 text-[#0052cc]" />
                Ghé thăm Kênh YouTube Official
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* Card 2: Zalo Study Support Community */}
          <div className="bg-gradient-to-br from-sky-900 via-indigo-800 to-blue-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="space-y-3 z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                <Users className="w-4 h-4 text-sky-200" />
                CỘNG ĐỒNG LUYỆN THI TOÁN THPTQG 2K8 - 2K9
              </div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                Cộng đồng hỏi đáp Toán THPTQG
              </h2>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Tham gia nhóm Zalo để giải bài tập Toán hàng ngày, nhận tài liệu tổng ôn vận dụng cao và hỏi đáp bài khó trực tiếp cùng cộng đồng.
              </p>
            </div>

            <div className="pt-2 z-10">
              <a
                href="https://zalo.me/g/mw6rrjaosw86oamzaxy1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-sky-50 text-indigo-900 font-black text-xs px-6 py-3 rounded-2xl transition shadow-md w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 text-sky-600" />
                Tham gia Nhóm Zalo Hỗ Trợ
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>

        </div>

        {/* PDF Downloads Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0052cc]" />
            Danh sách Tài liệu Toán THPTQG Tải về (PDF)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="bg-blue-50 text-[#0052cc] font-extrabold text-[11px] px-3 py-1 rounded-full border border-blue-200 inline-block">
                    {doc.category}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">{doc.title}</h3>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Dung lượng: <strong>{doc.fileSize}</strong></div>
                    <div>Cập nhật ngày: {doc.updatedAt}</div>
                  </div>
                </div>

                <a
                  href={doc.downloadUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Đang tải file PDF Toán 12: ${doc.title}`);
                  }}
                  className="w-full bg-[#0052cc] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" /> Tải tài liệu PDF
                </a>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
