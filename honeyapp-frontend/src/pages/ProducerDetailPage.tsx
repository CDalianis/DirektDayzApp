import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { producerApi, productApi } from '../api/directdayzapp';
import { ProductCard } from '../components/ProductCard';
import { translateRegion } from '../i18n/helpers';

export function ProducerDetailPage() {
  const { t } = useTranslation();
  const { uuid } = useParams<{ uuid: string }>();

  const { data: producer, isLoading } = useQuery({
    queryKey: ['producer', uuid],
    queryFn: () => producerApi.getByUuid(uuid!),
    enabled: !!uuid,
  });

  const { data: products } = useQuery({
    queryKey: ['products', 'producer', uuid],
    queryFn: () => productApi.getAll({ producerUuid: uuid, size: 50 }),
    enabled: !!uuid,
  });

  if (isLoading || !producer) return <p>{t('common.loading')}</p>;

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
      <div className="grid">
        {products?.content.map((product) => (
          <ProductCard key={product.uuid} product={product} />
        ))}
        {products?.content.length === 0 && <p>{t('producerDetail.noProducts')}</p>}
      </div>
    </section>
  );
}
