import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { producerApi, productApi } from '../api/directdayzapp';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { DetailSkeleton, ProductGridSkeleton } from '../components/LoadingSkeleton';
import { ProductCard } from '../components/ProductCard';
import { translateRegion } from '../i18n/helpers';

export function ProducerDetailPage() {
  const { t } = useTranslation();
  const { uuid } = useParams<{ uuid: string }>();

  const {
    data: producer,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['producer', uuid],
    queryFn: () => producerApi.getByUuid(uuid!),
    enabled: !!uuid,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'producer', uuid],
    queryFn: () => productApi.getAll({ producerUuid: uuid, size: 50 }),
    enabled: !!uuid,
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !producer) {
    return (
      <ErrorState
        message={t('producerDetail.loadError')}
        retryLabel={t('common.retry')}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section>
      <h1>{producer.businessName}</h1>
      <p className="muted">
        {producer.ownerFirstname} {producer.ownerLastname} · {translateRegion(producer.region)}
      </p>
      <p>{producer.description}</p>
      <div className="detail-meta">
        <div><strong>{t('common.address')}</strong><p>{producer.address}</p></div>
        <div><strong>{t('common.phone')}</strong><p>{producer.phone}</p></div>
        {producer.organicCertNumber && (
          <div><strong>{t('producerDetail.organicCert')}</strong><p>{producer.organicCertNumber}</p></div>
        )}
      </div>

      <h2>{t('common.products')}</h2>
      {productsLoading && <ProductGridSkeleton count={3} />}
      {!productsLoading && products && products.content.length > 0 && (
        <div className="grid">
          {products.content.map((product) => (
            <ProductCard key={product.uuid} product={product} />
          ))}
        </div>
      )}
      {!productsLoading && products?.content.length === 0 && (
        <EmptyState title={t('producerDetail.noProducts')} />
      )}
    </section>
  );
}
