import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { producerApi, regionApi } from '../api/directdayzapp';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { ProducerCard } from '../components/ProducerCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { translateRegion } from '../i18n/helpers';

export function ProducersPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const region = searchParams.get('region') ?? '';
  const [businessName, setBusinessName] = useState('');
  const debouncedBusinessName = useDebouncedValue(businessName, 350);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [region, debouncedBusinessName]);

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: regionApi.getAll,
  });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['producers', page, debouncedBusinessName, region],
    queryFn: () =>
      producerApi.getAll({
        page,
        size: 9,
        businessName: debouncedBusinessName || undefined,
        region: region || undefined,
      }),
  });

  const clearRegion = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('region');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setBusinessName('');
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
      <h1>{t('producers.title')}</h1>
      {region && (
        <div className="region-banner">
          <span>{t('producers.filteredByRegion', { region: translateRegion(region) })}</span>
          <button type="button" className="btn-link" onClick={clearRegion}>
            {t('common.clearRegion')}
          </button>
          <Link to={{ pathname: '/products', search: `?region=${encodeURIComponent(region)}` }} className="btn-link">
            {t('producers.viewProductsInRegion', { region: translateRegion(region) })}
          </Link>
        </div>
      )}
      <div className="filters">
        <input
          placeholder={t('producers.searchPlaceholder')}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          aria-label={t('producers.searchPlaceholder')}
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
      </div>

      {showSkeleton && <ProductGridSkeleton count={6} />}

      {isError && (
        <ErrorState
          message={t('producers.loadError')}
          retryLabel={t('common.retry')}
          onRetry={() => void refetch()}
        />
      )}

      {!showSkeleton && !isError && data && data.content.length > 0 && (
        <div className="grid">
          {data.content.map((producer) => (
            <ProducerCard key={producer.uuid} producer={producer} />
          ))}
        </div>
      )}

      {!showSkeleton && !isError && data && data.content.length === 0 && (
        <EmptyState
          title={t('producers.noResults')}
          description={t('producers.noResultsHint')}
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
