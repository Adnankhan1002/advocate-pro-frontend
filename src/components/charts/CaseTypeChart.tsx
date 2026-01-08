'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CaseTypeChartProps {
  data?: {
    type: string;
    count: number;
  }[];
}

const defaultData = [
  { type: 'Criminal', count: 8, color: '#ef4444' },
  { type: 'Civil', count: 6, color: '#3b82f6' },
  { type: 'Family', count: 4, color: '#10b981' },
  { type: 'Corporate', count: 5, color: '#f59e0b' },
  { type: 'Property', count: 3, color: '#8b5cf6' },
];

export function CaseTypeChart({ data = defaultData }: CaseTypeChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{payload[0].payload.type}</p>
          <p className="text-sm text-slate-600">{payload[0].value} cases</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader>
        <CardTitle className="text-lg">Cases by Type</CardTitle>
        <p className="text-sm text-slate-600">Distribution across practice areas</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              type="category"
              dataKey="type"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#e2e8f0' }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
