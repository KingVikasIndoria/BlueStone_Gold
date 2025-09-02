import React from 'react';

type TableRow = {
  date: string; // already formatted for display
  price_22k: number; // per gram
  price_24k: number; // per gram
};

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

function getChange(curr: number, prev: number) {
  const diff = curr - prev;
  if (diff === 0) return null;
  const isUp = diff > 0;
  return {
    value: Math.abs(diff),
    isUp,
  };
}

const TempLast10DaysTable: React.FC<{ data: TableRow[] }> = ({ data }) => {
  const rows = data;
  return (
    <>
      <h3 className="text-blue-900 font-bold text-sm lg:text-lg mb-2 lg:mb-3">Gold Rate in Chennai for Last 10 days</h3>
      <div className="overflow-x-auto overflow-y-auto h-full">
        <table className="min-w-full text-xs lg:text-sm border border-blue-100 rounded-lg">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-left text-blue-900 font-semibold">Date</th>
              <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Standard Gold (22K)<br/>(1 gram)</th>
              <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Pure Gold (24K)<br/>(1 gram)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const prev = rows[i + 1];
              const change22k = prev ? getChange(row.price_22k, prev.price_22k) : null;
              const change24k = prev ? getChange(row.price_24k, prev.price_24k) : null;
              return (
                <tr key={row.date} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                  <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-blue-800 font-medium whitespace-nowrap">{row.date}</td>
                  <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-bold">
                    {formatINR(row.price_22k)}
                    {change22k && (
                      <span className={`ml-1 lg:ml-2 font-semibold text-xs ${change22k.isUp ? 'text-green-600' : 'text-red-600'}`}>(₹{change22k.value.toLocaleString('en-IN')} {change22k.isUp ? '▲' : '▼'})</span>
                    )}
                  </td>
                  <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-bold">
                    {formatINR(row.price_24k)}
                    {change24k && (
                      <span className={`ml-1 lg:ml-2 font-semibold text-xs ${change24k.isUp ? 'text-green-600' : 'text-red-600'}`}>(₹{change24k.value.toLocaleString('en-IN')} {change24k.isUp ? '▲' : '▼'})</span>
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