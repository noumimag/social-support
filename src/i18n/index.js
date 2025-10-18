import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslation from './locales/en/translation.json'
import arTranslation from './locales/ar/translation.json'

const resources = {
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: localStorage.getItem('i18nextLng') || 'en',
  debug: false,

  interpolation: {
    escapeValue: false,
  },
})

// Handle language changes and update HTML direction
i18n.on('languageChanged', lng => {
  const isRTL = lng === 'ar'

  // Update HTML direction
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
})

export default i18n
