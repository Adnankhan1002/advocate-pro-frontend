'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskProgressChartProps {
  tasksDone?: number;
  tasksTotal?: number;
  drafts?: number;
  alerts?: number;
}

export function TaskProgressChart({
  tasksDone = 8,
  tasksTotal = 12,
  drafts = 4,
  alerts = 2,
}: TaskProgressChartProps) {
  const data = [
    {
      name: 'Tasks',
      value: tasksDone,
      total: tasksTotal,
      color: '#10b981',
    },
    {
      name: 'Drafts',
      value: drafts,
      total: 10,
      color: '#3b82f6',
    },
    {
      name: 'Alerts',
      value: alerts,
      total: 5,
      color: '#f59e0b',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{data.name}</p>
          <p className="text-sm text-slate-600">
            {data.value} / {data.total}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {((data.value / data.total) * 100).toFixed(0)}% Complete
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader>
        <CardTitle className="text-lg">Today's Progress</CardTitle>
        <p className="text-sm text-slate-600">Your daily activity overview</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Progress indicators */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.name}</span>
                <span className="font-semibold text-slate-900">
                  {item.value}/{item.total}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.value / item.total) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
