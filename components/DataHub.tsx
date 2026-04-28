'use client';

import { useState } from 'react';
import { MemberForm } from './MemberForm';
import { Analytics } from './Analytics';

export default function DataHub() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <section id="datahub" className="py-20 sm:py-32" style={{ background: '#111111' }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-16">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="divider-gold w-8" />
            <span className="text-xs tracking-[0.3em] uppercase font-montserrat" style={{ color: '#C9A84C' }}>
              Cập nhật & Thống kê
            </span>
          </div>
          <h2 className="font-playfair font-bold text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Tin tức lớp A1
          </h2>
        </div>

        <div className="divider-gold mb-16" />

        {/* Form */}
        <div className="mb-20">
          <p className="text-xs tracking-[0.3em] uppercase font-montserrat mb-8" style={{ color: '#888888' }}>
            Chia sẻ thông tin của bạn
          </p>
          <MemberForm />
        </div>

        <div className="divider-gold mb-16" />

        {/* Analytics */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase font-montserrat mb-8" style={{ color: '#888888' }}>
            Thống kê lớp
          </p>
          <Analytics key={refreshKey} />
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-montserrat" style={{ color: '#555555' }}>
            Tất cả dữ liệu được cập nhật theo thời gian thực
          </p>
        </div>
      </div>
    </section>
  );
}
