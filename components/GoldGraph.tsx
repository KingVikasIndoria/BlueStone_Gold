import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// Static data for 7 days (latest first)
const staticGoldData = [
  { date: '2025-06-30', price_24k: 9726, price_22k: 8915 },
  { date: '2025-06-29', price_24k: 9742, price_22k: 8930 },
  { date: '2025-06-28', price_24k: 9742, price_22k: 8930 },
  { date: '2025-06-27', price_24k: 9802, price_22k: 8985 },
  { date: '2025-06-26', price_24k: 9895, price_22k: 9070 },
  { date: '2025-06-25', price_24k: 9895, price_22k: 9070 },
  { date: '2025-06-24', price_24k: 9922, price_22k: 9095 },
];

// Format for Recharts, add 18K as 75% of 24K
const chartData = staticGoldData.map((d) => ({
  date: d.date.slice(5), // MM-DD
  '18K': Math.round(d.price_24k * 0.75),
  '22K': d.price_22k,
  '24K': d.price_24k,
}));

// Calculate min and max from the dataset
const allPrices = staticGoldData.flatMap(d => [Math.round(d.price_24k * 0.75), d.price_22k, d.price_24k]);
const minY = Math.floor(Math.min(...allPrices) / 100) * 100 - 100;
const maxY = Math.ceil(Math.max(...allPrices) / 100) * 100 + 100;

// Generate ticks every 100 between minY and maxY
const ticks: number[] = [];
for (let t = minY; t <= maxY; t += 100) {
  ticks.push(t);
}

export default function TempGoldGraph() {
  return (
    <div className="bg-white rounded-lg shadow p-2 border border-blue-100 flex flex-col items-center justify-center w-full">
      <div className="w-full text-center text-blue-900 font-semibold text-base mb-2">Weekly Gold Rate (18K, 22K & 24K)</div>
      <div className="flex justify-center w-full">
        <ResponsiveContainer width={480} height={180}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ef" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis domain={[minY, maxY]} ticks={ticks} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={50} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} formatter={(value) => `₹${value}`} />
            <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 13 }} />
            <Line type="monotone" dataKey="18K" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981' }} activeDot={{ r: 4 }} name="18K" />
            <Line type="monotone" dataKey="22K" stroke="#f59e42" strokeWidth={2} dot={{ r: 2, fill: '#f59e42' }} activeDot={{ r: 4 }} name="22K" />
            <Line type="monotone" dataKey="24K" stroke="#2563eb" strokeWidth={2} dot={{ r: 2, fill: '#2563eb' }} activeDot={{ r: 4 }} name="24K" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 