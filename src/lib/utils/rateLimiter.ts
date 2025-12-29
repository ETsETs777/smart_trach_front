/**
 * Client-side rate limiter
 * Prevents spam and abuse by limiting request frequency
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly defaultWindow = 60000 // 1 minute
  private readonly defaultMaxRequests = 10

  /**
   * Check if request is allowed
   * @param key - Unique identifier for the rate limit (e.g., 'login', 'upload')
   * @param maxRequests - Maximum requests allowed in the window
   * @param windowMs - Time window in milliseconds
   * @returns true if allowed, false if rate limited
   */
  isAllowed(
    key: string,
    maxRequests: number = this.defaultMaxRequests,
    windowMs: number = this.defaultWindow,
  ): boolean {
    const now = Date.now()
    const entry = this.limits.get(key)

    // No entry or window expired - allow and create new entry
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      return false
    }

    // Increment count
    entry.count++
    return true
  }

  /**
   * Get remaining requests in current window
   */
  getRemaining(key: string, maxRequests: number = this.defaultMaxRequests): number {
    const entry = this.limits.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - entry.count)
  }

  /**
   * Get time until reset
   */
  getResetTime(key: string): number | null {
    const entry = this.limits.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return null
    }
    return entry.resetTime - Date.now()
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key)
  }

  /**
   * Clear all rate limits
   */
  clear(): void {
    this.limits.clear()
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()

/**
 * Rate limit configuration for different operations
 */
export const RATE_LIMITS = {
  LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  REGISTER: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  UPLOAD: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 uploads per minute
  PASSWORD_RESET: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  EMAIL_CONFIRM: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  API_CALL: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 calls per minute
} as const

/**
 * Decorator function for rate limiting async operations
 */
export async function withRateLimit<T>(
  key: string,
  operation: () => Promise<T>,
  maxRequests?: number,
  windowMs?: number,
): Promise<T> {
  const config = RATE_LIMITS[key as keyof typeof RATE_LIMITS] || {
    maxRequests: maxRequests || 10,
    windowMs: windowMs || 60000,
  }

  if (!rateLimiter.isAllowed(key, config.maxRequests, config.windowMs)) {
    const remaining = rateLimiter.getRemaining(key, config.maxRequests)
    const resetTime = rateLimiter.getResetTime(key)
    throw new Error(
      `Rate limit exceeded. Try again in ${resetTime ? Math.ceil(resetTime / 1000) : 60} seconds.`,
    )
  }

  try {
    return await operation()
  } catch (error) {
    // On error, don't count towards rate limit (optional - depends on use case)
    throw error
  }
}

 * Client-side rate limiter
 * Prevents spam and abuse by limiting request frequency
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly defaultWindow = 60000 // 1 minute
  private readonly defaultMaxRequests = 10

  /**
   * Check if request is allowed
   * @param key - Unique identifier for the rate limit (e.g., 'login', 'upload')
   * @param maxRequests - Maximum requests allowed in the window
   * @param windowMs - Time window in milliseconds
   * @returns true if allowed, false if rate limited
   */
  isAllowed(
    key: string,
    maxRequests: number = this.defaultMaxRequests,
    windowMs: number = this.defaultWindow,
  ): boolean {
    const now = Date.now()
    const entry = this.limits.get(key)

    // No entry or window expired - allow and create new entry
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      return false
    }

    // Increment count
    entry.count++
    return true
  }

  /**
   * Get remaining requests in current window
   */
  getRemaining(key: string, maxRequests: number = this.defaultMaxRequests): number {
    const entry = this.limits.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - entry.count)
  }

  /**
   * Get time until reset
   */
  getResetTime(key: string): number | null {
    const entry = this.limits.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return null
    }
    return entry.resetTime - Date.now()
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key)
  }

  /**
   * Clear all rate limits
   */
  clear(): void {
    this.limits.clear()
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()

/**
 * Rate limit configuration for different operations
 */
export const RATE_LIMITS = {
  LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  REGISTER: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  UPLOAD: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 uploads per minute
  PASSWORD_RESET: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  EMAIL_CONFIRM: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  API_CALL: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 calls per minute
} as const

/**
 * Decorator function for rate limiting async operations
 */
export async function withRateLimit<T>(
  key: string,
  operation: () => Promise<T>,
  maxRequests?: number,
  windowMs?: number,
): Promise<T> {
  const config = RATE_LIMITS[key as keyof typeof RATE_LIMITS] || {
    maxRequests: maxRequests || 10,
    windowMs: windowMs || 60000,
  }

  if (!rateLimiter.isAllowed(key, config.maxRequests, config.windowMs)) {
    const remaining = rateLimiter.getRemaining(key, config.maxRequests)
    const resetTime = rateLimiter.getResetTime(key)
    throw new Error(
      `Rate limit exceeded. Try again in ${resetTime ? Math.ceil(resetTime / 1000) : 60} seconds.`,
    )
  }

  try {
    return await operation()
  } catch (error) {
    // On error, don't count towards rate limit (optional - depends on use case)
    throw error
  }
}

 * Client-side rate limiter
 * Prevents spam and abuse by limiting request frequency
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly defaultWindow = 60000 // 1 minute
  private readonly defaultMaxRequests = 10

  /**
   * Check if request is allowed
   * @param key - Unique identifier for the rate limit (e.g., 'login', 'upload')
   * @param maxRequests - Maximum requests allowed in the window
   * @param windowMs - Time window in milliseconds
   * @returns true if allowed, false if rate limited
   */
  isAllowed(
    key: string,
    maxRequests: number = this.defaultMaxRequests,
    windowMs: number = this.defaultWindow,
  ): boolean {
    const now = Date.now()
    const entry = this.limits.get(key)

    // No entry or window expired - allow and create new entry
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      return false
    }

    // Increment count
    entry.count++
    return true
  }

  /**
   * Get remaining requests in current window
   */
  getRemaining(key: string, maxRequests: number = this.defaultMaxRequests): number {
    const entry = this.limits.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - entry.count)
  }

  /**
   * Get time until reset
   */
  getResetTime(key: string): number | null {
    const entry = this.limits.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return null
    }
    return entry.resetTime - Date.now()
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key)
  }

  /**
   * Clear all rate limits
   */
  clear(): void {
    this.limits.clear()
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()

/**
 * Rate limit configuration for different operations
 */
export const RATE_LIMITS = {
  LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  REGISTER: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  UPLOAD: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 uploads per minute
  PASSWORD_RESET: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  EMAIL_CONFIRM: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  API_CALL: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 calls per minute
} as const

/**
 * Decorator function for rate limiting async operations
 */
export async function withRateLimit<T>(
  key: string,
  operation: () => Promise<T>,
  maxRequests?: number,
  windowMs?: number,
): Promise<T> {
  const config = RATE_LIMITS[key as keyof typeof RATE_LIMITS] || {
    maxRequests: maxRequests || 10,
    windowMs: windowMs || 60000,
  }

  if (!rateLimiter.isAllowed(key, config.maxRequests, config.windowMs)) {
    const remaining = rateLimiter.getRemaining(key, config.maxRequests)
    const resetTime = rateLimiter.getResetTime(key)
    throw new Error(
      `Rate limit exceeded. Try again in ${resetTime ? Math.ceil(resetTime / 1000) : 60} seconds.`,
    )
  }

  try {
    return await operation()
  } catch (error) {
    // On error, don't count towards rate limit (optional - depends on use case)
    throw error
  }
}




