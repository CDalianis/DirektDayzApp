import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useForm, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HONEY_TYPES, QUANTITY_CHANGE_REASONS, producerApi, productApi } from '../api/directdayzapp';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../components/Toast';
import {
  translateHoneyType,
  translateQuantityChangeReason,
  translateRegion,
} from '../i18n/helpers';
import type { HoneyType, Product, QuantityChangeReason } from '../types';

interface ProductForm {
  name: string;
  honeyType: HoneyType;
  description: string;
  price: number;
  quantityKg: number;
  harvestYear: number;
}

interface QuantityForm {
  quantityKg: number;
  reason: QuantityChangeReason | '';
}

export function ProducerDashboardPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<Product | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    defaultValues: { harvestYear: new Date().getFullYear(), honeyType: 'THYME' },
  });

  const {
    register: registerQuantity,
    handleSubmit: handleQuantitySubmit,
    reset: resetQuantity,
    formState: { errors: quantityErrors },
  } = useForm<QuantityForm>();

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
      showToast(t('dashboard.addSuccess'));
    },
  });

  const updateQuantity = useMutation({
    mutationFn: ({
      uuid,
      quantityKg,
      reason,
    }: {
      uuid: string;
      quantityKg: number;
      reason: QuantityChangeReason;
    }) => productApi.updateQuantity(uuid, { uuid, quantityKg, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingQuantity(null);
      showToast(t('dashboard.updateQuantitySuccess'));
    },
  });

  const deleteProduct = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setPendingDelete(null);
      showToast(t('dashboard.deleteSuccess'));
    },
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

  const openQuantityEditor = (product: Product) => {
    setEditingQuantity(product);
    resetQuantity({
      quantityKg: product.quantityKg,
      reason: '',
    });
  };

  const onQuantitySubmit = (data: QuantityForm) => {
    if (!editingQuantity || !data.reason) return;
    updateQuantity.mutate({
      uuid: editingQuantity.uuid,
      quantityKg: Number(data.quantityKg),
      reason: data.reason,
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
          <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
            <label htmlFor="dash-name">
              {t('dashboard.name')}
              <input
                id="dash-name"
                {...register('name', { required: t('common.required') })}
              />
              {errors.name && <span className="error field-error">{errors.name.message}</span>}
            </label>
            <label htmlFor="dash-honeyType">
              {t('dashboard.honeyType')}
              <select id="dash-honeyType" {...register('honeyType', { required: t('common.required') })}>
                {HONEY_TYPES.map((type) => (
                  <option key={type} value={type}>{translateHoneyType(type)}</option>
                ))}
              </select>
            </label>
            <label htmlFor="dash-description">
              {t('common.description')}
              <textarea id="dash-description" {...register('description')} rows={2} />
            </label>
            <label htmlFor="dash-price">
              {t('dashboard.pricePerKg')}
              <input
                id="dash-price"
                type="number"
                step="0.01"
                {...register('price', { required: t('common.required') })}
              />
              {errors.price && <span className="error field-error">{errors.price.message}</span>}
            </label>
            <label htmlFor="dash-quantity">
              {t('dashboard.quantityKg')}
              <input
                id="dash-quantity"
                type="number"
                step="0.1"
                {...register('quantityKg', { required: t('common.required') })}
              />
              {errors.quantityKg && <span className="error field-error">{errors.quantityKg.message}</span>}
            </label>
            <label htmlFor="dash-harvest">
              {t('dashboard.harvestYear')}
              <input
                id="dash-harvest"
                type="number"
                {...register('harvestYear', { required: t('common.required') })}
              />
              {errors.harvestYear && <span className="error field-error">{errors.harvestYear.message}</span>}
            </label>
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
                <div className="product-list-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => openQuantityEditor(p)}
                  >
                    {t('dashboard.updateQuantity')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setPendingDelete(p)}
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {products?.content.length === 0 && (
            <EmptyState
              title={t('dashboard.noProducts')}
              description={t('dashboard.noProductsHint')}
            />
          )}
        </div>
      </div>

      <QuantityUpdateDialog
        open={!!editingQuantity}
        product={editingQuantity}
        register={registerQuantity}
        errors={quantityErrors}
        isPending={updateQuantity.isPending}
        onCancel={() => setEditingQuantity(null)}
        onSubmit={handleQuantitySubmit(onQuantitySubmit)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title={t('dashboard.deleteTitle')}
        message={t('dashboard.deleteMessage', { name: pendingDelete?.name ?? '' })}
        confirmLabel={t('dashboard.deleteConfirm')}
        cancelLabel={t('common.cancel')}
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteProduct.mutate(pendingDelete.uuid);
        }}
      />
    </section>
  );
}

function QuantityUpdateDialog({
  open,
  product,
  register,
  errors,
  isPending,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  product: Product | null;
  register: UseFormRegister<QuantityForm>;
  errors: FieldErrors<QuantityForm>;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (e?: FormEvent) => Promise<void>;
}) {
  const { t } = useTranslation();
  const quantityRef = useRef<HTMLInputElement | null>(null);
  const { ref: quantityFieldRef, ...quantityField } = register('quantityKg', {
    required: t('common.required'),
    min: { value: 0.01, message: t('common.required') },
  });

  useEffect(() => {
    if (open) quantityRef.current?.focus();
  }, [open]);

  if (!open || !product) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quantity-title"
        aria-describedby="quantity-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="quantity-title">{t('dashboard.updateQuantityTitle')}</h2>
        <p id="quantity-message" className="muted">
          {t('dashboard.updateQuantityMessage', { name: product.name })}
        </p>
        <p className="muted">{t('dashboard.currentQuantity', { amount: product.quantityKg })}</p>

        <form onSubmit={onSubmit} className="form" noValidate>
          <label htmlFor="edit-quantity">
            {t('dashboard.newQuantity')}
            <input
              id="edit-quantity"
              type="number"
              step="0.1"
              min="0.01"
              {...quantityField}
              ref={(el) => {
                quantityFieldRef(el);
                quantityRef.current = el;
              }}
            />
            {errors.quantityKg && (
              <span className="error field-error">{errors.quantityKg.message}</span>
            )}
          </label>
          <label htmlFor="edit-quantity-reason">
            {t('dashboard.quantityReason')}
            <select
              id="edit-quantity-reason"
              {...register('reason', { required: t('common.required') })}
            >
              <option value="" disabled>
                {t('dashboard.quantityReasonPlaceholder')}
              </option>
              {QUANTITY_CHANGE_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {translateQuantityChangeReason(reason)}
                </option>
              ))}
            </select>
            {errors.reason && <span className="error field-error">{errors.reason.message}</span>}
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {t('dashboard.updateQuantityConfirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
