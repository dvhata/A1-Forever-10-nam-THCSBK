'use client';

import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ImageCarousel() {
  const carouselItems = useMemo(() => {
    const localImages = [
      '/images/20160520_074223.jpg',
      '/images/IMG_8515.JPG',
      '/images/IMG_8527.JPG',
      '/images/IMG_8630.JPG',
      '/images/IMG_8631.JPG',
      '/images/LIO_0631.JPG',
      '/images/LIO_0669.JPG',
      '/images/LIO_0729.JPG',
      '/images/LIO_0830.JPG',
    ];

    return localImages.map((src, i) => ({
      type: 'image' as const,
      src,
      alt: `Kỷ niệm lớp A1 — ${i + 1}`,
    }));
  }, []);

  return (
    <section id="memories" className="w-full" style={{ background: '#0A0A0A' }}>
      {/* Section label */}
      <div className="flex items-center gap-4 px-8 sm:px-16 py-10">
        <div className="divider-gold w-8" />
        <span className="text-xs tracking-[0.3em] uppercase font-montserrat" style={{ color: '#C9A84C' }}>
          Ảnh kỷ niệm
        </span>
      </div>

      {/* Full-width tall carousel */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(280px, 55vw, 680px)' }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true, enabled: carouselItems.length > 1 }}
          navigation={{ enabled: carouselItems.length > 1 }}
          loop={carouselItems.length > 1}
          className="w-full h-full"
        >
          {carouselItems.map((item, index) => (
            <SwiperSlide key={index} className="relative w-full h-full">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.72)' }}
              />

              {/* Bottom vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)',
                }}
              />

              {/* Caption */}
              <div className="absolute bottom-8 left-8 sm:left-16">
                <p
                  className="text-xs tracking-[0.2em] uppercase font-montserrat"
                  style={{ color: 'rgba(201,168,76,0.85)' }}
                >
                  {item.alt}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style>{`
          .swiper-button-next,
          .swiper-button-prev {
            color: #C9A84C;
            background: rgba(10,10,10,0.55);
            width: 48px;
            height: 48px;
            border-radius: 0;
            border: 1px solid rgba(201,168,76,0.3);
          }
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 14px;
            font-weight: 700;
          }
          .swiper-pagination-bullet {
            background: rgba(255,255,255,0.25);
            border-radius: 0;
            width: 24px;
            height: 2px;
            opacity: 1;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background: #C9A84C;
            width: 40px;
          }
        `}</style>
      </div>

      <div className="divider-gold" />
    </section>
  );
}
