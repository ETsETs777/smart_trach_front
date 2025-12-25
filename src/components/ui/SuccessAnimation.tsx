import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface SuccessAnimationProps {
  message?: string
  onComplete?: () => void
}

/**
 * Success animation component for user feedback
 */
export default function SuccessAnimation({ message, onComplete }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      onAnimationComplete={onComplete}
      className="flex flex-col items-center justify-center gap-3 p-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
        className="relative"
      >
        <CheckCircle className="w-16 h-16 text-green-500" />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0] }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="absolute inset-0 rounded-full bg-green-500"
        />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-semibold text-gray-800"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  )
}

