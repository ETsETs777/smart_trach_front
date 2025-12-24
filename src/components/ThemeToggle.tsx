import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import Button from './ui/Button'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={toggleTheme}
        variant="ghost"
        size="sm"
        className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-md"
        title={theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')}
      >
        {theme === 'light' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </Button>
    </motion.div>
  )
}

