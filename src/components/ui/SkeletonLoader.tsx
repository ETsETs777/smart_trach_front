import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table' | 'list'
  width?: string | number
  height?: string | number
  count?: number
  animated?: boolean
}

export default function SkeletonLoader({
  className = '',
  variant = 'rectangular',
  width,
  height,
  count = 1,
  animated = true,
}: SkeletonLoaderProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded'
  
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl p-6 space-y-4',
    table: 'rounded-lg',
    list: 'rounded-lg space-y-2',
  }

  const skeletonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`

  const skeletonStyle = {
    width: width || (variant === 'text' ? '100%' : variant === 'circular' ? height || '40px' : '100%'),
    height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? width || '40px' : '200px'),
  }

  const animationVariants = animated
    ? {
        initial: { opacity: 0.6 },
        animate: {
          opacity: [0.6, 1, 0.6],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
      }
    : {}

  if (variant === 'card') {
    return (
      <div className={skeletonClasses} style={skeletonStyle}>
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            variants={animationVariants}
            initial="initial"
            animate="animate"
            className="space-y-3"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
            <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded" />
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count || 5 }).map((_, index) => (
          <motion.div
            key={index}
            variants={animationVariants}
            initial="initial"
            animate="animate"
            className="flex gap-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={skeletonClasses} style={skeletonStyle}>
        {Array.from({ length: count || 3 }).map((_, index) => (
          <motion.div
            key={index}
            variants={animationVariants}
            initial="initial"
            animate="animate"
            className="flex items-center gap-3 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={skeletonClasses}
          style={skeletonStyle}
          variants={animationVariants}
          initial="initial"
          animate="animate"
        />
      ))}
    </>
  )
}


