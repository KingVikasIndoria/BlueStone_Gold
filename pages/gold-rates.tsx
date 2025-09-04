import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import statesToCities from '../states_to_cities.json';
import { toSlug } from '../lib/slugs';
import GoldCalculator from '../components/GoldCalculator';

interface HomeProps {
  delhi22k: number;
  delhi24k: number;
}

export default function HomePage({ delhi22k, delhi24k }: HomeProps) {
  const router = useRouter();
  const [stateSel, setStateSel] = useState('');
  const [citySel, setCitySel] = useState('');

  const stateOptions = useMemo(() => Object.keys(statesToCities as Record<string, string[]>).sort(), []);
  const cityOptions = useMemo(() => {
    if (!stateSel) return [] as string[];
    const map = statesToCities as Record<string, string[]>;
    return (map[stateSel] || []).slice().sort();
  }, [stateSel]);

  const handleGoState = () => {
    if (stateSel) router.push(`/states/${toSlug(stateSel)}`);
  };
  const handleGoCity = () => {
    if (citySel) router.push(`/cities/${toSlug(citySel)}`);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: '#F0F0F0' }}>
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-blue-200">
        <Header />
      </header>

      <main className="flex-1 p-1 lg:p-4 space-y-2">
        <Breadcrumbs items={[{ label: 'Home' }]} />

        {/* Quick Navigator - first */}
        <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-4">
          <h2 className="text-blue-900 font-bold text-base lg:text-lg mb-3">Find Gold Rates by State or City</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <label className="block text-blue-900 text-sm font-semibold mb-1">Select a State</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 border border-blue-900 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 rounded px-2 py-2 text-sm text-blue-900 bg-white"
                  value={stateSel}
                  onChange={(e) => { setStateSel(e.target.value); setCitySel(''); }}
                >
                  <option value="">-- Choose State --</option>
                  {stateOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  className="px-3 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:opacity-60 text-sm"
                  style={{ backgroundColor: '#082c5c' }}
                  onClick={handleGoState}
                  disabled={!stateSel}
                >
                  Go
                </button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <label className="block text-blue-900 text-sm font-semibold mb-1">Select a City</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 border border-blue-900 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 rounded px-2 py-2 text-sm text-blue-900 bg-white"
                  value={citySel}
                  onChange={(e) => setCitySel(e.target.value)}
                  disabled={!stateSel}
                >
                  <option value="">{stateSel ? '-- Choose City --' : 'Select a state first'}</option>
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  className="px-3 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:opacity-60 text-sm"
                  style={{ backgroundColor: '#082c5c' }}
                  onClick={handleGoCity}
                  disabled={!citySel}
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Gold Calculator - uses Delhi prices statically */}
        <section className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4">
          <GoldCalculator price22k={delhi22k} price24k={delhi24k} city="" showCityInHeading={false} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  // Read Delhi prices from local JSON and take latest entry
  const dataDir = path.join(process.cwd(), 'data', 'cities');
  // Try both dash and underscore file naming
  let delhiPath = path.join(dataDir, 'delhi.json');
  if (!fs.existsSync(delhiPath)) {
    const alt = path.join(dataDir, 'new_delhi.json');
    if (fs.existsSync(alt)) delhiPath = alt;
  }
  const rawText = fs.readFileSync(delhiPath, 'utf-8');
  const cleaned = rawText.replace(/:\s*NaN/g, ': null');
  const raw = JSON.parse(cleaned) as { date: string; ['22k']: number | null; ['24k']: number | null }[];
  const valid = raw.filter((d) => typeof (d as any)['22k'] === 'number' && typeof (d as any)['24k'] === 'number');
  const latest = valid[valid.length - 1];
  const delhi22k = (latest as any)['22k'] || 0;
  const delhi24k = (latest as any)['24k'] || 0;
  return { props: { delhi22k, delhi24k } };
}


