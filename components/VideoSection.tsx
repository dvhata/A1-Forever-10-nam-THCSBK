'use client';

interface Video { id: string; title: string; type: 'youtube' | 'mp4'; url: string; }

export default function VideoSection({ videos = [] }: { videos?: Video[] }) {
  const defaultVideos: Video[] = [
    { id: '1', title: 'Vũ điệu công chịch', type: 'youtube', url: 'https://www.youtube.com/embed/AKEiaWGLuJU' },
    { id: '2', title: 'Đại chiến bóng nước', type: 'youtube', url: 'https://www.youtube.com/embed/8sRgor2ob2Q' },
        { id: '3', title: 'Lucky -Lucky Twice 9A1 THCSBK 2012-2016', type: 'youtube', url: 'https://www.youtube.com/embed/IXRxdsqiU9U' },
  ];
  const display = videos.length > 0 ? videos : defaultVideos;

  return (
    <section
      className="py-20 sm:py-28"
      style={{ background: 'linear-gradient(160deg, #FDFAF6 0%, #EEF7FC 100%)' }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-12">
        <div className="mb-12 reveal">
          <div className="section-label">
            <span className="text-xs font-montserrat font-semibold tracking-widest uppercase" style={{ color: '#E07898' }}>
              Looking back
            </span>
          </div>
          <h2 className="font-playfair font-bold" style={{ fontSize: 'clamp(1.8rem,4.5vw,3rem)', color: '#2C4A6E' }}>
            Video kỉ niệm 🎬
          </h2>
        </div>

        <div className="divider-rose mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {display.map((v, i) => (
            <div key={v.id} className="card-soft overflow-hidden reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="aspect-video bg-slate-100">
                {v.type === 'youtube' ? (
                  <iframe src={v.url} title={v.title} className="w-full h-full" allowFullScreen loading="lazy" />
                ) : (
                  <video src={v.url} controls className="w-full h-full object-cover" />
                )}
              </div>
              <div className="px-5 py-4 flex items-center gap-3">
                <span
                  className="w-7 h-7 flex items-center justify-center rounded-full text-xs"
                  style={{ background: 'rgba(242,167,184,0.2)', color: '#E07898' }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-playfair font-semibold text-sm" style={{ color: '#2C4A6E' }}>{v.title}</h3>
                  <p className="text-xs font-montserrat" style={{ color: 'rgba(44,74,110,0.5)' }}>
                    {v.type === 'youtube' ? 'YouTube' : 'Video'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
