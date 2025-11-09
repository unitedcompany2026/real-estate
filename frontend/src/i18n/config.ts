import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enTranslations from './locales/en.json'
import kaTranslations from './locales/ka.json'
import ruTranslations from './locales/ru.json'

const resources = {
  en: { translation: enTranslations },
  ka: { translation: kaTranslations },
  ru: { translation: ruTranslations },
}

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    lng: 'en', // Initial language
    debug: false, // Set to true for debugging

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'], // Cache user's language choice
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
