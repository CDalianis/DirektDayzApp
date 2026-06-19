import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { consumerApi } from '../api/directdayzapp';

interface ConsumerForm {
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  username: string;
  password: string;
}

export function RegisterConsumerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<ConsumerForm>();

  const mutation = useMutation({
    mutationFn: consumerApi.register,
    onSuccess: () => navigate('/login'),
  });

  const onSubmit = (data: ConsumerForm) => {
    mutation.mutate({
      firstname: data.firstname,
      lastname: data.lastname,
      address: data.address,
      phone: data.phone,
      userInsertDTO: { username: data.username, password: data.password },
    });
  };

  return (
    <section className="form-page">
      <h1>{t('registerConsumer.title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label>{t('registerConsumer.firstname')}<input {...register('firstname', { required: true })} /></label>
        <label>{t('registerConsumer.lastname')}<input {...register('lastname', { required: true })} /></label>
        <label>{t('common.address')}<input {...register('address', { required: true })} /></label>
        <label>{t('common.phone')}<input {...register('phone', { required: true })} /></label>
        <label>{t('common.username')}<input {...register('username', { required: true, minLength: 3 })} /></label>
        <label>{t('common.password')}<input type="password" {...register('password', { required: true, minLength: 6 })} /></label>
        {mutation.isError && <p className="error">{t('registerConsumer.failed')}</p>}
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {t('registerConsumer.submit')}
        </button>
      </form>
    </section>
  );
}
