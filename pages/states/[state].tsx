import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import GoldPriceBannerComponent from '../../components/GoldPriceBannerComponent';
import Last10DaysTable from '../../components/Last10DaysTable';
import GoldCalculator from '../../components/GoldCalculator';
import NearbyCities from '../../components/NearbyCities';
import FAQAccordion from '../../components/FAQAccordion';
import HistoricalMonthlyTable from '../../components/HistoricalMonthlyTable';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import fs from 'fs';
import path from 'path';
import { geo, allStates, stateSlug, citySlug } from '../../lib/geo';
import { stateToRepresentativeCity } from '../../lib/state_rep_city';

interface StatePageProps {
  state: string;
  repCity: string;
  last10: { date: string; price_22k: number; price_24k: number }[];
  latest22k: number;
  latest24k: number;
  series: { date: string; price_22k: number; price_24k: number }[];
  blue22k: number;
  blue24k: number;
}

export default function StatePage({ state, repCity, last10, latest22k, latest24k, series, blue22k, blue24k }: StatePageProps) {
  const [range, setRange] = useState<'7d' | '30d' | '3m'>('7d');
  const selectedDays = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const chartData = series
    .slice(-selectedDays)
    .map(d => ({
      date: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      price: d.price_22k,
    }));

  const yesterday22k = last10.length > 1 ? last10[1].price_22k : latest22k;
  const yesterday24k = last10.length > 1 ? last10[1].price_24k : latest24k;
  const today18k = Math.round(latest24k * 0.75);
  const yesterday18k = Math.round(yesterday24k * 0.75);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: '#F0F0F0' }}>
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-blue-200">
        <Header />
      </header>

      <main className="flex-1 p-1 lg:p-4 space-y-0.5 lg:space-y-2">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Gold Rate', href: '/gold-rates' },
            { label: `Gold Rate in ${state}` },
          ]}
        />

        <GoldPriceBannerComponent
          mobileStyle="table"
          cityName={state}
          price22k={latest22k}
          price24k={latest24k}
          bluestone22k={blue22k}
          bluestone24k={blue24k}
        />

        {/* 22K & 24K tables */}
        <div className="w-full px-0 lg:px-0 py-1 lg:py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center">
              <h3 className="text-blue-900 font-bold text-sm lg:text-base mb-2 lg:mb-3">22 Carat Gold Rate in {state} (Today & Yesterday)</h3>
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
                      const today = latest22k;
                      const yesterday = yesterday22k;
                      const rows = [
                        { label: '1 gram', t: today, y: yesterday },
                        { label: '8 grams', t: today * 8, y: yesterday * 8 },
                        { label: '10 grams', t: today * 10, y: yesterday * 10 },
                        { label: '12 grams', t: today * 12, y: yesterday * 12 },
                      ];
                      function formatINR(n: number) { return '₹' + n.toLocaleString('en-IN'); }
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
              <h3 className="text-blue-900 font-bold text-sm lg:text-base mb-2 lg:mb-3">24 Carat Gold Rate in {state} (Today & Yesterday)</h3>
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
                      const today = latest24k;
                      const yesterday = yesterday24k;
                      const rows = [
                        { label: '1 gram', t: today, y: yesterday },
                        { label: '8 grams', t: today * 8, y: yesterday * 8 },
                        { label: '10 grams', t: today * 10, y: yesterday * 10 },
                        { label: '12 grams', t: today * 12, y: yesterday * 12 },
                      ];
                      function formatINR(n: number) { return '₹' + n.toLocaleString('en-IN'); }
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

        {/* Goldmine Banner */}
        <div className="w-full p-1 lg:p-2">
          {/* Mobile Goldmine Banner */}
          <section className="block lg:hidden">
            <div 
              className="strip-wrap"
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: '#E8F4FD',
                border: '1px solid #B3E0FF',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                marginBottom: '10px'
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
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Enroll Now
                </a>
              </div>
              <a href="/goldmine.html" className="strip-link ga-event-trigger" data-eventname="stripSection_Gold Mine" title="Gold Mine" style={{ position: 'absolute', inset: '0', zIndex: '1' }}></a>
            </div>
          </section>

          {/* Desktop Goldmine Banner */}
          <section className="hidden lg:flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg shadow-gold py-4 px-6 relative overflow-hidden">
            <a href="https://www.bluestone.com/goldmine.html" target="_blank" rel="noopener noreferrer">
              <img
                src="https://kinclimg7.bluestone.com/f_webp/static/resources/themes/bluestone/images/new/bp-goldmine.v6.jpg"
                alt="Goldmine Banner"
                className="img-responsive-c w-full h-auto rounded-lg"
                style={{ width: '100%', height: '100%' }}
              />
            </a>
          </section>
        </div>

        {/* Last 10 days & Graph */}
        <div className="w-full px-0 lg:px-0 py-1 lg:py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-start h-auto overflow-hidden">
              <Last10DaysTable data={last10} cityName={state} />
            </section>
            <section className="info-card h-auto p-3 lg:p-4">
              <div className="w-full mx-auto p-3 lg:p-4 bg-white rounded-lg">
                <h3 className="text-sm lg:text-base font-bold text-blue-900 mb-3 lg:mb-4">Weekly & Monthly Graph of 22K Gold Rate in {state} (1 gram)</h3>
                <div className="flex gap-2 lg:gap-3 mb-3 lg:mb-4">
                  <button onClick={() => setRange('7d')} className={`px-2 lg:px-3 py-1 rounded font-semibold text-xs lg:text-sm ${range==='7d' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}>7 Days</button>
                  <button onClick={() => setRange('30d')} className={`px-2 lg:px-3 py-1 rounded font-semibold text-xs lg:text-sm ${range==='30d' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}>30 Days</button>
                  <button onClick={() => setRange('3m')} className={`px-2 lg:px-3 py-1 rounded font-semibold text-xs lg:text-sm ${range==='3m' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}>3 Months</button>
                </div>
                <div className="w-full h-56 lg:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 30 }}>
                      <defs>
                        <linearGradient id="colorGoldState" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.7"/>
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" fontSize={12} angle={0} dy={10} />
                      <YAxis domain={[(dataMin: number) => Math.floor((dataMin - 50) / 50) * 50, (dataMax: number) => Math.ceil((dataMax + 50) / 50) * 50]} tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} fontSize={10} width={50} />
                      <Tooltip formatter={(v: number) => `₹${(v as number).toLocaleString('en-IN')}`} labelFormatter={(d) => `Date: ${d}`} />
                      <Area type="monotone" dataKey="price" stroke="#2563eb" fill="url(#colorGoldState)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Calculator */}
        <div className="w-full px-0 lg:px-0 py-1 lg:py-2">
          <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-center">
            <GoldCalculator price22k={latest22k} price24k={latest24k} city={state} />
          </section>
        </div>

        {/* Store Banner (placed right after Calculator to match city pages) */}
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

            {/* Desktop Store Banner */}
            <div className="hidden lg:block">
              <a
                href="https://www.bluestone.com/store.html"
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

        {/* Nearby Cities & 18K */}
        <div className="w-full px-0 lg:px-0 py-1 lg:py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-center">
              <NearbyCities currentCity={repCity} currentState={state} base22k={latest22k} base24k={latest24k} cityDisplayName={repCity} isStatePage={true} />
            </section>
            <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4 flex flex-col justify-center">
              <h3 className="text-blue-900 font-bold text-base lg:text-base mb-2 lg:mb-3">18 Carat Gold Rate in {state} (Today & Yesterday)</h3>
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
                      const rows = [
                        { label: '1 gram', t: today18k, y: yesterday18k },
                        { label: '8 grams', t: today18k * 8, y: yesterday18k * 8 },
                        { label: '10 grams', t: today18k * 10, y: yesterday18k * 10 },
                        { label: '12 grams', t: today18k * 12, y: yesterday18k * 12 },
                      ];
                      function formatINR(n: number) { return '₹' + n.toLocaleString('en-IN'); }
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

        {/* Historical */}
        <div className="w-full px-0 lg:px-0 py-1 lg:py-2">
          <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-center h-64 lg:h-80">
            <HistoricalMonthlyTable cityName={state} />
          </section>
        </div>

        {/* Gold Rate Guide */}
        <div className="w-full px-0 lg:px-0 py-1 lg:py-2">
          <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4 flex flex-col justify-center">
            <h3 className="text-blue-900 font-bold text-base lg:text-lg mb-2 lg:mb-3">Gold Rate Guide for {state}</h3>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              Gold is that precious metal which everyone wants to own in their life—especially in Indian households. People
              prefer buying gold because it is a long‑term investment whose value is likely to increase in the future.
            </p>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              But before buying gold, it is essential to know what the gold rates are in the market. If you live in {state}, you
              already know there is strong demand for gold jewellery, coins, and investment bars. Whether you are purchasing gold
              for weddings, festivals, or investing in gold as an asset, staying updated with the gold rate in {state} becomes
              crucial.
            </p>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              Gold rate in {state} depends on international market trends, demand, currency fluctuations, and government
              policies. Keeping track of live gold rates helps you make the right buying or selling decisions as gold prices change
              daily.
            </p>
            <p className="mb-3 text-blue-900 text-sm lg:text-base">
              We at BlueStone ensure that the pricing of our jewellery is based on the live gold rate in {state}, along with a
              clear breakup of making charges and GST. So, if you're buying gold for investment or as jewellery, checking
              today's gold rate can help you make informed decisions.
            </p>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">Best Gold Investment Options in {state}</h4>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              In {state}, you can explore diverse ways to invest in gold—depending on your goals, be it tradition, security, or
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

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">Factors That Affect Gold Rate in {state}</h4>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              Several domestic and international factors influence daily gold rates in {state}. Understanding these can help you time your purchases and investments better.
            </p>
            <ul className="list-disc pl-4 lg:pl-6 mb-2 text-blue-900 text-sm lg:text-base">
              <li className="mb-1"><strong>International Gold Prices</strong> – Global market trends from London and New York directly impact local rates.</li>
              <li className="mb-1"><strong>Currency Fluctuations</strong> – When the Indian Rupee weakens against the US Dollar, gold prices in {state} tend to rise.</li>
              <li className="mb-1"><strong>Demand & Supply</strong> – Festival seasons, wedding months, and investment demand create price fluctuations.</li>
              <li className="mb-1"><strong>Government Policies</strong> – Import duties, GST changes, and monetary policies affect final gold prices.</li>
              <li className="mb-1"><strong>Inflation Rates</strong> – High inflation often drives people toward gold as a hedge, increasing demand and prices.</li>
              <li className="mb-1"><strong>Interest Rates</strong> – When bank interest rates fall, gold becomes more attractive as an investment option.</li>
            </ul>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">How to Sell Physical Gold at the Highest Price in {state}</h4>
            <ul className="list-disc pl-4 lg:pl-6 mb-2 text-blue-900 text-sm lg:text-base">
              <li className="mb-1">Check the current gold rate in {state} and sell accordingly—never sell without confirming the day's price.</li>
              <li className="mb-1">Sell at authorised dealers such as reputed jewellers or trusted banks for fairer valuation.</li>
              <li className="mb-1">Avoid pawn brokers who may offer lower valuations for quick cash.</li>
              <li className="mb-1">Carry the bill and hallmark certificate; it adds credibility and improves offers.</li>
              <li className="mb-1">Compare multiple buyers before selling to secure the best deal.</li>
            </ul>

            <h4 className="text-blue-800 font-bold mt-2 lg:mt-3 mb-2 text-sm lg:text-base">Impact of GST on Gold Rate in {state}</h4>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              GST has influenced gold prices in {state} by making taxation more uniform yet adding a small increase to the final
              cost. Understanding its impact helps you plan purchases better.
            </p>
            <ul className="list-disc pl-4 lg:pl-6 mb-2 text-blue-900 text-sm lg:text-base">
              <li className="mb-1"><strong>3% GST on Gold Value</strong> – Charged on the base price of your gold.</li>
              <li className="mb-1"><strong>5% GST on Making Charges</strong> – Applied on making charges, which increases final jewellery cost.</li>
              <li className="mb-1"><strong>Overall Impact</strong> – You pay slightly more than the pre‑GST era, but pricing is more transparent and streamlined.</li>
            </ul>
            <p className="mb-2 text-blue-900 text-sm lg:text-base">
              For example, if the gold rate in {state} today is ₹6,000 per gram, adding GST and making charges could raise the
              final jewellery price to ₹6,300–₹6,500 per gram depending on design.
            </p>

            <p className="mb-3 text-blue-900 text-sm lg:text-base">
              Whether you buy jewellery for tradition, invest in coins/bars, or choose digital formats, understanding the gold
              rate in {state} helps you make smarter financial decisions. Verify purity, and consider GST and making charges
              before purchasing.
            </p>
          </section>
        </div>

        {/* FAQ */}
        <div className="w-full px-0 lg:px-0 py-1 lg:py-2">
          <FAQAccordion cityName={state} price22k={latest22k} price24k={latest24k} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
  const paths = allStates.map((s) => ({ params: { state: stateSlug(s) } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { state: string } }) {
  const slug = params.state;
  const stateName = allStates.find((s) => stateSlug(s) === slug) || slug;
  const candidateCities = (geo[stateName] || []).slice().sort();
  const dataDir = path.join(process.cwd(), 'data', 'cities');
  const available = new Set(fs.readdirSync(dataDir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')));
  const cities = candidateCities.filter((c) => available.has(citySlug(c)));

  // Use fixed representative city mapping per state with fallback
  const preferred = stateToRepresentativeCity[stateName] || cities[0] || candidateCities[0] || stateName;
  const repCity = cities.includes(preferred) ? preferred : (cities[0] || preferred);
  const repSlug = citySlug(repCity);
  
  // Try both dash and underscore versions for file lookup
  let repSlugFile = repSlug;
  if (!fs.existsSync(path.join(dataDir, `${repSlug}.json`))) {
    const underscoreSlug = repSlug.replace(/-/g, '_');
    if (fs.existsSync(path.join(dataDir, `${underscoreSlug}.json`))) {
      repSlugFile = underscoreSlug;
    }
  }

  // Read the representative city's data
  const rawText = fs.readFileSync(path.join(dataDir, `${repSlugFile}.json`), 'utf-8');
  const cleanedText = rawText.replace(/:\s*NaN/g, ': null');
  const raw = JSON.parse(cleanedText) as { date: string; ['22k']: number | null; ['24k']: number | null }[];
  const mapped = raw
    .filter((d) => d.date && typeof (d as any)['22k'] === 'number' && typeof (d as any)['24k'] === 'number' && !isNaN((d as any)['22k']) && !isNaN((d as any)['24k']))
    .map((d) => ({ date: d.date, price_22k: (d as any)['22k'], price_24k: (d as any)['24k'] }));
  const last10 = mapped.slice(-10).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    price_22k: d.price_22k,
    price_24k: d.price_24k,
  })).reverse();
  const latest = mapped[mapped.length - 1];
  const series = mapped.slice(-90);

  // Read BlueStone data
  const blueRaw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'bluestone.json'), 'utf-8')) as any;
  const blue22k = Number(blueRaw['22k'] || 0);
  const blue24k = Number(blueRaw['24k'] || 0);

  return { 
    props: { 
      state: stateName, 
      repCity, 
      last10, 
      latest22k: latest.price_22k, 
      latest24k: latest.price_24k, 
      series, 
      blue22k, 
      blue24k 
    } 
  };
}
