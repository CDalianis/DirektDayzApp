import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { consumerApi } from '../api/directdayzapp';
import { useToast } from '../components/Toast';

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
  const { showToast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsumerForm>();

  const mutation = useMutation({
    mutationFn: consumerApi.register,
    onSuccess: () => {
      showToast(t('registerConsumer.success'));
      navigate('/login');
    },
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
      <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
        <fieldset>
          <legend>{t('registerConsumer.title')}</legend>
          <label htmlFor="consumer-firstname">
            {t('registerConsumer.firstname')}
            <input
              id="consumer-firstname"
              {...register('firstname', { required: t('common.required') })}
            />
            {errors.firstname && <span className="error field-error">{errors.firstname.message}</span>}
          </label>
          <label htmlFor="consumer-lastname">
            {t('registerConsumer.lastname')}
            <input
              id="consumer-lastname"
              {...register('lastname', { required: t('common.required') })}
            />
            {errors.lastname && <span className="error field-error">{errors.lastname.message}</span>}
          </label>
          <label htmlFor="consumer-address">
            {t('common.address')}
            <input
              id="consumer-address"
              {...register('address', { required: t('common.required') })}
            />
            {errors.address && <span className="error field-error">{errors.address.message}</span>}
          </label>
          <label htmlFor="consumer-phone">
            {t('common.phone')}
            <input
              id="consumer-phone"
              {...register('phone', { required: t('common.required') })}
            />
            {errors.phone && <span className="error field-error">{errors.phone.message}</span>}
          </label>
          <label htmlFor="consumer-username">
            {t('common.username')}
            <input
              id="consumer-username"
              autoComplete="username"
              {...register('username', {
                required: t('common.required'),
                minLength: { value: 3, message: t('common.minLength', { count: 3 }) },
              })}
            />
            {errors.username && <span className="error field-error">{errors.username.message}</span>}
          </label>
          <label htmlFor="consumer-password">
            {t('common.password')}
            <input
              id="consumer-password"
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
        {mutation.isError && <p className="error">{t('registerConsumer.failed')}</p>}
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {t('registerConsumer.submit')}
        </button>
      </form>
    </section>
  );
}
