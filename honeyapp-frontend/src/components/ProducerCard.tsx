import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translateRegion } from '../i18n/helpers';
import type { Producer } from '../types';

export function ProducerCard({ producer }: { producer: Producer }) {
  const { t } = useTranslation();

  return (
    <article className="card">
      <h3>{producer.businessName}</h3>
      <p className="muted">
        {producer.ownerFirstname} {producer.ownerLastname} · {translateRegion(producer.region)}
      </p>
      <p className="description">{producer.description || t('producers.defaultDescription')}</p>
      {producer.organicCertNumber && (
        <span className="tag">{t('producers.organicCertified')}</span>
      )}
      <Link to={`/producers/${producer.uuid}`} className="btn btn-secondary">
        {t('producers.viewProducer')}
      </Link>
    </article>
  );
}
