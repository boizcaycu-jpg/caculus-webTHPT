'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function ExamPreparationPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params?.examId as string;

  const [exam, setExam] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        } else if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('caculus_user');
          if (stored) setUser(JSON.parse(stored));
        }
      })
      .catch(() => {});

    fetch('/api/student/exams')
      .then(res => res.json())
      .then(data => {
        const found = (data.exams || []).find((e: any) => e.id === examId);
        if (found) setExam(found);
      })
      .catch(() => {});
  }, [examId]);

  const handleStart = () => {
    router.push(`/exams/${examId}/room`);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const maxDrag = rect.width - 68;
    const offset = Math.max(0, Math.min(clientX - rect.left - 34, maxDrag));
    setSliderPosition(offset);

    if (offset >= maxDrag * 0.88) {
      setIsDragging(false);
      setSliderPosition(maxDrag);
      handleStart();
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (sliderTrackRef.current) {
      const maxDrag = sliderTrackRef.current.getBoundingClientRect().width - 68;
      if (sliderPosition < maxDrag * 0.88) {
        setSliderPosition(0);
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-100 flex flex-col font-sans select-none"
      onMouseMove={handleTouchMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Top Banner Tiêu chuẩn Bộ GD&ĐT theo Ảnh 2 */}
      <div className="bg-[#0052cc] text-white py-4 px-6 sm:px-12 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-xl sm:text-3xl font-black tracking-wide uppercase">
            GIAO DIỆN THI TRÊN MÁY TÍNH
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-blue-100 uppercase tracking-widest mt-0.5">
            GIAO DIỆN THÍ SINH SAU KHI CHỌN BÀI THI
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs font-bold tracking-wider uppercase block text-blue-200">
            KHẢO THÍ THPT TRỰC TUYẾN
          </span>
          <span className="text-[11px] font-mono text-white/80">CACULUS ONLINE TEST</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center space-y-8">
        <h2 className="text-2xl sm:text-3xl font-black text-[#0039a6] text-center uppercase tracking-wide">
          BÀI THI MÔ PHỎNG TN THPTQG 2026 - MÔN TOÁN
        </h2>

        {/* 2 Khung Thông tin theo Ảnh 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Thông tin Thí sinh */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-black text-slate-900 text-sm tracking-wider uppercase border-b border-slate-100 pb-2">
              THÔNG TIN THÍ SINH
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">HỌ TÊN:</span>
                <span className="font-black text-slate-900">{user?.name || user?.realName || 'Thí sinh THPTQG'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">USERNAME / SBD:</span>
                <span className="font-mono font-black text-[#0052cc]">{user?.studentId || user?.email || 'THPTQG_2026_01'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Thông tin Bài thi */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-black text-slate-900 text-sm tracking-wider uppercase border-b border-slate-100 pb-2">
              THÔNG TIN BÀI THI
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">TÊN BÀI THI:</span>
                <span className="font-bold text-slate-900 text-right line-clamp-1">{exam?.title || 'Đề thi thử THPTQG Môn Toán'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">ID:</span>
                <span className="font-mono text-slate-700 font-semibold">{exam?.id || examId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">SỐ LƯỢNG CÂU HỎI:</span>
                <span className="font-black text-slate-900">22 câu (3 Phần)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">THỜI GIAN:</span>
                <span className="font-black text-rose-600">90 phút</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thanh Trượt "KÉO SANG ĐỂ THAM GIA BÀI THI" theo Ảnh 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-center font-black text-slate-900 text-base uppercase tracking-wider">
            KÉO SANG ĐỂ THAM GIA BÀI THI
          </h3>

          <div
            ref={sliderTrackRef}
            className="relative h-18 bg-gradient-to-r from-blue-100 via-blue-300 to-[#0052cc] rounded-2xl overflow-hidden border-2 border-blue-300 shadow-inner flex items-center"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs sm:text-sm font-black text-white uppercase tracking-widest animate-pulse opacity-90 drop-shadow-md">
                Kéo thanh trượt sang phải để vào thi →
              </span>
            </div>

            <div
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              style={{ transform: `translateX(${sliderPosition}px)` }}
              className="absolute left-1.5 top-1.5 bottom-1.5 w-16 bg-white hover:bg-slate-50 border-2 border-slate-800 rounded-xl shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75 z-10"
            >
              <ChevronRight className="w-9 h-9 text-slate-900 stroke-[3]" />
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
