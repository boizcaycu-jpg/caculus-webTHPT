'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Mail, Phone, Code, Sparkles, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSent(true);
    setTimeout(() => {
      setFeedback('');
      setSent(false);
      alert('Cảm ơn bạn! Phản hồi kỹ thuật của bạn đã được gửi tới Ban Quản Trị.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.12),transparent)] flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-500/15 selection:text-blue-700">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Glass Banner */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-white/75 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Đồng Hành Khảo Thí 24/7</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Liên Hệ & Hỗ Trợ Kỹ Thuật
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Hệ thống khảo thí CACULUS THPTQG cam kết hỗ trợ tối đa cho học sinh trong quá trình ôn luyện và thi thử trực tuyến.
          </p>
        </div>

        {/* 3 Metric Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-[24px] p-6 bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Email Hỗ Trợ</h3>
            <p className="text-xs text-slate-500 font-mono break-all">support.caculus.edu.vn@gmail.com</p>
          </div>

          <div className="rounded-[24px] p-6 bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Hotline Kỹ Thuật</h3>
            <p className="text-xs text-slate-600 font-mono font-bold text-sm">0767 588 269</p>
            <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Hỗ trợ 24/7
            </span>
          </div>

          <div className="rounded-[24px] p-6 bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Phiên Bản Hệ Thống</h3>
            <p className="text-xs text-slate-600 font-mono font-bold">CACULUS v2.7 Pro</p>
            <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Chuẩn GDPT 2018
            </span>
          </div>
        </div>

        {/* Feedback / Support Form Card */}
        <div className="rounded-[28px] p-6 sm:p-8 bg-white/75 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-base">Gửi Yêu Cầu Hỗ Trợ Hoặc Góp Ý Đề Thi</h2>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Nhập nội dung thắc mắc, phản ánh lỗi đề thi hoặc yêu cầu trợ giúp kỹ thuật tại đây..."
              className="w-full rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all resize-none shadow-xs"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sent || !feedback.trim()}
                className="rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs px-6 py-2.5 transition-all active:scale-95 shadow-sm flex items-center gap-2"
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi tin nhắn</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
