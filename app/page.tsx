import Hero from '@/components/Hero';
import ImageCarousel from '@/components/ImageCarousel';
import Chalkboard from '@/components/Chalkboard';
import DataHub from '@/components/DataHub';
import { MessageWall } from '@/components/MessageWall';
import VideoSection from '@/components/VideoSection';
import MediaWall from '@/components/MediaWall';

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <Hero />
      <ImageCarousel />
      <Chalkboard />
      <DataHub />

      {/* Message Wall */}
      <section className="py-20 sm:py-32" style={{ background: '#111111' }}>
        <div className="max-w-6xl mx-auto px-8 sm:px-16">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="divider-gold w-8" />
              <span className="text-xs tracking-[0.3em] uppercase font-montserrat" style={{ color: '#C9A84C' }}>
                Lời nhắn
              </span>
            </div>
            <h2 className="font-playfair font-bold text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Tường nhắn lớp
            </h2>
          </div>
          <div className="divider-gold mb-16" />
          <MessageWall />
        </div>
      </section>

      <VideoSection />
      <MediaWall />

      {/* Footer */}
      <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="max-w-6xl mx-auto px-8 sm:px-16 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            {/* Left — branding */}
            <div>
              <h3 className="font-playfair font-bold text-white text-2xl mb-2">
                Lớp A1
              </h3>
              <p className="text-xs tracking-[0.2em] uppercase font-montserrat" style={{ color: '#C9A84C' }}>
                THCS Bắc Kạn · 2012 – 2016
              </p>
            </div>

            {/* Center — tagline */}
            <div className="md:text-center">
              <p className="font-dancing font-semibold text-lg" style={{ color: '#888888' }}>
                10 Năm Chớp Mắt
              </p>
              <p className="text-xs font-montserrat mt-1" style={{ color: '#444444' }}>
                Những ký ức mãi không quên
              </p>
            </div>

            {/* Right — copyright */}
            <div className="md:text-right">
              <p className="text-xs font-montserrat" style={{ color: '#444444' }}>
                © 2024 Lớp A1 Bắc Kạn
              </p>
              <p className="text-xs font-montserrat mt-1" style={{ color: '#333333' }}>
                Nơi kết nối những trái tim
              </p>
            </div>
          </div>

          {/* Bottom gold line */}
          <div className="divider-gold mt-12" />
        </div>
      </footer>
    </main>
  );
}
