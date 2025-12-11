import { TrashBinType, BIN_CONFIGS } from '@/types'
import { motion } from 'framer-motion'

interface BinIconProps {
  type: TrashBinType
  size?: 'sm' | 'md' | 'lg' | 'xl'
  highlighted?: boolean
  onClick?: () => void
}

const sizeClasses = {
  sm: 'w-16 h-16 text-2xl',
  md: 'w-24 h-24 text-4xl',
  lg: 'w-32 h-32 text-5xl',
  xl: 'w-40 h-40 text-6xl',
}

export default function BinIcon({ type, size = 'md', highlighted = false, onClick }: BinIconProps) {
  const config = BIN_CONFIGS[type]
  const sizeClass = sizeClasses[size]

  return (
    <motion.div
      className={`
        ${sizeClass}
        ${config.color}
        rounded-2xl
        flex items-center justify-center
        shadow-lg
        ${highlighted ? 'ring-4 ring-yellow-400 ring-offset-4' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-300
      `}
      whileHover={onClick ? { scale: 1.1, rotate: 5 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      animate={highlighted ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      } : {}}
      transition={{
        duration: 0.5,
        repeat: highlighted ? Infinity : 0,
        repeatType: 'reverse',
      }}
    >
      <span className="text-white drop-shadow-lg">{config.icon}</span>
    </motion.div>
  )
}

