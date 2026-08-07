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
        navigate('/account');
      }
    } catch {
      setError('root', { message: t('login.invalidCredentials') });
    }
  };

  return (
    <section className="form-page">
      <h1>{t('login.title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
        <label htmlFor="login-username">
          {t('common.username')}
          <input
            id="login-username"
            autoComplete="username"
            {...register('username', { required: t('login.usernameRequired') })}
          />
          {errors.username && <span className="error field-error">{errors.username.message}</span>}
        </label>
        <label htmlFor="login-password">
          {t('common.password')}
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: t('login.passwordRequired') })}
          />
          {errors.password && <span className="error field-error">{errors.password.message}</span>}
        </label>
        {errors.root && <p className="error">{errors.root.message}</p>}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? t('login.signingIn') : t('login.signIn')}
        </button>
      </form>
    </section>
  );
}
