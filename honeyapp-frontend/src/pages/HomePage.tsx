import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GreeceMap } from '../components/GreeceMap';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-top">
        <div className="hero-content">
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">
              {t('home.browseHoney')}
            </Link>
            <Link to="/register/producer" className="btn btn-secondary">
              {t('home.joinProducer')}
            </Link>
          </div>
        </div>

        <div className="hero-map-panel">
          <h2 className="map-heading">{t('home.mapTitle')}</h2>
          <p className="muted map-subheading">{t('home.mapHint')}</p>
          <GreeceMap />
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat">
          <strong>{t('home.statRegions')}</strong>
          <span>{t('home.statRegionsSub')}</span>
        </div>
        <div className="stat">
          <strong>{t('home.statVarieties')}</strong>
          <span>{t('home.statVarietiesSub')}</span>
        </div>
        <div className="stat">
          <strong>{t('home.statDirect')}</strong>
          <span>{t('home.statDirectSub')}</span>
        </div>
      </div>
    </section>
  );
}
