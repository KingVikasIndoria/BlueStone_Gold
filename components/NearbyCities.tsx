import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import statesToCities from '../states_to_cities.json';

const CLUSTERS: Record<string, string[]> = {
  'Northeast India': [
    'Arunachal Pradesh', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura', 'Meghalaya'
  ],
  'North/North-Central India': [
    'Bihar', 'Uttarakhand', 'Himachal Pradesh', 'Chandigarh', 'Jammu and Kashmir'
  ],
  'Central-West + UTs': [
    'Goa', 'Dadra and Nagar Haveli and Daman and Diu', 'Puducherry', 'Sikkim', 'Andaman and Nicobar Islands', 'Lakshadweep'
  ]
};

const STATE_TO_CLUSTER: Record<string, string> = Object.entries(CLUSTERS).reduce((acc, [cluster, states]) => {
  states.forEach(state => { acc[state.toLowerCase()] = cluster; });
  return acc;
}, {} as Record<string, string>);

// Helper: Find the canonical state key from statesToCities.json for a given state (case-insensitive)
function findStateKey(state: string): string | undefined {
  const lower = state.toLowerCase();
  return Object.keys(statesToCities).find(
    k => k.toLowerCase() === lower
  );
}

function getNearbyCities(currentCity: string, currentState: string): { name: string, key: string }[] {
  // Find the canonical state key
  const stateKey = findStateKey(currentState);
  if (!stateKey) return [];
  const allStatesToCities = statesToCities as Record<string, string[]>;
  // Exclude current city (case-insensitive)
  let stateCities = (allStatesToCities[stateKey] || []).filter(
    c => c.trim().toLowerCase() !== currentCity.trim().toLowerCase()
  );
  // If state has 5 or more, pick 5 random
  if (stateCities.length >= 5) {
    // Shuffle and pick 5
    stateCities = stateCities.sort(() => 0.5 - Math.random()).slice(0, 5);
    return stateCities.map(name => ({
      name,
      key: name.toLowerCase().replace(/ /g, '_')
    }));
  }
  // If fewer than 5, fill from cluster
  const cluster = STATE_TO_CLUSTER[stateKey.toLowerCase()];
  let result: string[] = [...stateCities];
  if (cluster) {
    for (const state of CLUSTERS[cluster]) {
      const otherStateKey = findStateKey(state);
      if (!otherStateKey || otherStateKey === stateKey) continue;
      const moreCities = (allStatesToCities[otherStateKey] || []).filter(
        c => c.trim().toLowerCase() !== currentCity.trim().toLowerCase() && !result.some(r => r.trim().toLowerCase() === c.trim().toLowerCase())
      );
      result.push(...moreCities);
      if (result.length >= 5) break;
    }
  }
  result = result.slice(0, 5);
  return result.map(name => ({
    name,
    key: name.toLowerCase().replace(/ /g, '_')
  }));
}

interface TempNearbyCitiesProps {
  currentCity: string;
  currentState: string;
  base22k: number;
  base24k: number;
  cityDisplayName: string;
  isStatePage?: boolean;
}

function randomPrice(base: number) {
  // ±5% random
  const percent = 1 + (Math.random() * 0.1 - 0.05);
  return Math.round(base * percent);
}

const TempNearbyCities: React.FC<TempNearbyCitiesProps> = ({ currentCity, currentState, base22k, base24k, cityDisplayName, isStatePage = false }) => {
  const [hydrated, setHydrated] = useState(false);
  const [rows, setRows] = useState<{ name: string, key: string, price18k: number, price22k: number, price24k: number }[]>([]);

  useEffect(() => {
    setHydrated(true);
    const cities = getNearbyCities(currentCity, currentState);
    // Shuffle and pick 5 (if more than 5)
    let shuffled = cities;
    if (cities.length > 5) {
      shuffled = [...cities].sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    setRows(
      shuffled.map(cityObj => {
        const price24k = randomPrice(base24k);
        const price22k = randomPrice(base22k);
        const price18k = Math.round(price24k * 0.75);
        return {
          ...cityObj,
          price18k,
          price22k,
          price24k
        };
      })
    );
  }, [currentCity, currentState, base22k, base24k]);

  if (!hydrated) return null;
  if (!rows.length) return null;
  return (
    <>
      <h3 className="text-blue-900 font-bold text-lg mb-3">
        {isStatePage ? `Gold rate in the cities of ${currentState}` : `Gold rate in nearby cities of ${cityDisplayName}`}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-blue-100 rounded-lg">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left text-blue-900 font-semibold">City</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">18K Price</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">22K Price</th>
              <th className="px-4 py-2 text-center text-blue-900 font-semibold">24K Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((cityObj, i) => (
              <tr key={cityObj.key} className={i !== rows.length - 1 ? 'border-b border-blue-50' : ''}>
                <td className="px-4 py-2 text-blue-800 font-medium whitespace-nowrap">
                  <Link href={`/cities/${cityObj.key}`} className="text-blue-800 underline hover:text-blue-900">
                    {cityObj.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-center text-blue-900 font-bold">₹{cityObj.price18k.toLocaleString('en-IN')}</td>
                <td className="px-4 py-2 text-center text-blue-900 font-bold">₹{cityObj.price22k.toLocaleString('en-IN')}</td>
                <td className="px-4 py-2 text-center text-blue-900 font-bold">₹{cityObj.price24k.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TempNearbyCities; 