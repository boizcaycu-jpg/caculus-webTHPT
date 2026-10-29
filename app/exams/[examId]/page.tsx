'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ExamPreparationPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params?.examId as string;

  const [exam, setExam] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('parabol_user') || localStorage.getItem('caculus_user');
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              // Ignore invalid local storage json
            }
          }
        }
      })
      .catch(() => {});

    fetch('/api/student/exams')
      .then((res) => res.json())
      .then((data) => {
        const found = (data.exams || []).find((e: any) => e.id === examId);
        if (found) setExam(found);
      })
      .catch(() => {});
  }, [examId]);

  const handleStart = useCallback(() => {
    if (isStarting) return;
    setIsStarting(true);
    router.push(`/exams/${examId}/room`);
  }, [examId, isStarting, router]);

  const updateSlider = (clientX: number) => {
    if (!sliderTrackRef.current || isStarting) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const thumbWidth = 44;
    const padding = 6;
    const maxDrag = Math.max(0, rect.width - thumbWidth - padding * 2);
    const currentX = clientX - rect.left - padding - thumbWidth / 2;
    const offset = Math.max(0, Math.min(currentX, maxDrag));
    setSliderPosition(offset);

    if (maxDrag > 0 && offset >= maxDrag * 0.75) {
      setIsDragging(false);
      setSliderPosition(maxDrag);
      handleStart();
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || isStarting) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    updateSlider(clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging || isStarting) return;
    setIsDragging(false);
    if (sliderTrackRef.current) {
      const rect = sliderTrackRef.current.getBoundingClientRect();
      const maxDrag = Math.max(0, rect.width - 44 - 12);
      if (sliderPosition < maxDrag * 0.75) {
        setSliderPosition(0);
      }
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isStarting || !sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const maxDrag = Math.max(0, rect.width - 44 - 12);

    // If clicked past the middle or right half, trigger start smoothly
    if (clickX > rect.width * 0.5) {
      setSliderPosition(maxDrag);
      handleStart();
    }
  };

  const studentName = user?.realName || user?.name || user?.fullName || 'Thí sinh THPTQG';
  const rawSbd = user?.studentId || user?.username || user?.email || 'PARABOL_2027';
  const studentSbd = rawSbd.replace(/^CACULUS_/i, 'PARABOL_').replace(/^THPTQG_/i, 'PARABOL_');
  const examTitle = exam?.title || 'Đề Thi Mô Phỏng Tốt Nghiệp THPTQG 2027 - Môn Toán';
  const duration = exam?.durationMinutes || 90;
  const questionCount = exam?.questions?.length || 22;

  return (
    <div
      className="min-h-screen bg-[#F5F5F7] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(37,99,235,0.10),transparent)] flex flex-col justify-between p-4 md:p-8 antialiased select-none"
      onMouseMove={handleTouchMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* 1. Minimal Top Glass Bar */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/70 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Tổng quan</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 text-xs font-medium text-emerald-700 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Hệ thống Khảo thí Sẵn sàng</span>
        </div>
      </header>

      {/* 2. Main Centerpiece: The Liquid Glass Exam Card */}
      <main className="max-w-2xl w-full mx-auto my-auto py-6">
        <div className="rounded-[32px] bg-white/80 backdrop-blur-2xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-[0_20px_60px_rgb(15,23,42,0.07)] p-6 md:p-10 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-3">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>PARABOL KHẢO THÍ • MÔN TOÁN 12</span>
          </div>

          {/* Exam Title (Full-width, centered, zero awkward truncation) */}
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 text-center leading-snug">
            {examTitle}
          </h1>

          {/* Candidate & Exam Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 text-left">
            {/* Box 1: Thí sinh */}
            <div className="rounded-[20px] bg-slate-900/[0.025] border border-slate-200/60 p-4 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">THÍ SINH</span>
              <div className="mt-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{studentName}</p>
                <p className="text-xs text-blue-600 font-medium tabular-nums truncate mt-0.5">SBD: {studentSbd}</p>
              </div>
            </div>

            {/* Box 2: Thời gian làm bài */}
            <div className="rounded-[20px] bg-slate-900/[0.025] border border-slate-200/60 p-4 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">THỜI GIAN</span>
              <div className="mt-1">
                <p className="text-base font-bold text-slate-900 tabular-nums">{duration} phút</p>
                <p className="text-xs text-slate-500 mt-0.5">Đếm ngược tự động</p>
              </div>
            </div>

            {/* Box 3: Cấu trúc đề */}
            <div className="rounded-[20px] bg-slate-900/[0.025] border border-slate-200/60 p-4 col-span-2 sm:col-span-1 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">CẤU TRÚC ĐỀ</span>
              <div className="mt-1">
                <p className="text-base font-bold text-slate-900 tabular-nums">{questionCount} câu hỏi</p>
                <p className="text-xs text-slate-500 mt-0.5">Chuẩn GDPT 2018</p>
              </div>
            </div>
          </div>

          {/* 3-Part Exam Structure Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-8">
            <div className="rounded-2xl bg-white/90 border border-slate-200/60 p-3.5 text-left shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Phần I: 12 câu</span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">3.0 điểm</span>
              </div>
              <p className="text-[11px] font-medium text-slate-600">Trắc nghiệm 4 lựa chọn</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Chọn 1 phương án đúng A, B, C, D</p>
            </div>

            <div className="rounded-2xl bg-white/90 border border-slate-200/60 p-3.5 text-left shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Phần II: 4 câu</span>
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">4.0 điểm</span>
              </div>
              <p className="text-[11px] font-medium text-slate-600">Trắc nghiệm Đúng / Sai</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Mỗi câu gồm 4 ý a), b), c), d)</p>
            </div>

            <div className="rounded-2xl bg-white/90 border border-slate-200/60 p-3.5 text-left shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Phần III: 6 câu</span>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">3.0 điểm</span>
              </div>
              <p className="text-[11px] font-medium text-slate-600">Trả lời ngắn (Điền số)</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Điền số nguyên hoặc số thập phân</p>
            </div>
          </div>

          {/* 3. Authentic iOS "Slide to Start Exam" Capsule */}
          <div className="max-w-md mx-auto w-full">
            <div
              ref={sliderTrackRef}
              onClick={handleTrackClick}
              className="relative h-14 w-full rounded-full bg-slate-900/[0.06] backdrop-blur-md border border-slate-300/60 p-1.5 shadow-inner overflow-hidden select-none flex items-center cursor-pointer transition-colors"
            >
              {/* Progress Fill tracking the thumb */}
              <div
                style={{ width: `${sliderPosition + 44}px` }}
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-[width] duration-75 pointer-events-none opacity-90"
              />

              {/* Center Track Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-12">
                <span
                  style={{
                    opacity: Math.max(0, 1 - sliderPosition / 140),
                  }}
                  className="text-xs font-semibold tracking-wide text-slate-600 transition-opacity"
                >
                  {isStarting ? 'Đang mở phòng thi...' : 'Kéo sang phải để bắt đầu tính giờ →'}
                </span>
              </div>

              {/* Draggable Thumb Button */}
              <div
                onMouseDown={() => !isStarting && setIsDragging(true)}
                onTouchStart={() => !isStarting && setIsDragging(true)}
                style={{
                  transform: `translateX(${sliderPosition}px)`,
                  transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="relative h-11 w-11 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.04] flex items-center justify-center text-blue-600 cursor-grab active:cursor-grabbing active:scale-95 z-10 select-none"
              >
                {isStarting ? (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                )}
              </div>
            </div>

            {/* Subtle Anti-cheat & Security Guidance */}
            <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Hệ thống tự động lưu bài làm và chống gian lận trong thời gian thi</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="max-w-3xl w-full mx-auto py-3 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
        <span>PARABOL KHẢO THÍ 2027 • Hệ Thống Khảo Thí Trực Tuyến</span>
      </footer>
    </div>
  );
}
