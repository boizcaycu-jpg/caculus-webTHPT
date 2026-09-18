'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question, ExamModule, UserAnswer } from '@/types';
import MathText from '@/components/ui/MathText';
import { Clock, Check, X, Bookmark, BookmarkCheck, Maximize2, Minimize2 } from 'lucide-react';
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

  // Modal Kết quả theo Ảnh 3
  const [showResultModal, setShowResultModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ answered: number; total: number; score: number } | null>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const partType = currentQ?.partType || (currentQ?.number <= 12 ? 'part1' : currentQ?.number <= 16 ? 'part2' : 'part3');

  // Đếm ngược 90 phút
  useEffect(() => {
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
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Trắc nghiệm Phần 1
  const handleSelectP1 = (optId: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  // Trắc nghiệm Đúng/Sai Phần 2
  const handleSelectP2 = (statementId: string, value: boolean) => {
    const curr = userAnswers[currentQ.id] || {};
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { ...curr, [statementId]: value },
    }));
  };

  // Trả lời ngắn Phần 3 (Điền số)
  const handleInputP3 = (val: string) => {
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

  // Chấm điểm chuẩn Bộ GD&ĐT và hiện kết quả theo Ảnh 3
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
    } catch (e) {
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

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col font-sans select-none">
      {/* 1. Header Xanh Đậm chuẩn Bộ GD&ĐT theo Ảnh 1 */}
      <header className="bg-[#002b66] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-md">
        {/* Thông tin Thí sinh */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs font-semibold">
          <span className="font-bold text-sm text-white">{studentName}</span>
          <span className="text-blue-200">SBD: <strong className="font-mono text-white">{studentId}</strong></span>
          <span className="text-blue-200">Môn thi: <strong className="text-white uppercase">TOÁN</strong></span>
          <span className="text-blue-200 hidden md:inline">Ngày thi: {new Date().toLocaleDateString('vi-VN')}</span>
          <span className="text-blue-200 hidden md:inline">Ca thi: 1</span>
        </div>

        {/* Timer, Đang kết nối, Nộp bài */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 font-mono font-black text-base sm:text-lg bg-black/25 px-3 py-1 rounded-lg border border-white/20 text-amber-300">
            <Clock className="w-4 h-4 text-amber-300" />
            {formatTime(globalSeconds)}
          </div>
          <span className="hidden sm:flex items-center gap-1 text-emerald-300 font-bold bg-white/10 px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Đang kết nối
          </span>
          <button
            onClick={handleSubmit}
            className="bg-white hover:bg-slate-100 text-[#002b66] font-black px-4 py-1.5 rounded-md transition shadow-sm uppercase tracking-wide text-xs"
          >
            NỘP BÀI
          </button>
          <button onClick={toggleFullscreen} className="text-white hover:text-blue-200 p-1">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Sub Navigation Bar theo Ảnh 1 */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-xs px-3 py-1.5 rounded border border-slate-300 transition"
          >
            Quay lại
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className="bg-[#0052cc] hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs px-3 py-1.5 rounded transition shadow-2xs"
          >
            Tiếp theo
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
          <span>Số câu đã trả lời: <strong className="text-[#0052cc] text-sm">{answeredCount} / {questions.length}</strong></span>
          <button className="bg-blue-50 text-[#0052cc] border border-blue-200 px-3 py-1 rounded hover:bg-blue-100">
            Lưu
          </button>
        </div>
      </div>

      {/* 3. Main Split-Screen Question Panel theo Ảnh 1 */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Cột Trái: Ảnh Đề Bài & Ngữ cảnh Bài Toán */}
        <div className="flex-1 bg-white rounded-xl border border-slate-300 p-6 overflow-y-auto shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-xs font-black text-[#0052cc] uppercase tracking-wider">
              {partType === 'part1' && 'PHẦN I: TRẮC NGHIỆM 4 PHƯƠNG ÁN (CÂU 1 - 12)'}
              {partType === 'part2' && 'PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (CÂU 13 - 16)'}
              {partType === 'part3' && 'PHẦN III: TRẢ LỜI NGẮN / ĐIỀN SỐ (CÂU 17 - 22)'}
            </span>
            <button
              onClick={() => toggleFlag(currentQ?.id)}
              className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                flaggedQuestions[currentQ?.id]
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {flaggedQuestions[currentQ?.id] ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5" />}
              Đánh dấu
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            <span className="font-black text-[#002b66] mr-2">Câu {currentQ?.number || currentIndex + 1}.</span>
            <MathText content={currentQ?.text || 'Nội dung câu hỏi'} />
          </h2>

          {/* Hiển thị Hình ảnh Đề thi (Chụp đề do Admin tải lên) */}
          {currentQ?.imageUrl && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 overflow-hidden max-w-2xl mx-auto shadow-2xs">
              <img
                src={currentQ.imageUrl}
                alt={`Đề bài câu ${currentQ.number}`}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Cột Phải: Ô Chọn Phương Án Đáp Án */}
        <div className="w-full md:w-[480px] bg-white rounded-xl border border-slate-300 p-6 overflow-y-auto shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              LỰA CHỌN PHƯƠNG ÁN TRẢ LỜI
            </h3>

            {/* PHẦN 1: Trắc nghiệm 4 lựa chọn A, B, C, D */}
            {partType === 'part1' && (
              <div className="space-y-2.5">
                {(currentQ?.options?.length ? currentQ.options : [
                  { id: 'opt-a', text: 'Phương án A' },
                  { id: 'opt-b', text: 'Phương án B' },
                  { id: 'opt-c', text: 'Phương án C' },
                  { id: 'opt-d', text: 'Phương án D' },
                ]).map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = userAnswers[currentQ?.id] === opt.id || userAnswers[currentQ?.id] === letter;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectP1(opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-[#0052cc] bg-blue-50/60 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#0052cc] text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 flex-1">
                        <MathText content={opt.text} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* PHẦN 2: Đúng / Sai 4 ý a, b, c, d */}
            {partType === 'part2' && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-purple-900 bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                  Thí sinh lựa chọn Đúng hoặc Sai cho mỗi ý a), b), c), d):
                </p>
                {['a', 'b', 'c', 'd'].map((itemKey) => {
                  const currentMap = userAnswers[currentQ?.id] || {};
                  const isTrue = currentMap[itemKey] === true;
                  const isFalse = currentMap[itemKey] === false;

                  return (
                    <div key={itemKey} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <span className="font-bold text-xs text-slate-800">Ý {itemKey})</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSelectP2(itemKey, true)}
                          className={`flex-1 py-2 rounded-lg font-black text-xs transition flex items-center justify-center gap-1 border ${
                            isTrue
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" /> ĐÚNG
                        </button>
                        <button
                          onClick={() => handleSelectP2(itemKey, false)}
                          className={`flex-1 py-2 rounded-lg font-black text-xs transition flex items-center justify-center gap-1 border ${
                            isFalse
                              ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-50'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" /> SAI
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PHẦN 3: Trả lời ngắn điền số */}
            {partType === 'part3' && (
              <div className="space-y-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <label className="block text-xs font-black text-amber-900 uppercase">
                  NHẬP ĐÁP ÁN CỦA BẠN:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 6.8 hoặc -15"
                  value={userAnswers[currentQ?.id] || ''}
                  onChange={(e) => handleInputP3(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-4 py-3 text-lg font-mono font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
                <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                  ⚠️ <strong>LƯU Ý:</strong> Chỉ chấp nhận đáp án số thập phân dạng dấu chấm <code className="font-mono bg-amber-200 px-1 py-0.5 rounded">XY.Z</code> (Ví dụ: 6.8), không được dùng dấu phẩy.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. Thanh Nút Tròn 22 Câu Hỏi ở Đáy Màn hình theo Ảnh 1 */}
      <footer className="bg-white border-t border-slate-300 px-4 py-3 shadow-md">
        <div className="max-w-[1600px] mx-auto flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1">
          {questions.map((q, idx) => {
            const val = userAnswers[q.id];
            const isAnswered =
              typeof val === 'object' && val !== null
                ? Object.keys(val).length > 0
                : !!val && String(val).trim() !== '';
            const isCurrent = idx === currentIndex;
            const isFlagged = flaggedQuestions[q.id];

            let btnBg = 'bg-slate-200 text-slate-700 border-slate-300';
            if (isAnswered) {
              btnBg = 'bg-emerald-500 text-white font-bold border-emerald-600 shadow-xs';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-8 h-8 rounded-full text-xs font-mono transition-all flex items-center justify-center border shrink-0 ${btnBg} ${
                  isCurrent ? 'ring-3 ring-[#002b66] border-black scale-110 font-black z-10' : ''
                }`}
              >
                {q.number || idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white"></span>
                )}
              </button>
            );
          })}
        </div>
      </footer>

      {/* 5. Giao diện Kết quả Thi Modal theo Ảnh 3 */}
      {showResultModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full border-4 border-[#0052cc] p-6 sm:p-8 shadow-2xl space-y-6">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Kết quả thi
            </h3>

            <div className="text-center space-y-4 py-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Bạn đã nộp bài thi thành công!
              </h2>

              <div className="space-y-2 text-base font-bold text-slate-700">
                <div>
                  Số câu đã trả lời: <span className="text-emerald-600 font-mono font-black text-xl">{submissionResult?.answered} / {submissionResult?.total}</span>
                </div>
                <div>
                  Số điểm đạt được: <span className="text-emerald-600 font-mono font-black text-2xl">{submissionResult?.score} / 10.0</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-black px-8 py-3 rounded-xl border border-slate-300 text-sm shadow-xs transition active:scale-95"
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
