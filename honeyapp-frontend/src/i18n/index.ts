import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import el from './locales/el.json';

const STORAGE_KEY = 'directdayzapp-lang';

export type AppLanguage = 'en' | 'el';

function getStoredLanguage(): AppLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'el' ? 'el' : 'en';
}

function syncDocumentLanguage(lng: string) {
  document.documentElement.lang = lng;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    el: { translation: el },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

syncDocumentLanguage(i18n.language);

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  syncDocumentLanguage(lng);
});

export default i18n;
