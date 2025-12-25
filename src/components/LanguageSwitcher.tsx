import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from './ui/Button'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(newLang)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={toggleLanguage}
        variant="ghost"
        size="sm"
        className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-md flex items-center gap-2"
        title={i18n.language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
      >
        <Globe className="w-4 h-4" />
        <span className="font-semibold">{i18n.language === 'ru' ? 'RU' : 'EN'}</span>
      </Button>
    </motion.div>
  )
}


