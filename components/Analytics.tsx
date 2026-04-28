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
/* Mapping tỉnh/thành → tọa độ [x%,y%] trên SVG viewBox 0 0 200 500 */
const VN_MAP_COORDS: Record<string,[number,number]> = {
  'Hà Nội':     [95, 148],
  'Bắc Kạn':   [97, 118],
  'Hải Phòng':  [110,158],
  'Đà Nẵng':   [115,268],
  'Sài Gòn':   [105,380],
  'Cần Thơ':   [98, 405],
  'Nước Ngoài': [168, 60],
  'Khác':       [60, 250],
};

/* SVG path approximating Vietnam's S-shape */
const VN_PATH = `
  M 97 45 C 102 50 108 55 110 65
  C 115 80 112 95 108 108
  C 105 118 100 125 98 135
  C 96 145 97 155 102 165
  C 108 178 115 185 118 198
  C 122 215 120 230 118 245
  C 116 258 114 268 116 280
  C 118 295 122 308 120 320
  C 117 335 112 345 110 358
  C 108 370 108 380 106 392
  C 104 405 100 415 96 425
  C 92 435 88 440 85 448
  L 80 455
  C 75 450 68 442 65 432
  C 62 422 65 412 68 402
  C 72 388 75 375 74 362
  C 73 348 70 335 72 322
  C 74 308 80 298 82 285
  C 84 272 83 260 82 248
  C 80 235 77 225 76 212
  C 75 198 77 186 80 174
  C 83 162 86 152 84 140
  C 82 128 77 118 76 106
  C 75 92 78 80 82 68
  C 86 55 90 48 97 45 Z
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
