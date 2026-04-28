'use client';

import { useEffect, useState } from 'react';
import { subscribeToMessages } from '@/lib/firebaseService';
import { Message } from '@/lib/types';

export function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((items) => {
      setMessages(items);
    });
    return unsubscribe;
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours}h trước`;
    if (days < 7) return `${days}d trước`;
    return date.toLocaleDateString('vi-VN');
  };

  if (messages.length === 0) {
    return (
      <div
        className="py-16 text-center"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-sm font-montserrat" style={{ color: '#555555' }}>
          Chưa có lời nhắn nào. Hãy là người đầu tiên chia sẻ!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-px">
      {messages.map((message, idx) => (
        <div
          key={message.id}
          className="group relative p-6 sm:p-8 transition-all duration-200"
          style={{
            background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
            borderLeft: '2px solid transparent',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderLeftColor = '#C9A84C';
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.04)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent';
            (e.currentTarget as HTMLDivElement).style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 flex items-center justify-center text-xs font-montserrat font-bold"
                style={{
                  background: 'rgba(201,168,76,0.15)',
                  color: '#C9A84C',
                }}
              >
                {message.memberName.charAt(message.memberName.lastIndexOf(' ') + 1)}
              </div>
              <span className="font-montserrat font-semibold text-sm" style={{ color: '#F5F4F0' }}>
                {message.memberName}
              </span>
            </div>
            <span className="text-xs font-montserrat shrink-0" style={{ color: '#555555' }}>
              {formatDate(message.timestamp)}
            </span>
          </div>
          <p className="text-sm font-montserrat leading-relaxed pl-9" style={{ color: '#888888' }}>
            {message.message}
          </p>
        </div>
      ))}
    </div>
  );
}
