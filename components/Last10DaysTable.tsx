import React from 'react';

// Demo data for last 10 days (latest first)
const demoGoldData = [
  { date: '02 Jul 2025', price_22k: 9180, price_24k: 9639 },
  { date: '01 Jul 2025', price_22k: 9135, price_24k: 9592 },
  { date: '30 Jun 2025', price_22k: 9030, price_24k: 9482 },
  { date: '29 Jun 2025', price_22k: 9150, price_24k: 9600 },
  { date: '28 Jun 2025', price_22k: 9100, price_24k: 9550 },
  { date: '27 Jun 2025', price_22k: 9000, price_24k: 9450 },
  { date: '26 Jun 2025', price_22k: 9050, price_24k: 9500 },
  { date: '25 Jun 2025', price_22k: 8950, price_24k: 9400 },
  { date: '24 Jun 2025', price_22k: 9000, price_24k: 9450 },
  { date: '23 Jun 2025', price_22k: 8900, price_24k: 9350 },
];

function formatINR(n: number) {
  return '₹' + (n * 8).toLocaleString('en-IN');
}

function getChange(curr: number, prev: number) {
  const diff = (curr - prev) * 8;
  if (diff === 0) return null;
  const isUp = diff > 0;
  return {
    value: Math.abs(diff),
    isUp,
  };
}

const TempLast10DaysTable: React.FC = () => {
  return (
    <>
      <h3 className="text-blue-900 font-bold text-lg mb-3">Gold Rate in Chennai for Last 10 days</h3>
      <div className="overflow-x-auto overflow-y-auto max-h-80">
        <table className="min-w-full text-sm border border-blue-100 rounded-lg">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left text-blue-900 font-semibold">Date</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">Standard Gold (22K)<br/>(8 grams)</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">Pure Gold (24K)<br/>(8 grams)</th>
            </tr>
          </thead>
          <tbody>
            {demoGoldData.map((row, i) => {
              const prev = demoGoldData[i + 1];
              const change22k = prev ? getChange(row.price_22k, prev.price_22k) : null;
              const change24k = prev ? getChange(row.price_24k, prev.price_24k) : null;
              return (
                <tr key={row.date} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 text-blue-800 font-medium whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-2 text-center text-blue-900 font-bold">
                    {formatINR(row.price_22k)}
                    {change22k && (
                      <span className={`ml-2 font-semibold ${change22k.isUp ? 'text-green-600' : 'text-red-600'}`}>({change22k.value.toLocaleString('en-IN')} {change22k.isUp ? '▲' : '▼'})</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center text-blue-900 font-bold">
                    {formatINR(row.price_24k)}
                    {change24k && (
                      <span className={`ml-2 font-semibold ${change24k.isUp ? 'text-green-600' : 'text-red-600'}`}>({change24k.value.toLocaleString('en-IN')} {change24k.isUp ? '▲' : '▼'})</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TempLast10DaysTable; 