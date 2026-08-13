import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import { BrandLogo } from './BrandLogo';
import { LanguageToggle } from './LanguageToggle';
import { AnimatedExternalLink, AnimatedNavLink } from './ui/skiper-ui/AnimatedNavLink';

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

  const closeMenu = () => setMenuOpen(false);

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
          <AnimatedNavLink to="/products" onClick={closeMenu}>{t('nav.products')}</AnimatedNavLink>
          <AnimatedNavLink to="/producers" onClick={closeMenu}>{t('nav.producers')}</AnimatedNavLink>
          {!isAuthenticated && (
            <>
              <AnimatedNavLink to="/login" onClick={closeMenu}>{t('nav.login')}</AnimatedNavLink>
              <AnimatedNavLink to="/register/producer" onClick={closeMenu}>
                {t('nav.becomeProducer')}
              </AnimatedNavLink>
              <AnimatedNavLink to="/register/consumer" onClick={closeMenu}>
                {t('nav.signUp')}
              </AnimatedNavLink>
            </>
          )}
          {isAuthenticated && role === 'PRODUCER' && (
            <AnimatedNavLink to="/producer/dashboard" onClick={closeMenu}>
              {t('nav.dashboard')}
            </AnimatedNavLink>
          )}
          {isAuthenticated && role === 'CONSUMER' && (
            <AnimatedNavLink to="/account" onClick={closeMenu}>
              {t('nav.account')}
            </AnimatedNavLink>
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
        <p className="footer-credit muted">
          {t('footer.uiCredit')}{' '}
          <AnimatedExternalLink href="https://skiper-ui.com/" className="footer-credit-link">
            Skiper UI
          </AnimatedExternalLink>
        </p>
      </footer>
    </div>
  );
}
