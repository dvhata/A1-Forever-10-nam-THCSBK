'use client';

import { CLASS_MEMBERS, TEACHERS } from '@/lib/constants';

export default function Chalkboard() {
  return (
    <section
      className="py-20 sm:py-28"
      style={{ background: 'linear-gradient(160deg, #FDFAF6 0%, #EEF7FC 100%)' }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-12">

        {/* Section header */}
        <div className="mb-12 reveal">
          <div className="section-label">
            <span className="text-xs font-montserrat font-semibold tracking-widest uppercase" style={{ color: '#E07898' }}>
              Danh sách lớp
            </span>
          </div>
          <h2 className="font-playfair font-bold" style={{ fontSize: 'clamp(1.8rem,4.5vw,3rem)', color: '#2C4A6E' }}>
            Thành viên lớp 9A1
          </h2>
        </div>

        {/* Teachers card */}
        <div className="card-soft p-8 mb-10 reveal stagger-1">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">👩‍🏫</span>
            <p className="text-xs font-montserrat font-semibold tracking-widest uppercase" style={{ color: '#A8D4EC' }}>
              Giáo viên chủ nhiệm
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            {TEACHERS.map(t => (
              <div key={t} className="flex items-center gap-3">
                <div
                  className="w-2 h-8 rounded-full"
                  style={{ background: 'linear-gradient(180deg,#A8D4EC,#F2A7B8)' }}
                />
                <span className="font-playfair font-bold text-lg sm:text-xl" style={{ color: '#2C4A6E' }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider-rose mb-10" />

        {/* Student grid */}
        <div className="reveal stagger-2">
          <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-6" style={{ color: '#A8D4EC' }}>
            {CLASS_MEMBERS.length} học sinh 🌺
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {CLASS_MEMBERS.map((member, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3 px-2 transition-all duration-200 rounded-lg group cursor-default"
                style={{ borderBottom: '1px solid rgba(200,230,245,0.4)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(242,167,184,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <span
                  className="text-xs font-montserrat tabular-nums shrink-0"
                  style={{ color: 'rgba(168,212,236,0.6)', minWidth: '1.6rem' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                  style={{ background: i % 3 === 0 ? '#F2A7B8' : i % 3 === 1 ? '#A8D4EC' : '#C4B5E0' }}
                />
                <span
                  className="font-montserrat text-sm transition-colors"
                  style={{ color: '#3D5A7A' }}
                >
                  {member}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
