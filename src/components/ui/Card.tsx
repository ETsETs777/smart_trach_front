import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'glass dark:glass-dark rounded-2xl p-6 shadow-lg',
          'bg-white/80 dark:bg-gray-800/80',
          'text-gray-900 dark:text-gray-100',
          hover && 'cursor-pointer',
          className
        )}
        whileHover={hover ? { scale: 1.02, y: -4 } : {}}
        whileTap={hover ? { scale: 0.98 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export default Card






