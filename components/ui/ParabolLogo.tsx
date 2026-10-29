'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ParabolLogoProps {
  variant?: 'mark' | 'horizontal' | 'square';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  subtitle?: string;
}

export function ParabolMarkSVG({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PARABOL KHẢO THÍ Logo"
    >
      <defs>
        <linearGradient id="pStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="pLoopGrad" x1="20%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="parabolaGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="40%" stopColor="#2563EB" />
          <stop offset="70%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
        <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Main Geometric Letter P */}
      <g filter="url(#subtleGlow)">
        {/* Vertical Stem */}
        <path
          d="M26 22H42V78H26V22Z"
          fill="url(#pStemGrad)"
          rx="2"
        />

        {/* P Upper Loop */}
        <path
          d="M40 22H58C71.2548 22 82 32.7452 82 46C82 59.2548 71.2548 70 58 70H40V22ZM42 35V57H57C63.0751 57 68 52.0751 68 46C68 39.9249 63.0751 35 57 35H42Z"
          fill="url(#pLoopGrad)"
        />

        {/* Dynamic Upward Parabolic Curve (y = ax^2) swooping through the P */}
        <path
          d="M18 20 C22 55, 38 72, 54 62 C68 53, 76 34, 82 17"
          stroke="url(#parabolaGrad)"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Subtle inner accent curve for 3D depth */}
        <path
          d="M20 22 C23 52, 38 68, 54 59 C67 51, 74 34, 80 19"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.45"
          fill="none"
        />
      </g>
    </svg>
  );
}

export default function ParabolLogo({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showText = true,
  subtitle = 'Hệ Thống Khảo Thí & Luyện Đề Toán 12',
}: ParabolLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Height mappings
  const heightMap = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  if (variant === 'square') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-sm">
          {!imgError ? (
            <img
              src="/logo-parabol.png"
              alt="PARABOL KHẢO THÍ"
              className={`${heightMap[size]} w-auto object-contain rounded-2xl`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-200/80 shadow-sm flex items-center justify-center">
              <ParabolMarkSVG className="w-12 h-12" />
            </div>
          )}
        </div>
        {showText && (
          <div className="text-center">
            <h1 className="text-lg font-black tracking-tight text-[#0F172A] leading-tight">
              PARABOL KHẢO THÍ
            </h1>
            {subtitle && (
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon / Mark */}
      <div className="relative shrink-0 flex items-center">
        {!imgError ? (
          <img
            src="/logo-parabol-icon.png"
            alt="PARABOL KHẢO THÍ"
            className={`${heightMap[size]} w-auto object-contain rounded-xl shadow-xs`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="p-1 rounded-xl bg-white border border-slate-200/70 shadow-xs">
            <ParabolMarkSVG className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-sm font-extrabold tracking-tight text-[#0F172A] leading-snug flex items-center gap-1.5">
            <span>PARABOL KHẢO THÍ</span>
          </span>
          {subtitle && (
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline leading-none mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
