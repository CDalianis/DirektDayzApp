import type { HoneyType } from '@/types';

const HONEY_COLORS: Record<HoneyType, { jar: string; fill: string; lid: string; bg: string }> = {
  THYME: { jar: '#f5e6c8', fill: '#e8b84a', lid: '#c8860a', bg: '#fff6e4' },
  PINE: { jar: '#efe0c0', fill: '#a86b1a', lid: '#6b3f0e', bg: '#f3e8d4' },
  ORANGE: { jar: '#ffe8c8', fill: '#f0a030', lid: '#d4780a', bg: '#fff0dc' },
  HEATHER: { jar: '#f0e4d8', fill: '#c47a4a', lid: '#8b4a6b', bg: '#f7ebe8' },
  MULTIFLORAL: { jar: '#fff0d0', fill: '#e8c040', lid: '#c8860a', bg: '#fff8e0' },
  OTHER: { jar: '#f8ecd8', fill: '#d4a017', lid: '#9a6608', bg: '#faf0dc' },
};

/** Inline SVG data URL so HoverExpand works without external image assets. */
export function honeyVarietyImageSrc(honeyType: HoneyType): string {
  const c = HONEY_COLORS[honeyType] ?? HONEY_COLORS.OTHER;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 320">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fffaf0" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${c.fill}" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="240" height="320" rx="28" fill="${c.bg}"/>
  <rect width="240" height="320" rx="28" fill="url(#g)"/>
  <ellipse cx="120" cy="78" rx="36" ry="12" fill="${c.lid}"/>
  <rect x="84" y="78" width="72" height="16" rx="3" fill="${c.lid}"/>
  <path d="M72 100h96l10 16v110c0 14-10 24-24 24H86c-14 0-24-10-24-24V116l10-16z"
        fill="${c.jar}" stroke="#c8a96a" stroke-width="2"/>
  <path d="M58 168h124v68c0 14-10 24-24 24H82c-14 0-24-10-24-24v-68z"
        fill="${c.fill}" opacity="0.94"/>
  <ellipse cx="120" cy="168" rx="62" ry="10" fill="${c.fill}" opacity="0.8"/>
  <path d="M90 118c10 6 20 6 30 0s20-6 30 0" fill="none" stroke="#fffaf0" stroke-width="3" opacity="0.55"/>
</svg>`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
