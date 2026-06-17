import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import { LanguageToggle } from './LanguageToggle';

export function Layout() {
  const { t } = useTranslation();
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="header">
        <Link to="/" className="logo">
          🍯 DirectDayzapp
        </Link>
        <nav className="nav">
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
