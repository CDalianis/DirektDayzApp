import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GREECE_REGIONS, type RegionKey } from '../data/greeceRegions';
import { translateRegion } from '../i18n/helpers';

interface GreeceMapProps {
  /** If set, highlights this region (e.g. on home before navigation). */
  selectedRegion?: RegionKey | null;
  /** Called after a region is chosen; default navigates to products filtered by region. */
  onRegionSelect?: (region: RegionKey) => void;
}

export function GreeceMap({ selectedRegion = null, onRegionSelect }: GreeceMapProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<RegionKey | null>(null);

  const handleSelect = (region: RegionKey) => {
    if (onRegionSelect) {
      onRegionSelect(region);
    } else {
      navigate(`/products?region=${encodeURIComponent(region)}`);
    }
  };

  const active = hovered ?? selectedRegion;

  return (
    <div className="greece-map-wrap">
      <svg
        viewBox="0 0 1000 1000"
        className="greece-map"
        role="img"
        aria-label={t('home.mapTitle')}
      >
        <rect x="0" y="0" width="1000" height="1000" className="map-sea" rx="12" />
        {GREECE_REGIONS.map((region) => {
          const isActive = active === region.key;
          return (
            <g
              key={region.key}
              className={`map-region-group${isActive ? ' map-region-group-active' : ''}`}
              onClick={() => handleSelect(region.key)}
              onMouseEnter={() => setHovered(region.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(region.key)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              role="button"
              aria-label={translateRegion(region.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(region.key);
                }
              }}
            >
              {region.paths.map((d, i) => (
                <path key={i} d={d} className="map-region" />
              ))}
              {isActive && (
                <text
                  x={region.labelX}
                  y={region.labelY}
                  className="map-label map-label-active"
                  pointerEvents="none"
                >
                  {translateRegion(region.key)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="map-attribution">
        Map data ©{' '}
        <a href="https://simplemaps.com" target="_blank" rel="noopener noreferrer">
          Simplemaps.com
        </a>
      </p>
      {active && (
        <p className="map-selection-hint">
          {t('home.mapSelected', { region: translateRegion(active) })}
        </p>
      )}
    </div>
  );
}
