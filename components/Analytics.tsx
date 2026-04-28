'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnalyticsData, Member, Message } from '@/lib/types';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { subscribeToMembers, subscribeToMessages } from '@/lib/firebaseService';

const PALETTE = ['#F2A7B8','#A8D4EC','#C4B5E0','#A8C5A0','#F7C9A0','#95C8D8'];

const MARITAL_ICONS: Record<string,string> = {
  'Kết Hôn':'💍','Độc Thân':'🌿','Có ny':'💑','Chưa yêu ai bao giờ':'🌸','Ế':'🥲','Khác':'✨',
};

const softTooltip = {
  contentStyle: {
    background:'rgba(255,255,255,0.95)',
    border:'1px solid rgba(200,230,245,0.8)',
    borderRadius:'0.75rem',
    color:'#2C4A6E',
    fontSize:12,
    fontFamily:'inherit',
    boxShadow:'0 4px 20px rgba(168,212,236,0.2)',
  },
  itemStyle:{ color:'#E07898' },
  cursor:{ fill:'rgba(242,167,184,0.08)' },
};

/* ── Bản đồ Việt Nam hình chữ S ─────────────────────────────────── */
/*
 * viewBox: 0 0 140 420
 * Path được vẽ theo đường viền thực tế của Việt Nam (simplified)
 * Phần bắc rộng, eo miền Trung hẹp, phần Nam phình to → hình S rõ
 */
const VN_MAP_COORDS: Record<string,[number,number]> = {
  'Bắc Kạn':    [62, 62],
  'Hà Nội':     [70, 82],
  'Hải Phòng':  [85, 90],
  'Đà Nẵng':   [90, 200],
  'Sài Gòn':   [82, 330],
  'Cần Thơ':   [70, 360],
  'Nước Ngoài': [125, 30],
  'Khác':       [45, 220],
};

/*
 * Simplified outline của Việt Nam:
 * - Phần Bắc (Đông Bắc rộng, lõm vào vịnh Bắc Bộ)
 * - Eo thắt miền Trung (Quảng Bình ~200px)
 * - Phần Nam phình ra hình tam giác (mũi Cà Mau)
 * Toàn bộ tạo nên hình chữ S đặc trưng
 */
const VN_PATH = `
  M 58 8
  C 65 6 75 5 85 8
  C 92 10 98 14 102 20
  C 106 26 108 32 110 38
  C 112 44 113 50 112 56
  C 111 62 108 66 106 70
  C 103 75 100 79 99 84
  C 98 89 100 94 103 98
  C 107 103 112 106 114 112
  C 116 118 115 124 113 130
  C 111 136 107 140 104 146
  C 101 152 99 158 98 164
  C 97 170 97 176 96 182
  C 95 188 93 193 92 199
  C 91 205 91 210 92 215
  C 93 220 95 224 96 229
  C 97 234 97 239 95 244
  C 93 249 89 253 87 258
  C 85 264 84 270 85 276
  C 86 283 89 289 91 295
  C 93 302 94 309 92 316
  C 90 323 85 329 82 335
  C 78 342 75 348 72 355
  C 68 363 65 371 62 379
  C 59 387 57 395 55 402
  C 53 409 51 415 50 420
  L 45 418
  C 44 412 42 405 41 398
  C 40 390 40 382 42 375
  C 44 367 48 360 50 353
  C 52 345 52 337 50 329
  C 48 321 44 314 42 306
  C 40 298 39 290 40 282
  C 41 274 44 267 46 260
  C 48 253 49 246 48 239
  C 47 232 44 226 43 219
  C 42 212 42 205 44 198
  C 46 191 50 185 52 178
  C 54 171 55 164 54 157
  C 53 150 50 144 48 137
  C 46 130 44 123 44 116
  C 44 109 46 102 47 95
  C 48 88 48 81 46 74
  C 44 67 40 61 38 54
  C 36 47 35 40 36 33
  C 37 26 41 20 46 15
  C 51 10 55 8 58 8 Z
`;

function VietnamMap({ locationsData }: { locationsData: {name:string;value:number}[] }) {
  const max = Math.max(...locationsData.map(d => d.value), 1);

  return (
    <div className="relative" style={{ width:'100%', maxWidth: 220, margin:'0 auto' }}>
      <svg
        viewBox="0 0 200 500"
        style={{ width:'100%', height:'auto', overflow:'visible' }}
      >
        {/* S-shape background */}
        <path
          d={VN_PATH}
          fill="rgba(168,212,236,0.12)"
          stroke="rgba(168,212,236,0.45)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Location dots */}
        {locationsData.map((loc, i) => {
          const coord = VN_MAP_COORDS[loc.name];
          if (!coord) return null;
          const [cx, cy] = coord;
          const r = 5 + (loc.value / max) * 12;
          return (
            <g key={loc.name}>
              {/* Pulse ring */}
              <circle cx={cx} cy={cy} r={r + 4} fill={PALETTE[i % PALETTE.length]} opacity="0.2">
                <animate attributeName="r" values={`${r+2};${r+8};${r+2}`} dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0;0.25" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              {/* Dot */}
              <circle cx={cx} cy={cy} r={r} fill={PALETTE[i % PALETTE.length]} opacity="0.9" />
              <circle cx={cx} cy={cy} r={r * 0.45} fill="white" opacity="0.7" />
              {/* Label */}
              <text
                x={cx + r + 4}
                y={cy + 4}
                fontSize="9"
                fill="#3D5A7A"
                fontFamily="Montserrat, sans-serif"
                fontWeight="600"
              >
                {loc.name.split(' ').pop()} ({loc.value})
              </text>
            </g>
          );
        })}

        {/* "Nước Ngoài" label at top right */}
        {locationsData.find(d => d.name === 'Nước Ngoài') && (() => {
          const d = locationsData.find(x => x.name === 'Nước Ngoài')!;
          return (
            <g>
              <line x1="140" y1="60" x2="162" y2="60" stroke="#C4B5E0" strokeWidth="1" strokeDasharray="3,2"/>
              <text x="145" y="55" fontSize="8" fill="#7A6AAA" fontFamily="Montserrat,sans-serif">🌍</text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div className="mt-4 space-y-1.5">
        {locationsData.map((loc, i) => (
          <div key={loc.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="text-xs font-montserrat" style={{ color:'#3D5A7A' }}>
              {loc.name}
            </span>
            <div className="flex-1 mx-1" style={{ height:2, background:'rgba(168,212,236,0.2)', borderRadius:1 }}>
              <div style={{
                height:'100%',
                width:`${Math.round((loc.value / locationsData[0].value)*100)}%`,
                background: PALETTE[i % PALETTE.length],
                borderRadius:1,
                transition:'width 0.7s ease',
              }}/>
            </div>
            <span className="text-xs font-montserrat font-bold shrink-0"
              style={{ color: PALETTE[i % PALETTE.length] }}>
              {loc.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Analytics ─────────────────────────────────────────────── */
export function Analytics() {
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'charts'|'table'>('charts');

  useEffect(() => {
    const u1 = subscribeToMembers(setMembers);
    const u2 = subscribeToMessages(setMessages);
    return () => { u1(); u2(); };
  }, []);

  const analytics = useMemo<AnalyticsData>(() => {
    const maritalStatus: Record<string,number> = {};
    const jobCategories: Record<string,number> = {};
    const locations: Record<string,number> = {};
    members.forEach(m => {
      if (m.maritalStatus) maritalStatus[m.maritalStatus] = (maritalStatus[m.maritalStatus]||0)+1;
      if (m.jobCategory)   jobCategories[m.jobCategory]   = (jobCategories[m.jobCategory]||0)+1;
      if (m.location)      locations[m.location]           = (locations[m.location]||0)+1;
    });
    return { maritalStatus, jobCategories, locations, totalMembers:members.length, totalMessages:messages.length };
  }, [members, messages]);

  const maritalData = Object.entries(analytics.maritalStatus).map(([name,value]) => ({name,value}));
  const jobData     = Object.entries(analytics.jobCategories).map(([name,value]) => ({name,value}));
  const radarData   = jobData.map(d => ({ subject: d.name.replace('Công Nghệ ','IT ').split(' ').slice(0,2).join(' '), value: d.value }));
  const locData     = Object.entries(analytics.locations).map(([name,value]) => ({name,value})).sort((a,b)=>b.value-a.value).slice(0,8);

  const empty = <p className="text-center py-8 text-sm font-montserrat" style={{ color:'rgba(44,74,110,0.4)' }}>Chưa có dữ liệu</p>;

  const tabBtn = (tab:'charts'|'table', icon:string, text:string) => (
    <button onClick={() => setActiveTab(tab)} className="btn-outline flex items-center gap-1.5 transition-all"
      style={activeTab===tab ? { background:'rgba(242,167,184,0.2)', borderColor:'rgba(224,120,152,0.5)', color:'#C0607E' } : {}}>
      {icon} {text}
    </button>
  );

  return (
    <div className="space-y-8">

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { v:analytics.totalMembers, label:'Đã cập nhật', sub:`/ 44 thành viên`, icon:'👥', color:'#F2A7B8' },
          { v:analytics.totalMessages, label:'Lời nhắn',    sub:'đã gửi',          icon:'💌', color:'#A8D4EC' },
          { v:10,                     label:'Năm kỷ niệm', sub:'2012 – 2022',      icon:'🎉', color:'#C4B5E0' },
        ].map((s,i) => (
          <div key={i} className="card-soft py-7 px-3 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="font-playfair font-bold" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', color:s.color, lineHeight:1 }}>
              {s.v}
            </p>
            <p className="text-xs font-montserrat font-semibold mt-1.5 tracking-wide uppercase" style={{ color:'rgba(44,74,110,0.55)' }}>
              {s.label}
            </p>
            <p className="text-xs font-montserrat" style={{ color:'rgba(44,74,110,0.35)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {tabBtn('charts','📊','Biểu đồ')}
        {tabBtn('table','📋','Bảng tổng hợp')}
      </div>

      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* Row 1: Pie + Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Pie — hôn nhân */}
            <div className="card-soft p-6">
              <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-1" style={{ color:'#E07898' }}>Tình trạng hôn nhân</p>
              <p className="text-xs font-montserrat mb-5" style={{ color:'rgba(44,74,110,0.5)' }}>Phân bố theo trạng thái</p>
              {maritalData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={210}>
                    <PieChart>
                      <Pie data={maritalData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                        {maritalData.map((_,i) => <Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                      </Pie>
                      <Tooltip {...softTooltip}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {maritalData.map((d,i) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background:PALETTE[i%PALETTE.length] }}/>
                        <span className="text-xs font-montserrat truncate" style={{ color:'#3D5A7A' }}>
                          {MARITAL_ICONS[d.name]??''} {d.name} <b style={{ color:PALETTE[i%PALETTE.length] }}>({d.value})</b>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : empty}
            </div>

            {/* Radar — ngành nghề */}
            <div className="card-soft p-6">
              <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-1" style={{ color:'#E07898' }}>Ngành nghề</p>
              <p className="text-xs font-montserrat mb-5" style={{ color:'rgba(44,74,110,0.5)' }}>Phân bố theo lĩnh vực</p>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(168,212,236,0.35)"/>
                    <PolarAngleAxis dataKey="subject" tick={{ fill:'#5A8FAF', fontSize:11 }} tickLine={false}/>
                    <PolarRadiusAxis tick={{ fill:'rgba(44,74,110,0.35)', fontSize:9 }} axisLine={false} tickLine={false}/>
                    <Radar name="Số lượng" dataKey="value" stroke="#E07898" fill="#F2A7B8" fillOpacity={0.3} strokeWidth={2}/>
                    <Tooltip {...softTooltip}/>
                  </RadarChart>
                </ResponsiveContainer>
              ) : empty}
            </div>
          </div>

          {/* Row 2: Bar + Vietnam Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Bar — chi tiết lĩnh vực */}
            <div className="card-soft p-6">
              <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-1" style={{ color:'#E07898' }}>Chi tiết lĩnh vực</p>
              <p className="text-xs font-montserrat mb-5" style={{ color:'rgba(44,74,110,0.5)' }}>Số người theo nhóm ngành</p>
              {jobData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={jobData} layout="vertical" margin={{ top:0, right:20, left:110, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,212,236,0.2)" horizontal={false}/>
                    <XAxis type="number" tick={{ fill:'rgba(44,74,110,0.45)', fontSize:11 }} axisLine={false} tickLine={false}/>
                    <YAxis dataKey="name" type="category" width={105} tick={{ fill:'#5A8FAF', fontSize:11 }} axisLine={false} tickLine={false}/>
                    <Tooltip {...softTooltip}/>
                    <Bar dataKey="value" radius={[0,4,4,0]} background={{ fill:'rgba(200,230,245,0.1)', radius:4 }}>
                      {jobData.map((_,i) => <Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : empty}
            </div>

            {/* Vietnam map + location list */}
            <div className="card-soft p-6">
              <p className="text-xs font-montserrat font-semibold tracking-widest uppercase mb-1" style={{ color:'#E07898' }}>Phân bố địa điểm</p>
              <p className="text-xs font-montserrat mb-5" style={{ color:'rgba(44,74,110,0.5)' }}>Nơi sinh sống của cả lớp 🗺️</p>
              {locData.length > 0
                ? <VietnamMap locationsData={locData}/>
                : empty
              }
            </div>
          </div>
        </div>
      )}

      {activeTab === 'table' && (
        <div className="card-soft overflow-hidden">
          {/* Header */}
          <div
            className="grid grid-cols-12 px-5 py-3 text-xs font-montserrat font-semibold tracking-widest uppercase"
            style={{ background:'linear-gradient(135deg,rgba(242,167,184,0.15),rgba(168,212,236,0.15))', borderBottom:'1px solid rgba(200,230,245,0.5)', color:'#5A8FAF' }}
          >
            <div className="col-span-1">#</div>
            <div className="col-span-3">Tên</div>
            <div className="col-span-3">Ngành nghề</div>
            <div className="col-span-2">Hôn nhân</div>
            <div className="col-span-3">Nơi sống</div>
          </div>

          {members.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-4xl mb-3">🌸</p>
              <p className="text-sm font-montserrat" style={{ color:'rgba(44,74,110,0.45)' }}>Chưa có thành viên nào cập nhật</p>
            </div>
          ) : members.map((m, i) => (
            <div
              key={m.id}
              className="grid grid-cols-12 px-5 py-3.5 text-sm font-montserrat items-center transition-colors duration-150"
              style={{
                borderBottom:'1px solid rgba(200,230,245,0.25)',
                background: i%2===0 ? 'rgba(240,247,253,0.3)' : 'transparent',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background='rgba(242,167,184,0.07)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = i%2===0 ? 'rgba(240,247,253,0.3)' : 'transparent'}
            >
              <div className="col-span-1 text-xs tabular-nums" style={{ color:'rgba(168,212,236,0.7)' }}>
                {String(i+1).padStart(2,'0')}
              </div>
              <div className="col-span-3">
                <p style={{ color:'#2C4A6E' }}>{m.name}</p>
                {m.jobDetail && <p className="text-xs mt-0.5 truncate" style={{ color:'rgba(44,74,110,0.45)' }}>{m.jobDetail}</p>}
              </div>
              <div className="col-span-3">
                {m.jobCategory
                  ? <span className="inline-block px-2 py-0.5 text-xs rounded-full" style={{ background:'rgba(242,167,184,0.18)', color:'#C0607E', border:'1px solid rgba(224,120,152,0.25)' }}>{m.jobCategory}</span>
                  : <span style={{ color:'rgba(44,74,110,0.25)' }}>—</span>}
              </div>
              <div className="col-span-2 text-xs" style={{ color:'#5A8FAF' }}>
                {m.maritalStatus ? `${MARITAL_ICONS[m.maritalStatus]??''} ${m.maritalStatus}` : '—'}
              </div>
              <div className="col-span-3 text-xs" style={{ color:'#5A8FAF' }}>
                {m.location||'—'}
              </div>
            </div>
          ))}

          {members.length > 0 && (
            <div className="px-5 py-3 text-xs font-montserrat" style={{ background:'rgba(242,167,184,0.07)', borderTop:'1px solid rgba(242,167,184,0.2)', color:'rgba(44,74,110,0.45)' }}>
              🌸 Hiển thị {members.length} / 44 thành viên đã cập nhật
            </div>
          )}
        </div>
      )}
    </div>
  );
}
