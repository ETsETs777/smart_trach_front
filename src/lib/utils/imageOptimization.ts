/**
 * Image optimization utilities
 * Provides functions for WebP support detection, responsive images, and image optimization
 */

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

/**
 * Get WebP version of image URL if supported
 * @param url Original image URL
 * @returns WebP URL or original URL
 */
export async function getOptimizedImageUrl(url: string): Promise<string> {
  if (!url) return url

  // If URL already contains format, return as is
  if (url.includes('.webp') || url.includes('.svg')) {
    return url
  }

  // Check WebP support
  const webPSupported = await supportsWebP()

  if (webPSupported) {
    // Try to get WebP version (assuming backend supports it)
    // For now, return original URL - backend should handle conversion
    return url
  }

  return url
}

/**
 * Generate srcset for responsive images
 * @param baseUrl Base image URL
 * @param sizes Array of sizes in pixels
 * @returns srcset string
 */
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes
    .map((size) => {
      // Assuming backend supports size parameters
      // Adjust based on your backend API
      const separator = baseUrl.includes('?') ? '&' : '?'
      return `${baseUrl}${separator}w=${size} ${size}w`
    })
    .join(', ')
}

/**
 * Generate sizes attribute for responsive images
 * @param breakpoints Array of breakpoint objects with media query and size
 * @returns sizes string
 */
export function generateSizes(
  breakpoints: Array<{ media: string; size: string }>
): string {
  return breakpoints.map((bp) => `${bp.media} ${bp.size}`).join(', ')
}

/**
 * Default responsive image sizes
 */
export const DEFAULT_IMAGE_SIZES = [
  { media: '(max-width: 640px)', size: '100vw' },
  { media: '(max-width: 1024px)', size: '50vw' },
  { media: '(min-width: 1025px)', size: '33vw' },
]

/**
 * Default srcset widths for responsive images
 */
export const DEFAULT_SRCSET_WIDTHS = [320, 640, 960, 1280, 1920]

/**
 * Get optimized image props for img tag
 */
export async function getOptimizedImageProps(
  url: string,
  alt: string,
  options?: {
    sizes?: Array<{ media: string; size: string }>
    srcsetWidths?: number[]
    loading?: 'lazy' | 'eager'
  }
) {
  const optimizedUrl = await getOptimizedImageUrl(url)
  const sizes = options?.sizes || DEFAULT_IMAGE_SIZES
  const srcsetWidths = options?.srcsetWidths || DEFAULT_SRCSET_WIDTHS

  return {
    src: optimizedUrl,
    alt,
    srcSet: generateSrcSet(optimizedUrl, srcsetWidths),
    sizes: generateSizes(sizes),
    loading: options?.loading || 'lazy',
  }
}


