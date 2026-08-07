import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { HONEY_TYPES, productApi, regionApi } from '../api/directdayzapp';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { ProductCard } from '../components/ProductCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { translateHoneyType, translateRegion } from '../i18n/helpers';
import type { HoneyType } from '../types';

export function ProductsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const region = searchParams.get('region') ?? '';
  const [honeyType, setHoneyType] = useState<HoneyType | ''>('');
  const [name, setName] = useState('');
  const debouncedName = useDebouncedValue(name, 350);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [region, honeyType, debouncedName]);

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: regionApi.getAll,
  });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['products', page, honeyType, debouncedName, region],
    queryFn: () =>
      productApi.getAll({
        page,
        size: 12,
        honeyType: honeyType || undefined,
        name: debouncedName || undefined,
        region: region || undefined,
      }),
  });

  const clearRegion = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('region');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setName('');
    setHoneyType('');
    clearRegion();
  };

  const setRegion = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('region', value);
    else next.delete('region');
    setSearchParams(next);
  };

  const showSkeleton = isLoading || (isFetching && !data);

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
          onChange={(e) => setName(e.target.value)}
          aria-label={t('products.searchPlaceholder')}
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label={t('common.region')}
        >
          <option value="">{t('common.selectRegion')}</option>
          {regions.map((r) => (
            <option key={r.id} value={r.name}>{translateRegion(r.name)}</option>
          ))}
        </select>
        <select
          value={honeyType}
          onChange={(e) => setHoneyType(e.target.value as HoneyType | '')}
          aria-label={t('dashboard.honeyType')}
        >
          <option value="">{t('products.allTypes')}</option>
          {HONEY_TYPES.map((type) => (
            <option key={type} value={type}>{translateHoneyType(type)}</option>
          ))}
        </select>
      </div>

      {showSkeleton && <ProductGridSkeleton />}

      {isError && (
        <ErrorState
          message={t('products.loadError')}
          retryLabel={t('common.retry')}
          onRetry={() => void refetch()}
        />
      )}

      {!showSkeleton && !isError && data && data.content.length > 0 && (
        <div className="grid">
          {data.content.map((product) => (
            <ProductCard key={product.uuid} product={product} />
          ))}
        </div>
      )}

      {!showSkeleton && !isError && data && data.content.length === 0 && (
        <EmptyState
          title={t('products.noResults')}
          description={t('products.noResultsHint')}
          action={
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              {t('common.clearFilters')}
            </button>
          }
        />
      )}

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button type="button" className="btn btn-secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            {t('common.previous')}
          </button>
          <span>{t('common.pageOf', { current: page + 1, total: data.totalPages })}</span>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page >= data.totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            {t('common.next')}
          </button>
        </div>
      )}
    </section>
  );
}
