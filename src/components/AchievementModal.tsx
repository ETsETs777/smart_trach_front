import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Target, Award, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from './ui/Button'
import Card from './ui/Card'

interface AchievementModalProps {
  achievement: {
    id: string
    title: string
    description: string
    criterionType: string
    threshold: number
  } | null
  show: boolean
  onClose: () => void
  progress?: number
  current?: number
}

const iconMap: Record<string, any> = {
  TOTAL_PHOTOS: Target,
  CORRECT_BIN_MATCHES: Award,
  STREAK_DAYS: Calendar,
}

export default function AchievementModal({ 
  achievement, 
  show, 
  onClose,
  progress = 0,
  current = 0,
}: AchievementModalProps) {
  const { t } = useTranslation()

  if (!achievement) return null

  const Icon = iconMap[achievement.criterionType] || Trophy
  const progressPercent = Math.min((current / achievement.threshold) * 100, 100)

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-title"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="p-8 relative overflow-hidden">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={t('common.cancel')}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Achievement icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg"
                >
                  <Icon className="w-12 h-12 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  id="achievement-title"
                  className="text-3xl font-bold text-center text-gray-800 mb-2"
                >
                  {achievement.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-gray-600 mb-6"
                >
                  {achievement.description}
                </motion.p>

                {/* Progress */}
                {progress < 100 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {t('achievements.progress')}
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {current} / {achievement.threshold}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Success message */}
                {progress >= 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center"
                  >
                    <p className="text-green-800 font-semibold">
                      {t('achievements.achieved')} 🎉
                    </p>
                  </motion.div>
                )}

                {/* Close button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={onClose}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {t('common.save')}
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

