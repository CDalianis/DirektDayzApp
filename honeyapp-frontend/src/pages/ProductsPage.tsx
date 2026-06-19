import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { HONEY_TYPES, productApi, regionApi } from '../api/directdayzapp';
import { ProductCard } from '../components/ProductCard';
import { translateHoneyType, translateRegion } from '../i18n/helpers';
import type { HoneyType } from '../types';

export function ProductsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const region = searchParams.get('region') ?? '';
  const [honeyType, setHoneyType] = useState<HoneyType | ''>('');
  const [name, setName] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [region, honeyType, name]);

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: regionApi.getAll,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', page, honeyType, name, region],
    queryFn: () =>
      productApi.getAll({
        page,
        size: 12,
        honeyType: honeyType || undefined,
        name: name || undefined,
        region: region || undefined,
      }),
  });

  const clearRegion = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('region');
    setSearchParams(next);
  };

  const setRegion = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('region', value);
    else next.delete('region');
    setSearchParams(next);
  };

  return (
    <section>
      <h1>{t('products.title')}</h1>
      {region && (
        <div className="region-banner">
          <span>{t('products.filteredByRegion', { region: translateRegion(region) })}</span>
          <button type="button" className="btn-link" onClick={clearRegion}>
            {t('common.clearRegion')}
          </button>
          <Link to={{ pathname: '/producers', search: `?region=${encodeURIComponent(region)}` }} className="btn-link">
            {t('products.viewProducersInRegion', { region: translateRegion(region) })}
          </Link>
        </div>
      )}
      <div className="filters">
        <input
          placeholder={t('products.searchPlaceholder')}
          value={name}
          onChange={(e) => { setName(e.target.value); setPage(0); }}
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">{t('common.selectRegion')}</option>
          {regions.map((r) => (
            <option key={r.id} value={r.name}>{translateRegion(r.name)}</option>
          ))}
        </select>
        <select
          value={honeyType}
          onChange={(e) => { setHoneyType(e.target.value as HoneyType | ''); setPage(0); }}
        >
          <option value="">{t('products.allTypes')}</option>
          {HONEY_TYPES.map((type) => (
            <option key={type} value={type}>{translateHoneyType(type)}</option>
          ))}
        </select>
      </div>

      {isLoading && <p>{t('products.loading')}</p>}
      {isError && <p className="error">{t('products.loadError')}</p>}

      <div className="grid">
        {data?.content.map((product) => (
          <ProductCard key={product.uuid} product={product} />
        ))}
      </div>

      {data && data.content.length === 0 && !isLoading && (
        <p className="muted">{t('products.noResults')}</p>
      )}

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>{t('common.previous')}</button>
          <span>{t('common.pageOf', { current: page + 1, total: data.totalPages })}</span>
          <button disabled={page >= data.totalPages - 1} onClick={() => setPage((p) => p + 1)}>{t('common.next')}</button>
        </div>
      )}
    </section>
  );
}
