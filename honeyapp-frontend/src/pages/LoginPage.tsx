import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface LoginForm {
  username: string;
  password: string;
}

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const role = await login(data.username, data.password);
      if (role === 'PRODUCER') {
        navigate('/producer/dashboard');
      } else {
        navigate('/products');
      }
    } catch {
      setError('root', { message: t('login.invalidCredentials') });
    }
  };

  return (
    <section className="form-page">
      <h1>{t('login.title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label>
          {t('common.username')}
          <input {...register('username', { required: t('login.usernameRequired') })} />
          {errors.username && <span className="error">{errors.username.message}</span>}
        </label>
        <label>
          {t('common.password')}
          <input type="password" {...register('password', { required: t('login.passwordRequired') })} />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </label>
        {errors.root && <p className="error">{errors.root.message}</p>}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? t('login.signingIn') : t('login.signIn')}
        </button>
      </form>
    </section>
  );
}
