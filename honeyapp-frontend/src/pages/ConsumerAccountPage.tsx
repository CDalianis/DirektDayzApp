import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { consumerApi } from '../api/directdayzapp';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';

export function ConsumerAccountPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['consumer', 'me'],
    queryFn: consumerApi.getMe,
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data) {
    return (
      <ErrorState
        message={t('account.loadError')}
        retryLabel={t('common.retry')}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section className="form-page">
      <h1>{t('account.title')}</h1>
      <p className="muted">{t('account.subtitle')}</p>

      <div className="card account-card">
        <h2>{t('account.welcome', { name: data.firstname })}</h2>
        <div className="detail-meta">
          <div>
            <strong>{t('registerConsumer.firstname')}</strong>
            <p>{data.firstname}</p>
          </div>
          <div>
            <strong>{t('registerConsumer.lastname')}</strong>
            <p>{data.lastname}</p>
          </div>
          <div>
            <strong>{t('common.address')}</strong>
            <p>{data.address}</p>
          </div>
          <div>
            <strong>{t('common.phone')}</strong>
            <p>{data.phone}</p>
          </div>
        </div>
        <p className="muted">{t('account.exploreHint')}</p>
        <div className="account-actions">
          <Link to="/products" className="btn btn-primary">
            {t('account.browseHoney')}
          </Link>
          <Link to="/producers" className="btn btn-secondary">
            {t('account.browseProducers')}
          </Link>
        </div>
      </div>
    </section>
  );
}
