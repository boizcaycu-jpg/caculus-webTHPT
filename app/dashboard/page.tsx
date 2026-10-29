'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Award,
  BookOpen,
  Clock,
  PlayCircle,
  Lock,
  Trophy,
  BarChart2,
  ChevronDown,
  Sparkles,
  LogOut,
  CheckCircle2,
  FileText,
  Download,
  Users,
  ExternalLink,
  PlaySquare,
  MessageCircle,
  Mail,
  Phone,
  Code,
  Send,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
} from 'lucide-react';
import { TokenPayload } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Topbar Navigation Tabs State ('overview' | 'documents' | 'leaderboard' | 'contact')
  const [activeNavTab, setActiveNavTab] = useState<'overview' | 'documents' | 'leaderboard' | 'contact'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Feedback Form State (Contact tab)
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Personalized Name Entry State
  const [inputRealName, setInputRealName] = useState('');
  const [submittingName, setSubmittingName] = useState(false);
  const [showNameModal, setShowNameModal] = useState(true);

  // Stage Tab Filter for Full Mock Exams
  const [activeStageTab, setActiveStageTab] = useState<'gk1' | 'hk1' | 'gk2' | 'ck2' | 'tot-nghiep'>('gk1');
  const [openTopicsAccordion, setOpenTopicsAccordion] = useState(true);

  useEffect(() => {
    // Sync tab from URL query (?tab=documents | leaderboard | contact)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'documents' || tab === 'leaderboard' || tab === 'contact') {
        setActiveNavTab(tab);
      }
    }

    // 1. Fetch User Session
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/login');
        } else {
          setUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('parabol_user', JSON.stringify(data.user));
            localStorage.setItem('caculus_user', JSON.stringify(data.user));
          }
        }
      })
      .catch(() => {});

    // 2. Fetch Exams List
    fetch('/api/student/exams')
      .then((res) => res.json())
      .then((data) => {
        setExams(data.exams || []);
        setSubmissions(data.submissions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 3. Fetch Leaderboard Data
    fetch('/api/student/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
      })
      .catch(() => {});
  }, [router]);

  const handleNavTabChange = (tab: 'overview' | 'documents' | 'leaderboard' | 'contact') => {
    setActiveNavTab(tab);
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      const newUrl = tab === 'overview' ? '/dashboard' : `/dashboard?tab=${tab}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const formatStudentBadge = (id?: string) => {
    if (!id) return 'PARABOL_2027';
    return id.replace(/^CACULUS_/i, 'PARABOL_').replace(/^THPTQG_/i, 'PARABOL_');
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('parabol_user');
      localStorage.removeItem('caculus_user');
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  // Stats calculation
  const totalTaken = submissions.length;
  const completedCount = new Set(submissions.map((s) => s.examId)).size;
  const totalExamsCount = 40; // 10 Topics + 30 Exams
  const highestScore = submissions.reduce((max, s) => Math.max(max, s.score || 0), 0);
  const progressPercent = Math.min(100, Math.round((completedCount / totalExamsCount) * 100));

  // Determine if student has a generic / default placeholder name ("Học sinh 00x")
  const isDefaultName = Boolean(
    !user?.realName ||
    !user?.name ||
    user.name.trim() === '' ||
    user.name === 'null' ||
    user.name.toLowerCase().startsWith('học sinh') ||
    user.name.toLowerCase().startsWith('hoc sinh')
  );

  const needsName = Boolean(user && user.role === 'student' && isDefaultName && showNameModal);

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
        setShowNameModal(false);
        setInputRealName('');
        if (typeof window !== 'undefined') {
          localStorage.setItem('parabol_user', JSON.stringify(data.user));
          localStorage.setItem('caculus_user', JSON.stringify(data.user));
        }
      } else {
        alert(data.error || 'Không thể lưu tên');
      }
    } catch {
      alert('Lỗi cập nhật Họ và tên');
    } finally {
      setSubmittingName(false);
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSent(false);
      alert('Cảm ơn bạn! Phản hồi của bạn đã được gửi tới Ban Chuyên Môn PARABOL KHẢO THÍ.');
    }, 1000);
  };

  const isUserVip = user?.isVip ?? true;

  // Separate Practice Topics and Full Mock Exams
  const practiceExams = exams.filter((e) => e.category === 'LUYỆN TẬP' || e.id.startsWith('chuyen-de-'));
  const fullExams = exams.filter((e) => e.category !== 'LUYỆN TẬP' && !e.id.startsWith('chuyen-de-'));

  const currentStageExams = fullExams.filter((e) => {
    if (activeStageTab === 'gk1')
      return (
        e.stage === 'gk1' ||
        ['de-thuc-chien-01', 'de-thuc-chien-02', 'de-thuc-chien-03', 'de-thuc-chien-04', 'de-thuc-chien-05'].includes(e.id)
      );
    if (activeStageTab === 'hk1')
      return (
        e.stage === 'hk1' ||
        ['de-thuc-chien-06', 'de-thuc-chien-07', 'de-thuc-chien-08', 'de-thuc-chien-09', 'de-thuc-chien-10'].includes(e.id)
      );
    if (activeStageTab === 'gk2')
      return (
        e.stage === 'gk2' ||
        ['de-thuc-chien-11', 'de-thuc-chien-12', 'de-thuc-chien-13', 'de-thuc-chien-14', 'de-thuc-chien-15'].includes(e.id)
      );
    if (activeStageTab === 'ck2')
      return (
        e.stage === 'ck2' ||
        ['de-thuc-chien-16', 'de-thuc-chien-17', 'de-thuc-chien-18', 'de-thuc-chien-19', 'de-thuc-chien-20'].includes(e.id)
      );
    if (activeStageTab === 'tot-nghiep')
      return e.stage === 'tot-nghiep' || !['gk1', 'hk1', 'gk2', 'ck2'].includes(e.stage || '');
    return true;
  });

  const documentsList = [
    {
      id: 'doc-thptqg-1',
      title: 'Bộ 10 Đề Thi Minh Họa TN THPT Quốc Gia Môn Toán 2027 (Có Đáp Án & Lời Giải Chi Tiết)',
      category: 'Đề Thi Thử THPTQG',
      fileSize: '5.6 MB',
      updatedAt: '01/06/2026',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'doc-thptqg-2',
      title: 'Sổ Tay Công Thức Toán 12 Trọng Tâm Thi THPTQG (Hàm Số, Mũ-Logarit, Tích Phân, Oxyz)',
      category: 'Công Thức Toán 12',
      fileSize: '3.4 MB',
      updatedAt: '10/06/2026',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'doc-thptqg-3',
      title: 'Chuyên Đề Tổng Ôn 8+ & 9+ Môn Toán THPTQG (Tuyển Tập Dạng Bài Vận Dụng Cao)',
      category: 'Tổng Ôn 9+',
      fileSize: '7.2 MB',
      updatedAt: '15/06/2026',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'doc-thptqg-4',
      title: 'Phương Pháp Giải Nhanh Câu Hỏi Trắc Nghiệm Đúng/Sai & Trả Lời Ngắn Môn Toán 2027',
      category: 'Phương Pháp Giải',
      fileSize: '4.1 MB',
      updatedAt: '20/06/2026',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.12),transparent)] text-slate-900 antialiased selection:bg-blue-500/15 selection:text-blue-700 flex flex-col font-sans relative">
      {/* 1. Floating iOS Liquid Glass Topbar */}
      <header className="sticky top-0 z-40 w-full bg-white/75 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Brand Block */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavTabChange('overview')}
              className="flex items-center gap-2.5 group text-left"
            >
              <img
                src="/logo-parabol-icon.png"
                alt="PARABOL KHẢO THÍ"
                className="h-9 w-auto object-contain rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105 active:scale-95"
              />
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight text-[#0F172A]">
                  PARABOL KHẢO THÍ
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  Hệ Thống Khảo Thí & Luyện Đề Toán 12
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Pills (Synchronized Dynamic Tab Switcher) */}
          <nav className="hidden md:flex items-center bg-slate-900/[0.04] p-1 rounded-full border border-slate-200/50 shadow-inner">
            <button
              onClick={() => handleNavTabChange('overview')}
              className={`rounded-full px-4 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
                activeNavTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Tổng quan
            </button>

            <button
              onClick={() => handleNavTabChange('documents')}
              className={`rounded-full px-4 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
                activeNavTab === 'documents'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Tài liệu Toán 12
            </button>

            <button
              onClick={() => handleNavTabChange('leaderboard')}
              className={`rounded-full px-4 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
                activeNavTab === 'leaderboard'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Bảng xếp hạng
            </button>

            <button
              onClick={() => handleNavTabChange('contact')}
              className={`rounded-full px-4 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
                activeNavTab === 'contact'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Liên hệ
            </button>
          </nav>

          {/* Right User Profile Pill & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2.5 bg-white/80 border border-slate-200/70 rounded-full py-1.5 pl-1.5 pr-3 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {user?.name ? user.name[0]?.toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 line-clamp-1 max-w-[120px]">
                  {user?.name || user?.realName || 'Thí sinh'}
                </span>
                <span className="text-[10px] text-blue-600 font-mono font-medium leading-none">
                  {formatStudentBadge(user?.studentId)}
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-2 pb-4 space-y-1.5">
            <button
              onClick={() => handleNavTabChange('overview')}
              className={`w-full text-left font-semibold text-xs py-2 px-3 rounded-xl transition ${
                activeNavTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => handleNavTabChange('documents')}
              className={`w-full text-left font-semibold text-xs py-2 px-3 rounded-xl transition ${
                activeNavTab === 'documents' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Tài liệu Toán 12
            </button>
            <button
              onClick={() => handleNavTabChange('leaderboard')}
              className={`w-full text-left font-semibold text-xs py-2 px-3 rounded-xl transition ${
                activeNavTab === 'leaderboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Bảng xếp hạng
            </button>
            <button
              onClick={() => handleNavTabChange('contact')}
              className={`w-full text-left font-semibold text-xs py-2 px-3 rounded-xl transition ${
                activeNavTab === 'contact' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Liên hệ
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ============================================================ */}
        {/* TAB 1: TỔNG QUAN (BENTO STATS + 10 CHUYÊN ĐỀ + 30 ĐỀ THI)    */}
        {/* ============================================================ */}
        {activeNavTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 2. Compact Apple Bento Hero & Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Profile & Quick Progress Card (md:col-span-5) */}
              <div className="md:col-span-5 rounded-[24px] p-5 bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.25)] shrink-0">
                    {user?.name ? user.name[0]?.toUpperCase() : <User className="w-6 h-6" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 font-medium">Xin chào,</div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-base font-bold text-slate-900 truncate">
                        {user?.realName || user?.name || 'Thí sinh VIP'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setInputRealName(user?.realName || (user?.name?.toLowerCase().startsWith('học sinh') ? '' : user?.name) || '');
                          setShowNameModal(true);
                        }}
                        title="Đổi họ tên"
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full px-2 py-0.5 transition active:scale-95"
                      >
                        Đổi tên
                      </button>
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-bold text-blue-700 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-tight">
                      MÔN TOÁN 12 • {formatStudentBadge(user?.studentId)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <div className="text-xs font-semibold text-slate-700 mb-1">
                    Tiến độ <span className="font-mono text-blue-600 font-bold">{completedCount}/40 bài</span>
                  </div>
                  <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium mt-1">{progressPercent}% hoàn thành</span>
                </div>
              </div>

              {/* 3 Compact Metric Widgets (md:col-span-7 split into 3 sub-cards) */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Card 1: Số bài đã làm */}
                <div className="rounded-[24px] p-4 bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-medium">Số bài đã làm</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="tabular-nums text-2xl font-bold tracking-tight text-slate-900">
                    {totalTaken}
                  </div>
                </div>

                {/* Card 2: Điểm cao nhất */}
                <div className="rounded-[24px] p-4 bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-medium">Điểm cao nhất</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="tabular-nums text-2xl font-bold tracking-tight text-slate-900">
                    {highestScore > 0 ? `${highestScore}đ` : '--'}
                  </div>
                </div>

                {/* Card 3: Trạng thái tài khoản */}
                <div className="rounded-[24px] p-4 bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-medium">Trạng thái</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    {isUserVip ? (
                      <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Đã kích hoạt VIP
                      </span>
                    ) : (
                      <span className="bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1">
                        Tài khoản Free
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Section 1: 10 Chuyên Đề Toán 12 */}
            <section className="rounded-[28px] p-6 bg-white/60 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setOpenTopicsAccordion(!openTopicsAccordion)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold tracking-tight text-slate-900">
                        10 CHUYÊN ĐỀ TOÁN 12 TRỌNG TÂM
                      </h3>
                      <span className="rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20 px-2.5 py-0.5 text-xs font-semibold">
                        10 Chuyên đề chuẩn GDPT 2018
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Luyện tập chuyên sâu các chuyên đề cốt lõi theo chương trình mới của Bộ Giáo dục & Đào tạo
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-white/80 border border-slate-200/60 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-transform duration-200 active:scale-95 shrink-0"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openTopicsAccordion ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {openTopicsAccordion && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-6 pt-6 border-t border-slate-200/50">
                  {practiceExams.map((topic) => {
                    const isPublished = topic.isPublished ?? topic.status !== 'CHƯA UPDATE';
                    const sub = submissions.find((s) => s.examId === topic.id);
                    const canAccess = isPublished;

                    return (
                      <div
                        key={topic.id}
                        className="rounded-[20px] p-4 bg-white/90 backdrop-blur-md border border-white/90 ring-1 ring-slate-900/[0.04] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex items-center justify-between gap-3.5"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                            {topic.id.replace('chuyen-de-', '')}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                              {topic.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium text-slate-400">
                                22 câu • 45 phút
                              </span>
                              {sub && (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                                  Đã làm: {sub.score}đ
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-1">
                              {topic.description}
                            </p>
                          </div>
                        </div>

                        {canAccess ? (
                          <Link
                            href={`/exams/${topic.id}`}
                            className="rounded-full px-4 py-2 text-xs font-semibold bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.25),inset_0_1px_0_0_rgba(255,255,255,0.3)] hover:from-blue-600 hover:to-blue-700 active:scale-[0.96] transition-all shrink-0 flex items-center gap-1.5"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Luyện ngay</span>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="rounded-full px-4 py-2 text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shrink-0 flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" /> Chưa mở
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 4. Section 2: 30 Đề Thi Thực Chiến THPTQG 2027 */}
            <section className="rounded-[28px] p-6 bg-white/60 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">
                      30 ĐỀ THI THỰC CHIẾN THPTQG 2027
                    </h3>
                    <span className="rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
                      Update liên tục
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Hệ thống 30 đề thi chuẩn cấu trúc 22 câu - 90 phút theo 5 giai đoạn năm học
                  </p>
                </div>

                {/* 5-Stage Segmented Control Pill Bar */}
                <div className="flex items-center bg-slate-900/[0.04] p-1 rounded-full border border-slate-200/60 shadow-inner overflow-x-auto no-scrollbar shrink-0">
                  <button
                    onClick={() => setActiveStageTab('gk1')}
                    className={`rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 whitespace-nowrap active:scale-95 ${
                      activeStageTab === 'gk1'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 font-medium'
                    }`}
                  >
                    Giữa Kì 1 (Đề 01-05)
                  </button>
                  <button
                    onClick={() => setActiveStageTab('hk1')}
                    className={`rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 whitespace-nowrap active:scale-95 ${
                      activeStageTab === 'hk1'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 font-medium'
                    }`}
                  >
                    Học Kì 1 (Đề 06-10)
                  </button>
                  <button
                    onClick={() => setActiveStageTab('gk2')}
                    className={`rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 whitespace-nowrap active:scale-95 ${
                      activeStageTab === 'gk2'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 font-medium'
                    }`}
                  >
                    Giữa Kì 2 (Đề 11-15)
                  </button>
                  <button
                    onClick={() => setActiveStageTab('ck2')}
                    className={`rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 whitespace-nowrap active:scale-95 ${
                      activeStageTab === 'ck2'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 font-medium'
                    }`}
                  >
                    Cuối Kì 2 (Đề 16-20)
                  </button>
                  <button
                    onClick={() => setActiveStageTab('tot-nghiep')}
                    className={`rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 whitespace-nowrap active:scale-95 ${
                      activeStageTab === 'tot-nghiep'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 font-medium'
                    }`}
                  >
                    Đề Tốt Nghiệp 2027 (Đề 21-30)
                  </button>
                </div>
              </div>

              {/* Exam Rows List */}
              <div className="space-y-3">
                {currentStageExams.map((exam) => {
                  const isPublished = exam.isPublished ?? exam.status !== 'CHƯA UPDATE';
                  const isDemoExam = exam.isFree || exam.isDemoExam || exam.id.includes('demo') || exam.id === 'de-thuc-chien-01';
                  const canAccess = isPublished && (isDemoExam || isUserVip || user?.role === 'admin');
                  const sub = submissions.find((s) => s.examId === exam.id);

                  let stageBadge = {
                    label: 'Tốt Nghiệp',
                    cls: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
                  };
                  if (exam.stage === 'gk1')
                    stageBadge = {
                      label: 'Giữa Kì 1',
                      cls: 'bg-amber-500/10 text-amber-800 border-amber-500/20',
                    };
                  else if (exam.stage === 'hk1')
                    stageBadge = {
                      label: 'Học Kì 1',
                      cls: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
                    };
                  else if (exam.stage === 'gk2')
                    stageBadge = {
                      label: 'Giữa Kì 2',
                      cls: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
                    };
                  else if (exam.stage === 'ck2')
                    stageBadge = {
                      label: 'Cuối Kì 2',
                      cls: 'bg-teal-500/10 text-teal-800 border-teal-500/20',
                    };

                  return (
                    <div
                      key={exam.id}
                      className="rounded-[18px] bg-white/85 hover:bg-white p-4 border border-slate-200/60 hover:border-blue-300/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        <span className="w-9 h-9 rounded-xl bg-slate-100/90 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200/60 shadow-2xs">
                          {exam.id.replace('de-thuc-chien-', '')}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h4 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition">
                              {exam.title}
                            </h4>
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${stageBadge.cls}`}>
                              {stageBadge.label}
                            </span>
                            {isDemoExam && (
                              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                🎁 Đề Thi Thử Miễn Phí
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                            {exam.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                            sub
                              ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20 font-bold'
                              : 'text-slate-500 bg-slate-100/80 border-slate-200/60'
                          }`}
                        >
                          {sub ? `Đã nộp (${sub.score}đ)` : '22 câu • 90 phút'}
                        </span>

                        {canAccess ? (
                          <Link
                            href={`/exams/${exam.id}`}
                            className="rounded-full px-4 py-2 text-xs font-semibold bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.25),inset_0_1px_0_0_rgba(255,255,255,0.3)] hover:from-blue-600 hover:to-blue-700 active:scale-[0.96] transition-all flex items-center gap-1.5 shrink-0"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>{sub ? 'Thi lại' : 'Vào thi'}</span>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="rounded-full px-4 py-2 text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shrink-0 flex items-center gap-1"
                          >
                            <Lock className="w-3.5 h-3.5" /> Chưa mở
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: TÀI LIỆU TOÁN 12 & ĐỀ THI MẪU                         */}
        {/* ============================================================ */}
        {activeNavTab === 'documents' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Glass Banner */}
            <div className="rounded-[28px] p-6 sm:p-8 bg-white/75 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Kho Học Liệu Số • Môn Toán 12</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                <BookOpen className="w-7 h-7 text-blue-600" />
                <span>Tài Liệu Toán 12 & Đề Thi Chuẩn Bộ GD&ĐT</span>
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
                Tải miễn phí các bộ tài liệu tuyển chọn, chuyên đề 8+, sổ tay công thức cốt lõi và tuyển tập đề thi thử bám sát cấu trúc đề tốt nghiệp THPT Quốc Gia mới nhất.
              </p>
            </div>

            {/* 2 Apple Spatial Featured Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: YouTube Video Lectures */}
              <div className="rounded-[24px] p-6 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white shadow-[0_12px_36px_rgba(30,58,138,0.25)] flex flex-col justify-between space-y-5 relative overflow-hidden">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-bold tracking-wide">
                    <PlaySquare className="w-3.5 h-3.5 text-blue-200" />
                    <span>BÀI GIẢNG VIDEO CHỮA ĐỀ CHI TIẾT</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                    Kênh Bài Giảng Giải Đề THPTQG
                  </h2>
                  <p className="text-xs text-blue-100 leading-relaxed opacity-90">
                    Tổng hợp video chữa chi tiết các đề thi thử Toán 12, phân tích bẫy đề thi và phương pháp giải nhanh Trắc nghiệm Đúng/Sai & Điền số chuẩn cấu trúc 2027.
                  </p>
                </div>

                <a
                  href="https://www.youtube.com/@siiuuuu77777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 text-blue-700 font-semibold text-xs px-5 py-2.5 transition-all shadow-sm active:scale-95 w-fit"
                >
                  <span>Xem Kênh YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Card 2: Zalo Study Support Community */}
              <div className="rounded-[24px] p-6 bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-800 text-white shadow-[0_12px_36px_rgba(37,99,235,0.25)] flex flex-col justify-between space-y-5 relative overflow-hidden">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-bold tracking-wide">
                    <Users className="w-3.5 h-3.5 text-sky-200" />
                    <span>CỘNG ĐỒNG HỌC TẬP TOÁN 12</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                    Cộng Đồng Hỏi Đáp & Trao Đổi Bài Tập
                  </h2>
                  <p className="text-xs text-blue-100 leading-relaxed opacity-90">
                    Tham gia nhóm Zalo để trao đổi giải bài tập khó hàng ngày, nhận tài liệu tổng ôn vận dụng cao và giải đáp thắc mắc trực tiếp cùng thầy cô và bạn học.
                  </p>
                </div>

                <a
                  href="https://zalo.me/g/mw6rrjaosw86oamzaxy1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 text-indigo-700 font-semibold text-xs px-5 py-2.5 transition-all shadow-sm active:scale-95 w-fit"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Tham gia Nhóm Zalo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PDF Downloads Section */}
            <div className="rounded-[28px] p-6 sm:p-8 bg-white/75 backdrop-blur-xl border border-white/80 ring-1 ring-slate-900/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Danh Sách Tài Liệu PDF Miễn Phí</span>
                </h2>
                <span className="text-xs text-slate-400 font-medium">Cập nhật định kỳ 2026-2027</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentsList.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-[20px] p-5 bg-white/90 border border-white/90 ring-1 ring-slate-900/[0.04] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${doc.badgeColor}`}
                      >
                        {doc.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                        <span>Dung lượng: <strong className="text-slate-700">{doc.fileSize}</strong></span>
                        <span>•</span>
                        <span>Cập nhật: {doc.updatedAt}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Đang tải tài liệu PDF: "${doc.title}"`)}
                      className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 transition-all active:scale-95 shadow-xs flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải tài liệu PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: BẢNG XẾP HẠNG TOÀN HỆ THỐNG                          */}
        {/* ============================================================ */}
        {activeNavTab === 'leaderboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Rank 2 (Silver) */}
              <div className="rounded-[24px] bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] p-6 shadow-sm flex flex-col items-center text-center space-y-3 order-2 md:order-1 mt-0 md:mt-6">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-2xl flex items-center justify-center border-2 border-slate-300 shadow-inner">
                  🥈
                </div>
                <span className="rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-0.5 uppercase tracking-wider">
                  HẠNG 2 • Á QUÂN
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  {leaderboard[1]?.name || 'Trần Thị Mai'}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {leaderboard[1]?.studentId || 'THPTQG_2027_02'}
                </p>
                <div className="rounded-full bg-slate-100 text-slate-800 font-mono font-bold text-lg px-4 py-1">
                  {leaderboard[1]?.highestScore || 9.4} điểm
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
                <h3 className="font-bold text-white text-lg">
                  {leaderboard[0]?.name || 'Nguyễn Văn An'}
                </h3>
                <p className="text-xs font-mono text-amber-100">
                  {leaderboard[0]?.studentId || 'THPTQG_2027_01'}
                </p>
                <div className="rounded-full bg-amber-400/30 text-white font-mono font-bold text-2xl px-5 py-1.5 border border-white/25">
                  {leaderboard[0]?.highestScore || 9.8} điểm
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
                <h3 className="font-bold text-slate-900 text-base">
                  {leaderboard[2]?.name || 'Lê Hoàng Nam'}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {leaderboard[2]?.studentId || 'THPTQG_2027_03'}
                </p>
                <div className="rounded-full bg-amber-50 text-amber-900 font-mono font-bold text-lg px-4 py-1">
                  {leaderboard[2]?.highestScore || 9.0} điểm
                </div>
              </div>
            </div>

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
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: LIÊN HỆ & TRỢ GIÚP KỸ THUẬT                           */}
        {/* ============================================================ */}
        {activeNavTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
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
                Hệ thống khảo thí PARABOL KHẢO THÍ cam kết hỗ trợ tối đa cho học sinh trong quá trình ôn luyện và thi thử trực tuyến.
              </p>
            </div>

            {/* 3 Metric Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-[24px] p-6 bg-white/80 backdrop-blur-xl border border-white/90 ring-1 ring-slate-900/[0.05] shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Email Hỗ Trợ</h3>
                <p className="text-xs text-slate-500 font-mono break-all">support.parabol.edu.vn@gmail.com</p>
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
                <p className="text-xs text-slate-600 font-mono font-bold">PARABOL KHẢO THÍ v2.7 Pro</p>
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

              <form onSubmit={handleSendFeedback} className="space-y-4">
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Nhập nội dung thắc mắc, phản ánh lỗi đề thi hoặc yêu cầu trợ giúp kỹ thuật tại đây..."
                  className="w-full rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all resize-none shadow-xs"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={feedbackSent || !feedbackText.trim()}
                    className="rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs px-6 py-2.5 transition-all active:scale-95 shadow-sm flex items-center gap-2"
                  >
                    {feedbackSent ? (
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
          </div>
        )}
      </main>

      {/* MANDATORY / PERSONALIZED NAME ENTRY MODAL (Apple iOS Liquid Glass) */}
      {needsName && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/90 ring-1 ring-slate-900/[0.05] space-y-6 relative">
            <button
              type="button"
              onClick={() => setShowNameModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Cá Nhân Hóa Thí Sinh</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chào mừng bạn đến với <strong>PARABOL KHẢO THÍ</strong>! Vui lòng nhập Họ & Tên của bạn để hiển thị trên hồ sơ thi thử, kết quả làm bài và bảng vinh danh.
              </p>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Họ và tên thí sinh *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={inputRealName}
                  onChange={(e) => setInputRealName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Cường"
                  className="w-full text-sm border border-slate-200 bg-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900 shadow-xs transition-all"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={submittingName || !inputRealName.trim()}
                  className="w-full rounded-full py-3.5 text-sm font-semibold bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_2px_12px_rgba(37,99,235,0.3)] hover:from-blue-600 hover:to-blue-700 active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingName ? 'Đang lưu...' : 'Xác nhận & Bắt đầu luyện thi'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  Để sau (Sử dụng tên mặc định)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
