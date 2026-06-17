/** Region keys match backend seed data (English periphery names). */
import greeceMapPaths from './greeceMapPaths.json';
import greeceRegionLabels from './greeceRegionLabels.json';

export const REGION_KEYS = [
  'Attica',
  'Central Greece',
  'Central Macedonia',
  'Crete',
  'Eastern Macedonia and Thrace',
  'Epirus',
  'Ionian Islands',
  'North Aegean',
  'Peloponnese',
  'South Aegean',
  'Thessaly',
  'Western Greece',
  'Western Macedonia',
] as const;

export type RegionKey = (typeof REGION_KEYS)[number];

export interface GreeceRegionShape {
  key: RegionKey;
  paths: string[];
  labelX: number;
  labelY: number;
}

const labels = greeceRegionLabels as Record<RegionKey, { labelX: number; labelY: number }>;

export const GREECE_REGIONS: GreeceRegionShape[] = REGION_KEYS.map((key) => ({
  key,
  paths: greeceMapPaths[key].map((p) => p.d),
  ...labels[key],
}));
