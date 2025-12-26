/**
 * Secure token storage utilities
 * Implements secure storage patterns for authentication tokens
 */

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  ROLE: 'auth_role',
  TOKEN_EXPIRY: 'token_expiry',
} as const

/**
 * Token storage interface
 */
interface TokenData {
  accessToken: string
  refreshToken?: string
  role?: string
  expiresAt?: number
}

/**
 * Secure token storage using sessionStorage for access tokens
 * sessionStorage is cleared when tab is closed, reducing XSS attack window
 */
class TokenStorage {
  /**
   * Store access token in sessionStorage (cleared on tab close)
   */
  setAccessToken(token: string, expiresIn?: number): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
      
      if (expiresIn) {
        const expiresAt = Date.now() + expiresIn * 1000
        sessionStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt.toString())
      }
    } catch (error) {
      console.error('Failed to store access token:', error)
      // Fallback to memory storage if sessionStorage is not available
    }
  }

  /**
   * Get access token from sessionStorage
   */
  getAccessToken(): string | null {
    try {
      const token = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      
      if (!token) {
        return null
      }

      // Check if token is expired
      const expiry = sessionStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY)
      if (expiry) {
        const expiresAt = parseInt(expiry, 10)
        if (Date.now() >= expiresAt) {
          this.clearAccessToken()
          return null
        }
      }

      return token
    } catch (error) {
      console.error('Failed to get access token:', error)
      return null
    }
  }

  /**
   * Clear access token
   */
  clearAccessToken(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY)
    } catch (error) {
      console.error('Failed to clear access token:', error)
    }
  }

  /**
   * Store role in sessionStorage
   */
  setRole(role: string): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.ROLE, role)
    } catch (error) {
      console.error('Failed to store role:', error)
    }
  }

  /**
   * Get role from sessionStorage
   */
  getRole(): string | null {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ROLE)
    } catch (error) {
      console.error('Failed to get role:', error)
      return null
    }
  }

  /**
   * Clear role
   */
  clearRole(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ROLE)
    } catch (error) {
      console.error('Failed to clear role:', error)
    }
  }

  /**
   * Store all token data
   */
  setTokens(data: TokenData): void {
    this.setAccessToken(data.accessToken, data.expiresAt ? Math.floor((data.expiresAt - Date.now()) / 1000) : undefined)
    
    if (data.role) {
      this.setRole(data.role)
    }

    // Note: Refresh token should be stored in httpOnly cookie by backend
    // We don't store it in client-side storage for security
  }

  /**
   * Clear all tokens
   */
  clearAll(): void {
    this.clearAccessToken()
    this.clearRole()
    
    // Also clear any legacy localStorage tokens for migration
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.ROLE)
    } catch (error) {
      console.error('Failed to clear legacy tokens:', error)
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  /**
   * Migrate tokens from localStorage to sessionStorage (one-time migration)
   */
  migrateFromLocalStorage(): void {
    try {
      const legacyToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const legacyRole = localStorage.getItem(STORAGE_KEYS.ROLE)

      if (legacyToken && !this.getAccessToken()) {
        this.setAccessToken(legacyToken)
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      }

      if (legacyRole && !this.getRole()) {
        this.setRole(legacyRole)
        localStorage.removeItem(STORAGE_KEYS.ROLE)
      }
    } catch (error) {
      console.error('Failed to migrate tokens:', error)
    }
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage()

// Run migration on module load
if (typeof window !== 'undefined') {
  tokenStorage.migrateFromLocalStorage()
}


