import i18nRaw from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { es } from './locales/es';

export const LANG_KEY = 'lang';
export type Lang = 'en' | 'es';
export const LANGS: Lang[] = ['en', 'es'];

export const i18n = i18nRaw.createInstance();

export const inlinePlural = {
  type: 'postProcessor' as const,
  name: 'inlinePlural',
  process(value: string, _key: unknown, options: { count?: number }) {
    if (!/\{\{p\|/.test(value)) return value;
    const one = options?.count === 1;
    return value.replace(/\{\{p\|([^|]*)\|([^}]*)\}\}/g, (_, a, b) => (one ? a : b));
  },
};

export function resolveLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'es') return saved;
  } catch {
    /* private mode */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

i18n.use(initReactI18next).use(inlinePlural).init({
  postProcess: 'inlinePlural',
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: resolveLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* private mode */
  }
  void i18n.changeLanguage(lang);
}
