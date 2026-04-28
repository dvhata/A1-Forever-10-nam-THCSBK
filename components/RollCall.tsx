'use client';

import { useState } from 'react';
import { CLASS_MEMBERS, TEACHERS } from '@/lib/constants';

export default function RollCall() {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-center text-[#0A1F44] mb-4">
          Danh Sách Toàn Thành Viên
        </h2>
        <div className="w-16 h-1 bg-[#FF6B00] mx-auto mb-12"></div>

        {/* Teachers Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-playfair font-bold text-center text-[#FF6B00] mb-8">
            Thầy Cô Giáo
          </h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            {TEACHERS.map((teacher) => (
              <div
                key={teacher}
                className="relative group"
              >
                <div className="text-center p-6 bg-gradient-to-br from-[#FFFBF5] to-[#FFF5EB] rounded-lg border-2 border-[#FF6B00] shadow-sm hover:shadow-lg transition-all duration-300">
                  <p className="text-lg font-dancing font-semibold text-[#0A1F44] group-hover:text-[#FF6B00] transition-colors">
                    {teacher}
                  </p>
                  <p className="text-sm text-[#FF6B00] opacity-70 mt-2">
                    Yêu quý nhất
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Section */}
        <div>
          <h3 className="text-2xl font-playfair font-bold text-center text-[#FF6B00] mb-8">
            Danh Sách Học Sinh
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {CLASS_MEMBERS.map((member) => (
              <div
                key={member}
                onMouseEnter={() => setHoveredMember(member)}
                onMouseLeave={() => setHoveredMember(null)}
                className={`p-3 sm:p-4 rounded-lg border-2 border-[#E8DDD0] text-center cursor-pointer transition-all duration-300 ${hoveredMember === member
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00] scale-105 shadow-lg'
                    : 'bg-[#FFFBF5] text-[#0A1F44] hover:border-[#FF6B00]'
                  }`}
              >
                <p className="text-sm sm:text-base font-montserrat font-medium">
                  {member}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="text-[#0A1F44] opacity-60">
            Tổng cộng: <span className="font-semibold text-[#FF6B00]">{CLASS_MEMBERS.length}</span> thành viên
          </p>
        </div>
      </div>
    </section>
  );
}
