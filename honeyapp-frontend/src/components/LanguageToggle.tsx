import { useTranslation } from 'react-i18next';
import type { AppLanguage } from '../i18n';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language as AppLanguage;

  const setLanguage = (lng: AppLanguage) => {
    void i18n.changeLanguage(lng);
  };

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={current === 'en' ? 'lang-btn active' : 'lang-btn'}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={current === 'el' ? 'lang-btn active' : 'lang-btn'}
        onClick={() => setLanguage('el')}
      >
        ΕΛ
      </button>
    </div>
  );
}
