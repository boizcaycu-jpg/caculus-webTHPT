'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { ParabolMarkSVG } from '@/components/ui/ParabolLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Clear any residual session on login page to prevent credential overlap
  React.useEffect(() => {
    setEmail('');
    setPassword('');
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('parabol_user');
        localStorage.removeItem('caculus_user');
        sessionStorage.clear();
      } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('parabol_user', JSON.stringify(data.user));
          localStorage.setItem('caculus_user', JSON.stringify(data.user)); // backward compatibility
        }
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      } else {
        setError(data.error || 'Đăng nhập không thành công');
      }
    } catch {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.12),transparent)] text-slate-900 antialiased selection:bg-blue-500/15 selection:text-blue-700 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Master Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-sm mx-auto">
            {!imgError ? (
              <img
                src="/logo-parabol.png"
                alt="PARABOL KHẢO THÍ"
                className="h-16 w-auto object-contain rounded-xl"
                onError={() => setImgError(true)}
              />
            ) : (
              <ParabolMarkSVG className="w-14 h-14" />
            )}
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            PARABOL KHẢO THÍ
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Hệ Thống Khảo Thí & Luyện Đề Toán 12 • Chuẩn GDPT 2018
          </p>
        </div>

        {/* Login Form Box (Apple iOS Liquid Glass) */}
        <div className="rounded-[28px] bg-white/80 backdrop-blur-2xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Đăng nhập thí sinh</h2>
            <p className="text-xs text-slate-500">Tài khoản dự thi được cấp bởi Quản trị viên</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-2xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tài khoản / Email thí sinh *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  name="parabol_account_id"
                  id="parabol_account_id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mật khẩu *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  name="parabol_auth_pass"
                  id="parabol_auth_pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-xs font-medium text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 text-sm transition shadow-[0_2px_10px_rgba(37,99,235,0.25)] active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Đang xác thực...' : 'Vào Phòng Luyện PARABOL'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Help & Support Footer */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-1">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hệ thống bảo mật trực tuyến PARABOL KHẢO THÍ</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Hỗ trợ: <strong className="text-slate-600">support.parabol.edu.vn@gmail.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
