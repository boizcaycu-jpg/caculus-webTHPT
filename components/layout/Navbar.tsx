'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  X,
} from 'lucide-react';
import { TokenPayload } from '@/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('caculus_user');
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('caculus_user');
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  // Hide in exam room for full immersion
  if (pathname.includes('/room')) {
    return null;
  }

  const isOverview = pathname === '/dashboard' || pathname === '/';
  const isDocuments = pathname === '/documents';
  const isLeaderboard = pathname === '/leaderboard';
  const isContact = pathname === '/contact';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/75 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Block */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-sm rounded-xl px-3 py-1.5 font-bold tracking-tight text-xs flex items-center gap-1.5 transition-transform duration-200 group-hover:scale-105 active:scale-95">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>CACULUS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                CACULUS THPTQG
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Luyện Thi Toán 12 • Chuẩn GDPT 2018
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Pills (Floating Segmented Control) */}
        <nav className="hidden md:flex items-center bg-slate-900/[0.04] p-1 rounded-full border border-slate-200/50 shadow-inner">
          <Link
            href="/dashboard"
            className={`rounded-full px-4 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
              isOverview
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Tổng quan
          </Link>
          <Link
            href="/documents"
            className={`rounded-full px-4 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
              isDocuments
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Tài liệu Toán 12
          </Link>
          <Link
            href="/leaderboard"
            className={`rounded-full px-4 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
              isLeaderboard
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Bảng xếp hạng
          </Link>
          <Link
            href="/contact"
            className={`rounded-full px-4 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
              isContact
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Liên hệ
          </Link>

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="ml-1 text-amber-900 bg-amber-300 hover:bg-amber-400 font-bold px-3 py-1 rounded-full text-xs transition-all active:scale-95 flex items-center gap-1 shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right User Profile Pill & Logout */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 bg-white/80 border border-slate-200/70 rounded-full py-1.5 pl-1.5 pr-3 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {user.name ? user.name[0]?.toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 line-clamp-1 max-w-[120px]">
                    {user.name || user.realName || 'Thí sinh'}
                  </span>
                  <span className="text-[10px] text-blue-600 font-mono font-medium leading-none">
                    {user.studentId || 'THPTQG_2027'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full p-2 transition-all duration-200 active:scale-90"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all active:scale-95 shadow-xs"
            >
              Đăng nhập
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-2 pb-4 space-y-1.5">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={`block font-semibold text-xs py-2 px-3 rounded-xl transition ${
              isOverview ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Tổng quan
          </Link>
          <Link
            href="/documents"
            onClick={() => setMenuOpen(false)}
            className={`block font-semibold text-xs py-2 px-3 rounded-xl transition ${
              isDocuments ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Tài liệu Toán 12
          </Link>
          <Link
            href="/leaderboard"
            onClick={() => setMenuOpen(false)}
            className={`block font-semibold text-xs py-2 px-3 rounded-xl transition ${
              isLeaderboard ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Bảng xếp hạng
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className={`block font-semibold text-xs py-2 px-3 rounded-xl transition ${
              isContact ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Liên hệ
          </Link>
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block font-bold text-xs py-2 px-3 rounded-xl bg-amber-50 text-amber-900"
            >
              Quản trị Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
