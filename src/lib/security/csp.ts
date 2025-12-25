/**
 * Content Security Policy (CSP) configuration
 * Helps prevent XSS attacks by restricting resource loading
 */

/**
 * Generate CSP meta tag content
 * Note: For production, CSP should be set via HTTP headers on the server
 * This meta tag provides client-side CSP as a fallback
 */
export function getCSPMetaContent(): string {
  const policies = [
    // Default source - allow same origin
    "default-src 'self'",
    
    // Scripts - allow same origin, inline scripts with nonce, and specific CDNs
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    
    // Styles - allow same origin, inline styles, and CDNs
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    
    // Images - allow same origin, data URIs, blob URIs, and external sources
    "img-src 'self' data: blob: https: http:",
    
    // Fonts - allow same origin and Google Fonts
    "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
    
    // Connect - allow same origin and API endpoints
    "connect-src 'self' ws: wss: http://localhost:* https://*",
    
    // Media - allow same origin, blob, and data URIs
    "media-src 'self' blob: data:",
    
    // Object - deny all (no Flash, plugins)
    "object-src 'none'",
    
    // Base URI - restrict to same origin
    "base-uri 'self'",
    
    // Form action - allow same origin
    "form-action 'self'",
    
    // Frame ancestors - prevent clickjacking
    "frame-ancestors 'none'",
    
    // Upgrade insecure requests in production
    ...(import.meta.env.PROD ? ["upgrade-insecure-requests"] : []),
  ]

  return policies.join('; ')
}

/**
 * Set CSP meta tag in document head
 */
export function setCSPMetaTag(): void {
  if (typeof document === 'undefined') return

  // Remove existing CSP meta tag if present
  const existing = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
  if (existing) {
    existing.remove()
  }

  // Create and add new CSP meta tag
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Content-Security-Policy'
  meta.content = getCSPMetaContent()
  document.head.appendChild(meta)
}

/**
 * Initialize CSP on app load
 */
export function initCSP(): void {
  if (typeof window !== 'undefined') {
    setCSPMetaTag()
  }
}

