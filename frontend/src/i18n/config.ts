import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslations from './locales/en.json'
import kaTranslations from './locales/ka.json'
import ruTranslations from './locales/ru.json'
import heTranslations from './locales/he.json'
import arTranslations from './locales/ar.json'

const resources = {
  en: { translation: enTranslations },
  ka: { translation: kaTranslations },
  ru: { translation: ruTranslations },
  he: { translation: heTranslations },
  ar: { translation: arTranslations },
}

const SUPPORTED_LANGS = ['en', 'ka', 'ru', 'he', 'ar']

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  })

/**
 * ✅ Ensure ?lang= is ALWAYS present
 */
const syncLangToUrl = (lng: string) => {
  if (!SUPPORTED_LANGS.includes(lng)) return

  const url = new URL(window.location.href)

  if (url.searchParams.get('lang') !== lng) {
    url.searchParams.set('lang', lng)
    window.history.replaceState({}, '', url.toString())
  }
}

// ✅ Handle FIRST load
syncLangToUrl(i18n.language)

// ✅ Handle language changes
i18n.on('languageChanged', lng => {
  syncLangToUrl(lng)
})

export default i18n
