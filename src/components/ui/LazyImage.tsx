import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getOptimizedImageUrl,
  generateSrcSet,
  generateSizes,
  DEFAULT_IMAGE_SIZES,
  DEFAULT_SRCSET_WIDTHS,
} from '@/lib/utils/imageOptimization'

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: React.ReactNode
  threshold?: number
  rootMargin?: string
  responsive?: boolean
  srcsetWidths?: number[]
  sizes?: Array<{ media: string; size: string }>
}

/**
 * Lazy loading image component with intersection observer
 * Loads images only when they enter the viewport
 */
export default function LazyImage({
  src,
  alt,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  responsive = true,
  srcsetWidths = DEFAULT_SRCSET_WIDTHS,
  sizes = DEFAULT_IMAGE_SIZES,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src)
  const imgRef = useRef<HTMLImageElement>(null)

  // Optimize image URL on mount
  useEffect(() => {
    getOptimizedImageUrl(src).then(setOptimizedSrc)
  }, [src])

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  const defaultPlaceholder = (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
      <svg
        className="w-12 h-12 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  )

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} style={props.style}>
      <AnimatePresence mode="wait">
        {!isLoaded && !hasError && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {placeholder || defaultPlaceholder}
          </motion.div>
        )}

        {hasError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <div className="text-center text-gray-400 dark:text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">Failed to load image</p>
            </div>
          </motion.div>
        )}

        {isInView && !hasError && (
          <motion.img
            key="image"
            src={optimizedSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full h-full object-cover ${isLoaded ? '' : 'opacity-0'}`}
            loading="lazy"
            {...(responsive && {
              srcSet: generateSrcSet(optimizedSrc, srcsetWidths),
              sizes: generateSizes(sizes),
            })}
            {...props}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

