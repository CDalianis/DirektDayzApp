import type { HoneyType } from '../types';

const HONEY_COLORS: Record<HoneyType, { jar: string; fill: string; lid: string }> = {
  THYME: { jar: '#f5e6c8', fill: '#e8b84a', lid: '#c8860a' },
  PINE: { jar: '#efe0c0', fill: '#a86b1a', lid: '#6b3f0e' },
  ORANGE: { jar: '#ffe8c8', fill: '#f0a030', lid: '#d4780a' },
  HEATHER: { jar: '#f0e4d8', fill: '#c47a4a', lid: '#8b4a6b' },
  MULTIFLORAL: { jar: '#fff0d0', fill: '#e8c040', lid: '#c8860a' },
  OTHER: { jar: '#f8ecd8', fill: '#d4a017', lid: '#9a6608' },
};

export function HoneyImage({
  honeyType,
  size = 'card',
  label,
}: {
  honeyType: HoneyType;
  size?: 'card' | 'detail';
  label?: string;
}) {
  const colors = HONEY_COLORS[honeyType] ?? HONEY_COLORS.OTHER;
  const className = size === 'detail' ? 'honey-image honey-image-detail' : 'honey-image';

  return (
    <div className={className} aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}>
      <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="honey-jar-svg">
        <defs>
          <linearGradient id={`glow-${honeyType}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffaf0" stopOpacity="0.55" />
            <stop offset="100%" stopColor={colors.fill} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="120" height="140" rx="12" fill={`url(#glow-${honeyType})`} />
        <ellipse cx="60" cy="28" rx="22" ry="8" fill={colors.lid} />
        <rect x="38" y="28" width="44" height="10" rx="2" fill={colors.lid} />
        <path
          d="M34 42h52l6 10v62c0 8-6 14-14 14H42c-8 0-14-6-14-14V52l6-10z"
          fill={colors.jar}
          stroke="#c8a96a"
          strokeWidth="1.5"
        />
        <path
          d="M28 78h64v36c0 8-6 14-14 14H42c-8 0-14-6-14-14V78z"
          fill={colors.fill}
          opacity="0.92"
        />
        <ellipse cx="60" cy="78" rx="32" ry="6" fill={colors.fill} opacity="0.75" />
        <path d="M42 52c6 4 12 4 18 0s12-4 18 0" fill="none" stroke="#fffaf0" strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  );
}
