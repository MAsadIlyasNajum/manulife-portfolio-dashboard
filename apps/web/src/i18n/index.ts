import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import bm from './locales/bm';
import en from './locales/en';

export const LANGUAGE_STORAGE_KEY = 'portfolio.language';
export const SUPPORTED_LANGUAGES = ['en', 'bm'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  en: {
    translation: en,
  },
  bm: {
    translation: bm,
  },
} as const;

function normalizeLanguage(language: string | null | undefined): SupportedLanguage {
  if (!language) {
    return 'en';
  }

  const lowerLanguage = language.toLowerCase();
  if (lowerLanguage.startsWith('bm') || lowerLanguage.startsWith('ms')) {
    return 'bm';
  }

  return 'en';
}

export function getStoredLanguage(): SupportedLanguage {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return normalizeLanguage(stored);
  } catch {
    return 'en';
  }
}

export function getInitialLanguage(): SupportedLanguage {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) {
      return normalizeLanguage(stored);
    }
  } catch {
    // Ignore storage failures.
  }

  return normalizeLanguage(window.navigator.language);
}

export function getLocaleForLanguage(language: string): string {
  return normalizeLanguage(language) === 'bm' ? 'ms-MY' : 'en-US';
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (language) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
  } catch {
    // Ignore storage failures.
  }
});

export default i18n;
