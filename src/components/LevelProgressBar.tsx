import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface LevelProgressBarProps {
  level: number
  progress: number // 0-100
  experience: number
  experienceToNextLevel: number
}

export default function LevelProgressBar({
  level,
  progress,
  experience,
  experienceToNextLevel,
}: LevelProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-bold text-white">Уровень {level}</span>
        </div>
        <span className="text-sm text-white/80">
          {experience} / {experience + experienceToNextLevel} XP
        </span>
      </div>
      <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
        />
      </div>
      <div className="text-xs text-white/60 mt-1">
        До следующего уровня: {experienceToNextLevel} XP
      </div>
    </div>
  )
}

