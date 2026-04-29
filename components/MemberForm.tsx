'use client';

import { useState, useMemo } from 'react';
import { CLASS_MEMBERS, JOB_CATEGORIES, MARITAL_STATUS, LOCATIONS } from '@/lib/constants';
import { addMember, addMessage } from '@/lib/firebaseService';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedMembers, setSubmittedMembers] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');

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
    try {
      await addMember({ name:formData.name, jobCategory:formData.jobCategory, jobDetail:formData.jobDetail, maritalStatus:formData.maritalStatus, location:formData.location });
      if (formData.message.trim()) await addMessage({ memberName:formData.name, message:formData.message, memberId:formData.name });
      setSubmittedMembers(p => new Set([...p, formData.name]));
      setSubmitted(true);
      setFormData({ name:'', jobCategory:'', jobDetail:'', maritalStatus:'', location:'', message:'' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error('Submit failed:', error);
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setErrorMessage(message);
      alert(message);
    } finally {
      setLoading(false);
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
            {label('Nơi làm việc')}
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

        <div className="divider-rose" />

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary w-full text-center">
          {loading ? '⏳ Đang gửi...' : '🌸 Gửi thông tin'}
        </button>

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
