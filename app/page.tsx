'use client';

import { useEffect } from 'react';
import Hero from '@/components/Hero';
import ImageCarousel from '@/components/ImageCarousel';
import Chalkboard from '@/components/Chalkboard';
import DataHub from '@/components/DataHub';
import { MessageWall } from '@/components/MessageWall';
import VideoSection from '@/components/VideoSection';
import MediaWall from '@/components/MediaWall';

function SectionHeader({ label, title, light }: { label: string; title: string; light?: boolean }) {
  return (
    <div className="mb-12 reveal">
      <div className="section-label">
        <span
          className="text-xs font-montserrat font-semibold tracking-widest uppercase"
          style={{ color: light ? 'rgba(255,255,255,0.7)' : '#E07898' }}
        >
          {label}
        </span>
      </div>
      <h2
        className="font-playfair font-bold"
        style={{
          fontSize: 'clamp(1.8rem,4.5vw,3rem)',
          color: light ? '#fff' : '#2C4A6E',
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen" style={{ background: '#FDFAF6' }}>
      <Hero />
      <ImageCarousel />
      <Chalkboard />
      <DataHub />

      {/* ── Message Wall ────────────────────────────────────────── */}
      <section
        className="py-20 sm:py-28"
        style={{ background: 'linear-gradient(160deg, #EEF7FC 0%, #FDE8EE 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          <SectionHeader label="Lời nhắn" title="Thư gửi cả lớp 💌" />
          <div className="divider-rose mb-12" />
          <div className="reveal stagger-2">
            <MessageWall />
          </div>
        </div>
      </section>

      <VideoSection />
      <MediaWall />

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        style={{
          background: 'linear-gradient(135deg, #2C4A6E 0%, #3D5A7A 60%, #5A4070 100%)',
          borderTop: '3px solid rgba(242,167,184,0.4)',
        }}
      >
        <div className="max-w-5xl mx-auto px-8 sm:px-16 py-16">
          {/* Flower deco */}
          <div className="text-center mb-10">
            <p className="text-4xl mb-3">🌸 🌷 🌸</p>
            <h3 className="font-playfair font-bold text-white text-2xl sm:text-3xl">
              Lớp 9A1 Bắc Kạn
            </h3>
            <p
              className="font-dancing font-semibold text-xl mt-2"
              style={{ color: 'rgba(242,167,184,0.85)' }}
            >
              10 Năm Ngày Trở Về
            </p>
          </div>

          <div className="divider-rose mb-10 opacity-40" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-xs font-montserrat tracking-widest uppercase mb-2" style={{ color: 'rgba(168,212,236,0.7)' }}>
                Trường
              </p>
              <p className="text-white font-montserrat text-sm">THCS Bắc Kạn</p>
            </div>
            <div>
              <p className="text-xs font-montserrat tracking-widest uppercase mb-2" style={{ color: 'rgba(168,212,236,0.7)' }}>
                Niên khóa
              </p>
              <p className="text-white font-montserrat text-sm">2012 – 2016</p>
            </div>
            <div>
              <p className="text-xs font-montserrat tracking-widest uppercase mb-2" style={{ color: 'rgba(168,212,236,0.7)' }}>
                Ngày gặp mặt
              </p>
              <p className="text-white font-montserrat text-sm">01/05/2026</p>
            </div>
          </div>

          <div className="divider-rose mt-10 mb-6 opacity-20" />
          <p className="text-center text-xs font-montserrat" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © 2026 Lớp 9A1 THCS Bắc Kạn · Nơi kết nối những trái tim
          </p>
        </div>
      </footer>
    </main>
  );
}
