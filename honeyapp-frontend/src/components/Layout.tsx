import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import { BrandLogo } from './BrandLogo';
import { LanguageToggle } from './LanguageToggle';

export function Layout() {
  const { t } = useTranslation();
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="header">
        <BrandLogo />
        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.menu')}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
        {menuOpen && (
          <button
            type="button"
            className="nav-backdrop"
            aria-label={t('nav.closeMenu')}
            onClick={() => setMenuOpen(false)}
          />
        )}
        <nav id="main-nav" className={`nav${menuOpen ? ' open' : ''}`}>
          <Link to="/products">{t('nav.products')}</Link>
          <Link to="/producers">{t('nav.producers')}</Link>
          {!isAuthenticated && (
            <>
              <Link to="/login">{t('nav.login')}</Link>
              <Link to="/register/producer">{t('nav.becomeProducer')}</Link>
              <Link to="/register/consumer">{t('nav.signUp')}</Link>
            </>
          )}
          {isAuthenticated && role === 'PRODUCER' && (
            <Link to="/producer/dashboard">{t('nav.dashboard')}</Link>
          )}
          {isAuthenticated && role === 'CONSUMER' && (
            <Link to="/account">{t('nav.account')}</Link>
          )}
          {isAuthenticated && (
            <button type="button" className="btn-link" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          )}
          <LanguageToggle />
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>{t('footer.tagline')}</p>
      </footer>
    </div>
  );
}
