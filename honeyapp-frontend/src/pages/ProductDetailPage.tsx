import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { productApi } from '../api/directdayzapp';
import { translateHoneyType, translateRegion } from '../i18n/helpers';

export function ProductDetailPage() {
  const { t } = useTranslation();
  const { uuid } = useParams<{ uuid: string }>();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', uuid],
    queryFn: () => productApi.getByUuid(uuid!),
    enabled: !!uuid,
  });

  if (isLoading) return <p>{t('common.loading')}</p>;
  if (isError || !product) return <p className="error">{t('productDetail.notFound')}</p>;

  return (
    <section className="detail-page">
      <span className="card-badge">{translateHoneyType(product.honeyType)}</span>
      <h1>{product.name}</h1>
      <p className="muted">
        {t('productDetail.harvest', {
          year: product.harvestYear,
          region: translateRegion(product.region),
        })}
      </p>
      <p>{product.description || t('productDetail.defaultDescription')}</p>
      <div className="detail-meta">
        <div><strong>{t('common.price')}</strong><p>{t('common.perKg', { price: product.price.toFixed(2) })}</p></div>
        <div><strong>{t('common.available')}</strong><p>{product.quantityKg} {t('common.kg')}</p></div>
        <div><strong>{t('common.producer')}</strong><p>{product.producerBusinessName}</p></div>
      </div>
      <Link to={`/producers/${product.producerUuid}`} className="btn btn-primary">
        {t('productDetail.viewProducer')}
      </Link>
    </section>
  );
}
