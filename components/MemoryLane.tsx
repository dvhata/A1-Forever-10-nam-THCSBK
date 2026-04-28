'use client';

interface GalleryItem {
  id: number;
  caption: string;
  description: string;
  height: 'small' | 'medium' | 'large';
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    caption: 'Khuôn Viên Trường Học',
    description: 'Sân trường xanh mát - nơi chúng ta lớn lên',
    height: 'medium',
  },
  {
    id: 2,
    caption: 'Lớp Học A1',
    description: 'Những buổi học hôm xưa',
    height: 'large',
  },
  {
    id: 3,
    caption: 'Gốc Phượng',
    description: 'Nơi chúng ta ngồi nói chuyện',
    height: 'small',
  },
  {
    id: 4,
    caption: 'Khoảnh Khắc Tươi Cười',
    description: 'Kỷ niệm xưa còn mãi',
    height: 'large',
  },
  {
    id: 5,
    caption: 'Hoạt Động Ngoại Khóa',
    description: 'Những buổi chơi vui vẻ',
    height: 'medium',
  },
  {
    id: 6,
    caption: 'Chia Tay & Lời Hứa',
    description: 'Tạm biệt nhưng không quên',
    height: 'medium',
  },
];

const heightClasses = {
  small: 'h-48 sm:h-52',
  medium: 'h-64 sm:h-72',
  large: 'h-80 sm:h-96',
};

export default function MemoryLane() {
  return (
    <section className="bg-[#FFFBF5] py-16 sm:py-24 border-t border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-center text-[#0A1F44] mb-4">
          Dòng Ký Ức
        </h2>
        <div className="w-16 h-1 bg-[#FF6B00] mx-auto mb-4"></div>
        <p className="text-center text-[#0A1F44] opacity-70 mb-12 font-montserrat">
          Những khoảnh khắc đáng nhớ nhất của chúng ta
        </p>

        {/* Masonry Gallery - 12 Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-max">
          {GALLERY_ITEMS.map((item, index) => {
            // Responsive column span logic for 12-column grid
            let colSpan = 'col-span-2 sm:col-span-2 lg:col-span-2';
            let rowSpan = '';
            
            if (index === 1 || index === 3) {
              colSpan = 'col-span-2 sm:col-span-2 lg:col-span-3';
              rowSpan = 'lg:row-span-2';
            }
            
            return (
              <div
                key={item.id}
                className={`${colSpan} ${rowSpan} ${heightClasses[item.height]} relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-[#E8DDD0] hover:border-[#FF6B00]`}
              >
              {/* Background gradient */}
              <div className={`w-full h-full bg-gradient-to-br from-[#FFB84D] via-[#FF8A3D] to-[#E55A00] flex items-center justify-center relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white blur-2xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 text-white">
                  <p className="text-sm opacity-80 mb-2">#{item.id}</p>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    {item.caption}
                  </h3>
                  <p className="text-sm sm:text-base opacity-90">
                    {item.description}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

                {/* Image placeholder text */}
                <div className="absolute top-3 right-3 text-white text-xs opacity-60">
                  📷
                </div>
              </div>
            );
          })}
        </div>

        {/* Doodle elements */}
        <div className="mt-16 flex justify-center gap-6 text-[#FF6B00] opacity-20">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.86-3.81c-.34-.45-.99-.47-1.37-.04-.37.43-.35 1.08.02 1.49l3.63 4.87c.34.44.99.46 1.37.04l3.93-5.06c.37-.43.35-1.08-.02-1.49-.39-.42-1.03-.4-1.37.04z"/>
          </svg>
          <div className="text-3xl">✤</div>
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-4c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
