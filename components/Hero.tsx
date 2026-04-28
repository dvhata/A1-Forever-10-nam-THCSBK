'use client';

import { useEffect, useRef } from 'react';

/* SVG hoa watercolor dạng inline */
function FlowerBlob({ color, size, style }: { color: string; size: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 200 200"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
      aria-hidden
    >
      <defs>
        <filter id={`blur-${color.replace('#','')}`}>
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      {/* petals */}
      {[0,60,120,180,240,300].map((deg, i) => (
        <ellipse
          key={i}
          cx={100 + 38 * Math.cos((deg * Math.PI) / 180)}
          cy={100 + 38 * Math.sin((deg * Math.PI) / 180)}
          rx="28" ry="18"
          fill={color}
          opacity="0.55"
          transform={`rotate(${deg} ${100 + 38 * Math.cos((deg * Math.PI) / 180)} ${100 + 38 * Math.sin((deg * Math.PI) / 180)})`}
          filter={`url(#blur-${color.replace('#','')})`}
        />
      ))}
      <circle cx="100" cy="100" r="22" fill={color} opacity="0.7" filter={`url(#blur-${color.replace('#','')})`} />
    </svg>
  );
}

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const children = contentRef.current.querySelectorAll('.hero-item');
    children.forEach((el, i) => {
      const e = el as HTMLElement;
      e.style.opacity = '0';
      e.style.transform = 'translateY(22px)';
      e.style.transition = `opacity 0.9s ease, transform 0.9s ease`;
      e.style.transitionDelay = `${0.1 + i * 0.18}s`;
      requestAnimationFrame(() => {
        e.style.opacity = '1';
        e.style.transform = 'translateY(0)';
      });
    });
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #EEF7FC 0%, #FDFAF6 45%, #FDE8EE 100%)' }}
    >
      {/* ── Watercolor flower blobs ──────────────────────────────── */}
      <FlowerBlob color="#A8D4EC" size={320} style={{ top: '-60px', left: '-80px', opacity: 0.45 }} />
      <FlowerBlob color="#F2A7B8" size={280} style={{ top: '-40px', right: '-60px', opacity: 0.4 }} />
      <FlowerBlob color="#C4B5E0" size={220} style={{ bottom: '60px', left: '8%', opacity: 0.3 }} />
      <FlowerBlob color="#F2A7B8" size={260} style={{ bottom: '-40px', right: '5%', opacity: 0.35 }} />
      <FlowerBlob color="#A8C5A0" size={160} style={{ top: '40%', left: '55%', opacity: 0.2 }} />

      {/* Floating petals */}
      {[
        { w: 10, h: 16, color: '#F2A7B8', left: '15%', delay: '0s',  dur: '6s'  },
        { w: 8,  h: 13, color: '#C4B5E0', left: '35%', delay: '2s',  dur: '7.5s'},
        { w: 12, h: 18, color: '#A8D4EC', left: '60%', delay: '1s',  dur: '5.5s'},
        { w: 7,  h: 11, color: '#F2A7B8', left: '80%', delay: '3s',  dur: '8s'  },
        { w: 9,  h: 14, color: '#C4B5E0', left: '50%', delay: '4s',  dur: '6.5s'},
      ].map((p, i) => (
        <div
          key={i}
          className="petal"
          style={{
            width: p.w, height: p.h,
            background: p.color,
            left: p.left,
            bottom: '-20px',
            opacity: 0.6,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 sm:px-16 py-6 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-montserrat font-semibold tracking-widest uppercase" style={{ color: '#3D5A7A' }}>
            THCS Bắc Kạn
          </span>
        </div>
        <span
          className="text-xs font-montserrat tracking-widest px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(168,212,236,0.25)', color: '#3D5A7A', border: '1px solid rgba(168,212,236,0.5)' }}
        >
          Niên khóa 2012 – 2016
        </span>
      </div>

      {/* ── Main content ────────────────────────────────────────── */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center px-6 sm:px-12">

        {/* Badge */}
        <div
          className="hero-item inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(242,167,184,0.18)',
            border: '1px solid rgba(224,120,152,0.35)',
            color: '#C0607E',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span>🌸</span> Kỷ niệm 10 năm ra trường <span>🌸</span>
        </div>

        {/* Big "10" */}
        <div className="hero-item relative">
          <span
            className="font-playfair font-bold select-none"
            style={{
              fontSize: 'clamp(7rem,22vw,18rem)',
              lineHeight: 0.85,
              background: 'linear-gradient(135deg, #A8D4EC 0%, #C4B5E0 40%, #F2A7B8 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 16px rgba(168,212,236,0.4))',
            }}
          >
            10
          </span>
        </div>

        {/* "Năm Ngày Trở Về" */}
        <div className="hero-item -mt-4 sm:-mt-6">
          <p
            className="font-dancing font-bold"
            style={{
              fontSize: 'clamp(2.2rem,7vw,5.5rem)',
              color: '#2C4A6E',
              lineHeight: 1.1,
            }}
          >
            Năm Ngày Trở Về
          </p>
        </div>

        {/* School + date */}
        <div className="hero-item mt-5 space-y-1.5">
          <p
            className="font-playfair font-semibold text-base sm:text-lg tracking-wide"
            style={{ color: '#3D5A7A' }}
          >
            Lớp 9A1 — Trường THCS Bắc Kạn
          </p>
          <p
            className="font-montserrat text-sm"
            style={{ color: 'rgba(44,74,110,0.6)' }}
          >
            Bắc Kạn, ngày 01 tháng 05 năm 2026
          </p>
        </div>

        {/* Tagline */}
        <p
          className="hero-item mt-6 max-w-md font-montserrat leading-relaxed"
          style={{ fontSize: '0.95rem', color: 'rgba(44,74,110,0.65)' }}
        >
          Mười năm qua đi, mỗi người một nẻo đường — hôm nay cùng nhau trở về, kể lại câu chuyện của mình.
        </p>

        {/* CTAs */}
        <div className="hero-item mt-10 flex flex-col sm:flex-row items-center gap-4">
          {/* Thiệp mời — nổi bật nhất */}
          <a
            href="#invitation"
            className="inline-flex items-center gap-2 font-montserrat font-bold text-sm tracking-wide px-7 py-3.5 rounded-full transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg,#F2A7B8,#C4B5E0)',
              color: '#fff',
              boxShadow: '0 6px 24px rgba(224,120,152,0.35)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 32px rgba(224,120,152,0.45)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 24px rgba(224,120,152,0.35)';
            }}
          >
            💌 Xem thiệp mời
          </a>
          <a href="#datahub" className="btn-primary">
            ✏️ Chia sẻ thông tin
          </a>
          <a href="#memories" className="btn-outline">
            📷 Xem kỷ niệm ↓
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs font-montserrat tracking-widest uppercase" style={{ color: 'rgba(44,74,110,0.4)' }}>
          Cuộn xuống
        </span>
        <div className="w-px h-8 overflow-hidden rounded-full" style={{ background: 'rgba(168,212,236,0.25)' }}>
          <div className="w-full h-4 rounded-full" style={{ background: '#A8D4EC', animation: 'scrollLine 1.8s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 divider-rose" />
    </section>
  );
}
