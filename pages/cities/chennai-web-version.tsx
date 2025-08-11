import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import GoldGraph from '../../components/GoldGraph';
import GoldCalculator from '../../components/GoldCalculator';
import NearbyCities from '../../components/NearbyCities';
import Last10DaysTable from '../../components/Last10DaysTable';
import HistoricalMonthlyTable from '../../components/HistoricalMonthlyTable';
import FAQAccordion from '../../components/FAQAccordion';
import GoldPriceBannerComponent from '../../components/GoldPriceBannerComponent';
import Link from 'next/link';
import Image from 'next/image';

function formatDateTime(date: Date) {
  const day = date.toLocaleDateString('en-GB', { weekday: 'short' });
  const d = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const t = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day}, ${d} at ${t.toLowerCase()}`;
}

function getPercentageDiff(city: number, blueStone: number) {
  if (!city) return null;
  const diff = ((city - blueStone) / city) * 100;
  return diff;
}

// Static gold price data for 7 days (latest first)
const staticGoldData = [
  { date: '2025-06-30', price_24k: 9726, price_22k: 8915 },
  { date: '2025-06-29', price_24k: 9742, price_22k: 8930 },
  { date: '2025-06-28', price_24k: 9742, price_22k: 8930 },
  { date: '2025-06-27', price_24k: 9802, price_22k: 8985 },
  { date: '2025-06-26', price_24k: 9895, price_22k: 9070 },
  { date: '2025-06-25', price_24k: 9895, price_22k: 9070 },
  { date: '2025-06-24', price_24k: 9922, price_22k: 9095 },
];

// BlueStone prices are always lower (e.g., -100 for 24K, -90 for 22K)
const staticBlueStoneData = staticGoldData.map((d) => ({
  date: d.date,
  price_24k: d.price_24k - 100,
  price_22k: d.price_22k - 90,
}));

// For the table, use the latest date's prices
const latestChennai = staticGoldData[0];
const latestBlueStone = staticBlueStoneData[0];

const chennai18k = Math.round(latestChennai.price_24k * 0.75);
const blueStone18k = Math.round(latestBlueStone.price_24k * 0.75);

const percent18k = getPercentageDiff(chennai18k, blueStone18k);
const percent22k = getPercentageDiff(latestChennai.price_22k, latestBlueStone.price_22k);
const percent24k = getPercentageDiff(latestChennai.price_24k, latestBlueStone.price_24k);

// For the graph, use the static data in GoldPrice format
const historicalData = staticGoldData.map((d, i) => ({
  date: d.date,
  price_22k: d.price_22k,
  price_24k: d.price_24k,
  city_name: 'Chennai',
}));

export default function ChennaiDesignPage() {
  // Use a fixed date for demo
  const now = new Date('2025-06-30T17:37:00');

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: '#F0F0F0' }}>
      {/* Sticky Bluestone Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-blue-200">
        <img
          src="/BlueStone_header.png.png"
          alt="Bluestone Brand Header"
          className="w-full h-auto object-cover"
        />
      </header>
      

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-2">
        {/* Breadcrumb */}
        <div className="w-full px-4 py-0">
          <div className="bread-crumbs mb-2">
          <ul className="flex items-center text-xs uppercase tracking-wide space-x-2" style={{ fontFamily: 'Montserrat, Proxima Nova, Arial, sans-serif' }}>
            <li>
              <Link href="/" style={{ color: '#2A7ABE' }} className="hover:underline">Home</Link>
            </li>
            <li style={{ color: '#4D4D4D' }}>/</li>
            <li>
              <Link href="/gold-rates" style={{ color: '#2A7ABE' }} className="hover:underline">Gold Rate</Link>
            </li>
            <li style={{ color: '#4D4D4D' }}>/</li>
            <li>
              <span style={{ color: '#2C2F5C', fontWeight: 600 }}>Chennai</span>
            </li>
          </ul>
        </div>
          </div>

        {/* Gold Price Banner Component */}
        <GoldPriceBannerComponent />

          {/* BlueStone Goldmine Banner */}
        <div className="w-full p-2">
          <section className="info-card flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg shadow-gold py-4 px-6 relative overflow-hidden">
            <a href="https://www.bluestone.com/goldmine.html" onClick={() => { if (typeof window !== 'undefined' && (window as any).trackGA) { (window as any).trackGA('GMS', 'Clicked GMS Browse', 'GMS Banner Clicked on Browse'); } }} target="_blank" rel="noopener noreferrer">
              <img
                src="https://kinclimg7.bluestone.com/f_webp/static/resources/themes/bluestone/images/new/bp-goldmine.v6.jpg"
                alt="Goldmine Banner"
                className="img-responsive-c"
                style={{ width: '100%', height: '100%' }}
              />
            </a>
          </section>
        </div>

          {/* Tables 22k & 24k */}
        <div className="w-full px-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center">
              <h3 className="text-blue-900 font-bold text-base mb-3">22 Carat Gold Rate in Chennai (Today & Yesterday)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-blue-100 rounded-lg">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-2 text-left text-blue-900 font-semibold">Gram</th>
                      <th className="px-4 py-2 text-center text-blue-900 font-semibold">Today</th>
                      <th className="px-4 py-2 text-center text-blue-900 font-semibold">Yesterday</th>
                      <th className="px-4 py-2 text-center text-blue-900 font-semibold">Price Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const today = staticGoldData[0].price_22k;
                      const yesterday = staticGoldData[1].price_22k;
                      const rows = [
                        { label: '1 gram', t: today, y: yesterday },
                        { label: '8 grams', t: today * 8, y: yesterday * 8 },
                        { label: '10 grams', t: today * 10, y: yesterday * 10 },
                        { label: '12 grams', t: today * 12, y: yesterday * 12 },
                      ];
                      function formatINR(n: number) {
                        return '₹' + n.toLocaleString('en-IN');
                      }
                      return rows.map((row, i) => (
                        <tr key={row.label} className={i !== rows.length - 1 ? 'border-b border-blue-50' : ''}>
                          <td className="px-4 py-2 text-blue-800 font-medium whitespace-nowrap">{row.label}</td>
                          <td className="px-4 py-2 text-center text-blue-900 font-bold">{formatINR(row.t)}</td>
                          <td className="px-4 py-2 text-center text-blue-700">{formatINR(row.y)}</td>
                          <td className={`px-4 py-2 text-center font-semibold ${row.t - row.y < 0 ? 'text-green-700' : row.t - row.y > 0 ? 'text-red-700' : 'text-gray-700'}`}>{row.t - row.y > 0 ? '+' : ''}{formatINR(row.t - row.y)}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center">
              <h3 className="text-blue-900 font-bold text-base mb-3">24 Carat Gold Rate in Chennai (Today & Yesterday)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-blue-100 rounded-lg">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-2 text-left text-blue-900 font-semibold">Gram</th>
                      <th className="px-4 py-2 text-center text-blue-900 font-semibold">Today</th>
                      <th className="px-4 py-2 text-center text-blue-900 font-semibold">Yesterday</th>
                      <th className="px-4 py-2 text-center text-blue-900 font-semibold">Price Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const today = staticGoldData[0].price_24k;
                      const yesterday = staticGoldData[1].price_24k;
                      const rows = [
                        { label: '1 gram', t: today, y: yesterday },
                        { label: '8 grams', t: today * 8, y: yesterday * 8 },
                        { label: '10 grams', t: today * 10, y: yesterday * 10 },
                        { label: '12 grams', t: today * 12, y: yesterday * 12 },
                      ];
                      function formatINR(n: number) {
                        return '₹' + n.toLocaleString('en-IN');
                      }
                      return rows.map((row, i) => (
                        <tr key={row.label} className={i !== rows.length - 1 ? 'border-b border-blue-50' : ''}>
                          <td className="px-4 py-2 text-blue-800 font-medium whitespace-nowrap">{row.label}</td>
                          <td className="px-4 py-2 text-center text-blue-900 font-bold">{formatINR(row.t)}</td>
                          <td className="px-4 py-2 text-center text-blue-700">{formatINR(row.y)}</td>
                          <td className={`px-4 py-2 text-center font-semibold ${row.t - row.y < 0 ? 'text-green-700' : row.t - row.y > 0 ? 'text-red-700' : 'text-gray-700'}`}>{row.t - row.y > 0 ? '+' : ''}{formatINR(row.t - row.y)}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          </div>

          {/* End of the grid for 22k & 24k tables */}
        <div className="w-full px-4 py-2">
          <div className="mt-4">
            <a
              href="/store.html"
              className="ga-event-trigger"
              data-eventname="staticBannerSection_DropintoaBlueStone"
              data-pos="14"
              data-sectionname="store_locator"
              data-bannername="Drop into a BlueStone"
            >
              <img
                src="https://kinclimg5.bluestone.com/f_webp/static/hp/d/sb_v2.jpg"
                data-src="https://kinclimg5.bluestone.com/f_webp/static/hp/d/sb_v2.jpg"
                alt="Drop into a BlueStone,store near you"
                className="img-responsive-c lazyloaded"
              />
            </a>
          </div>
          </div>

          {/* Gold Price Calculator */}
        <div className="w-full px-4 py-2">
          <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center">
            <GoldCalculator price22k={staticGoldData[0].price_22k} price24k={staticGoldData[0].price_24k} city="Chennai" />
          </section>
        </div>

          {/* Gold price in city vs nearby cities & Top cities */}
        <div className="w-full px-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center">
              <NearbyCities currentCity="Chennai" currentState="Tamil Nadu" base22k={latestChennai.price_22k} base24k={latestChennai.price_24k} cityDisplayName="Chennai" />
            </section>
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center h-80">
              <h3 className="text-blue-900 font-bold text-lg mb-3">18 Carat Gold Rate in Chennai (Today & Yesterday)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-blue-100 rounded-lg">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-2 text-left text-blue-900 font-semibold">Gram</th>
                      <th className="px-4 py-2 text-center text-blue-900 font-semibold">Chennai</th>
                      <th className="px-4 py-2 text-center text-blue-900 font-semibold">BlueStone</th>
                      <th className="px-4 py-2 text-center text-blue-900 font-semibold">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const rows = [
                        { label: '1 gram', c: chennai18k, b: blueStone18k },
                        { label: '8 grams', c: chennai18k * 8, b: blueStone18k * 8 },
                        { label: '10 grams', c: chennai18k * 10, b: blueStone18k * 10 },
                        { label: '12 grams', c: chennai18k * 12, b: blueStone18k * 12 },
                      ];
                      function formatINR(n: number) {
                        return '₹' + n.toLocaleString('en-IN');
                      }
                      return rows.map((row, i) => (
                        <tr key={row.label} className={i !== rows.length - 1 ? 'border-b border-blue-50' : ''}>
                          <td className="px-4 py-2 text-blue-800 font-medium whitespace-nowrap">{row.label}</td>
                          <td className="px-4 py-2 text-center text-blue-900 font-bold">₹{row.c.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-2 text-center text-blue-900 font-bold">₹{row.b.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-2 text-center text-blue-900 font-bold">{row.c - row.b > 0 ? '+' : ''}₹{Math.abs(row.c - row.b).toLocaleString('en-IN')}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          </div>

          {/* Last 10 days Price Table & One More Graph */}
        <div className="w-full px-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center h-80">
              <Last10DaysTable />
            </section>
            <section className="info-card h-auto p-4">
              {/* Gold Rate Graph with Tabs */}
              <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-lg">
                <h3 className="text-base font-bold text-blue-900 mb-4">Weekly & Monthly Graph of 22K Gold Rate in Chennai (1 gram)</h3>
                <div className="flex gap-3 mb-4">
                  <button className="px-3 py-1 rounded bg-blue-700 text-white font-semibold text-sm">7 Days</button>
                  <button className="px-3 py-1 rounded bg-white text-blue-700 border border-blue-200 font-semibold text-sm">30 Days</button>
                  <button className="px-3 py-1 rounded bg-white text-blue-700 border border-blue-200 font-semibold text-sm">3 Months</button>
                  <button className="px-3 py-1 rounded bg-white text-blue-700 border border-blue-200 font-semibold text-sm">6 Months</button>
                </div>
                <div className="w-full h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={staticGoldData.slice(0, 7).map(d => ({
                      date: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                      price: d.price_22k
                    })).reverse()} margin={{ left: 0, right: 0, top: 10, bottom: 30 }}>
                      <defs>
                        <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.7}/>
                          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" fontSize={14} angle={0} dy={10} />
                      <YAxis domain={['dataMin-20', 'dataMax+20']} tickFormatter={v => `₹${v.toLocaleString('en-IN')}`} fontSize={12} width={60} />
                      <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} labelFormatter={d => `Date: ${d}`} />
                      <Area type="monotone" dataKey="price" stroke="#2563eb" fill="url(#colorGold)" strokeWidth={3} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </div>
          </div>

          {/* Historical price in a city */}
        <div className="w-full px-4 py-2">
          <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center h-80">
            <HistoricalMonthlyTable />
          </section>
        </div>

          {/* Info about the city gold trend */}
        <div className="w-full px-4 py-2">
          <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center">
            <h3 className="text-blue-900 font-bold text-lg mb-3">Investing in Gold in Bangalore</h3>
            <p className="mb-2 text-blue-900">Gold investments can be done in various forms, from buying jewelry from the local store, to investing in the gold markets without actually holding any physical gold. Major avenues for investment in gold are:</p>
            <ul className="list-disc pl-6 mb-2 text-blue-900">
              <li className="mb-1"><strong>Jewelry and ornaments</strong> - Gold jewelries are purchased during occasions such as marriages, festivals such as Diwali and a few other points of time in the year. However, the market gold rate in Bangalore is meant for pure metal and not works done on it. As such gold jewelries cost include both gold rate and workmanship. When reselling the ornaments, the consumers may not get the same value as he paid to buy them.</li>
              <li className="mb-1"><strong>Gold bullions</strong> - These represent bulk gold that can be purchased as ingots or bars. Gold bars are generally available at the market Gold rate trend today in Bangalore. These bars can be purchased from any bullion dealer in the city and represent good value on the investment as returns are close to actual investment. Gold bullions are available in larger quantities like kilograms.</li>
              <li className="mb-1"><strong>Gold coins</strong> - Gold coins are available in various purities in the city. The coins can be purchased from private dealers or banks. The coins are usually marked by the selling entity and are sold at slightly higher prices than the actual gold rate today in Bangalore.</li>
            </ul>
            <h4 className="text-blue-800 font-bold mt-4 mb-2">Impact of GST on Gold Rate in Bangalore</h4>
            <p className="mb-2 text-blue-900">Here are the details on the impact of Goods and Services Tax (GST) on gold rate in Bangalore:</p>
            <ul className="list-disc pl-6 mb-2 text-blue-900">
              <li>After the advent of GST, taxation on gold jewelry is 3.00%</li>
              <li>The rates are exclusive of Value Added Tax (VAT) at 1.50% along with 1.00% excise duty</li>
              <li>The gold rates are inclusive of 3.00% GST along with 10% custom duty and 5.00% processing fees</li>
              <li>Due to the addition of GST, the overall gold rate increases by 1.60%</li>
              <li>GST has nuetralised the gap between big and small dealers, and organised and unorganised sector</li>
            </ul>
          </section>
        </div>

          {/* FAQ */}
        <div className="w-full px-4 py-2">
          <FAQAccordion />
        </div>
        </main>

        {/* Sidebar - Moved to bottom */}
        <aside className="w-full bg-white border-t border-blue-200 py-6 px-8">
          {/* Navigation component removed */}
        </aside>

      {/* Footer */}
      <footer className="w-full bg-blue-100 border-t border-blue-300 py-4 px-6 text-center text-blue-900 font-medium">
        Footer (Links, Copyright, etc.)
      </footer>
    </div>
  );
} 