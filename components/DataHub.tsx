'use client';

import { useState } from 'react';
import { MemberForm } from './MemberForm';
import { Analytics } from './Analytics';

export default function DataHub() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section
      id="datahub"
      className="py-20 sm:py-28 bg-watercolor"
      style={{ background: 'linear-gradient(160deg, #FDE8EE 0%, #EEF7FC 60%, #FDFAF6 100%)' }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-12">

        {/* Header */}
        <div className="mb-12 reveal">
          <div className="section-label">
            <span className="text-xs font-montserrat font-semibold tracking-widest uppercase" style={{ color: '#E07898' }}>
              Cập nhật & Thống kê
            </span>
          </div>
          <h2 className="font-playfair font-bold" style={{ fontSize: 'clamp(1.8rem,4.5vw,3rem)', color: '#2C4A6E' }}>
            Tin tức lớp A1 📊
          </h2>
        </div>

        <div className="divider-rose mb-12" />

        {/* Form */}
        <div className="reveal stagger-1 mb-16">
          <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-8" style={{ color: '#A8D4EC' }}>
            ✏️ Chia sẻ thông tin của bạn
          </p>
          <MemberForm />
        </div>

        <div className="divider-sky mb-12" />

        {/* Analytics */}
        <div className="reveal stagger-2">
          <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-8" style={{ color: '#A8D4EC' }}>
            📈 Thống kê lớp
          </p>
          <Analytics key={refreshKey} />
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs font-montserrat" style={{ color: 'rgba(44,74,110,0.45)' }}>
            Dữ liệu được cập nhật theo thời gian thực
          </p>
        </div>
      </div>
    </section>
  );
}
