'use client';

import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ImageCarousel() {
  const carouselItems = useMemo(() => [
    '/images/20160520_074223.jpg',
    '/images/IMG_8515.JPG',
    '/images/IMG_8527.JPG',
    '/images/IMG_8630.JPG',
    '/images/IMG_8631.JPG',
    '/images/LIO_0631.JPG',
    '/images/LIO_0669.JPG',
    '/images/LIO_0729.JPG',
    '/images/LIO_0830.JPG',
  ].map((src, i) => ({ src, alt: `Kỷ niệm lớp A1 — ${i + 1}` })), []);

  return (
    <section id="memories" style={{ background: '#FDFAF6' }}>
      {/* Label */}
      <div className="flex items-center gap-3 px-8 sm:px-16 pt-10 pb-6">
        <div className="divider-rose w-8" style={{ width: '2rem' }} />
        <span className="text-xs font-montserrat font-semibold tracking-widest uppercase" style={{ color: '#E07898' }}>
          Ảnh kỷ niệm
        </span>
      </div>

      {/* Carousel */}
      <div className="relative w-full overflow-hidden rounded-none" style={{ height: 'clamp(260px,50vw,620px)' }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="w-full h-full"
        >
          {carouselItems.map((item, i) => (
            <SwiperSlide key={i} className="relative w-full h-full">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.82) saturate(1.1)' }}
              />
              {/* Soft vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(253,250,246,0.55) 0%, transparent 50%)' }}
              />
              {/* Caption */}
              <div className="absolute bottom-8 left-8 sm:left-16">
                <span
                  className="px-3 py-1 text-xs font-montserrat font-semibold rounded-full"
                  style={{ background: 'rgba(255,255,255,0.75)', color: '#3D5A7A', backdropFilter: 'blur(8px)' }}
                >
                  {item.alt}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style>{`
          .swiper-button-next, .swiper-button-prev {
            color: #E07898;
            background: rgba(255,255,255,0.8);
            width: 42px; height: 42px;
            border-radius: 50%;
            box-shadow: 0 2px 12px rgba(200,140,170,0.25);
            backdrop-filter: blur(8px);
          }
          .swiper-button-next:after, .swiper-button-prev:after { font-size: 14px; font-weight: 800; }
          .swiper-pagination-bullet {
            background: rgba(255,255,255,0.6);
            width: 8px; height: 8px;
            border-radius: 50%;
            opacity: 1;
            transition: all 0.3s;
          }
          .swiper-pagination-bullet-active {
            background: #E07898;
            width: 24px;
            border-radius: 4px;
          }
        `}</style>
      </div>
      <div className="divider-rose mt-0" />
    </section>
  );
}
