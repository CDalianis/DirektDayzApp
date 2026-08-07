import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { producerApi, regionApi } from '../api/directdayzapp';
import { useToast } from '../components/Toast';
import { translateRegion } from '../i18n/helpers';

interface ProducerForm {
  businessName: string;
  ownerFirstname: string;
  ownerLastname: string;
  vat: string;
  regionId: number;
  description: string;
  username: string;
  password: string;
  address: string;
  phone: string;
  taxId: string;
  organicCertNumber: string;
}

export function RegisterProducerPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProducerForm>();

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: regionApi.getAll,
  });

  const mutation = useMutation({
    mutationFn: producerApi.register,
    onSuccess: (producer) => {
      showToast(t('registerProducer.success'));
      navigate(`/producers/${producer.uuid}`);
    },
  });

  const onSubmit = (data: ProducerForm) => {
    mutation.mutate({
      businessName: data.businessName,
      ownerFirstname: data.ownerFirstname,
      ownerLastname: data.ownerLastname,
      vat: data.vat,
      regionId: Number(data.regionId),
      description: data.description,
      userInsertDTO: { username: data.username, password: data.password },
      businessInfoInsertDTO: {
        taxId: data.taxId || null,
        address: data.address,
        phone: data.phone,
        organicCertNumber: data.organicCertNumber || null,
      },
    });
  };

  return (
    <section className="form-page wide">
      <h1>{t('registerProducer.title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form grid-form" noValidate>
        <fieldset>
          <legend>{t('registerProducer.business')}</legend>
          <label htmlFor="producer-businessName">
            {t('registerProducer.businessName')}
            <input
              id="producer-businessName"
              {...register('businessName', { required: t('common.required') })}
            />
            {errors.businessName && <span className="error field-error">{errors.businessName.message}</span>}
          </label>
          <label htmlFor="producer-ownerFirstname">
            {t('registerProducer.ownerFirstname')}
            <input
              id="producer-ownerFirstname"
              {...register('ownerFirstname', { required: t('common.required') })}
            />
            {errors.ownerFirstname && <span className="error field-error">{errors.ownerFirstname.message}</span>}
          </label>
          <label htmlFor="producer-ownerLastname">
            {t('registerProducer.ownerLastname')}
            <input
              id="producer-ownerLastname"
              {...register('ownerLastname', { required: t('common.required') })}
            />
            {errors.ownerLastname && <span className="error field-error">{errors.ownerLastname.message}</span>}
          </label>
          <label htmlFor="producer-vat">
            {t('registerProducer.vat')}
            <input
              id="producer-vat"
              {...register('vat', {
                required: t('common.required'),
                minLength: { value: 9, message: t('common.minLength', { count: 9 }) },
              })}
            />
            {errors.vat && <span className="error field-error">{errors.vat.message}</span>}
          </label>
          <label htmlFor="producer-regionId">
            {t('common.region')}
            <select id="producer-regionId" {...register('regionId', { required: t('common.required') })}>
              <option value="">{t('common.selectRegion')}</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{translateRegion(r.name)}</option>
              ))}
            </select>
            {errors.regionId && <span className="error field-error">{errors.regionId.message}</span>}
          </label>
          <label htmlFor="producer-description">
            {t('common.description')}
            <textarea id="producer-description" {...register('description')} rows={3} />
          </label>
        </fieldset>
        <fieldset>
          <legend>{t('registerProducer.contactAccount')}</legend>
          <label htmlFor="producer-address">
            {t('common.address')}
            <input
              id="producer-address"
              {...register('address', { required: t('common.required') })}
            />
            {errors.address && <span className="error field-error">{errors.address.message}</span>}
          </label>
          <label htmlFor="producer-phone">
            {t('common.phone')}
            <input
              id="producer-phone"
              {...register('phone', { required: t('common.required') })}
            />
            {errors.phone && <span className="error field-error">{errors.phone.message}</span>}
          </label>
          <label htmlFor="producer-taxId">
            {t('registerProducer.taxId')}
            <input id="producer-taxId" {...register('taxId')} />
          </label>
          <label htmlFor="producer-organicCert">
            {t('registerProducer.organicCert')}
            <input id="producer-organicCert" {...register('organicCertNumber')} />
          </label>
          <label htmlFor="producer-username">
            {t('common.username')}
            <input
              id="producer-username"
              autoComplete="username"
              {...register('username', {
                required: t('common.required'),
                minLength: { value: 3, message: t('common.minLength', { count: 3 }) },
              })}
            />
            {errors.username && <span className="error field-error">{errors.username.message}</span>}
          </label>
          <label htmlFor="producer-password">
            {t('common.password')}
            <input
              id="producer-password"
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: t('common.required'),
                minLength: { value: 6, message: t('common.minLength', { count: 6 }) },
              })}
            />
            {errors.password && <span className="error field-error">{errors.password.message}</span>}
          </label>
        </fieldset>
        {mutation.isError && <p className="error">{t('registerProducer.failed')}</p>}
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? t('registerProducer.registering') : t('registerProducer.submit')}
        </button>
      </form>
    </section>
  );
}
