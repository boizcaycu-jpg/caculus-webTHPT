'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { User, Award, BookOpen, Clock, PlayCircle, Lock, Trophy, BarChart2, ChevronDown, Sparkles } from 'lucide-react';
import { TokenPayload } from '@/lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mandatory Name Entry State
  const [inputRealName, setInputRealName] = useState('');
  const [submittingName, setSubmittingName] = useState(false);

  // Collapsible Accordion States
  const [openTopics, setOpenTopics] = useState(true);
  const [openFull, setOpenFull] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        } else if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('caculus_user');
          if (stored) {
            try { setUser(JSON.parse(stored)); } catch (e) {}
          }
        }
      })
      .catch(() => {});

    fetch('/api/student/exams')
      .then(res => res.json())
      .then(data => {
        setExams(data.exams || []);
        setSubmissions(data.submissions || []);
        setLoading(false);
      });
  }, []);

  const totalTaken = submissions.length;
  const highestScore = submissions.reduce((max, s) => Math.max(max, s.score), 0);

  const needsName = user && user.role === 'student' && (!user.name || user.name === 'null' || user.name.trim() === '');

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRealName.trim()) return;

    setSubmittingName(true);
    try {
      const res = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ realName: inputRealName.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('caculus_user', JSON.stringify(data.user));
        }
      } else {
        alert(data.error || 'Không thể lưu tên');
      }
    } catch (err) {
      alert('Lỗi cập nhật Họ và tên');
    } finally {
      setSubmittingName(false);
    }
  };

  const isUserVip = user?.isVip ?? true;

  // Separate Practice Topics (category === 'LUYỆN TẬP') and Full Mock Exams
  const practiceExams = exams.filter(e => e.category === 'LUYỆN TẬP');
  const fullExams = exams.filter(e => e.category !== 'LUYỆN TẬP');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Top Profile Summary Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-l-4 border-l-[#0052cc]">
          {/* User Avatar & Name */}
          <div className="flex items-center gap-4 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0052cc] flex items-center justify-center font-bold text-xl border border-blue-200 shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold">
                {user && (user.name || user.realName) ? `Xin chào, ${user.name || user.realName}` : 'Chào mừng thí sinh THPTQG'}
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 line-clamp-1">
                {user && (user.name || user.realName) ? (user.name || user.realName) : 'Thí sinh VIP'}
              </h2>
              <span className="inline-block mt-1 bg-blue-100 text-[#0052cc] text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                Môn Toán THPTQG {user?.studentId ? `• ${user.studentId}` : ''}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                <BookOpen className="w-4 h-4 text-[#0052cc]" /> Số bài đã làm
              </div>
              <div className="text-2xl font-black text-slate-900">{totalTaken}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-amber-500" /> Điểm cao nhất
              </div>
              <div className="text-2xl font-black text-[#0052cc]">{highestScore > 0 ? `${highestScore}đ` : '--'}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-emerald-600" /> Trạng thái
              </div>
              <div className="text-xs font-extrabold text-emerald-600 mt-2 bg-emerald-100 py-1 px-2 rounded-full inline-block">
                Đã kích hoạt Luyện Thi
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: 🔷 CHUYÊN ĐỀ LUYỆN TẬP TOÁN THPTQG (DẠNG DANH SÁCH NGANG) */}
        <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden shadow-xs">
          <button
            onClick={() => setOpenTopics(!openTopics)}
            className="w-full flex items-center justify-between p-5 bg-blue-50/80 hover:bg-blue-100/60 transition text-left border-b border-blue-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-8 bg-[#0052cc] rounded-full inline-block"></span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  🔷 CHUYÊN ĐỀ LUYỆN TẬP TOÁN THPTQG
                  <span className="text-xs font-bold bg-[#0052cc] text-white px-2.5 py-0.5 rounded-full">
                    {practiceExams.length} Chuyên đề trọng tâm
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Luyện tập chuyên sâu các dạng toán Hàm số, Logarit, Tích phân, Hình học Oxyz, Số phức & Xác suất THPTQG
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-[#0052cc] transition-transform duration-200 ${openTopics ? 'rotate-180' : ''}`} />
          </button>

          {openTopics && (
            <div className="divide-y divide-slate-100 p-2 sm:p-4 space-y-2">
              {practiceExams.length > 0 ? (
                practiceExams.map((item, idx) => {
                  const isPub = item.isPublished ?? (item.status !== 'CHƯA UPDATE');
                  const canAccess = isPub && (item.isFree || item.isDemoExam || isUserVip || user?.role === 'admin');

                  return (
                    <div
                      key={item.id}
                      className="p-3 sm:p-4 bg-white rounded-xl border border-slate-100 hover:border-[#0052cc] hover:bg-blue-50/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#0052cc] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm hover:text-[#0052cc] transition">
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0052cc] border border-blue-200">
                              🔵 Luyện Chuyên Đề
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {item.modules?.[0]?.totalQuestions || 25} câu • {item.modules?.[0]?.durationMinutes || 45} phút
                        </span>

                        {canAccess ? (
                          <Link
                            href={`/exams/${item.id}`}
                            className="bg-[#0052cc] hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg transition flex items-center gap-1.5 shadow-xs"
                          >
                            <PlayCircle className="w-4 h-4" /> Vào Luyện Chuyên Đề
                          </Link>
                        ) : (
                          <button disabled className="bg-slate-100 text-slate-400 font-semibold text-xs py-2 px-4 rounded-lg cursor-not-allowed border border-slate-200 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> 🔒 Chưa mở
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">Chưa có chuyên đề luyện tập nào được tải lên</div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: 🔥 LUYỆN ĐỀ THỰC CHIẾN THPTQG MÔN TOÁN (DANH SÁCH NGANG) */}
        <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden shadow-xs">
          <button
            onClick={() => setOpenFull(!openFull)}
            className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-blue-900 to-[#0052cc] transition text-left border-b border-blue-800 text-white"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-8 bg-amber-400 rounded-full inline-block"></span>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  🔥 LUYỆN ĐỀ THỰC CHIẾN - Bộ Đề Thi Thử TN THPTQG Môn Toán
                  <span className="text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                    {fullExams.length} Đề thi
                  </span>
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Thi áp lực thời gian 90 phút theo cấu trúc Bộ GD&ĐT 2025/2026 (Phần I: 12 Trắc nghiệm | Phần II: 4 Đúng/Sai | Phần III: 6 Trả lời ngắn)
                </p>
              </div>
            </div>

            <ChevronDown className={`w-5 h-5 text-white transition-transform duration-200 ${openFull ? 'rotate-180' : ''}`} />
          </button>

          {openFull && (
            <div className="divide-y divide-slate-100 p-2 sm:p-4 space-y-2">
              {fullExams.map((exam, idx) => {
                const isPublished = exam.isPublished ?? (exam.is_published ?? (exam.status !== 'CHƯA UPDATE'));
                const isDemoExam = exam.isFree || exam.isDemoExam || exam.id.includes('demo') || exam.id === 'exam-thptqg-1';
                const canAccess = isPublished && (isDemoExam || isUserVip || user?.role === 'admin');
                const sub = submissions.find(s => s.examId === exam.id);

                return (
                  <div
                    key={exam.id}
                    className="p-3 sm:p-4 bg-white rounded-xl border border-slate-100 hover:border-[#0052cc] hover:bg-blue-50/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#0052cc] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm hover:text-[#0052cc] transition">
                            {exam.title}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isDemoExam ? 'bg-blue-100 text-[#0052cc] border border-blue-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {isDemoExam ? 'Đề Thi Thử Miễn Phí' : 'Đề VIP THPTQG'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{exam.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        sub ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 bg-slate-100'
                      }`}>
                        {sub ? `Đã nộp bài (${sub.score}đ)` : 'Chưa thi'}
                      </span>

                      {canAccess ? (
                        <Link
                          href={`/exams/${exam.id}`}
                          className="bg-[#0052cc] hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg transition flex items-center gap-1.5 shadow-xs"
                        >
                          <PlayCircle className="w-4 h-4" /> {sub ? 'Thi lại' : 'Vào phòng thi 90p'}
                        </Link>
                      ) : (
                        <button disabled className="bg-slate-100 text-slate-400 font-semibold text-xs py-2 px-4 rounded-lg cursor-not-allowed border border-slate-200 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> 🔒 Đề chưa mở
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Section: Leaderboard Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#0052cc]" /> Tiến độ Luyện thi Toán THPT Quốc Gia
            </h3>
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500">Hoàn thành các bài thi thử 90 phút để cập nhật phân tích phổ điểm Toán cá nhân</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Bảng vàng THPTQG
              </h3>
              <Link href="/leaderboard" className="text-xs font-bold text-[#0052cc] hover:underline">
                Bảng xếp hạng
              </Link>
            </div>
            <div className="space-y-2">
              {submissions.length > 0 ? (
                submissions.slice(0, 3).map((sub) => (
                  <div key={sub.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[200px]">
                      {sub.userName || 'Thí sinh THPTQG'}
                    </span>
                    <span className="font-mono font-bold text-[#0052cc]">{sub.score} điểm</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 text-center py-4">Chưa có kết quả bài thi nào</div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* MANDATORY NAME ENTRY MODAL */}
      {needsName && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-blue-100 text-[#0052cc] rounded-full flex items-center justify-center mx-auto border border-blue-200">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Xác nhận Họ & Tên Thí sinh</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tài khoản <strong>{user?.email}</strong> cần nhập Họ và tên chính xác để đăng ký dự thi thử Toán THPTQG.
              </p>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Họ và tên đầy đủ *</label>
                <input
                  type="text"
                  required
                  value={inputRealName}
                  onChange={(e) => setInputRealName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Cường"
                  className="w-full text-sm border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0052cc] outline-none font-medium text-slate-900 shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submittingName}
                className="w-full bg-[#0052cc] hover:bg-blue-700 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                {submittingName ? 'Đang lưu thông tin...' : 'Xác nhận & Vào Luyện THPTQG'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
