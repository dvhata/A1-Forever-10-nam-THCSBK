'use client';

import { useState, useMemo } from 'react';
import { CLASS_MEMBERS, JOB_CATEGORIES, MARITAL_STATUS, LOCATIONS } from '@/lib/constants';
import { addMedia, addMember, addMessage, uploadMediaFile } from '@/lib/firebaseService';

const label = (text: string) => (
  <label
    className="block text-xs font-montserrat font-semibold tracking-widest uppercase mb-2"
    style={{ color: '#5A8FAF' }}
  >
    {text}
  </label>
);

export function MemberForm() {
  const [formData, setFormData] = useState({ name:'', jobCategory:'', jobDetail:'', maritalStatus:'', location:'', message:'' });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedMembers, setSubmittedMembers] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadLabel, setUploadLabel] = useState('');

  const available = useMemo(() => CLASS_MEMBERS.filter(m => !submittedMembers.has(m)), [submittedMembers]);
  const filtered = useMemo(() => searchQuery.trim()
    ? available.filter(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    : available, [searchQuery, available]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { alert('Vui lòng chọn tên của bạn'); return; }
    if (submittedMembers.has(formData.name)) { alert('Bạn đã cập nhật thông tin rồi!'); return; }
    setLoading(true);
    setErrorMessage('');
    setUploadProgress(null);
    setUploadLabel('');
    try {
      await addMember({ name:formData.name, jobCategory:formData.jobCategory, jobDetail:formData.jobDetail, maritalStatus:formData.maritalStatus, location:formData.location });
      if (formData.message.trim()) await addMessage({ memberName:formData.name, message:formData.message, memberId:formData.name });
      for (const f of photoFiles) {
        setUploadLabel(`Đang tải ảnh: ${f.name}`);
        const url = await uploadMediaFile(f, formData.name,'photo', setUploadProgress);
        await addMedia({ memberId:formData.name, memberName:formData.name, type:'photo', url });
      }
      if (videoFile) {
        setUploadLabel(`Đang tải video: ${videoFile.name}`);
        const url = await uploadMediaFile(videoFile, formData.name,'video', setUploadProgress);
        await addMedia({ memberId:formData.name, memberName:formData.name, type:'video', url });
      }
      setSubmittedMembers(p => new Set([...p, formData.name]));
      setSubmitted(true);
      setFormData({ name:'', jobCategory:'', jobDetail:'', maritalStatus:'', location:'', message:'' });
      setPhotoFiles([]); setVideoFile(null);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error('Upload failed:', error);
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setErrorMessage(message);
      alert(message);
    }
    finally {
      setLoading(false);
      setUploadLabel('');
      setUploadProgress(null);
    }
  };

  const selectStyle: React.CSSProperties = {
    width:'100%', padding:'0.75rem 1rem',
    background:'rgba(255,255,255,0.9)',
    border:'1.5px solid rgba(200,230,245,0.8)',
    borderRadius:'0.625rem',
    color:'#2C4A6E', fontFamily:'inherit', fontSize:'0.875rem', outline:'none',
  };

  return (
    <div className="card-soft p-7 sm:p-9">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Name search */}
        <div className="relative">
          {label('Tên của bạn *')}
          <input
            className="input-soft"
            type="text"
            value={formData.name || searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setFormData(p => ({...p, name:''})); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Tìm tên của bạn..."
          />
          {showDropdown && filtered.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 z-20 max-h-52 overflow-y-auto rounded-xl shadow-lg"
              style={{ background:'rgba(255,255,255,0.96)', border:'1.5px solid rgba(200,230,245,0.7)', backdropFilter:'blur(8px)' }}
            >
              {filtered.slice(0,8).map(m => (
                <button
                  key={m} type="button"
                  onMouseDown={() => { setFormData(p => ({...p, name:m})); setSearchQuery(''); setShowDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-montserrat transition-colors"
                  style={{ color:'#3D5A7A' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(242,167,184,0.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
          {formData.name && (
            <p className="text-xs font-montserrat mt-2" style={{ color:'#5A9A70' }}>✓ Đã chọn: {formData.name}</p>
          )}
        </div>

        {/* Job category */}
        <div>
          {label('Lĩnh vực công việc')}
          <select name="jobCategory" value={formData.jobCategory} onChange={handleChange} style={selectStyle}>
            <option value="">Chọn lĩnh vực</option>
            {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Job detail */}
        <div>
          {label('Chi tiết công việc')}
          <input name="jobDetail" type="text" value={formData.jobDetail} onChange={handleChange}
            placeholder="Ví dụ: Giáo viên, Lập trình viên..." className="input-soft" />
        </div>

        {/* Marital + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            {label('Tình trạng hôn nhân')}
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} style={selectStyle}>
              <option value="">Chọn</option>
              {MARITAL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            {label('Nơi sống')}
            <select name="location" value={formData.location} onChange={handleChange} style={selectStyle}>
              <option value="">Chọn</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          {label('Lời nhắn gửi cả lớp 💌')}
          <textarea name="message" value={formData.message} onChange={handleChange} rows={4}
            placeholder="Chia sẻ cảm xúc, kỷ niệm hoặc lời chúc..." className="input-soft" style={{ resize:'none' }} />
        </div>

        {/* Photo upload */}
        <div>
          {label('Ảnh kỷ niệm (tối đa 3)')}
          <div
            onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDrop={e => {
              e.preventDefault(); setDragActive(false);
              const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
              if (files.length + photoFiles.length > 3) { alert('Tối đa 3 ảnh!'); return; }
              setPhotoFiles(p => [...p, ...files]);
            }}
            className="rounded-xl p-6 text-center cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragActive ? '#E07898' : 'rgba(200,230,245,0.8)'}`,
              background: dragActive ? 'rgba(242,167,184,0.08)' : 'rgba(255,255,255,0.5)',
            }}
          >
            <input type="file" multiple accept="image/*" id="photo-input" className="hidden"
              onChange={e => {
                if (!e.target.files) return;
                const files = Array.from(e.target.files);
                if (files.length + photoFiles.length > 3) { alert('Tối đa 3 ảnh!'); return; }
                setPhotoFiles(p => [...p, ...files]);
              }} />
            <label htmlFor="photo-input" className="cursor-pointer">
              <p className="text-2xl mb-2">📷</p>
              <p className="text-sm font-montserrat" style={{ color:'rgba(44,74,110,0.6)' }}>
                Kéo thả hoặc <span style={{ color:'#E07898', textDecoration:'underline' }}>nhấp để chọn</span>
              </p>
            </label>
          </div>
          {photoFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {photoFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2 rounded-lg"
                  style={{ background:'rgba(242,167,184,0.1)', border:'1px solid rgba(224,120,152,0.2)' }}>
                  <span className="text-xs font-montserrat truncate" style={{ color:'#3D5A7A' }}>{f.name}</span>
                  <button type="button" onClick={() => setPhotoFiles(p => p.filter((_,j) => j!==i))}
                    className="text-xs font-montserrat ml-3 shrink-0" style={{ color:'#E07898' }}>✕ Xóa</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video */}
        <div>
          {label('Video lời nhắn (tùy chọn)')}
          <input type="file" accept="video/*" className="input-soft cursor-pointer"
            onChange={e => { if (e.target.files?.[0]) setVideoFile(e.target.files[0]); }} />
          {videoFile && <p className="text-xs font-montserrat mt-2" style={{ color:'#5A9A70' }}>✓ {videoFile.name}</p>}
        </div>

        <div className="divider-rose" />

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary w-full text-center">
          {loading ? '⏳ Đang gửi...' : '🌸 Gửi thông tin'}
        </button>

        {uploadLabel && (
          <div className="rounded-xl p-4 text-center"
            style={{ background:'rgba(168,212,236,0.2)', border:'1.5px solid rgba(168,212,236,0.45)' }}>
            <p className="text-xs font-montserrat" style={{ color:'#3D7A9A' }}>{uploadLabel}</p>
            {typeof uploadProgress === 'number' && (
              <p className="text-xs font-montserrat mt-1" style={{ color:'#3D7A9A' }}>{uploadProgress}%</p>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl p-4 text-center"
            style={{ background:'rgba(242,167,184,0.2)', border:'1.5px solid rgba(224,120,152,0.45)' }}>
            <p className="text-xs font-montserrat" style={{ color:'#B4516A' }}>
              {errorMessage}
            </p>
          </div>
        )}

        {submitted && (
          <div className="rounded-xl p-4 text-center"
            style={{ background:'rgba(168,212,236,0.2)', border:'1.5px solid rgba(168,212,236,0.5)' }}>
            <p className="font-dancing text-lg" style={{ color:'#3D7A9A' }}>
              🎉 Cảm ơn bạn đã chia sẻ!
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
