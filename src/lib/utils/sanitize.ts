/**
 * Client-side sanitization utilities to prevent XSS attacks
 * Note: Server-side sanitization is still required and primary
 */

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Sanitizes user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove null bytes and control characters
  return input
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
}

/**
 * Validates and sanitizes email address
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') {
    return ''
  }

  // Basic email validation and sanitization
  const sanitized = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(sanitized)) {
    return ''
  }

  return sanitized
}

/**
 * Sanitizes URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  const trimmed = url.trim()
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = trimmed.toLowerCase()
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return ''
    }
  }

  // Only allow http, https, and relative URLs
  if (!trimmed.startsWith('http://') && 
      !trimmed.startsWith('https://') && 
      !trimmed.startsWith('/') &&
      !trimmed.startsWith('./') &&
      !trimmed.startsWith('../')) {
    return ''
  }

  return trimmed
}

/**
 * Sanitizes object recursively for display
 */
export function sanitizeObjectForDisplay<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = escapeHtml(sanitized[key]) as any
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      if (Array.isArray(sanitized[key])) {
        sanitized[key] = sanitized[key].map((item: any) =>
          typeof item === 'string' ? escapeHtml(item) : item,
        ) as any
      } else {
        sanitized[key] = sanitizeObjectForDisplay(sanitized[key]) as any
      }
    }
  }

  return sanitized
}




 * Client-side sanitization utilities to prevent XSS attacks
 * Note: Server-side sanitization is still required and primary
 */

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Sanitizes user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove null bytes and control characters
  return input
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
}

/**
 * Validates and sanitizes email address
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') {
    return ''
  }

  // Basic email validation and sanitization
  const sanitized = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(sanitized)) {
    return ''
  }

  return sanitized
}

/**
 * Sanitizes URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  const trimmed = url.trim()
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = trimmed.toLowerCase()
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return ''
    }
  }

  // Only allow http, https, and relative URLs
  if (!trimmed.startsWith('http://') && 
      !trimmed.startsWith('https://') && 
      !trimmed.startsWith('/') &&
      !trimmed.startsWith('./') &&
      !trimmed.startsWith('../')) {
    return ''
  }

  return trimmed
}

/**
 * Sanitizes object recursively for display
 */
export function sanitizeObjectForDisplay<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = escapeHtml(sanitized[key]) as any
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      if (Array.isArray(sanitized[key])) {
        sanitized[key] = sanitized[key].map((item: any) =>
          typeof item === 'string' ? escapeHtml(item) : item,
        ) as any
      } else {
        sanitized[key] = sanitizeObjectForDisplay(sanitized[key]) as any
      }
    }
  }

  return sanitized
}




 * Client-side sanitization utilities to prevent XSS attacks
 * Note: Server-side sanitization is still required and primary
 */

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Sanitizes user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove null bytes and control characters
  return input
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
}

/**
 * Validates and sanitizes email address
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') {
    return ''
  }

  // Basic email validation and sanitization
  const sanitized = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(sanitized)) {
    return ''
  }

  return sanitized
}

/**
 * Sanitizes URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  const trimmed = url.trim()
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = trimmed.toLowerCase()
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return ''
    }
  }

  // Only allow http, https, and relative URLs
  if (!trimmed.startsWith('http://') && 
      !trimmed.startsWith('https://') && 
      !trimmed.startsWith('/') &&
      !trimmed.startsWith('./') &&
      !trimmed.startsWith('../')) {
    return ''
  }

  return trimmed
}

/**
 * Sanitizes object recursively for display
 */
export function sanitizeObjectForDisplay<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = escapeHtml(sanitized[key]) as any
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      if (Array.isArray(sanitized[key])) {
        sanitized[key] = sanitized[key].map((item: any) =>
          typeof item === 'string' ? escapeHtml(item) : item,
        ) as any
      } else {
        sanitized[key] = sanitizeObjectForDisplay(sanitized[key]) as any
      }
    }
  }

  return sanitized
}






