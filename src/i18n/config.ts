import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ru from './locales/ru.json'
import en from './locales/en.json'
import de from './locales/de.json'

// Supported languages
export const supportedLanguages = ['ru', 'en', 'de'] as const
export type SupportedLanguage = typeof supportedLanguages[number]

// Language names for display
export const languageNames: Record<SupportedLanguage, string> = {
  ru: 'Русский',
  en: 'English',
  de: 'Deutsch',
}

// Get system language with fallback
function getSystemLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en'
  
  // Try to get language from various sources
  const navigatorLang = navigator.language || (navigator as any).userLanguage
  const systemLang = navigatorLang?.split('-')[0]?.toLowerCase()
  
  // Check if system language is supported
  if (systemLang && supportedLanguages.includes(systemLang as SupportedLanguage)) {
    return systemLang as SupportedLanguage
  }
  
  // Fallback to English
  return 'en'
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: ru,
      },
      en: {
        translation: en,
      },
      de: {
        translation: de,
      },
    },
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Order of detection: localStorage (user preference) -> cookie -> navigator (browser/system) -> htmlTag -> querystring -> path
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag', 'querystring', 'path'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18next',
      // Check for system language if no preference is found
      checkWhitelist: true,
    },
    // Set default language based on system if no preference
    lng: getSystemLanguage(),
  })

export default i18n
