import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './ui/Button'
import { supportedLanguages, languageNames, type SupportedLanguage } from '@/i18n/config'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const currentLang = (i18n.language?.split('-')[0] || 'en') as SupportedLanguage

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang)
    setIsOpen(false)
  }

  const nextLanguage = () => {
    const currentIndex = supportedLanguages.indexOf(currentLang)
    const nextIndex = (currentIndex + 1) % supportedLanguages.length
    changeLanguage(supportedLanguages[nextIndex])
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-md flex items-center gap-2"
          title={`Current language: ${languageNames[currentLang]}. Click to change.`}
        >
          <Globe className="w-4 h-4" />
          <span className="font-semibold uppercase">{currentLang}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 z-20 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[150px]"
            >
              {supportedLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center justify-between ${
                    currentLang === lang ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  <span>{languageNames[lang]}</span>
                  {currentLang === lang && (
                    <span className="text-green-600">✓</span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}


