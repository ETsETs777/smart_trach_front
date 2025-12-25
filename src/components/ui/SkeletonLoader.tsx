import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
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
  const baseClasses = 'bg-gray-200 rounded'
  
  const variantClasses = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl p-6 space-y-4',
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
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-32 bg-gray-300 rounded" />
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


