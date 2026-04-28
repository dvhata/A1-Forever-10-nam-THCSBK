'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnalyticsData, Member, Message } from '@/lib/types';
import { COLORS } from '@/lib/constants';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { subscribeToMembers, subscribeToMessages } from '@/lib/firebaseService';

export function Analytics() {
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribeMembers = subscribeToMembers((items) => {
      setMembers(items);
    });
    const unsubscribeMessages = subscribeToMessages((items) => {
      setMessages(items);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeMessages();
    };
  }, []);

  const analytics = useMemo<AnalyticsData>(() => {
    const maritalStatus: Record<string, number> = {};
    const jobCategories: Record<string, number> = {};
    const locations: Record<string, number> = {};

    members.forEach((member) => {
      maritalStatus[member.maritalStatus] = (maritalStatus[member.maritalStatus] || 0) + 1;
      jobCategories[member.jobCategory] = (jobCategories[member.jobCategory] || 0) + 1;
      locations[member.location] = (locations[member.location] || 0) + 1;
    });

    return {
      maritalStatus,
      jobCategories,
      locations,
      totalMembers: members.length,
      totalMessages: messages.length,
    };
  }, [members, messages]);

  if (!analytics) return null;

  // Transform data for charts using reduce pattern
  const maritalStatusData = Object.entries(analytics.maritalStatus).reduce(
    (acc, [name, value]) => [...acc, { name, value }],
    [] as Array<{ name: string; value: number }>
  );

  const jobCategoriesData = Object.entries(analytics.jobCategories).reduce(
    (acc, [name, value]) => [...acc, { name, value }],
    [] as Array<{ name: string; value: number }>
  );

  const locationsData = Object.entries(analytics.locations)
    .reduce(
      (acc, [name, value]) => [...acc, { name, value }],
      [] as Array<{ name: string; value: number }>
    )
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const CHART_COLORS = [COLORS.orange, COLORS.orangeDark, COLORS.orangeLight, '#FF8A3D', '#FFB366', '#FFD9B3'];

  return (
    <div>
      <div className="space-y-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#FFFBF5] to-[#FFF5EB] p-6 rounded-lg border-2 border-[#FF6B00] text-center">
            <p className="text-3xl font-bold text-[#FF6B00]">{analytics.totalMembers}</p>
            <p className="text-sm text-[#0A1F44] font-semibold mt-2">Thành Viên</p>
          </div>
          <div className="bg-gradient-to-br from-[#FFFBF5] to-[#FFF5EB] p-6 rounded-lg border-2 border-[#FF6B00] text-center">
            <p className="text-3xl font-bold text-[#FF6B00]">{analytics.totalMessages}</p>
            <p className="text-sm text-[#0A1F44] font-semibold mt-2">Lời Nhắn</p>
          </div>
          <div className="bg-gradient-to-br from-[#FFFBF5] to-[#FFF5EB] p-6 rounded-lg border-2 border-[#0A1F44] text-center col-span-2 sm:col-span-1">
            <p className="text-3xl font-bold text-[#0A1F44]">10</p>
            <p className="text-sm text-[#0A1F44] font-semibold mt-2">Năm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Marital Status Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4" style={{ borderTopColor: COLORS.orange }}>
            <h3 className="text-lg font-bold mb-6 text-center text-[#0A1F44] font-playfair">
              Tình Trạng Hôn Nhân
            </h3>
            {maritalStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={maritalStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {maritalStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">Chưa có dữ liệu</p>
            )}
          </div>

          {/* Job Categories Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4" style={{ borderTopColor: COLORS.orange }}>
            <h3 className="text-lg font-bold mb-6 text-center text-[#0A1F44] font-playfair">
              Lĩnh Vực Công Việc
            </h3>
            {jobCategoriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={jobCategoriesData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.secondary} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">Chưa có dữ liệu</p>
            )}
          </div>

          {/* Locations Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4" style={{ borderTopColor: COLORS.orange }}>
            <h3 className="text-lg font-bold mb-6 text-center text-[#0A1F44] font-playfair">
              Phân Bố Địa Điểm
            </h3>
            {locationsData.length > 0 ? (
              <div className="space-y-3">
                {locationsData.map((location) => (
                  <div key={location.name} className="flex justify-between items-center pb-2 border-b border-[#E8DDD0]">
                    <span className="text-sm font-medium text-[#0A1F44]">{location.name}</span>
                    <span
                      className="px-3 py-1 rounded-full text-white text-sm font-bold"
                      style={{ backgroundColor: COLORS.orange }}
                    >
                      {location.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#0A1F44] opacity-60">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
