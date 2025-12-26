/**
 * CSRF token management for client-side
 * Handles CSRF token retrieval and inclusion in requests
 */

let csrfToken: string | null = null
let tokenExpiry: number = 0
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch CSRF token from server
 */
export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const response = await fetch(`${apiUrl}/auth/csrf-token`, {
      method: 'GET',
      credentials: 'include', // Include cookies
    })

    if (!response.ok) {
      console.warn('Failed to fetch CSRF token:', response.statusText)
      return null
    }

    const data = await response.json()
    csrfToken = data.token || null
    tokenExpiry = Date.now() + (data.expiresIn || 3600000) // Default 1 hour

    return csrfToken
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
    return null
  }
}

/**
 * Get current CSRF token, fetching if needed
 */
export async function getCsrfToken(): Promise<string | null> {
  // Return cached token if still valid
  if (csrfToken && Date.now() < tokenExpiry) {
    return csrfToken
  }

  // Fetch new token
  return await fetchCsrfToken()
}

/**
 * Clear CSRF token cache
 */
export function clearCsrfToken(): void {
  csrfToken = null
  tokenExpiry = 0
}

/**
 * Get CSRF token synchronously (may return null if not fetched yet)
 */
export function getCsrfTokenSync(): string | null {
  return csrfToken && Date.now() < tokenExpiry ? csrfToken : null
}

/**
 * Initialize CSRF token on app load
 */
export async function initializeCsrfToken(): Promise<void> {
  try {
    await fetchCsrfToken()
    
    // Set up periodic refresh
    setInterval(async () => {
      if (Date.now() >= tokenExpiry - TOKEN_REFRESH_INTERVAL) {
        await fetchCsrfToken()
      }
    }, TOKEN_REFRESH_INTERVAL)
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error)
  }
}


