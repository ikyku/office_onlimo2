import { Station } from '../types/onlimo';

export type IndonesiaTimezone = 'WIB' | 'WITA' | 'WIT';

const WIT_PROVINCES = [
  'maluku',
  'maluku utara',
  'papua',
  'papua barat',
  'papua selatan',
  'papua tengah',
  'papua pegunungan',
  'papua barat daya',
];

const WITA_PROVINCES = [
  'bali',
  'nusa tenggara barat',
  'nusa tenggara timur',
  'kalimantan selatan',
  'kalimantan timur',
  'kalimantan utara',
  'sulawesi utara',
  'gorontalo',
  'sulawesi tengah',
  'sulawesi barat',
  'sulawesi selatan',
  'sulawesi tenggara',
];

/**
 * Returns the Indonesian timezone (WIB, WITA, or WIT) based on station province or coordinates.
 * - WIB (UTC+7): Sumatra, Jawa, Kalimantan Barat, Kalimantan Tengah
 * - WITA (UTC+8): Bali, Nusa Tenggara, Kalimantan Selatan, Kalimantan Timur, Kalimantan Utara, Sulawesi
 * - WIT (UTC+9): Maluku, Maluku Utara, Papua (seluruh provinsi Papua)
 */
export function getStationTimezone(
  station?: Partial<Station> | { province?: string; city?: string; lng?: number } | null
): IndonesiaTimezone {
  if (!station) return 'WIB';

  const province = (station.province || '').trim().toLowerCase();

  for (const p of WIT_PROVINCES) {
    if (province.includes(p)) return 'WIT';
  }

  for (const p of WITA_PROVINCES) {
    if (province.includes(p)) return 'WITA';
  }

  // Fallback by longitude if province is missing or not matched
  if (typeof station.lng === 'number' && !isNaN(station.lng)) {
    if (station.lng >= 125) return 'WIT';
    if (station.lng >= 115) return 'WITA';
    return 'WIB';
  }

  return 'WIB';
}

/**
 * Formats a station's lastUpdate string by appending the proper timezone (WIB, WITA, WIT)
 * if it doesn't already contain one.
 */
export function formatStationLastUpdate(
  station?: Partial<Station> | { lastUpdate?: string; province?: string; city?: string; lng?: number } | null
): string {
  if (!station) return '';
  const rawTime = (station.lastUpdate || '28/08/2026 14:02:57').trim();

  // If already contains WIB, WITA, or WIT, return as is
  if (/\b(WIB|WITA|WIT)\b/i.test(rawTime)) {
    return rawTime;
  }

  const tz = getStationTimezone(station);
  return `${rawTime} ${tz}`;
}
