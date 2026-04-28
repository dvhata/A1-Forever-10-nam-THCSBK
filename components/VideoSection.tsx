'use client';

interface Video {
  id: string;
  title: string;
  type: 'youtube' | 'mp4';
  url: string;
}

interface VideoSectionProps {
  videos?: Video[];
}

export default function VideoSection({ videos = [] }: VideoSectionProps) {
  const defaultVideos: Video[] = [
    { id: '1', title: 'Kỷ Niệm Lớp A1', type: 'youtube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: '2', title: 'Sinh Nhật Lớp 10 Năm', type: 'youtube', url: 'https://www.youtube.com/embed/jNQXAC9IVRw' },
  ];

  const displayVideos = videos.length > 0 ? videos : defaultVideos;

  const getYoutubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return url;
    return `https://www.youtube.com/embed/${url}`;
  };

  return (
    <section className="py-20 sm:py-32" style={{ background: '#0A0A0A' }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-16">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="divider-gold w-8" />
            <span className="text-xs tracking-[0.3em] uppercase font-montserrat" style={{ color: '#C9A84C' }}>
              Video lời nhắn
            </span>
          </div>
          <h2 className="font-playfair font-bold text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Lời chúc từ lớp
          </h2>
        </div>

        <div className="divider-gold mb-16" />

        {displayVideos.length === 0 ? (
          <p className="text-sm font-montserrat" style={{ color: '#555555' }}>
            Chưa có video nào. Hãy chia sẻ lời chúc của bạn!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayVideos.map((video, idx) => (
              <div
                key={video.id}
                className="group overflow-hidden transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                {/* Video */}
                <div className="relative w-full bg-black aspect-video">
                  {video.type === 'youtube' ? (
                    <iframe
                      src={getYoutubeEmbedUrl(video.url)}
                      title={video.title}
                      className="w-full h-full"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Caption */}
                <div className="flex items-center gap-4 p-5" style={{ background: '#111111' }}>
                  <span
                    className="text-xs font-montserrat tabular-nums"
                    style={{ color: 'rgba(201,168,76,0.5)' }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div
                    className="w-px self-stretch"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  />
                  <div>
                    <h3 className="font-playfair font-semibold text-sm" style={{ color: '#F5F4F0' }}>
                      {video.title}
                    </h3>
                    <p className="text-xs font-montserrat mt-0.5" style={{ color: '#555555' }}>
                      {video.type === 'youtube' ? 'YouTube' : 'Video'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
