'use client';

import { useState, useEffect } from 'react';
import { subscribeToMedia } from '@/lib/firebaseService';
import { CLASS_MEMBERS, COLORS } from '@/lib/constants';
import { MediaItem } from '@/lib/types';

export default function MediaWall() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMedia((items) => {
      setMediaItems(items);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (selectedMember === 'all') {
      setFilteredMedia(mediaItems);
    } else {
      setFilteredMedia(mediaItems.filter((item) => item.memberName === selectedMember));
    }
  }, [mediaItems, selectedMember]);

  const uniqueMembers = Array.from(new Set(mediaItems.map((item) => item.memberName)));

  return (
    <section className="bg-gradient-to-b from-white to-[#FFFBF5] py-16 sm:py-24 border-t border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-center text-[#0A1F44] mb-4">
          Tường Kỷ Niệm
        </h2>
        <div className="w-16 h-1 bg-[#FF6B00] mx-auto mb-12"></div>

        {/* Filter by Member */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          <span className="text-sm font-semibold text-[#0A1F44]">Lọc theo thành viên:</span>
          <button
            onClick={() => setSelectedMember('all')}
            className="px-4 py-2 rounded-full font-semibold transition-all"
            style={{
              backgroundColor: selectedMember === 'all' ? COLORS.primary : COLORS.lightGray,
              color: selectedMember === 'all' ? 'white' : COLORS.text,
            }}
          >
            Tất Cả ({mediaItems.length})
          </button>
          {uniqueMembers.slice(0, 8).map((member) => {
            const memberMediaCount = mediaItems.filter((item) => item.memberName === member).length;
            return (
              <button
                key={member}
                onClick={() => setSelectedMember(member)}
                className="px-3 py-2 rounded-full font-semibold text-sm transition-all"
                style={{
                  backgroundColor: selectedMember === member ? COLORS.primary : COLORS.lightGray,
                  color: selectedMember === member ? 'white' : COLORS.text,
                }}
              >
                {member.split(' ').pop()} ({memberMediaCount})
              </button>
            );
          })}
          {uniqueMembers.length > 8 && (
            <span className="text-xs opacity-60 text-[#0A1F44]">+{uniqueMembers.length - 8} người khác</span>
          )}
        </div>

        {/* Empty State */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-[#0A1F44] opacity-60">
              Chưa có kỷ niệm nào. Hãy là người đầu tiên tải lên ảnh & video!
            </p>
          </div>
        ) : (
          /* Masonry Grid - 12 columns */
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((item) => {
              const colSpan = item.type === 'video' ? 'col-span-2 sm:col-span-2 lg:col-span-3' : 'col-span-2 sm:col-span-2 lg:col-span-2';

              return (
                <div
                  key={item.id}
                  className={`${colSpan} transform hover:scale-105 transition-transform duration-300`}
                >
                  {item.type === 'photo' ? (
                    /* Photo Card - Polaroid Style */
                    <div className="bg-white p-3 rounded-lg shadow-lg border-l-4 hover:shadow-xl transition-shadow" style={{ borderLeftColor: COLORS.primary }}>
                      <div className="bg-gray-100 rounded aspect-square overflow-hidden flex items-center justify-center mb-3">
                        <img
                          src={item.url}
                          alt={`Photo by ${item.memberName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-dancing font-semibold text-[#0A1F44] text-sm">{item.memberName}</h3>
                      {item.caption && (
                        <p className="text-xs text-[#0A1F44] opacity-70 mt-1 line-clamp-2">{item.caption}</p>
                      )}
                      <p className="text-xs text-[#FF6B00] font-semibold mt-2">
                        {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  ) : (
                    /* Video Card - Play Button Overlay */
                    <div
                      className="relative bg-[#0A1F44] rounded-lg shadow-lg overflow-hidden cursor-pointer group border-l-4 hover:shadow-xl transition-shadow"
                      style={{ borderLeftColor: COLORS.primary }}
                      onClick={() => setExpandedVideo(item.id)}
                    >
                      <div className="aspect-video bg-black flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            <span className="text-white text-2xl">▶</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <h3 className="font-dancing font-semibold text-[#0A1F44] text-sm">{item.memberName}</h3>
                        {item.caption && (
                          <p className="text-xs text-[#0A1F44] opacity-70 mt-1 line-clamp-2">{item.caption}</p>
                        )}
                        <p className="text-xs text-[#FF6B00] font-semibold mt-2">
                          {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Video Modal */}
        {expandedVideo && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setExpandedVideo(null)}
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="aspect-video bg-black flex items-center justify-center">
                <video
                  src={mediaItems.find((m) => m.id === expandedVideo)?.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-playfair font-bold text-[#0A1F44] mb-2">
                  {mediaItems.find((m) => m.id === expandedVideo)?.memberName}
                </h3>
                {mediaItems.find((m) => m.id === expandedVideo)?.caption && (
                  <p className="text-[#0A1F44] opacity-70">
                    {mediaItems.find((m) => m.id === expandedVideo)?.caption}
                  </p>
                )}
              </div>
              <button
                onClick={() => setExpandedVideo(null)}
                className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
