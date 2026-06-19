import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { producerApi, regionApi } from '../api/directdayzapp';
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
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<ProducerForm>();

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: regionApi.getAll,
  });

  const mutation = useMutation({
    mutationFn: producerApi.register,
    onSuccess: (producer) => navigate(`/producers/${producer.uuid}`),
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
      <form onSubmit={handleSubmit(onSubmit)} className="form grid-form">
        <fieldset>
          <legend>{t('registerProducer.business')}</legend>
          <label>{t('registerProducer.businessName')}<input {...register('businessName', { required: true })} /></label>
          <label>{t('registerProducer.ownerFirstname')}<input {...register('ownerFirstname', { required: true })} /></label>
          <label>{t('registerProducer.ownerLastname')}<input {...register('ownerLastname', { required: true })} /></label>
          <label>{t('registerProducer.vat')}<input {...register('vat', { required: true, minLength: 9 })} /></label>
          <label>
            {t('common.region')}
            <select {...register('regionId', { required: true })}>
              <option value="">{t('common.selectRegion')}</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{translateRegion(r.name)}</option>
              ))}
            </select>
          </label>
          <label>{t('common.description')}<textarea {...register('description')} rows={3} /></label>
        </fieldset>
        <fieldset>
          <legend>{t('registerProducer.contactAccount')}</legend>
          <label>{t('common.address')}<input {...register('address', { required: true })} /></label>
          <label>{t('common.phone')}<input {...register('phone', { required: true })} /></label>
          <label>{t('registerProducer.taxId')}<input {...register('taxId')} /></label>
          <label>{t('registerProducer.organicCert')}<input {...register('organicCertNumber')} /></label>
          <label>{t('common.username')}<input {...register('username', { required: true, minLength: 3 })} /></label>
          <label>{t('common.password')}<input type="password" {...register('password', { required: true, minLength: 6 })} /></label>
        </fieldset>
        {mutation.isError && <p className="error">{t('registerProducer.failed')}</p>}
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? t('registerProducer.registering') : t('registerProducer.submit')}
        </button>
      </form>
    </section>
  );
}
