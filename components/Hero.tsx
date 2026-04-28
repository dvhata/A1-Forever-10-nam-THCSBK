'use client';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Subtle radial glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 sm:px-16 py-7 z-10">
        <span className="text-xs tracking-[0.25em] text-[#888888] uppercase font-montserrat">
          THCS Bắc Kạn
        </span>
        <span className="text-xs tracking-[0.25em] text-[#888888] uppercase font-montserrat">
          2012 — 2016
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-8 sm:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        {/* Year badge */}
        <div className="mb-10 flex items-center gap-4">
          <div className="divider-gold w-12" />
          <span
            className="text-xs tracking-[0.3em] uppercase font-montserrat"
            style={{ color: '#C9A84C' }}
          >
            Kỷ niệm 10 năm
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-playfair font-bold leading-none tracking-tight">
          <span
            className="block text-[clamp(4rem,14vw,12rem)] text-white"
            style={{ lineHeight: 0.9 }}
          >
            A1
          </span>
          <span
            className="block text-[clamp(1.5rem,5vw,4rem)] mt-3 gold-shimmer font-playfair"
            style={{ letterSpacing: '0.12em' }}
          >
            BẮC KẠN
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="mt-10 text-base sm:text-lg font-montserrat max-w-lg leading-relaxed"
          style={{ color: '#888888' }}
        >
          Mười năm trôi qua, mỗi người một con đường — nhưng ký ức về lớp A1 thì mãi còn đó.
        </p>

        {/* CTA row */}
        <div className="mt-12 flex items-center gap-8">
          <a
            href="#datahub"
            className="inline-flex items-center gap-3 text-sm font-montserrat tracking-widest uppercase transition-colors"
            style={{ color: '#C9A84C' }}
          >
            <span
              className="w-10 h-px"
              style={{ background: '#C9A84C' }}
            />
            Chia sẻ thông tin
          </a>
          <a
            href="#memories"
            className="text-sm font-montserrat tracking-widest uppercase transition-opacity hover:opacity-60"
            style={{ color: '#888888' }}
          >
            Xem kỷ niệm ↓
          </a>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="divider-gold" />
      </div>

      {/* Large watermark number */}
      <div
        className="absolute right-0 bottom-0 pointer-events-none select-none font-playfair font-bold"
        style={{
          fontSize: 'clamp(12rem, 35vw, 32rem)',
          lineHeight: 0.8,
          color: 'rgba(201,168,76,0.04)',
          bottom: '-2rem',
          right: '-1rem',
        }}
      >
        10
      </div>
    </section>
  );
}
