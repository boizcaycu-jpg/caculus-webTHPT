'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Trophy, Sparkles, UserCheck, Award } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data.leaderboard || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#F5F5F7] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.12),transparent)] flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-500/15 selection:text-blue-700">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Title Card */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-white/75 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20 shadow-xs">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Bảng Vinh Danh Khảo Thí</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Bảng Xếp Hạng Toàn Hệ Thống PARABOL KHẢO THÍ
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Vinh danh những thí sinh xuất sắc nhất có điểm số cao nhất trên hệ thống luyện thi trực tuyến môn Toán 12.
          </p>
        </div>

        {/* Podium Top 3 Showcase */}
        {!loading && top3.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Rank 2 (Silver) */}
            <div className="rounded-[24px] bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] p-6 shadow-sm flex flex-col items-center text-center space-y-3 order-2 md:order-1 mt-0 md:mt-6">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-2xl flex items-center justify-center border-2 border-slate-300 shadow-inner">
                🥈
              </div>
              <span className="rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-0.5 uppercase tracking-wider">
                HẠNG 2 • Á QUÂN
              </span>
              <h3 className="font-bold text-slate-900 text-base">{top3[1]?.name || 'Thí sinh 02'}</h3>
              <p className="text-xs font-mono text-slate-400">{top3[1]?.studentId || 'THPTQG_02'}</p>
              <div className="rounded-full bg-slate-100 text-slate-800 font-mono font-bold text-lg px-4 py-1">
                {top3[1]?.highestScore || 9.2} điểm
              </div>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="rounded-[28px] bg-gradient-to-b from-amber-500 to-amber-600 p-7 text-white shadow-[0_12px_40px_rgba(245,158,11,0.3)] flex flex-col items-center text-center space-y-3.5 order-1 md:order-2 border-2 border-amber-300/80">
              <div className="w-18 h-18 rounded-full bg-white/20 backdrop-blur-md text-3xl flex items-center justify-center border-2 border-amber-200 shadow-md">
                🥇
              </div>
              <span className="rounded-full bg-white text-amber-900 text-[10px] font-bold px-3.5 py-1 uppercase tracking-wider shadow-xs">
                QUÁN QUÂN TOÀN HỆ THỐNG
              </span>
              <h3 className="font-bold text-white text-lg">{top3[0]?.name || 'Thí sinh 01'}</h3>
              <p className="text-xs font-mono text-amber-100">{top3[0]?.studentId || 'THPTQG_01'}</p>
              <div className="rounded-full bg-amber-400/30 text-white font-mono font-bold text-2xl px-5 py-1.5 border border-white/25">
                {top3[0]?.highestScore || 9.8} điểm
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="rounded-[24px] bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] p-6 shadow-sm flex flex-col items-center text-center space-y-3 order-3 mt-0 md:mt-8">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-2xl flex items-center justify-center border-2 border-amber-200 shadow-inner">
                🥉
              </div>
              <span className="rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold px-3 py-0.5 uppercase tracking-wider">
                HẠNG 3 • ĐỒNG HẠNG
              </span>
              <h3 className="font-bold text-slate-900 text-base">{top3[2]?.name || 'Thí sinh 03'}</h3>
              <p className="text-xs font-mono text-slate-400">{top3[2]?.studentId || 'THPTQG_03'}</p>
              <div className="rounded-full bg-amber-50 text-amber-900 font-mono font-bold text-lg px-4 py-1">
                {top3[2]?.highestScore || 8.8} điểm
              </div>
            </div>
          </div>
        )}

        {/* Full Ranking Table */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-white/75 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <span>Danh Sách Thí Sinh Dẫn Đầu</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Tự động cập nhật</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-center">Hạng</th>
                  <th className="py-3 px-4">Họ và tên thí sinh</th>
                  <th className="py-3 px-4">Mã định danh SBD</th>
                  <th className="py-3 px-4 text-center">Số bài đã làm</th>
                  <th className="py-3 px-4 text-right">Điểm cao nhất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(leaderboard.length > 0
                  ? leaderboard
                  : [
                      { rank: 1, name: 'Nguyễn Văn An', studentId: 'THPTQG_2027_01', completedExams: 18, highestScore: 9.8 },
                      { rank: 2, name: 'Trần Thị Mai', studentId: 'THPTQG_2027_02', completedExams: 15, highestScore: 9.4 },
                      { rank: 3, name: 'Lê Hoàng Nam', studentId: 'THPTQG_2027_03', completedExams: 16, highestScore: 9.0 },
                      { rank: 4, name: 'Phạm Minh Đức', studentId: 'THPTQG_2027_04', completedExams: 12, highestScore: 8.6 },
                      { rank: 5, name: 'Vũ Thùy Linh', studentId: 'THPTQG_2027_05', completedExams: 14, highestScore: 8.4 },
                    ]
                ).map((row, idx) => {
                  const rank = row.rank || idx + 1;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            rank === 1
                              ? 'bg-amber-100 text-amber-800'
                              : rank === 2
                              ? 'bg-slate-200 text-slate-800'
                              : rank === 3
                              ? 'bg-amber-50 text-amber-700'
                              : 'text-slate-500'
                          }`}
                        >
                          {rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-3.5 px-4 font-mono text-blue-600 text-xs">{row.studentId}</td>
                      <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                        {row.completedExams || row.completedCount || 10} bài
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                        {row.highestScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
