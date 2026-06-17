import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translateHoneyType, translateRegion } from '../i18n/helpers';
import type { Product } from '../types';

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();

  return (
    <article className="card product-card">
      <div className="card-badge">{translateHoneyType(product.honeyType)}</div>
      <h3>{product.name}</h3>
      <p className="muted">{product.producerBusinessName} · {translateRegion(product.region)}</p>
      <p className="description">{product.description || t('products.defaultDescription')}</p>
      <div className="card-meta">
        <span className="price">{t('common.perKgShort', { price: product.price.toFixed(2) })}</span>
        <span>{t('common.kgAvailable', { amount: product.quantityKg })}</span>
      </div>
      <Link to={`/products/${product.uuid}`} className="btn btn-secondary">
        {t('products.viewDetails')}
      </Link>
    </article>
  );
}
