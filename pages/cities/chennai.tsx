import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import GoldGraph from '../../components/GoldGraph';
import GoldCalculator from '../../components/GoldCalculator';
import NearbyCities from '../../components/NearbyCities';
import Last10DaysTable from '../../components/Last10DaysTable';
import HistoricalMonthlyTable from '../../components/HistoricalMonthlyTable';
import FAQAccordion from '../../components/FAQAccordion';
import GoldPriceBannerComponent from '../../components/GoldPriceBannerComponent';
import InterlinkingLinks from '../../components/InterlinkingLinks';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Header from '../../components/Header';

 

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

 

// Load real Chennai data at build time
import chennaiDataRaw from '../../data/cities/chennai.json';

type RawItem = { date: string; [k: string]: any };
const chennaiData: { date: string; price_22k: number; price_24k: number }[] = (chennaiDataRaw as RawItem[])
  .map((d) => ({
    date: d.date,
    price_22k: d['22k'],
    price_24k: d['24k'],
  })); // keep oldest -> newest order

// BlueStone prices are always lower (e.g., -100 for 24K, -90 for 22K)
const staticBlueStoneData = chennaiData.map((d) => ({
  date: d.date,
  price_24k: d.price_24k - 100,
  price_22k: d.price_22k - 90,
}));

// For the table, use the latest date's prices
const latestChennai = chennaiData[chennaiData.length - 1];
const latestBlueStone = staticBlueStoneData[0];

const chennai18k = Math.round(latestChennai.price_24k * 0.75);
const blueStone18k = Math.round(latestBlueStone.price_24k * 0.75);

const percent18k = getPercentageDiff(chennai18k, blueStone18k);
const percent22k = getPercentageDiff(latestChennai.price_22k, latestBlueStone.price_22k);
const percent24k = getPercentageDiff(latestChennai.price_24k, latestBlueStone.price_24k);

// For the graph, use the real data in GoldPrice format (recent slice)
const historicalData = chennaiData.slice(-30).map((d) => ({
  date: d.date,
  price_22k: d.price_22k,
  price_24k: d.price_24k,
  city_name: 'Chennai',
}));

export default function ChennaiDesignPage() {
  const [range, setRange] = useState<'7d' | '30d' | '3m'>('7d');
  const selectedDays = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const chartData = chennaiData
    .slice(-selectedDays)
    .map(d => ({
      date: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      price: d.price_22k
    }));
  const last10 = useMemo(() => {
    return chennaiData
      .slice(-10)
      .map((d) => ({
        date: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        price_22k: d.price_22k,
        price_24k: d.price_24k,
      }))
      .reverse(); // latest first for table logic
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: '#F0F0F0' }}>
      {/* BlueStone Header (sticky) */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-blue-200">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-1 lg:p-4 space-y-0.5 lg:space-y-2">
        {/* Breadcrumb */}
        <div className="w-full px-2 lg:px-4 py-0">
          <div className="bread-crumbs mb-0">
          <ul className="flex items-center text-[9px] lg:text-xs uppercase tracking-wide space-x-2" style={{ fontFamily: 'Montserrat, Proxima Nova, Arial, sans-serif' }}>
            <li>
              <Link href="/" style={{ color: '#2A7ABE' }} className="hover:underline">Home</Link>
            </li>
            <li style={{ color: '#4D4D4D' }}>/</li>
            <li>
              <Link href="/gold-rates" style={{ color: '#2A7ABE' }} className="hover:underline">Gold Rate</Link>
            </li>
            <li style={{ color: '#4D4D4D' }}>/</li>
            <li>
              <span className="font-medium lg:font-semibold" style={{ color: '#2C2F5C' }}>Chennai</span>
            </li>
          </ul>
        </div>
          </div>

        {/* Gold Price Banner Component */}
        <GoldPriceBannerComponent
          mobileStyle="table"
          cityName="Chennai"
          price22k={latestChennai.price_22k}
          price24k={latestChennai.price_24k}
          bluestone22k={latestChennai.price_22k - 90}
          bluestone24k={latestChennai.price_24k - 100}
        />

          {/* Goldmine Banner */}
        <div className="w-full p-1 lg:p-2">
          {/* Mobile Goldmine Banner */}
          <section className="block lg:hidden">
            <div 
              className="strip-wrap"
              style={{
                WebkitTextSizeAdjust: '100%',
                fontFamily: 'sans-serif, Arial',

                lineHeight: '1.5em',
                WebkitTapHighlightColor: 'transparent',
                outline: 'none !important',
                borderTop: '1px solid #F6C2CB',
                borderBottom: '1px solid #F6C2CB',
                padding: '12px 15px',
                color: '#050C33',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                position: 'relative',
                backgroundColor: '#fef7f7'
              }}
            >
              <div className="strip-left" style={{ flex: '1', textAlign: 'left' }}>
                <div className="strip-title" style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                  Gold Mine <strong style={{ color: '#d63384' }}>10 + 1</strong> Monthly Plan
                </div>
                <div className="strip-desc" style={{ fontSize: '10px', color: '#666' }}>
                  (Pay 10 installments &amp; enjoy 100% savings on the 11th month!)
                </div>
              </div>
              <div className="strip-btn" style={{ marginLeft: '10px' }}>
                <a 
                  href="/goldmine.html" 
                  className="ga-event-trigger"
                  data-eventname="stripSection_GoldMine"
                  style={{
                    backgroundColor: '#f8d4d7',
                    color: '#050C33',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: '600',
                    border: '1px solid #e9c6cc'
                  }}
                >
                  Enroll Now
                </a>
              </div>
              <a href="/goldmine.html" className="strip-link ga-event-trigger" data-eventname="stripSection_Gold Mine" title="Gold Mine" style={{ position: 'absolute', inset: '0', zIndex: '1' }}></a>
            </div>
          </section>

          {/* Desktop Goldmine Banner - Original with Image */}
          <section className="hidden lg:flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg shadow-gold py-4 px-6 relative overflow-hidden">
            <a href="https://www.bluestone.com/goldmine.html" onClick={() => { if (typeof window !== 'undefined' && (window as any).trackGA) { (window as any).trackGA('GMS', 'Clicked GMS Browse', 'GMS Banner Clicked on Browse'); } }} target="_blank" rel="noopener noreferrer">
              <img
                src="https://kinclimg7.bluestone.com/f_webp/static/resources/themes/bluestone/images/new/bp-goldmine.v6.jpg"
                alt="Goldmine Banner"
                className="img-responsive-c w-full h-auto rounded-lg"
                style={{ width: '100%', height: '100%' }}
              />
            </a>
          </section>
        </div>

          {/* Tables 22k & 24k */}
        <div className="w-full px-2 lg:px-4 py-1 lg:py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center">
              <h3 className="text-blue-900 font-bold text-sm lg:text-base mb-2 lg:mb-3">22 Carat Gold Rate in Chennai (Today & Yesterday)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs lg:text-sm border border-blue-100 rounded-lg">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-left text-blue-900 font-semibold">Gram</th>
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Today</th>
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Yesterday</th>
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Price Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const today = latestChennai.price_22k;
                      const yesterday = chennaiData[chennaiData.length - 2].price_22k;
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
                          <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-blue-800 font-medium whitespace-nowrap text-xs lg:text-sm">{row.label}</td>
                          <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-bold text-xs lg:text-sm">{formatINR(row.t)}</td>
                          <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-700 text-xs lg:text-sm">{formatINR(row.y)}</td>
                          <td className={`px-2 lg:px-4 py-1.5 lg:py-2 text-center font-semibold text-xs lg:text-sm ${row.t - row.y > 0 ? 'text-green-700' : row.t - row.y < 0 ? 'text-red-700' : 'text-gray-700'}`}>{row.t - row.y > 0 ? '+' : ''}{formatINR(row.t - row.y)}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center">
              <h3 className="text-blue-900 font-bold text-sm lg:text-base mb-2 lg:mb-3">24 Carat Gold Rate in Chennai (Today & Yesterday)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs lg:text-sm border border-blue-100 rounded-lg">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-left text-blue-900 font-semibold">Gram</th>
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Today</th>
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Yesterday</th>
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Price Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const today = latestChennai.price_24k;
                      const yesterday = chennaiData[chennaiData.length - 2].price_24k;
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
                          <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-blue-800 font-medium whitespace-nowrap text-xs lg:text-sm">{row.label}</td>
                          <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-bold text-xs lg:text-sm">{formatINR(row.t)}</td>
                          <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-700 text-xs lg:text-sm">{formatINR(row.y)}</td>
                          <td className={`px-2 lg:px-4 py-1.5 lg:py-2 text-center font-semibold text-xs lg:text-sm ${row.t - row.y > 0 ? 'text-green-700' : row.t - row.y < 0 ? 'text-red-700' : 'text-gray-700'}`}>{row.t - row.y > 0 ? '+' : ''}{formatINR(row.t - row.y)}</td>
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
        {/* Store Banner */}
        <div className="w-full px-2 lg:px-4 py-1 lg:py-2">
          <div className="mt-3 lg:mt-2">
            {/* Mobile Store Banner */}
            <section className="h-section static-banner-section block lg:hidden">
              <h2 className="h-title text-center text-lg font-bold text-blue-900 mb-4">Drop into a BlueStone<br/>store near you</h2>
              <a href="/store.html" className="ga-event-trigger block" data-eventname="staticBannerSection_DropintoaBlueStone">
                <img 
                  src="https://kinclimg5.bluestone.com/f_webp/static/hp/m/store.png" 
                  data-src="https://kinclimg5.bluestone.com/f_webp/static/hp/m/store.png" 
                  alt="Drop into a BlueStone store near you" 
                  className="img-responsive lazyloaded w-full h-auto rounded-lg shadow-md"
                />
              </a>
            </section>

            {/* Desktop Store Banner - Original */}
            <div className="hidden lg:block">
              <a
                href="/store.html"
                className="ga-event-trigger block"
                data-eventname="staticBannerSection_DropintoaBlueStone"
                data-pos="14"
                data-sectionname="store_locator"
                data-bannername="Drop into a BlueStone"
              >
                <img
                  src="https://kinclimg5.bluestone.com/f_webp/static/hp/d/sb_v2.jpg"
                  data-src="https://kinclimg5.bluestone.com/f_webp/static/hp/d/sb_v2.jpg"
                  alt="Drop into a BlueStone store near you"
                  className="img-responsive-c lazyloaded w-full h-auto rounded-lg shadow-md"
                />
              </a>
            </div>
          </div>
        </div>

          {/* Gold Price Calculator */}
        <div className="w-full px-2 lg:px-4 py-1 lg:py-2">
          <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-center">
            <GoldCalculator price22k={latestChennai.price_22k} price24k={latestChennai.price_24k} city="Chennai" />
          </section>
        </div>

          {/* Gold price in city vs nearby cities & Top cities */}
        <div className="w-full px-2 lg:px-4 py-1 lg:py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-center">
              <NearbyCities currentCity="Chennai" currentState="Tamil Nadu" base22k={latestChennai.price_22k} base24k={latestChennai.price_24k} cityDisplayName="Chennai" />
            </section>
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-center h-64 lg:h-80">
              <h3 className="text-blue-900 font-bold text-base lg:text-base mb-2 lg:mb-3">18 Carat Gold Rate in Chennai (Today & Yesterday)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs lg:text-sm border border-blue-100 rounded-lg">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-left text-blue-900 font-semibold">Gram</th>
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Today</th>
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Yesterday</th>
                      <th className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-semibold">Price Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const today18 = Math.round(latestChennai.price_24k * 0.75);
                      const yesterday18 = Math.round(chennaiData[chennaiData.length - 2].price_24k * 0.75);
                      const rows = [
                        { label: '1 gram', t: today18, y: yesterday18 },
                        { label: '8 grams', t: today18 * 8, y: yesterday18 * 8 },
                        { label: '10 grams', t: today18 * 10, y: yesterday18 * 10 },
                        { label: '12 grams', t: today18 * 12, y: yesterday18 * 12 },
                      ];
                      function formatINR(n: number) {
                        return '₹' + n.toLocaleString('en-IN');
                      }
                      return rows.map((row, i) => (
                        <tr key={row.label} className={i !== rows.length - 1 ? 'border-b border-blue-50' : ''}>
                          <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-blue-800 font-medium whitespace-nowrap text-xs lg:text-sm">{row.label}</td>
                          <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-900 font-bold text-xs lg:text-sm">{formatINR(row.t)}</td>
                          <td className="px-2 lg:px-4 py-1.5 lg:py-2 text-center text-blue-700 text-xs lg:text-sm">{formatINR(row.y)}</td>
                          <td className={`px-2 lg:px-4 py-1.5 lg:py-2 text-center font-semibold text-xs lg:text-sm ${row.t - row.y > 0 ? 'text-green-700' : row.t - row.y < 0 ? 'text-red-700' : 'text-gray-700'}`}>{row.t - row.y > 0 ? '+' : ''}{formatINR(row.t - row.y)}</td>
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
        <div className="w-full px-2 lg:px-4 py-1 lg:py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-start h-auto overflow-hidden">
              <Last10DaysTable data={last10} />
            </section>
            <section className="info-card h-auto p-3 lg:p-4">
              {/* Gold Rate Graph with Tabs */}
              <div className="w-full mx-auto p-3 lg:p-4 bg-white rounded-lg">
                <h3 className="text-sm lg:text-base font-bold text-blue-900 mb-3 lg:mb-4">Weekly & Monthly Graph of 22K Gold Rate in Chennai (1 gram)</h3>
                <div className="flex gap-2 lg:gap-3 mb-3 lg:mb-4">
                  <button onClick={() => setRange('7d')} className={`px-2 lg:px-3 py-1 rounded font-semibold text-xs lg:text-sm ${range==='7d' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}>7 Days</button>
                  <button onClick={() => setRange('30d')} className={`px-2 lg:px-3 py-1 rounded font-semibold text-xs lg:text-sm ${range==='30d' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}>30 Days</button>
                  <button onClick={() => setRange('3m')} className={`px-2 lg:px-3 py-1 rounded font-semibold text-xs lg:text-sm ${range==='3m' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}>3 Months</button>
                </div>
                <div className="w-full h-56 lg:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 30 }}>
                      <defs>
                        <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.7"/>
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" fontSize={12} angle={0} dy={10} />
                      <YAxis domain={[
                        (dataMin: number) => Math.floor((dataMin - 50) / 50) * 50,
                        (dataMax: number) => Math.ceil((dataMax + 50) / 50) * 50
                      ]} tickFormatter={v => `₹${v.toLocaleString('en-IN')}`} fontSize={10} width={50} />
                      <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} labelFormatter={d => `Date: ${d}`} />
                      <Area type="monotone" dataKey="price" stroke="#2563eb" fill="url(#colorGold)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </div>
          </div>

          {/* Historical price in a city */}
        <div className="w-full px-2 lg:px-4 py-1 lg:py-2">
          <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-center h-64 lg:h-80">
            <HistoricalMonthlyTable />
          </section>
        </div>

          {/* Info about the city gold trend */}
        <div className="w-full px-2 lg:px-4 py-1 lg:py-2">
          <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-center">
            <h3 className="text-blue-900 font-bold text-base lg:text-lg mb-2 lg:mb-3">Gold Rate Guide for Chennai</h3>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              Gold is that precious metal which everyone wants to own in their life—especially in Indian households. People
              prefer buying gold because it is a long‑term investment whose value is likely to increase in the future.
            </p>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              But before buying gold, it is essential to know what the gold rates are in the market. If you live in Chennai, you
              already know there is strong demand for gold jewellery, coins, and investment bars. Whether you are purchasing gold
              for weddings, festivals, or investing in gold as an asset, staying updated with the gold rate in Chennai becomes
              crucial.
            </p>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              Gold rate in Chennai depends on international market trends, demand, currency fluctuations, and government
              policies. Keeping track of live gold rates helps you make the right buying or selling decisions as gold prices change
              daily.
            </p>
            <p className="mb-3 text-blue-900 text-sm lg:text-base">
              We at BlueStone ensure that the pricing of our jewellery is based on the live gold rate in Chennai, along with a
              clear breakup of making charges and GST. So, if you're buying gold for investment or as jewellery, checking
              today’s gold rate can help you make informed decisions.
            </p>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">Best Gold Investment Options in Chennai</h4>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              In Chennai, you can explore diverse ways to invest in gold—depending on your goals, be it tradition, security, or
              financial returns. Some prefer jewellery for its beauty, while others opt for coins or bonds for long‑term
              investments.
            </p>
            <ul className="list-disc pl-4 lg:pl-6 mb-2 text-blue-900 text-sm lg:text-base">
              <li className="mb-1"><strong>Gold Jewellery</strong> – During weddings & festivals like Diwali & Akshaya Tritiya, demand rises. Track historical rates to time your purchases better.</li>
              <li className="mb-1"><strong>Gold Coins & Bars</strong> – Lower making charges compared to jewellery; available at banks, reputed jewellers and bullion dealers.</li>
              <li className="mb-1"><strong>Digital Gold</strong> – Buy and store gold digitally via fintech apps—convenient and storage‑free.</li>
              <li className="mb-1"><strong>Gold ETFs (Exchange Traded Funds)</strong> – Trade gold like a financial asset without physical storage hassles.</li>
              <li className="mb-1"><strong>Sovereign Gold Bonds (SGBs)</strong> – Government‑issued bonds that offer interest income along with exposure to gold price.</li>
            </ul>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">Factors That Affect Gold Rate in Chennai</h4>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              The gold rate in Chennai doesn’t stay constant. It is influenced by multiple factors—global and domestic—that change
              daily. Understanding these helps you make better decisions.
            </p>
            <ul className="list-disc pl-4 lg:pl-6 mb-2 text-blue-900 text-sm lg:text-base">
              <li className="mb-1"><strong>International Market Trends</strong> – India imports most of its gold, so global prices directly impact local rates.</li>
              <li className="mb-1"><strong>Indian Rupee vs US Dollar</strong> – A weaker rupee makes imports costlier and pushes local gold prices higher.</li>
              <li className="mb-1"><strong>Demand & Supply</strong> – During Akshaya Tritiya, Diwali and the wedding season, demand rises and so do prices.</li>
              <li className="mb-1"><strong>Inflation & Economic Stability</strong> – Gold acts as a hedge against inflation; rates tend to rise when inflation is high.</li>
              <li className="mb-1"><strong>Government Duties & Taxes</strong> – Customs duty, GST and import policies affect the retail price you pay.</li>
            </ul>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">How to Check Gold Purity in Chennai</h4>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              Don’t get fooled when buying a precious metal like gold. Always verify purity before purchasing.
            </p>
            <ul className="list-disc pl-4 lg:pl-6 mb-2 text-blue-900 text-sm lg:text-base">
              <li className="mb-1"><strong>Hallmark Certification</strong> – Look for BIS hallmarking that certifies purity (e.g., 22K or 24K).</li>
              <li className="mb-1"><strong>Magnet Test</strong> – Real gold is non‑magnetic; if it sticks to a magnet, it’s impure.</li>
              <li className="mb-1"><strong>Acid Test</strong> – Done by professionals using nitric acid to verify authenticity.</li>
              <li className="mb-1"><strong>Electronic Testing Machines</strong> – Many reputed Chennai stores use modern machines for accurate testing.</li>
              <li className="mb-1"><strong>Bill & Certification</strong> – Always demand an invoice with karat, weight and hallmark number.</li>
            </ul>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">Things to Consider Before Buying Gold in Chennai</h4>
            <ul className="list-disc pl-4 lg:pl-6 mb-2 text-blue-900 text-sm lg:text-base">
              <li className="mb-1"><strong>Compare Gold Rates</strong> – Check live rates across multiple jewellers to get the best price.</li>
              <li className="mb-1"><strong>Hallmarking & Certified Jewellery</strong> – Ensure every piece is BIS‑certified to avoid paying for impure gold.</li>
              <li className="mb-1"><strong>Buy from Reputed Jewellers</strong> – Prefer trusted stores in Chennai for better resale assurance.</li>
              <li className="mb-1"><strong>Consider Investment Goals</strong> – For long‑term investments, coins, bars or bonds are usually better than jewellery.</li>
            </ul>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">How to Sell Physical Gold at the Highest Price in Chennai</h4>
            <ul className="list-disc pl-4 lg:pl-6 mb-2 text-blue-900 text-sm lg:text-base">
              <li className="mb-1">Check the current gold rate in Chennai and sell accordingly—never sell without confirming the day’s price.</li>
              <li className="mb-1">Sell at authorised dealers such as reputed jewellers or trusted banks for fairer valuation.</li>
              <li className="mb-1">Avoid pawn brokers who may offer lower valuations for quick cash.</li>
              <li className="mb-1">Carry the bill and hallmark certificate; it adds credibility and improves offers.</li>
              <li className="mb-1">Compare multiple buyers before selling to secure the best deal.</li>
            </ul>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">Impact of GST on Gold Rate in Chennai</h4>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              GST has influenced gold prices in Chennai by making taxation more uniform yet adding a small increase to the final
              cost. Understanding its impact helps you plan purchases better.
            </p>
            <ul className="list-disc pl-4 lg:pl-6 mb-2 text-blue-900 text-sm lg:text-base">
              <li className="mb-1"><strong>3% GST on Gold Value</strong> – Charged on the base price of your gold.</li>
              <li className="mb-1"><strong>5% GST on Making Charges</strong> – Applied on making charges, which increases final jewellery cost.</li>
              <li className="mb-1"><strong>Overall Impact</strong> – You pay slightly more than the pre‑GST era, but pricing is more transparent and streamlined.</li>
            </ul>
            <p className="mb-3 text-blue-900 text-sm lg:text-base">
              For example, if the gold rate in Chennai today is ₹6,000 per gram, adding GST and making charges could raise the
              final jewellery price to ₹6,300–₹6,500 per gram depending on design.
            </p>

            <p className="mb-3 text-blue-900 text-sm lg:text-base">
              Whether you buy jewellery for tradition, invest in coins/bars, or choose digital formats, understanding the gold
              rate in Chennai helps you make smarter financial decisions. Verify purity, and consider GST and making charges
              before purchasing.
            </p>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">Why Buy Gold Jewellery from BlueStone in Chennai?</h4>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              BlueStone is a trusted destination for gold buyers in Chennai—combining trust, design and transparency.
            </p>
            <ul className="list-disc pl-4 lg:pl-6 mb-0 text-blue-900 text-sm lg:text-base">
              <li className="mb-1"><strong>BIS‑Hallmarked Jewellery</strong> – Every product is certified so you get authentic gold at the best price.</li>
              <li className="mb-1"><strong>Daily Updated Prices</strong> – Prices are aligned with Chennai’s live gold rate.</li>
              <li className="mb-1"><strong>Lifetime Exchange & Buyback</strong> – Facilities that make your buying experience secure and hassle‑free.</li>
              <li className="mb-1"><strong>Unique Designs</strong> – Thousands of exquisite styles for weddings and everyday wear.</li>
              <li className="mb-1"><strong>Flexible Payment Options</strong> – EMI plans and exciting festive offers.</li>
            </ul>
          </section>
        </div>

          {/* FAQ */}
        <div className="w-full px-2 lg:px-4 py-1 lg:py-2">
          <FAQAccordion cityName="Chennai" price22k={latestChennai.price_22k} price24k={latestChennai.price_24k} />
        </div>
        </main>

        {/* Interlinking: Gold Rate Links */}
        <InterlinkingLinks />

        {/* Sidebar - Moved to bottom */}
        <aside className="w-full bg-white border-t border-blue-200 py-0 lg:py-0 px-0 lg:px-0">
          {/* Navigation component removed */}
        </aside>

      {/* Footer */}
      <Footer />
    </div>
  );
} 