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
        className="bg-white/20 hover:bg-white/30 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 text-gray-800 dark:text-gray-100 border-2 border-gray-300/50 dark:border-gray-600 backdrop-blur-md"
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


