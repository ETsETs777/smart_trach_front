/**
 * Memoization utilities for expensive computations
 * Provides functions for caching and memoizing heavy calculations
 */

/**
 * Simple memoization function with cache
 * @param fn Function to memoize
 * @param getKey Function to generate cache key from arguments
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Memoize with TTL (Time To Live)
 * @param fn Function to memoize
 * @param ttl Time to live in milliseconds
 * @param getKey Function to generate cache key
 */
export function memoizeWithTTL<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 60000, // 1 minute default
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<
    string,
    { value: ReturnType<T>; expires: number }
  >()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    const cached = cache.get(key)

    if (cached && cached.expires > Date.now()) {
      return cached.value
    }

    const result = fn(...args)
    cache.set(key, {
      value: result,
      expires: Date.now() + ttl,
    })

    // Cleanup expired entries
    if (cache.size > 100) {
      const now = Date.now()
      for (const [k, v] of cache.entries()) {
        if (v.expires <= now) {
          cache.delete(k)
        }
      }
    }

    return result
  }) as T
}

/**
 * Debounce function - delays execution until after wait time
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, wait)
  }
}

/**
 * Throttle function - limits execution to once per wait time
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= wait) {
      lastCall = now
      fn(...args)
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        fn(...args)
        timeoutId = null
      }, wait - timeSinceLastCall)
    }
  }
}

/**
 * Memoize async function
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, Promise<Awaited<ReturnType<T>>>>()

  return ((...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const promise = fn(...args).then(
      (result) => {
        // Cache successful results
        return result
      },
      (error) => {
        // Remove from cache on error
        cache.delete(key)
        throw error
      }
    )

    cache.set(key, promise)
    return promise
  }) as T
}

/**
 * Clear memoization cache
 */
export function clearMemoizationCache(): void {
  // This would need to be called on specific memoized functions
  // For now, it's a placeholder for future implementation
}


 * Memoization utilities for expensive computations
 * Provides functions for caching and memoizing heavy calculations
 */

/**
 * Simple memoization function with cache
 * @param fn Function to memoize
 * @param getKey Function to generate cache key from arguments
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Memoize with TTL (Time To Live)
 * @param fn Function to memoize
 * @param ttl Time to live in milliseconds
 * @param getKey Function to generate cache key
 */
export function memoizeWithTTL<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 60000, // 1 minute default
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<
    string,
    { value: ReturnType<T>; expires: number }
  >()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    const cached = cache.get(key)

    if (cached && cached.expires > Date.now()) {
      return cached.value
    }

    const result = fn(...args)
    cache.set(key, {
      value: result,
      expires: Date.now() + ttl,
    })

    // Cleanup expired entries
    if (cache.size > 100) {
      const now = Date.now()
      for (const [k, v] of cache.entries()) {
        if (v.expires <= now) {
          cache.delete(k)
        }
      }
    }

    return result
  }) as T
}

/**
 * Debounce function - delays execution until after wait time
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, wait)
  }
}

/**
 * Throttle function - limits execution to once per wait time
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= wait) {
      lastCall = now
      fn(...args)
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        fn(...args)
        timeoutId = null
      }, wait - timeSinceLastCall)
    }
  }
}

/**
 * Memoize async function
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, Promise<Awaited<ReturnType<T>>>>()

  return ((...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const promise = fn(...args).then(
      (result) => {
        // Cache successful results
        return result
      },
      (error) => {
        // Remove from cache on error
        cache.delete(key)
        throw error
      }
    )

    cache.set(key, promise)
    return promise
  }) as T
}

/**
 * Clear memoization cache
 */
export function clearMemoizationCache(): void {
  // This would need to be called on specific memoized functions
  // For now, it's a placeholder for future implementation
}


 * Memoization utilities for expensive computations
 * Provides functions for caching and memoizing heavy calculations
 */

/**
 * Simple memoization function with cache
 * @param fn Function to memoize
 * @param getKey Function to generate cache key from arguments
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Memoize with TTL (Time To Live)
 * @param fn Function to memoize
 * @param ttl Time to live in milliseconds
 * @param getKey Function to generate cache key
 */
export function memoizeWithTTL<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 60000, // 1 minute default
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<
    string,
    { value: ReturnType<T>; expires: number }
  >()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    const cached = cache.get(key)

    if (cached && cached.expires > Date.now()) {
      return cached.value
    }

    const result = fn(...args)
    cache.set(key, {
      value: result,
      expires: Date.now() + ttl,
    })

    // Cleanup expired entries
    if (cache.size > 100) {
      const now = Date.now()
      for (const [k, v] of cache.entries()) {
        if (v.expires <= now) {
          cache.delete(k)
        }
      }
    }

    return result
  }) as T
}

/**
 * Debounce function - delays execution until after wait time
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, wait)
  }
}

/**
 * Throttle function - limits execution to once per wait time
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= wait) {
      lastCall = now
      fn(...args)
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        fn(...args)
        timeoutId = null
      }, wait - timeSinceLastCall)
    }
  }
}

/**
 * Memoize async function
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, Promise<Awaited<ReturnType<T>>>>()

  return ((...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = getKey
      ? getKey(...args)
      : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const promise = fn(...args).then(
      (result) => {
        // Cache successful results
        return result
      },
      (error) => {
        // Remove from cache on error
        cache.delete(key)
        throw error
      }
    )

    cache.set(key, promise)
    return promise
  }) as T
}

/**
 * Clear memoization cache
 */
export function clearMemoizationCache(): void {
  // This would need to be called on specific memoized functions
  // For now, it's a placeholder for future implementation
}





