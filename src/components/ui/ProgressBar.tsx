import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
  animated?: boolean
  ariaLabel?: string
}

export default function ProgressBar({
  progress,
  className = '',
  showLabel = true,
  animated = true,
  ariaLabel,
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayProgress(progress)
    }
  }, [progress, animated])

  const clampedProgress = Math.min(Math.max(displayProgress, 0), 100)

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100} aria-label={ariaLabel || `Progress: ${clampedProgress}%`}>
          {showLabel && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ariaLabel || 'Progress'}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(clampedProgress)}%</span>
            </div>
          )}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
