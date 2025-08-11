import React from 'react';

// Demo data for historical monthly prices (latest first)
const demoMonthlyData = [
  { month: 'May 2025', low_18k: 70000, high_18k: 73000, low_22k: 93930, high_22k: 97640, low_24k: 93930, high_24k: 97640 },
  { month: 'April 2025', low_18k: 67500, high_18k: 71000, low_22k: 90430, high_22k: 98210, low_24k: 90430, high_24k: 98210 },
  { month: 'March 2025', low_18k: 65000, high_18k: 69000, low_22k: 86620, high_22k: 91910, low_24k: 86620, high_24k: 91910 },
  { month: 'February 2025', low_18k: 63000, high_18k: 67000, low_22k: 84050, high_22k: 88090, low_24k: 84050, high_24k: 88090 },
  { month: 'January 2025', low_18k: 60000, high_18k: 65000, low_22k: 78000, high_22k: 84430, low_24k: 78000, high_24k: 84430 },
  { month: 'December 2024', low_18k: 59000, high_18k: 60000, low_22k: 77350, high_22k: 78000, low_24k: 77350, high_24k: 78000 },
  { month: 'November 2024', low_18k: 57000, high_18k: 59000, low_22k: 75650, high_22k: 80560, low_24k: 75650, high_24k: 80560 },
  { month: 'October 2024', low_18k: 56000, high_18k: 58000, low_22k: 76910, high_22k: 81330, low_24k: 76910, high_24k: 81330 },
  { month: 'September 2024', low_18k: 54000, high_18k: 57000, low_22k: 72750, high_22k: 77450, low_24k: 72750, high_24k: 77450 },
  { month: 'August 2024', low_18k: 52000, high_18k: 55000, low_22k: 68780, high_22k: 73680, low_24k: 68780, high_24k: 73680 },
  { month: 'July 2024', low_18k: 51000, high_18k: 54000, low_22k: 67850, high_22k: 73880, low_24k: 67850, high_24k: 73880 },
  { month: 'June 2024', low_18k: 50000, high_18k: 53000, low_22k: 67450, high_22k: 73580, low_24k: 67450, high_24k: 73580 },
  { month: 'May 2024', low_18k: 49500, high_18k: 52500, low_22k: 67255, high_22k: 73330, low_24k: 67255, high_24k: 73330 },
  { month: 'April 2024', low_18k: 50000, high_18k: 54000, low_22k: 67775, high_22k: 75400, low_24k: 67775, high_24k: 75400 },
  { month: 'March 2024', low_18k: 47000, high_18k: 49500, low_22k: 63160, high_22k: 66270, low_24k: 63160, high_24k: 66270 },
  { month: 'February 2024', low_18k: 46000, high_18k: 48000, low_22k: 62010, high_22k: 64120, low_24k: 62010, high_24k: 64120 },
  { month: 'January 2024', low_18k: 46000, high_18k: 48000, low_22k: 62690, high_22k: 64090, low_24k: 62690, high_24k: 64090 },
];

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

const TempHistoricalMonthlyTable: React.FC = () => {
  return (
    <>
      <h3 className="text-blue-900 font-bold text-lg mb-3">Historical Gold Rate in Bangalore</h3>
      <div className="overflow-x-auto overflow-y-auto max-h-80">
        <table className="min-w-full text-sm border border-blue-100 rounded-lg">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left text-blue-900 font-semibold">Month</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">Lowest 18K<br/>Per 10g</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">Highest 18K<br/>Per 10g</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">Lowest 22K<br/>Per 10g</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">Highest 22K<br/>Per 10g</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">Lowest 24K<br/>Per 10g</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">Highest 24K<br/>Per 10g</th>
            </tr>
          </thead>
          <tbody>
            {demoMonthlyData.map((row, i) => (
              <tr key={row.month} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-2 text-blue-800 font-medium whitespace-nowrap">{row.month}</td>
                <td className="px-4 py-2 text-center text-blue-900 font-bold">{formatINR(row.low_18k)}</td>
                <td className="px-4 py-2 text-center text-blue-900 font-bold">{formatINR(row.high_18k)}</td>
                <td className="px-4 py-2 text-center text-blue-900 font-bold">{formatINR(row.low_22k)}</td>
                <td className="px-4 py-2 text-center text-blue-900 font-bold">{formatINR(row.high_22k)}</td>
                <td className="px-4 py-2 text-center text-blue-900 font-bold">{formatINR(row.low_24k)}</td>
                <td className="px-4 py-2 text-center text-blue-900 font-bold">{formatINR(row.high_24k)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TempHistoricalMonthlyTable; 