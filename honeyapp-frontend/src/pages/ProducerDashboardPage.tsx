import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HONEY_TYPES, producerApi, productApi } from '../api/directdayzapp';
import { translateHoneyType, translateRegion } from '../i18n/helpers';
import type { HoneyType, Product } from '../types';

interface ProductForm {
  name: string;
  honeyType: HoneyType;
  description: string;
  price: number;
  quantityKg: number;
  harvestYear: number;
}

export function ProducerDashboardPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<ProductForm>({
    defaultValues: { harvestYear: new Date().getFullYear(), honeyType: 'THYME' },
  });

  const { data: producer } = useQuery({
    queryKey: ['producer', 'me'],
    queryFn: producerApi.getMe,
  });

  const { data: products } = useQuery({
    queryKey: ['products', 'mine', producer?.uuid],
    queryFn: () => productApi.getAll({ producerUuid: producer!.uuid, size: 50 }),
    enabled: !!producer?.uuid,
  });

  const createProduct = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      reset({ harvestYear: new Date().getFullYear(), honeyType: 'THYME' });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const onSubmit = (data: ProductForm) => {
    if (!producer) return;
    createProduct.mutate({
      ...data,
      price: Number(data.price),
      quantityKg: Number(data.quantityKg),
      harvestYear: Number(data.harvestYear),
      producerUuid: producer.uuid,
    });
  };

  if (!producer) {
    return <p>{t('dashboard.loadingProfile')}</p>;
  }

  return (
    <section>
      <h1>{t('dashboard.title')}</h1>
      <p className="muted">{producer.businessName} · {translateRegion(producer.region)}</p>

      <div className="dashboard-grid">
        <div className="card">
          <h2>{t('dashboard.addProduct')}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <label>{t('dashboard.name')}<input {...register('name', { required: true })} /></label>
            <label>
              {t('dashboard.honeyType')}
              <select {...register('honeyType', { required: true })}>
                {HONEY_TYPES.map((type) => (
                  <option key={type} value={type}>{translateHoneyType(type)}</option>
                ))}
              </select>
            </label>
            <label>{t('common.description')}<textarea {...register('description')} rows={2} /></label>
            <label>{t('dashboard.pricePerKg')}<input type="number" step="0.01" {...register('price', { required: true })} /></label>
            <label>{t('dashboard.quantityKg')}<input type="number" step="0.1" {...register('quantityKg', { required: true })} /></label>
            <label>{t('dashboard.harvestYear')}<input type="number" {...register('harvestYear', { required: true })} /></label>
            <button type="submit" className="btn btn-primary" disabled={createProduct.isPending}>
              {t('dashboard.addProductBtn')}
            </button>
          </form>
        </div>

        <div>
          <h2>{t('dashboard.yourProducts')}</h2>
          <ul className="product-list">
            {products?.content.map((p: Product) => (
              <li key={p.uuid} className="product-list-item">
                <div>
                  <strong>{p.name}</strong>
                  <span className="muted">
                    {' '}· {translateHoneyType(p.honeyType)} · {t('common.perKgShort', { price: p.price })} · {p.quantityKg} {t('common.kg')}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deleteProduct.mutate(p.uuid)}
                >
                  {t('common.delete')}
                </button>
              </li>
            ))}
            {products?.content.length === 0 && <p>{t('dashboard.noProducts')}</p>}
          </ul>
        </div>
      </div>
    </section>
  );
}
