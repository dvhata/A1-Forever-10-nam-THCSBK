'use client';

import { useState } from 'react';
import { addMedia, uploadMediaFile } from '@/lib/firebaseService';

const label = (text: string) => (
  <label className="block text-xs font-montserrat font-semibold tracking-widest uppercase mb-2" style={{ color: '#5A8FAF' }}>
    {text}
  </label>
);

export default function MediaUpload() {
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLabel, setUploadLabel] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photoFiles.length === 0 && !videoFile) {
      alert('Vui lòng chọn ít nhất 1 ảnh hoặc video!');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setUploadProgress(null);
    setUploadLabel('');
    const name = uploaderName.trim() || 'Ẩn danh';
    try {
      for (const f of photoFiles) {
        setUploadLabel(`Đang tải ảnh: ${f.name}`);
        const url = await uploadMediaFile(f, name, 'photo', setUploadProgress);
        await addMedia({ memberId: name, memberName: name, type: 'photo', url, caption: caption.trim() || undefined });
      }
      if (videoFile) {
        setUploadLabel(`Đang tải video: ${videoFile.name}`);
        const url = await uploadMediaFile(videoFile, name, 'video', setUploadProgress);
        await addMedia({ memberId: name, memberName: name, type: 'video', url, caption: caption.trim() || undefined });
      }
      setDone(true);
      setPhotoFiles([]);
      setVideoFile(null);
      setCaption('');
      setTimeout(() => setDone(false), 5000);
    } catch (error) {
      console.error('Upload failed:', error);
      const msg = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
      setUploadLabel('');
      setUploadProgress(null);
    }
  };

  return (
    <section className="py-20 sm:py-28" style={{ background: 'linear-gradient(160deg, #EEF7FC 0%, #FDE8EE 100%)' }}>
      <div className="max-w-2xl mx-auto px-6 sm:px-12">

        <div className="mb-10 reveal">
          <div className="section-label">
            <span className="text-xs font-montserrat font-semibold tracking-widest uppercase" style={{ color: '#E07898' }}>
              Chia sẻ kỷ niệm
            </span>
          </div>
          <h2 className="font-playfair font-bold" style={{ fontSize: 'clamp(1.6rem,4vw,2.6rem)', color: '#2C4A6E' }}>
            Tải lên ảnh & video 📤
          </h2>
          <p className="text-sm font-montserrat mt-3" style={{ color: 'rgba(44,74,110,0.6)' }}>
            Không cần đăng ký — cứ thoải mái chia sẻ kỷ niệm của bạn!
          </p>
        </div>

        <div className="divider-rose mb-10" />

        <div className="card-soft p-7 sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name (optional) */}
            <div>
              {label('Tên hiển thị (để trống = Ẩn danh)')}
              <input
                type="text"
                className="input-soft"
                value={uploaderName}
                onChange={e => setUploaderName(e.target.value)}
                placeholder="Ví dụ: Minh, Hoa, An..."
              />
            </div>

            {/* Caption (optional) */}
            <div>
              {label('Chú thích (tùy chọn)')}
              <input
                type="text"
                className="input-soft"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Ảnh này chụp ở đâu, khi nào..."
              />
            </div>

            {/* Photo upload */}
            <div>
              {label('Ảnh kỷ niệm (tối đa 10 ảnh)')}
              <div
                onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDrop={e => {
                  e.preventDefault(); setDragActive(false);
                  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                  if (files.length + photoFiles.length > 10) { alert('Tối đa 10 ảnh!'); return; }
                  setPhotoFiles(p => [...p, ...files]);
                }}
                className="rounded-xl p-6 text-center cursor-pointer transition-all"
                style={{
                  border: `2px dashed ${dragActive ? '#E07898' : 'rgba(200,230,245,0.8)'}`,
                  background: dragActive ? 'rgba(242,167,184,0.08)' : 'rgba(255,255,255,0.5)',
                }}
              >
                <input type="file" multiple accept="image/*" id="media-photo-input" className="hidden"
                  onChange={e => {
                    if (!e.target.files) return;
                    const files = Array.from(e.target.files);
                    if (files.length + photoFiles.length > 10) { alert('Tối đa 10 ảnh!'); return; }
                    setPhotoFiles(p => [...p, ...files]);
                  }} />
                <label htmlFor="media-photo-input" className="cursor-pointer">
                  <p className="text-2xl mb-2">📷</p>
                  <p className="text-sm font-montserrat" style={{ color: 'rgba(44,74,110,0.6)' }}>
                    Kéo thả hoặc <span style={{ color: '#E07898', textDecoration: 'underline' }}>nhấp để chọn</span>
                  </p>
                  <p className="text-xs font-montserrat mt-1" style={{ color: 'rgba(44,74,110,0.4)' }}>
                    JPG, PNG, WEBP — tối đa 10 ảnh
                  </p>
                </label>
              </div>
              {photoFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {photoFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 rounded-lg"
                      style={{ background: 'rgba(242,167,184,0.1)', border: '1px solid rgba(224,120,152,0.2)' }}>
                      <span className="text-xs font-montserrat truncate" style={{ color: '#3D5A7A' }}>{f.name}</span>
                      <button type="button" onClick={() => setPhotoFiles(p => p.filter((_, j) => j !== i))}
                        className="text-xs font-montserrat ml-3 shrink-0" style={{ color: '#E07898' }}>✕ Xóa</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video */}
            <div>
              {label('Video kỷ niệm (tùy chọn)')}
              <div
                className="rounded-xl p-6 text-center transition-all"
                style={{ border: '2px dashed rgba(200,230,245,0.8)', background: 'rgba(255,255,255,0.5)' }}
              >
                <input type="file" accept="video/*" id="media-video-input" className="hidden"
                  onChange={e => { if (e.target.files?.[0]) setVideoFile(e.target.files[0]); }} />
                <label htmlFor="media-video-input" className="cursor-pointer">
                  <p className="text-2xl mb-2">🎬</p>
                  <p className="text-sm font-montserrat" style={{ color: 'rgba(44,74,110,0.6)' }}>
                    <span style={{ color: '#E07898', textDecoration: 'underline' }}>Nhấp để chọn video</span>
                  </p>
                  <p className="text-xs font-montserrat mt-1" style={{ color: 'rgba(44,74,110,0.4)' }}>
                    MP4, MOV, WEBM
                  </p>
                </label>
              </div>
              {videoFile && (
                <div className="mt-3 flex items-center justify-between px-4 py-2 rounded-lg"
                  style={{ background: 'rgba(168,212,236,0.1)', border: '1px solid rgba(168,212,236,0.3)' }}>
                  <span className="text-xs font-montserrat truncate" style={{ color: '#3D5A7A' }}>✓ {videoFile.name}</span>
                  <button type="button" onClick={() => setVideoFile(null)}
                    className="text-xs font-montserrat ml-3 shrink-0" style={{ color: '#E07898' }}>✕ Xóa</button>
                </div>
              )}
            </div>

            <div className="divider-rose" />

            <button type="submit" disabled={loading} className="btn-primary w-full text-center">
              {loading ? '⏳ Đang tải lên...' : '📤 Tải lên kỷ niệm'}
            </button>

            {uploadLabel && (
              <div className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(168,212,236,0.2)', border: '1.5px solid rgba(168,212,236,0.45)' }}>
                <p className="text-xs font-montserrat" style={{ color: '#3D7A9A' }}>{uploadLabel}</p>
                {typeof uploadProgress === 'number' && (
                  <div className="mt-2">
                    <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(168,212,236,0.3)' }}>
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg,#A8D4EC,#E07898)' }} />
                    </div>
                    <p className="text-xs font-montserrat mt-1" style={{ color: '#3D7A9A' }}>{uploadProgress}%</p>
                  </div>
                )}
              </div>
            )}

            {errorMessage && (
              <div className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(242,167,184,0.2)', border: '1.5px solid rgba(224,120,152,0.45)' }}>
                <p className="text-xs font-montserrat" style={{ color: '#B4516A' }}>{errorMessage}</p>
              </div>
            )}

            {done && (
              <div className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(168,212,236,0.2)', border: '1.5px solid rgba(168,212,236,0.5)' }}>
                <p className="font-dancing text-lg" style={{ color: '#3D7A9A' }}>
                  🎉 Tải lên thành công! Ảnh/video đã xuất hiện trên tường kỷ niệm.
                </p>
              </div>
            )}

          </form>
        </div>
      </div>
    </section>
  );
}
