import { COLORS } from '@/lib/constants';

export function Header() {
  return (
    <header className="relative overflow-hidden py-20" style={{ backgroundColor: COLORS.primary }}>
      {/* Decorative gold accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: COLORS.accent }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
          Tuyên Truyền Lớp A1
        </h1>
        <p className="text-xl md:text-2xl text-white mb-2" style={{ color: COLORS.accent }}>
          Khóa 2012 - 2016
        </p>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mt-6 text-balance">
          Nơi kết nối, chia sẻ và ghi lại những kỷ niệm đặc biệt của lớp chúng ta
        </p>
      </div>
    </header>
  );
}
