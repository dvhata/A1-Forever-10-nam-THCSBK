'use client';

import { useEffect, useRef } from 'react';

export default function Invitation() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="invitation"
      className="reveal py-16 sm:py-24"
      style={{ background: 'linear-gradient(160deg, #EEF7FC 0%, #FDE8EE 60%, #F0EBF8 100%)' }}
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-12">

        {/* ── Thiệp mời ───────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(242,167,184,0.45)',
            borderRadius: '1.5rem',
            boxShadow: '0 8px 48px rgba(224,120,152,0.12), 0 2px 16px rgba(168,212,236,0.1)',
          }}
        >
          {/* Hoa góc trái trên */}
          <div className="absolute -top-8 -left-8 text-[7rem] pointer-events-none select-none opacity-20" aria-hidden>🌸</div>
          {/* Hoa góc phải dưới */}
          <div className="absolute -bottom-8 -right-8 text-[7rem] pointer-events-none select-none opacity-20" aria-hidden>🌷</div>
          {/* Hoa góc phải trên */}
          <div className="absolute -top-4 right-12 text-[4rem] pointer-events-none select-none opacity-15" aria-hidden>🌺</div>

          {/* Dải màu top */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #A8D4EC, #F2A7B8, #C4B5E0, #A8C5A0, #F2A7B8)' }} />

          <div className="px-8 sm:px-14 py-10 sm:py-14 relative z-10">

            {/* Header */}
            <div className="text-center mb-10">
              <p
                className="font-montserrat text-xs font-semibold tracking-[0.3em] uppercase mb-4"
                style={{ color: '#A8D4EC' }}
              >
                ✦ Trân trọng kính mời ✦
              </p>

              <p
                className="font-dancing font-bold"
                style={{ fontSize: 'clamp(1.6rem,5vw,2.8rem)', color: '#C07090', lineHeight: 1.2 }}
              >
                Bạn được mời tới dự
              </p>

              <h2
                className="font-playfair font-bold mt-3"
                style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)', color: '#2C4A6E', lineHeight: 1.3 }}
              >
                Tiệc kỷ niệm 10 năm ra trường
              </h2>

              <p
                className="font-playfair font-semibold mt-2"
                style={{ fontSize: 'clamp(1rem,2.5vw,1.3rem)', color: '#5A8FAF' }}
              >
                Tập thể lớp A1 — THCS Bắc Kạn (2012–2016)
              </p>

              {/* Divider hoa */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(242,167,184,0.5))' }} />
                <span className="text-xl">🌸</span>
                <span className="text-xl">🌼</span>
                <span className="text-xl">🌸</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(242,167,184,0.5),transparent)' }} />
              </div>
            </div>

            {/* ── Thông tin chính ─────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

              {/* Thời gian */}
              <div
                className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(168,212,236,0.12)', border: '1.5px solid rgba(168,212,236,0.35)' }}
              >
                <div className="text-3xl mb-3">🕔</div>
                <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-2" style={{ color: '#5A8FAF' }}>
                  Thời gian
                </p>
                <p className="font-playfair font-bold text-lg" style={{ color: '#2C4A6E' }}>17:00</p>
                <p className="font-montserrat text-sm mt-1" style={{ color: '#3D5A7A' }}>Thứ Sáu, 01/05/2026</p>
              </div>

              {/* Địa điểm */}
              <div
                className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(242,167,184,0.12)', border: '1.5px solid rgba(242,167,184,0.35)' }}
              >
                <div className="text-3xl mb-3">📍</div>
                <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-2" style={{ color: '#C07090' }}>
                  Địa điểm
                </p>
                <p className="font-playfair font-bold text-lg" style={{ color: '#2C4A6E' }}>Trà Hoa Viên</p>
                <p className="font-montserrat text-sm mt-1" style={{ color: '#3D5A7A' }}>Bắc Kạn</p>
              </div>

              {/* Dress code */}
              <div
                className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(196,181,224,0.12)', border: '1.5px solid rgba(196,181,224,0.35)' }}
              >
                <div className="text-3xl mb-3">👗</div>
                <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-2" style={{ color: '#9B7EC8' }}>
                  Dress code
                </p>
                <p className="font-playfair font-bold text-base" style={{ color: '#2C4A6E' }}>
                  Gì cũng được
                </p>
                <p className="font-montserrat text-sm mt-1" style={{ color: '#5A4070' }}>
                  miễn là bạn thấy xinh 🌟
                </p>
              </div>
            </div>

            {/* ── Google Map ──────────────────────────────────── */}
            <div className="mb-10">
              <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: '#5A8FAF' }}>
                🗺️ Bản đồ đường đi
              </p>
              <div
                className="overflow-hidden"
                style={{ borderRadius: '1rem', border: '2px solid rgba(168,212,236,0.4)', boxShadow: '0 4px 20px rgba(168,212,236,0.15)' }}
              >
                <iframe
                  title="Trà Hoa Viên Bắc Kạn"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.123456789!2d105.833!3d22.147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36cc9a3b36f12345%3A0xabcdef123456!2zVHLDoCBIb2EgVmnDqm4!5e0!3m2!1svi!2svn!4v1234567890"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-3 text-center">
                <a
                  href="https://maps.google.com/?q=Trà+Hoa+Viên+Bắc+Kạn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-montserrat font-semibold tracking-widest uppercase transition-all duration-200 hover:opacity-80"
                  style={{ color: '#E07898' }}
                >
                  📍 Mở trong Google Maps →
                </a>
              </div>
            </div>

            {/* ── Lời kết ─────────────────────────────────────── */}
            <div
              className="rounded-2xl px-8 py-7 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(253,232,238,0.7), rgba(238,247,252,0.7))' }}
            >
              <p
                className="font-dancing font-bold"
                style={{ fontSize: 'clamp(1.3rem,3.5vw,2rem)', color: '#2C4A6E', lineHeight: 1.4 }}
              >
                Hẹn gặp lại...
              </p>
              <p
                className="font-montserrat text-sm mt-3 leading-relaxed"
                style={{ color: 'rgba(44,74,110,0.65)' }}
              >
                Dù bận đến đâu, hãy về nhé — vì có những khoảnh khắc chỉ xảy ra một lần. 🌸
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 my-5">
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(242,167,184,0.4))' }} />
                <span className="text-base">💌</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(242,167,184,0.4),transparent)' }} />
              </div>

              <p className="font-dancing font-bold text-xl" style={{ color: '#C07090' }}>
                Ban tổ chức
              </p>
              <p
                className="font-montserrat text-xs mt-1 tracking-widest"
                style={{ color: 'rgba(44,74,110,0.45)' }}
              >
                with love 💗
              </p>
            </div>

          </div>

          {/* Dải màu bottom */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #F2A7B8, #C4B5E0, #A8D4EC, #A8C5A0, #F2A7B8)' }} />
        </div>

      </div>
    </section>
  );
}
