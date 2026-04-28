'use client';

import { CLASS_MEMBERS, TEACHERS } from '@/lib/constants';

export default function Chalkboard() {
  return (
    <section className="py-20 sm:py-32" style={{ background: '#0A0A0A' }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-16">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="divider-gold w-8" />
            <span className="text-xs tracking-[0.3em] uppercase font-montserrat" style={{ color: '#C9A84C' }}>
              Danh sách lớp
            </span>
          </div>
          <h2 className="font-playfair font-bold text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Thành viên lớp A1
          </h2>
        </div>

        {/* Teachers */}
        <div
          className="mb-16 p-8 sm:p-10"
          style={{
            border: '1px solid rgba(201,168,76,0.25)',
            background: 'rgba(201,168,76,0.04)',
          }}
        >
          <p className="text-xs tracking-[0.3em] uppercase font-montserrat mb-6" style={{ color: '#C9A84C' }}>
            Giáo viên chủ nhiệm
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            {TEACHERS.map((teacher) => (
              <div key={teacher} className="flex items-center gap-3">
                <div
                  className="w-5 h-px"
                  style={{ background: '#C9A84C' }}
                />
                <span
                  className="font-playfair text-lg sm:text-xl font-semibold"
                  style={{ color: '#F5F4F0' }}
                >
                  {teacher}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold mb-16" />

        {/* Students grid */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase font-montserrat mb-8" style={{ color: '#888888' }}>
            {CLASS_MEMBERS.length} học sinh
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0">
            {CLASS_MEMBERS.map((member, index) => (
              <div
                key={index}
                className="flex items-center gap-4 py-3 font-montserrat text-sm transition-colors"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  color: '#AAAAAA',
                }}
              >
                <span
                  className="text-xs font-montserrat tabular-nums"
                  style={{ color: 'rgba(201,168,76,0.5)', minWidth: '2rem' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{member}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
