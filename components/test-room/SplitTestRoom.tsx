'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question, ExamModule, UserAnswer } from '@/types';
import MathText from '@/components/ui/MathText';
import {
  Clock,
  Check,
  X,
  Bookmark,
  BookmarkCheck,
  Maximize2,
  Minimize2,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SplitTestRoomProps {
  examId: string;
  module: ExamModule;
  questions: Question[];
  studentName: string;
  studentId: string;
}

export default function SplitTestRoom({
  examId,
  module,
  questions,
  studentName,
  studentId,
}: SplitTestRoomProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [globalSeconds, setGlobalSeconds] = useState((module.durationMinutes || 90) * 60);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modal Kết quả & Chế độ Xem Đáp Án / Lời Giải
  const [showResultModal, setShowResultModal] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ answered: number; total: number; score: number } | null>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const partType = currentQ?.partType || (currentQ?.number <= 12 ? 'part1' : currentQ?.number <= 16 ? 'part2' : 'part3');

  // Đếm ngược 90 phút (dừng khi đã nộp bài)
  useEffect(() => {
    if (isReviewMode) return;
    const timer = setInterval(() => {
      setGlobalSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isReviewMode]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Trắc nghiệm Phần 1
  const handleSelectP1 = (optId: string) => {
    if (isReviewMode) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  // Trắc nghiệm Đúng/Sai Phần 2
  const handleSelectP2 = (statementId: string, value: boolean) => {
    if (isReviewMode) return;
    const curr = userAnswers[currentQ.id] || {};
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { ...curr, [statementId]: value },
    }));
  };

  // Trả lời ngắn Phần 3 (Điền số)
  const handleInputP3 = (val: string) => {
    if (isReviewMode) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  // Bật/tắt cờ đánh dấu
  const toggleFlag = (qId: string) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Đếm số câu đã hoàn thành
  const answeredCount = Object.keys(userAnswers).filter((k) => {
    const v = userAnswers[k];
    if (typeof v === 'object' && v !== null) return Object.keys(v).length > 0;
    return !!v && String(v).trim() !== '';
  }).length;

  // Chấm điểm chuẩn Bộ GD&ĐT
  const handleSubmit = async () => {
    const answersList: UserAnswer[] = Object.entries(userAnswers).map(([qId, val]) => ({
      questionId: qId,
      selectedOptionId: typeof val === 'string' ? val : undefined,
      fillBlankValue: typeof val === 'string' ? val : undefined,
      timeSpentSeconds: 30,
    }));

    try {
      const res = await fetch('/api/student/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId,
          moduleId: module.id,
          answers: answersList,
          userAnswersMap: userAnswers,
        }),
      });

      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setSubmissionResult({
          answered: answeredCount,
          total: questions.length || 22,
          score: data.submission.score,
        });
        setShowResultModal(true);
      }
    } catch {
      alert('Không thể kết nối máy chủ để nộp bài');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Làm sạch chuỗi câu hỏi để tránh lặp chữ "Câu 1. Câu 1"
  const getCleanQuestionText = () => {
    if (!currentQ?.text) return '';
    const num = currentQ.number || currentIndex + 1;
    const regex = new RegExp(`^câu\\s*${num}[.:]?\\s*`, 'i');
    return currentQ.text.replace(regex, '').trim();
  };

  // Kiểm tra tính đúng sai của từng câu
  const checkQuestionStatus = (q: Question) => {
    const val = userAnswers[q.id];
    const isAnswered =
      typeof val === 'object' && val !== null
        ? Object.keys(val).length > 0
        : !!val && String(val).trim() !== '';

    if (!isReviewMode) {
      return { isAnswered, isCorrect: false };
    }

    if (!isAnswered) {
      return { isAnswered: false, isCorrect: false };
    }

    const pType = q.partType || (q.number <= 12 ? 'part1' : q.number <= 16 ? 'part2' : 'part3');

    if (pType === 'part1') {
      const userOpt = String(val).toLowerCase();
      const correctOpt = String(q.correctOptionId || '').toLowerCase();
      const isCorrect = userOpt === correctOpt || userOpt.replace('opt-', '') === correctOpt.replace('opt-', '');
      return { isAnswered: true, isCorrect };
    }

    if (pType === 'part2') {
      const tfMap = val || {};
      const items = q.trueFalseItems || [];
      if (items.length === 0) return { isAnswered: true, isCorrect: true };
      const correctCount = items.filter((item) => tfMap[item.id] === item.isTrue).length;
      return { isAnswered: true, isCorrect: correctCount >= 2 };
    }

    if (pType === 'part3') {
      const userVal = String(val).trim().replace(',', '.');
      const correctVals = (q.fillBlankAnswers || []).map((v) => String(v).trim().replace(',', '.'));
      const isCorrect = correctVals.includes(userVal);
      return { isAnswered: true, isCorrect };
    }

    return { isAnswered: true, isCorrect: false };
  };

  // Phân chia 22 câu thành 3 cụm chuẩn Bộ GD&ĐT
  const questionsWithIndex = questions.map((q, i) => ({ ...q, originalIndex: i }));
  const part1Questions = questionsWithIndex.filter(
    (q) => q.partType === 'part1' || (q.number ? q.number <= 12 : q.originalIndex < 12)
  );
  const part2Questions = questionsWithIndex.filter(
    (q) => q.partType === 'part2' || (q.number ? q.number > 12 && q.number <= 16 : q.originalIndex >= 12 && q.originalIndex < 16)
  );
  const part3Questions = questionsWithIndex.filter(
    (q) => q.partType === 'part3' || (q.number ? q.number > 16 : q.originalIndex >= 16)
  );

  const renderDockButton = (q: any, idx: number) => {
    const status = checkQuestionStatus(q);
    const isCurrent = idx === currentIndex;
    const isFlagged = flaggedQuestions[q.id];

    let btnClass = 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80';

    if (isReviewMode) {
      if (status.isCorrect) {
        btnClass = 'bg-emerald-500 text-white shadow-[0_2px_6px_rgba(16,185,129,0.3)]';
      } else if (status.isAnswered) {
        btnClass = 'bg-rose-500 text-white shadow-[0_2px_6px_rgba(244,63,94,0.3)]';
      } else {
        btnClass = 'bg-slate-100/90 text-slate-400';
      }
    } else if (status.isAnswered) {
      btnClass = 'bg-blue-600 text-white shadow-[0_2px_6px_rgba(37,99,235,0.3)]';
    }

    if (isCurrent) {
      btnClass = 'bg-slate-900 text-white ring-4 ring-slate-900/15 shadow-sm scale-105';
    }

    return (
      <button
        key={q.id}
        onClick={() => setCurrentIndex(idx)}
        className={`w-8 h-8 rounded-full text-xs font-bold tabular-nums transition-all duration-150 active:scale-90 shrink-0 flex items-center justify-center relative ${btnClass}`}
      >
        <span>{q.number || idx + 1}</span>
        {isFlagged && (
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white absolute -top-0.5 -right-0.5" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen pb-28 flex flex-col font-sans select-none antialiased">
      {/* 1. Sleek iOS Floating Glass Topbar & Control Strip */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-slate-200/70 px-4 md:px-6 py-3 shadow-[0_4px_24px_rgb(0,0,0,0.03)] flex items-center justify-between">
        {/* Left Group (Candidate & Progress) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900/[0.04] border border-slate-200/70 rounded-full px-3 py-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Thí sinh:</span>
            <span className="text-xs font-bold text-slate-900 max-w-[120px] sm:max-w-[180px] truncate">{studentName}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/[0.04] border border-slate-200/70 rounded-full px-2.5 py-1 text-xs font-mono font-bold text-slate-700">
            <span className="text-[11px] text-slate-400 font-sans font-medium">SBD:</span>
            <span className="text-blue-700">{studentId}</span>
          </div>

          <div className="rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20 px-3 py-1 text-xs font-semibold tabular-nums flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>Đã làm: <strong>{answeredCount}</strong>/{questions.length || 22}</span>
          </div>
        </div>

        {/* Center Group (Apple Countdown Timer Pill) */}
        <div className="flex items-center">
          {!isReviewMode ? (
            <div
              className={`rounded-full px-4 py-1.5 text-sm font-bold tracking-wider tabular-nums shadow-sm flex items-center gap-2 transition-all ${
                globalSeconds < 300
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-900 text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(globalSeconds)}</span>
            </div>
          ) : (
            <div className="rounded-full bg-emerald-600 text-white px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>ĐÃ NỘP BÀI • {submissionResult?.score ?? 0} / 10.0</span>
            </div>
          )}
        </div>

        {/* Right Group (Actions) */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Đang kết nối</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition active:scale-95"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {!isReviewMode ? (
            <button
              onClick={handleSubmit}
              className="rounded-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-xs px-5 py-2 shadow-[0_2px_10px_rgba(37,99,235,0.25),inset_0_1px_0_0_rgba(255,255,255,0.3)] active:scale-95 transition-all"
            >
              Nộp bài
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResultModal(true)}
                className="rounded-full bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-semibold text-xs px-3.5 py-1.5 shadow-xs transition active:scale-95"
              >
                Xem điểm
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-1.5 shadow-sm transition active:scale-95"
              >
                Trang chủ
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Review Mode Banner */}
      {isReviewMode && (
        <div className="bg-emerald-500/10 backdrop-blur-md border-b border-emerald-500/20 px-6 py-2 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase">
              CHẾ ĐỘ XEM ĐÁP ÁN & LỜI GIẢI
            </span>
            <span>
              Điểm đạt được: <strong className="font-mono text-sm text-emerald-800 font-bold">{submissionResult?.score} / 10.0</strong> ({submissionResult?.answered}/{questions.length} câu)
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] text-emerald-700">
            Bấm vào các số câu ở thanh dock phía dưới để xem nhanh lời giải
          </span>
        </div>
      )}

      {/* 2. Main Split-Screen Question Panel */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-5">
        {/* Cột Trái: Đề bài, Toán MathJax & Lời giải */}
        <div className="rounded-[24px] bg-white/90 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 md:p-8 flex flex-col justify-between flex-1">
          <div className="space-y-4">
            {/* Top Bar inside Left Panel */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-blue-100">
                {partType === 'part1' && 'PHẦN I: TRẮC NGHIỆM 4 PHƯƠNG ÁN'}
                {partType === 'part2' && 'PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI'}
                {partType === 'part3' && 'PHẦN III: TRẢ LỜI NGẮN'}
              </span>

              {!isReviewMode && (
                <button
                  onClick={() => toggleFlag(currentQ?.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all active:scale-95 flex items-center gap-1.5 ${
                    flaggedQuestions[currentQ?.id]
                      ? 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                      : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  {flaggedQuestions[currentQ?.id] ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Đánh dấu</span>
                </button>
              )}
            </div>

            {/* Question Body */}
            <div className="py-2 space-y-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center shrink-0 rounded-xl bg-blue-600 text-white font-bold text-xs px-2.5 py-1 shadow-xs">
                  Câu {currentQ?.number || currentIndex + 1}
                </span>
                {getCleanQuestionText() && (
                  <div className="text-base md:text-[17px] leading-relaxed text-slate-900 font-medium">
                    <MathText content={getCleanQuestionText()} />
                  </div>
                )}
              </div>

              {/* Question Image */}
              {currentQ?.imageUrl && (
                <div className="my-4 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm max-h-[340px] flex items-center justify-center overflow-hidden mx-auto">
                  <img
                    src={currentQ.imageUrl}
                    alt={`Đề bài câu ${currentQ.number || currentIndex + 1}`}
                    className="max-h-[320px] w-auto object-contain rounded-xl"
                  />
                </div>
              )}

              {/* Review Mode: Detailed Explanation */}
              {isReviewMode && (
                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ĐÁP ÁN & LỜI GIẢI CHI TIẾT
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      Ban Chuyên môn Toán 12
                    </span>
                  </div>

                  {currentQ?.explanationImageUrl ? (
                    <div className="rounded-xl border border-emerald-200 bg-white p-2 overflow-hidden shadow-2xs max-w-2xl mx-auto">
                      <img
                        src={currentQ.explanationImageUrl}
                        alt={`Lời giải chi tiết câu ${currentQ.number || currentIndex + 1}`}
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    </div>
                  ) : currentQ?.explanation ? (
                    <div className="bg-white p-4 rounded-xl border border-emerald-200/80 text-slate-800 text-sm font-medium leading-relaxed">
                      <MathText content={currentQ.explanation} />
                    </div>
                  ) : (
                    <div className="bg-white/60 p-4 rounded-xl text-center text-xs text-slate-500 italic">
                      (Đề thi này chưa có ảnh lời giải chi tiết cho Câu {currentQ?.number || currentIndex + 1})
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Prev/Next Navigation Footer inside Left Panel */}
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none shadow-xs flex items-center gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Câu trước</span>
            </button>

            <span className="text-xs text-slate-400 font-medium tabular-nums">
              Câu {currentIndex + 1} / {questions.length}
            </span>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none shadow-xs flex items-center gap-1.5"
            >
              <span>Câu tiếp theo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cột Phải: Tactile Apple Answer Controls */}
        <div className="rounded-[24px] bg-white/85 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 w-full md:w-[460px] lg:w-[480px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                LỰA CHỌN PHƯƠNG ÁN TRẢ LỜI
              </span>
              {isReviewMode && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  Đối chiếu kết quả
                </span>
              )}
            </div>

            {/* PHẦN 1: Trắc nghiệm 4 phương án A, B, C, D */}
            {partType === 'part1' && (
              <div className="space-y-3">
                {(currentQ?.options?.length ? currentQ.options : [
                  { id: 'opt-a', text: 'Phương án A' },
                  { id: 'opt-b', text: 'Phương án B' },
                  { id: 'opt-c', text: 'Phương án C' },
                  { id: 'opt-d', text: 'Phương án D' },
                ]).map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = userAnswers[currentQ?.id] === opt.id || userAnswers[currentQ?.id] === letter;
                  const correctOptRaw = String(currentQ?.correctOptionId || '').toLowerCase();
                  const isCorrect = isReviewMode && (
                    correctOptRaw === opt.id.toLowerCase() ||
                    correctOptRaw === letter.toLowerCase() ||
                    correctOptRaw.replace('opt-', '') === letter.toLowerCase()
                  );
                  const isWrongSelected = isReviewMode && isSelected && !isCorrect;

                  let cardClass = 'bg-white hover:bg-slate-50/90 border-slate-200/80 hover:border-blue-300 shadow-[0_1px_3px_rgba(0,0,0,0.02)]';
                  let badgeClass = 'w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors';

                  if (isReviewMode) {
                    if (isCorrect) {
                      cardClass = 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-[0_4px_14px_rgba(16,185,129,0.12)]';
                      badgeClass = 'w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm';
                    } else if (isWrongSelected) {
                      cardClass = 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-[0_4px_14px_rgba(244,63,94,0.12)]';
                      badgeClass = 'w-9 h-9 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-sm';
                    } else {
                      cardClass = 'bg-white/60 border-slate-200/60 opacity-60';
                    }
                  } else if (isSelected) {
                    cardClass = 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/15 shadow-[0_4px_14px_rgba(37,99,235,0.10)]';
                    badgeClass = 'w-9 h-9 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectP1(opt.id)}
                      disabled={isReviewMode}
                      className={`group relative w-full text-left rounded-[18px] p-4 border transition-all duration-150 ease-out active:scale-[0.985] flex items-center gap-4 ${cardClass}`}
                    >
                      <span className={badgeClass}>{letter}</span>
                      <div className="flex-1 text-sm font-semibold text-slate-800 leading-snug">
                        <MathText content={opt.text} />
                      </div>
                      {isReviewMode && isCorrect && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          ✓ Đúng
                        </span>
                      )}
                      {isReviewMode && isWrongSelected && (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                          ✗ Đã chọn
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* PHẦN 2: Đúng / Sai 4 ý a, b, c, d */}
            {partType === 'part2' && (
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-900/[0.03] border border-slate-200/60 p-3 text-xs text-slate-600 font-medium">
                  {isReviewMode
                    ? 'Đối chiếu kết quả Đúng / Sai cho từng ý a), b), c), d):'
                    : 'Lựa chọn Đúng hoặc Sai cho mỗi khẳng định:'}
                </div>

                {['a', 'b', 'c', 'd'].map((itemKey) => {
                  const currentMap = userAnswers[currentQ?.id] || {};
                  const isUserTrue = currentMap[itemKey] === true;
                  const isUserFalse = currentMap[itemKey] === false;
                  const correctItem = (currentQ?.trueFalseItems || []).find((t) => t.id === itemKey);
                  const isActuallyTrue = correctItem?.isTrue;

                  return (
                    <div key={itemKey} className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/70 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">Ý {itemKey})</span>
                        {isReviewMode && (
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isActuallyTrue ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            Chuẩn: {isActuallyTrue ? 'ĐÚNG' : 'SAI'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSelectP2(itemKey, true)}
                          disabled={isReviewMode}
                          className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 border ${
                            isReviewMode && isActuallyTrue
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : isUserTrue
                              ? isReviewMode
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50/50'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" /> Đúng
                          {isReviewMode && isUserTrue && <span className="text-[10px] opacity-80">(Bạn chọn)</span>}
                        </button>
                        <button
                          onClick={() => handleSelectP2(itemKey, false)}
                          disabled={isReviewMode}
                          className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 border ${
                            isReviewMode && isActuallyTrue === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : isUserFalse
                              ? isReviewMode
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50/50'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" /> Sai
                          {isReviewMode && isUserFalse && <span className="text-[10px] opacity-80">(Bạn chọn)</span>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PHẦN 3: Trả lời ngắn điền số */}
            {partType === 'part3' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {isReviewMode ? 'KẾT QUẢ ĐIỀN ĐÁP ÁN SỐ' : 'NHẬP ĐÁP ÁN CỦA BẠN'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 6.8 hoặc -15"
                    value={userAnswers[currentQ?.id] || ''}
                    onChange={(e) => handleInputP3(e.target.value)}
                    disabled={isReviewMode}
                    className="w-full rounded-2xl bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 text-lg font-bold tracking-wide text-slate-900 tabular-nums transition-all placeholder:text-slate-300"
                  />
                </div>

                {isReviewMode && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-1.5 text-xs">
                    <div className="font-semibold text-slate-700">
                      Đáp án chuẩn: <span className="font-mono font-bold text-emerald-700 text-base">{currentQ?.fillBlankAnswers?.[0] || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="font-semibold text-slate-700">
                      Bạn đã điền: <span className="font-mono font-bold text-slate-900">{userAnswers[currentQ?.id] || '(Bỏ trống)'}</span>
                    </div>
                  </div>
                )}

                {!isReviewMode && (
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-800 font-medium leading-relaxed">
                    💡 <strong>Quy định:</strong> Điền số nguyên hoặc số thập phân dùng dấu chấm (Ví dụ: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">6.8</code> hoặc <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">-15</code>).
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Tự động lưu câu trả lời
            </span>
            <span className="font-mono">GDPT 2018</span>
          </div>
        </div>
      </main>

      {/* 4. Bottom iOS Floating Question Dock (Grouped into Part I, Part II, Part III) */}
      <nav aria-label="Danh sách câu hỏi" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-[96vw] bg-white/80 backdrop-blur-2xl border border-white/90 ring-1 ring-slate-900/[0.06] shadow-[0_12px_40px_rgb(15,23,42,0.10)] rounded-[24px] px-4 py-2.5 flex items-center gap-3 overflow-x-auto no-scrollbar">
        {/* Cluster 1: Questions 1 to 12 */}
        {part1Questions.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 select-none">P.I</span>
            {part1Questions.map((q) => renderDockButton(q, q.originalIndex))}
          </div>
        )}

        {/* Divider */}
        {part1Questions.length > 0 && part2Questions.length > 0 && (
          <div className="h-7 w-[1px] bg-slate-200/80 shrink-0" />
        )}

        {/* Cluster 2: Questions 13 to 16 */}
        {part2Questions.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 select-none">P.II</span>
            {part2Questions.map((q) => renderDockButton(q, q.originalIndex))}
          </div>
        )}

        {/* Divider */}
        {part2Questions.length > 0 && part3Questions.length > 0 && (
          <div className="h-7 w-[1px] bg-slate-200/80 shrink-0" />
        )}

        {/* Cluster 3: Questions 17 to 22 */}
        {part3Questions.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 select-none">P.III</span>
            {part3Questions.map((q) => renderDockButton(q, q.originalIndex))}
          </div>
        )}
      </nav>

      {/* 5. Liquid Glass Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] max-w-lg w-full border border-white/90 ring-1 ring-slate-900/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.15)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Kết quả khảo thí
              </span>
              <span className="text-xs text-slate-400 font-medium">Toán 12 • GDPT 2018</span>
            </div>

            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Nộp bài thi thành công!
              </h2>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Đã trả lời</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    {submissionResult?.answered} / {submissionResult?.total}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/70">
                  <span className="text-[11px] font-semibold text-blue-600 block uppercase">Điểm đạt</span>
                  <span className="text-2xl font-bold text-blue-700 tabular-nums">
                    {submissionResult?.score} <span className="text-xs font-normal text-slate-400">/ 10</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowResultModal(false);
                  setIsReviewMode(true);
                  setCurrentIndex(0);
                }}
                className="rounded-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-xs px-6 py-3 shadow-[0_2px_10px_rgba(37,99,235,0.25)] transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>Xem Đáp Án & Lời Giải Chi Tiết</span>
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-6 py-3 border border-slate-200 transition active:scale-95"
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
