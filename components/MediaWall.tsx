'use client';

import { useState, useEffect, useCallback } from 'react';
import { subscribeToMedia } from '@/lib/firebaseService';
import { MediaItem } from '@/lib/types';

function Lightbox({ items, current, onClose }: { items:MediaItem[]; current:number; onClose:()=>void }) {
  const [idx, setIdx] = useState(current);
  const item = items[idx];
  const prev = useCallback(() => setIdx(i => (i-1+items.length)%items.length), [items.length]);
  const next = useCallback(() => setIdx(i => (i+1)%items.length), [items.length]);

  useEffect(() => {
    const h = (e:KeyboardEvent) => { if(e.key==='Escape') onClose(); if(e.key==='ArrowLeft') prev(); if(e.key==='ArrowRight') next(); };
    window.addEventListener('keydown',h); return () => window.removeEventListener('keydown',h);
  },[onClose,prev,next]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background:'rgba(20,30,50,0.95)', backdropFilter:'blur(8px)' }} onClick={onClose}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom:'1px solid rgba(200,230,245,0.15)' }} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-montserrat font-bold"
            style={{ background:'rgba(242,167,184,0.2)', color:'#F2A7B8', border:'1px solid rgba(242,167,184,0.35)' }}>
            {String(idx+1).padStart(2,'0')}
          </div>
          <div>
            <p className="text-sm font-montserrat font-semibold text-white">{item.memberName}</p>
            {item.caption && <p className="text-xs font-montserrat" style={{ color:'rgba(255,255,255,0.5)' }}>{item.caption}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-montserrat" style={{ color:'rgba(255,255,255,0.35)' }}>{idx+1}/{items.length}</span>
          <button onClick={onClose} className="btn-outline text-xs" style={{ color:'rgba(255,255,255,0.6)', borderColor:'rgba(255,255,255,0.15)' }}>Đóng ✕</button>
        </div>
      </div>

      {/* Image / video */}
      <div className="flex-1 flex items-center justify-center relative p-4" onClick={e=>e.stopPropagation()}>
        {item.type==='photo'
          ? <img src={item.url} alt={item.memberName} className="max-w-full max-h-full object-contain rounded-xl" style={{ boxShadow:'0 8px 40px rgba(0,0,0,0.5)' }}/>
          : <video src={item.url} controls autoPlay className="max-w-full max-h-full rounded-xl"/>}
        {items.length>1&&<>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background:'rgba(255,255,255,0.12)', color:'white', backdropFilter:'blur(8px)' }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(242,167,184,0.3)'}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.12)'}>‹</button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background:'rgba(255,255,255,0.12)', color:'white', backdropFilter:'blur(8px)' }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(242,167,184,0.3)'}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.12)'}>›</button>
        </>}
      </div>

      {/* Thumbnails */}
      {items.length>1&&(
        <div className="flex gap-2 px-6 py-3 overflow-x-auto shrink-0" style={{ borderTop:'1px solid rgba(255,255,255,0.08)' }} onClick={e=>e.stopPropagation()}>
          {items.map((it,i) => (
            <button key={it.id} onClick={()=>setIdx(i)} className="shrink-0 w-14 h-14 overflow-hidden rounded-lg transition-all"
              style={{ border:i===idx?'2.5px solid #F2A7B8':'2.5px solid transparent', opacity:i===idx?1:0.45 }}>
              {it.type==='photo'
                ? <img src={it.url} alt="" className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center rounded-lg text-lg" style={{ background:'rgba(168,212,236,0.2)' }}>▶</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MediaCard({ item, index, onOpen }: { item:MediaItem; index:number; onOpen:()=>void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300"
      style={{
        background:'rgba(255,255,255,0.8)',
        border: hovered ? '1.5px solid rgba(242,167,184,0.6)' : '1.5px solid rgba(200,230,245,0.5)',
        boxShadow: hovered ? '0 8px 32px rgba(224,120,152,0.15)' : '0 2px 12px rgba(168,212,236,0.1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        backdropFilter:'blur(8px)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden" style={{ background:'#f0f7fb' }}>
        {item.type==='photo'
          ? <img src={item.url} alt={item.memberName} className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform:hovered?'scale(1.07)':'scale(1)', filter:hovered?'brightness(0.78)':'brightness(0.92)' }}/>
          : <div className="w-full h-full flex items-center justify-center" style={{ background:'linear-gradient(135deg,#EEF7FC,#FDE8EE)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-transform duration-300"
                style={{ background:'rgba(255,255,255,0.8)', transform:hovered?'scale(1.12)':'scale(1)', boxShadow:'0 4px 16px rgba(224,120,152,0.2)' }}>▶</div>
            </div>}

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300"
          style={{ opacity:hovered?1:0, background:'rgba(253,232,238,0.35)', backdropFilter:'blur(2px)' }}>
          <div className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5">
            👁️ Xem chi tiết
          </div>
        </div>

        {/* Type badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-montserrat font-semibold"
          style={{ background:'rgba(255,255,255,0.85)', color: item.type==='video'?'#E07898':'#5A8FAF', backdropFilter:'blur(8px)' }}>
          {item.type==='photo'?'📷':'🎬'}
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 py-3 transition-colors duration-200"
        style={{ background: hovered ? 'rgba(253,232,238,0.4)' : 'transparent' }}>
        <p className="text-xs font-montserrat font-semibold" style={{ color:'#2C4A6E' }}>{item.memberName}</p>
        <div className="flex items-center justify-between mt-0.5">
          {item.caption
            ? <p className="text-xs font-montserrat truncate" style={{ color:'rgba(44,74,110,0.5)' }}>{item.caption}</p>
            : <span/>}
          <p className="text-xs font-montserrat shrink-0 ml-2" style={{ color:'rgba(224,120,152,0.6)' }}>
            {new Date(item.timestamp).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MediaWall() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [selectedMember, setSelectedMember] = useState('all');
  const [lightboxIdx, setLightboxIdx] = useState<number|null>(null);

  useEffect(() => subscribeToMedia(setMediaItems), []);
  useEffect(() => {
    setFilteredMedia(selectedMember==='all' ? mediaItems : mediaItems.filter(i=>i.memberName===selectedMember));
  }, [mediaItems, selectedMember]);

  const uniqueMembers = Array.from(new Set(mediaItems.map(i=>i.memberName)));

  const filterBtn = (key:string, label:string) => {
    const active = selectedMember===key;
    return (
      <button key={key} onClick={()=>setSelectedMember(key)}
        className="transition-all duration-200 text-xs font-montserrat font-semibold px-4 py-1.5 rounded-full"
        style={{
          background: active ? 'linear-gradient(135deg,#E07898,#C4B5E0)' : 'rgba(255,255,255,0.7)',
          color: active ? 'white' : '#3D5A7A',
          border: active ? 'none' : '1.5px solid rgba(200,230,245,0.7)',
          boxShadow: active ? '0 3px 12px rgba(224,120,152,0.3)' : 'none',
        }}>
        {label}
      </button>
    );
  };

  return (
    <section className="py-20 sm:py-28" style={{ background:'linear-gradient(160deg, #FDE8EE 0%, #EEF7FC 100%)' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-12">

        <div className="mb-12 reveal">
          <div className="section-label">
            <span className="text-xs font-montserrat font-semibold tracking-widest uppercase" style={{ color:'#E07898' }}>Tường kỷ niệm</span>
          </div>
          <h2 className="font-playfair font-bold" style={{ fontSize:'clamp(1.8rem,4.5vw,3rem)', color:'#2C4A6E' }}>
            Ảnh & Video 📸
          </h2>
        </div>

        <div className="divider-rose mb-8" />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10 reveal stagger-1">
          {filterBtn('all',`Tất cả (${mediaItems.length})`)}
          {uniqueMembers.slice(0,8).map(m => filterBtn(m,`${m.split(' ').pop()} (${mediaItems.filter(i=>i.memberName===m).length})`))}
          {uniqueMembers.length>8&&<span className="text-xs font-montserrat self-center" style={{ color:'rgba(44,74,110,0.4)' }}>+{uniqueMembers.length-8}</span>}
        </div>

        {filteredMedia.length===0 ? (
          <div className="card-soft py-20 text-center">
            <p className="text-5xl mb-4">📷</p>
            <p className="font-dancing text-xl" style={{ color:'#C07090' }}>Chưa có kỷ niệm nào</p>
            <p className="text-sm font-montserrat mt-2" style={{ color:'rgba(44,74,110,0.5)' }}>Hãy là người đầu tiên tải lên ảnh & video!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item,i) => (
              <MediaCard key={item.id} item={item} index={i} onOpen={()=>setLightboxIdx(i)}/>
            ))}
          </div>
        )}
      </div>

      {lightboxIdx!==null && (
        <Lightbox items={filteredMedia} current={lightboxIdx} onClose={()=>setLightboxIdx(null)}/>
      )}
    </section>
  );
}
