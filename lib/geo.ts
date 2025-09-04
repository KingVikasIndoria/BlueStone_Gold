import statesToCities from '../states_to_cities.json';
import { toSlug } from './slugs';

export type GeoMap = Record<string, string[]>;

export const geo: GeoMap = statesToCities as unknown as GeoMap;

export const allStates = Object.keys(geo);

export const allCities = Array.from(
  new Set(allStates.flatMap((s) => geo[s]))
).sort();

export const cityBelongsToState = (cityName: string): string | null => {
  for (const state of allStates) {
    if (geo[state].some((c) => c.toLowerCase() === cityName.toLowerCase())) {
      return state;
    }
  }
  return null;
};

export const stateSlug = (stateName: string) => toSlug(stateName);
export const citySlug = (cityName: string) => toSlug(cityName);


