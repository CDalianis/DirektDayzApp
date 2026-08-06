import { Link } from 'react-router-dom';

export function BrandLogo() {
  return (
    <Link to="/" className="logo brand-logo" aria-label="DirectDayzapp">
      <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#c8860a" />
        <path
          d="M20 6c-.8 2.8-2.5 5-5.3 6.4 3 .5 5.3 2.2 6.5 4.8 1.2-2.6 3.5-4.3 6.5-4.8C24.9 11 23.2 8.8 22.4 6c-.7 2-1.7 3.4-2.4 4.2-.7-.8-1.7-2.2-2.4-4.2z"
          fill="#fff3d6"
        />
        <path d="M13.5 18h13v2.5c0 .8-.7 1.5-1.5 1.5h-10c-.8 0-1.5-.7-1.5-1.5V18z" fill="#fffaf0" />
        <path d="M12 22h16v11c0 1.7-1.3 3-3 3H15c-1.7 0-3-1.3-3-3V22z" fill="#fff3d6" />
        <path d="M15 26h10v5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-5z" fill="#e8b84a" />
      </svg>
      <span className="brand-name">DirectDayzapp</span>
    </Link>
  );
}
