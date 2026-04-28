'use client';

import { useEffect, useState } from 'react';
import { subscribeToMessages } from '@/lib/firebaseService';
import { Message } from '@/lib/types';

function formatDate(ts: number) {
  const d = new Date(ts), now = new Date();
  const diff = now.getTime() - d.getTime();
  const h = Math.floor(diff / 3600000), days = Math.floor(diff / 86400000);
  if (h < 1) return 'Vừa xong';
  if (h < 24) return `${h} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return d.toLocaleDateString('vi-VN');
}

function getInitial(name: string) {
  const parts = name.trim().split(' ');
  return parts[parts.length - 1].charAt(0).toUpperCase();
}

const AVATAR_COLORS = [
  ['#FDE8EE','#E07898'],['#EEF7FC','#5A8FAF'],['#F0EBF8','#9B7EC8'],
  ['#E8F5E9','#5A9A70'],['#FFF3E0','#D4874A'],
];

function LetterCard({ message, index }: { message: Message; index: number }) {
  const [open, setOpen] = useState(false);
  const [bg, txt] = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div
      className="cursor-pointer rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: open
          ? 'linear-gradient(135deg, rgba(253,232,238,0.9) 0%, rgba(238,247,252,0.9) 100%)'
          : 'rgba(255,255,255,0.75)',
        border: open ? '1.5px solid rgba(224,120,152,0.45)' : '1.5px solid rgba(200,230,245,0.5)',
        boxShadow: open
          ? '0 8px 32px rgba(224,120,152,0.15)'
          : '0 2px 12px rgba(168,212,236,0.1)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={() => setOpen(o => !o)}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-playfair font-bold text-sm shrink-0"
          style={{ background: bg, color: txt }}
        >
          {getInitial(message.memberName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-montserrat font-semibold text-sm" style={{ color: '#2C4A6E' }}>
            {message.memberName}
          </p>
          <p className="text-xs font-montserrat" style={{ color: 'rgba(44,74,110,0.5)' }}>
            {formatDate(message.timestamp)}
          </p>
        </div>
        {!open && (
          <p className="text-xs font-montserrat hidden sm:block max-w-[200px] truncate" style={{ color: 'rgba(44,74,110,0.45)' }}>
            {message.message}
          </p>
        )}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: open ? 'rgba(224,120,152,0.15)' : 'rgba(168,212,236,0.15)',
            color: open ? '#E07898' : '#5A8FAF',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Letter body */}
      <div
        style={{
          maxHeight: open ? '400px' : '0',
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease, opacity 0.3s ease',
        }}
      >
        <div className="divider-rose mx-5 mb-4" />
        <div className="px-6 pb-6">
          <p className="font-dancing text-base mb-3" style={{ color: '#C07090' }}>
            Kính gửi cả lớp 9A1,
          </p>
          <p className="font-montserrat text-sm leading-relaxed" style={{ color: '#3D5A7A', whiteSpace: 'pre-wrap' }}>
            {message.message}
          </p>
          <div className="mt-5 flex justify-end items-end gap-2">
            <div className="divider-rose" style={{ width: '2.5rem' }} />
            <p className="font-dancing text-lg" style={{ color: '#E07898' }}>
              {message.memberName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    return subscribeToMessages(setMessages);
  }, []);

  if (messages.length === 0) {
    return (
      <div className="card-soft py-16 text-center">
        <p className="text-4xl mb-4">💌</p>
        <p className="font-dancing text-xl" style={{ color: '#C07090' }}>Chưa có lời nhắn nào...</p>
        <p className="text-sm font-montserrat mt-2" style={{ color: 'rgba(44,74,110,0.5)' }}>
          Hãy là người đầu tiên gửi thư tới cả lớp!
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-6" style={{ color: 'rgba(44,74,110,0.4)' }}>
        {messages.length} lá thư — nhấp để mở 💌
      </p>
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <LetterCard key={msg.id} message={msg} index={i} />
        ))}
      </div>
    </div>
  );
}
