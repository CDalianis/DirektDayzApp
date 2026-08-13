import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GreeceMap } from '../components/GreeceMap';
import { HoverExpand } from '../components/ui/skiper-ui/HoverExpand';
import { honeyVarietyImageSrc } from '../components/ui/skiper-ui/honeyVarietyArt';
import { HONEY_TYPES } from '../api/directdayzapp';
import { translateHoneyType } from '../i18n/helpers';

export function HomePage() {
  const { t } = useTranslation();

  const varietyImages = HONEY_TYPES.map((type, index) => ({
    src: honeyVarietyImageSrc(type),
    alt: translateHoneyType(type),
    code: `# ${String(index + 1).padStart(2, '0')} · ${translateHoneyType(type)}`,
  }));

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

      <section className="varieties-section" aria-labelledby="varieties-heading">
        <h2 id="varieties-heading">{t('home.varietiesTitle')}</h2>
        <p className="muted">{t('home.varietiesSubtitle')}</p>
        <HoverExpand images={varietyImages} className="varieties-gallery" />
      </section>
    </section>
  );
}
