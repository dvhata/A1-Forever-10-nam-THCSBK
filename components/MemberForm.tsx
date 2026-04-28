'use client';

import { useState, useMemo } from 'react';
import { CLASS_MEMBERS, JOB_CATEGORIES, MARITAL_STATUS, LOCATIONS, COLORS } from '@/lib/constants';
import { addMedia, addMember, addMessage, uploadMediaFile } from '@/lib/firebaseService';

export function MemberForm() {
  const [formData, setFormData] = useState({
    name: '',
    jobCategory: '',
    jobDetail: '',
    maritalStatus: '',
    location: '',
    message: '',
  });

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedMembers, setSubmittedMembers] = useState<Set<string>>(new Set());
  const [dragActive, setDragActive] = useState(false);

  const availableMembers = useMemo(() => {
    return CLASS_MEMBERS.filter(member => !submittedMembers.has(member));
  }, [submittedMembers]);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return availableMembers;
    return availableMembers.filter(member =>
      member.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableMembers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const selectMember = (memberName: string) => {
    setFormData((prev) => ({ ...prev, name: memberName }));
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handlePhotoDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const photoFilesList = files.filter(
      (file) => file.type.startsWith('image/') && ['jpg', 'jpeg', 'png'].some(ext => file.type.includes(ext))
    );

    if (photoFilesList.length + photoFiles.length > 3) {
      alert('Tối đa 3 ảnh!');
      return;
    }

    setPhotoFiles((prev) => [...prev, ...photoFilesList]);
  };

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + photoFiles.length > 3) {
        alert('Tối đa 3 ảnh!');
        return;
      }
      setPhotoFiles((prev) => [...prev, ...files]);
    }
  };

  const handleVideoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert('Vui lòng chọn tên của bạn');
      return;
    }

    if (submittedMembers.has(formData.name)) {
      alert('Bạn đã cập nhật thông tin rồi!');
      return;
    }

    setLoading(true);

    try {
      // Add member info
      await addMember({
        name: formData.name,
        jobCategory: formData.jobCategory,
        jobDetail: formData.jobDetail,
        maritalStatus: formData.maritalStatus,
        location: formData.location,
      });

      // Add message if provided
      if (formData.message.trim()) {
        await addMessage({
          memberName: formData.name,
          message: formData.message,
          memberId: formData.name,
        });
      }

      // Add photos
      for (const photoFile of photoFiles) {
        const url = await uploadMediaFile(photoFile, formData.name, 'photo');
        await addMedia({
          memberId: formData.name,
          memberName: formData.name,
          type: 'photo',
          url,
        });
      }

      // Add video
      if (videoFile) {
        const url = await uploadMediaFile(videoFile, formData.name, 'video');
        await addMedia({
          memberId: formData.name,
          memberName: formData.name,
          type: 'video',
          url,
        });
      }

      setSubmittedMembers((prev) => new Set([...prev, formData.name]));
      setSubmitted(true);
      setFormData({ name: '', jobCategory: '', jobDetail: '', maritalStatus: '', location: '', message: '' });
      setPhotoFiles([]);
      setVideoFile(null);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg border border-[#0B4D8C]/20" style={{
        background: 'rgba(255, 251, 245, 0.85)',
        backdropFilter: 'blur(10px)',
      }}>
        <h2 className="text-3xl font-playfair font-bold text-center text-[#0B4D8C]">
          Chia Sẻ Thông Tin
        </h2>

        {/* Name Dropdown with Search */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-2 text-[#0B4D8C]">
            Tên của bạn
          </label>
          <input
            type="text"
            value={formData.name || searchQuery}
            onChange={handleNameSearch}
            onFocus={() => setShowDropdown(true)}
            placeholder="Tìm kiếm tên..."
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors"
            style={{
              borderColor: COLORS.border,
              '--tw-ring-color': COLORS.primary,
            } as React.CSSProperties}
          />
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
              style={{ borderColor: COLORS.border }}>
              {filteredMembers.slice(0, 8).map((member) => (
                <button
                  key={member}
                  type="button"
                  onClick={() => selectMember(member)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
                  style={{ color: COLORS.secondary }}
                >
                  {member}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Job Category */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#0B4D8C]">
            Lĩnh vực công việc
          </label>
          <select
            name="jobCategory"
            value={formData.jobCategory}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white"
            style={{
              borderColor: COLORS.border,
              '--tw-ring-color': COLORS.primary,
            } as React.CSSProperties}
          >
            <option value="">Chọn lĩnh vực</option>
            {JOB_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Job Detail */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#0B4D8C]">
            Chi tiết công việc
          </label>
          <input
            type="text"
            name="jobDetail"
            value={formData.jobDetail}
            onChange={handleChange}
            placeholder="Ví dụ: Senior Developer"
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors"
            style={{
              borderColor: COLORS.border,
              '--tw-ring-color': COLORS.primary,
            } as React.CSSProperties}
          />
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#0B4D8C]">
            Tình trạng hôn nhân
          </label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white"
            style={{
              borderColor: COLORS.border,
              '--tw-ring-color': COLORS.primary,
            } as React.CSSProperties}
          >
            <option value="">Chọn tình trạng</option>
            {MARITAL_STATUS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#0B4D8C]">
            Nơi sống
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white"
            style={{
              borderColor: COLORS.border,
              '--tw-ring-color': COLORS.primary,
            } as React.CSSProperties}
          >
            <option value="">Chọn nơi sống</option>
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#0B4D8C]">
            Lời nhắn (tùy chọn)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Chia sẻ điều gì đó..."
            rows={4}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none"
            style={{
              borderColor: COLORS.border,
              '--tw-ring-color': COLORS.primary,
            } as React.CSSProperties}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#0B4D8C]">
            Tải ảnh (tối đa 3)
          </label>
          <div
            onDragEnter={handlePhotoDrag}
            onDragLeave={handlePhotoDrag}
            onDragOver={handlePhotoDrag}
            onDrop={handlePhotoDrop}
            className="w-full p-6 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer"
            style={{
              borderColor: dragActive ? COLORS.primary : COLORS.border,
              backgroundColor: dragActive ? 'rgba(255, 107, 0, 0.05)' : 'transparent',
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoInput}
              className="hidden"
              id="photo-input"
            />
            <label htmlFor="photo-input" className="cursor-pointer">
              <p style={{ color: COLORS.secondary }} className="font-semibold">
                Kéo thả ảnh hoặc nhấp để chọn
              </p>
              <p style={{ color: COLORS.text }} className="text-sm opacity-60 mt-1">
                JPG, PNG tối đa 3MB
              </p>
            </label>
          </div>
          {photoFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {photoFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm" style={{ color: COLORS.text }}>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="text-sm px-3 py-1 rounded border"
                    style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-[#0B4D8C]">
            Tải video (tùy chọn)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoInput}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors"
            style={{
              borderColor: COLORS.border,
              '--tw-ring-color': COLORS.primary,
            } as React.CSSProperties}
          />
          {videoFile && (
            <p className="text-sm mt-2" style={{ color: COLORS.text }}>
              Đã chọn: {videoFile.name}
            </p>
          )}
        </div>

        {/* Submit Button - Vibrant Orange CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-bold text-white rounded-lg transition-all duration-200 border-2 border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/30"
          style={{
            backgroundColor: loading ? '#E55A00' : '#FF6B00',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Đang gửi...' : 'Gửi Thông Tin'}
        </button>

        {/* Success Message */}
        {submitted && (
          <div
            className="p-4 rounded-lg text-white text-center font-bold"
            style={{ backgroundColor: '#28a745' }}
          >
            Cập nhật thành công!
          </div>
        )}
      </form>
    </div>
  );
}
