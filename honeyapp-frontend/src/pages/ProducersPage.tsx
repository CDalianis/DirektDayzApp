import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { producerApi, regionApi } from '../api/directdayzapp';
import { ProducerCard } from '../components/ProducerCard';
import { translateRegion } from '../i18n/helpers';

export function ProducersPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const region = searchParams.get('region') ?? '';
  const [businessName, setBusinessName] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [region, businessName]);

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: regionApi.getAll,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['producers', page, businessName, region],
    queryFn: () =>
      producerApi.getAll({
        page,
        size: 9,
        businessName: businessName || undefined,
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
          onChange={(e) => { setBusinessName(e.target.value); setPage(0); }}
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
      </div>

      {isLoading && <p>{t('producers.loading')}</p>}
      {isError && <p className="error">{t('producers.loadError')}</p>}

      <div className="grid">
        {data?.content.map((producer) => (
          <ProducerCard key={producer.uuid} producer={producer} />
        ))}
      </div>

      {data && data.content.length === 0 && !isLoading && (
        <p className="muted">{t('producers.noResults')}</p>
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
