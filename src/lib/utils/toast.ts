/**
 * Enhanced toast notifications with categories
 * Provides typed toast functions for success, error, warning, and info
 */

import toast, { ToastOptions } from 'react-hot-toast'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastConfig extends ToastOptions {
  type?: ToastType
  title?: string
  description?: string
}

/**
 * Get toast styles based on theme
 */
function getToastStyles(isDark: boolean): ToastOptions['style'] {
  return {
    background: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f3f4f6' : '#111827',
    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1rem',
    boxShadow: isDark
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }
}

/**
 * Get icon theme based on type
 */
function getIconTheme(type: ToastType): ToastOptions['iconTheme'] {
  const themes = {
    success: {
      primary: '#22c55e',
      secondary: '#ffffff',
    },
    error: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
    warning: {
      primary: '#f59e0b',
      secondary: '#ffffff',
    },
    info: {
      primary: '#3b82f6',
      secondary: '#ffffff',
    },
  }
  return themes[type]
}

/**
 * Enhanced toast function with categories
 */
export function showToast(
  message: string,
  type: ToastType = 'info',
  options?: ToastOptions
): string {
  // Try to get theme from document (fallback if ThemeProvider not available)
  const isDark = document.documentElement.classList.contains('dark')

  const baseOptions: ToastOptions = {
    duration: type === 'error' ? 5000 : type === 'warning' ? 4000 : 3000,
    style: getToastStyles(isDark),
    iconTheme: getIconTheme(type),
    ...options,
  }

  switch (type) {
    case 'success':
      return toast.success(message, baseOptions)
    case 'error':
      return toast.error(message, baseOptions)
    case 'warning':
      return toast(message, {
        ...baseOptions,
        icon: '⚠️',
      })
    case 'info':
      return toast(message, {
        ...baseOptions,
        icon: 'ℹ️',
      })
    default:
      return toast(message, baseOptions)
  }
}

/**
 * Success toast
 */
export function toastSuccess(message: string, options?: ToastOptions): string {
  return showToast(message, 'success', options)
}

/**
 * Error toast
 */
export function toastError(message: string, options?: ToastOptions): string {
  return showToast(message, 'error', options)
}

/**
 * Warning toast
 */
export function toastWarning(message: string, options?: ToastOptions): string {
  return showToast(message, 'warning', options)
}

/**
 * Info toast
 */
export function toastInfo(message: string, options?: ToastOptions): string {
  return showToast(message, 'info', options)
}

/**
 * Dismiss toast by ID
 */
export function dismissToast(toastId: string): void {
  toast.dismiss(toastId)
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts(): void {
  toast.dismiss()
}


 * Provides typed toast functions for success, error, warning, and info
 */

import toast, { ToastOptions } from 'react-hot-toast'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastConfig extends ToastOptions {
  type?: ToastType
  title?: string
  description?: string
}

/**
 * Get toast styles based on theme
 */
function getToastStyles(isDark: boolean): ToastOptions['style'] {
  return {
    background: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f3f4f6' : '#111827',
    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1rem',
    boxShadow: isDark
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }
}

/**
 * Get icon theme based on type
 */
function getIconTheme(type: ToastType): ToastOptions['iconTheme'] {
  const themes = {
    success: {
      primary: '#22c55e',
      secondary: '#ffffff',
    },
    error: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
    warning: {
      primary: '#f59e0b',
      secondary: '#ffffff',
    },
    info: {
      primary: '#3b82f6',
      secondary: '#ffffff',
    },
  }
  return themes[type]
}

/**
 * Enhanced toast function with categories
 */
export function showToast(
  message: string,
  type: ToastType = 'info',
  options?: ToastOptions
): string {
  // Try to get theme from document (fallback if ThemeProvider not available)
  const isDark = document.documentElement.classList.contains('dark')

  const baseOptions: ToastOptions = {
    duration: type === 'error' ? 5000 : type === 'warning' ? 4000 : 3000,
    style: getToastStyles(isDark),
    iconTheme: getIconTheme(type),
    ...options,
  }

  switch (type) {
    case 'success':
      return toast.success(message, baseOptions)
    case 'error':
      return toast.error(message, baseOptions)
    case 'warning':
      return toast(message, {
        ...baseOptions,
        icon: '⚠️',
      })
    case 'info':
      return toast(message, {
        ...baseOptions,
        icon: 'ℹ️',
      })
    default:
      return toast(message, baseOptions)
  }
}

/**
 * Success toast
 */
export function toastSuccess(message: string, options?: ToastOptions): string {
  return showToast(message, 'success', options)
}

/**
 * Error toast
 */
export function toastError(message: string, options?: ToastOptions): string {
  return showToast(message, 'error', options)
}

/**
 * Warning toast
 */
export function toastWarning(message: string, options?: ToastOptions): string {
  return showToast(message, 'warning', options)
}

/**
 * Info toast
 */
export function toastInfo(message: string, options?: ToastOptions): string {
  return showToast(message, 'info', options)
}

/**
 * Dismiss toast by ID
 */
export function dismissToast(toastId: string): void {
  toast.dismiss(toastId)
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts(): void {
  toast.dismiss()
}


 * Provides typed toast functions for success, error, warning, and info
 */

import toast, { ToastOptions } from 'react-hot-toast'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastConfig extends ToastOptions {
  type?: ToastType
  title?: string
  description?: string
}

/**
 * Get toast styles based on theme
 */
function getToastStyles(isDark: boolean): ToastOptions['style'] {
  return {
    background: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f3f4f6' : '#111827',
    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1rem',
    boxShadow: isDark
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }
}

/**
 * Get icon theme based on type
 */
function getIconTheme(type: ToastType): ToastOptions['iconTheme'] {
  const themes = {
    success: {
      primary: '#22c55e',
      secondary: '#ffffff',
    },
    error: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
    warning: {
      primary: '#f59e0b',
      secondary: '#ffffff',
    },
    info: {
      primary: '#3b82f6',
      secondary: '#ffffff',
    },
  }
  return themes[type]
}

/**
 * Enhanced toast function with categories
 */
export function showToast(
  message: string,
  type: ToastType = 'info',
  options?: ToastOptions
): string {
  // Try to get theme from document (fallback if ThemeProvider not available)
  const isDark = document.documentElement.classList.contains('dark')

  const baseOptions: ToastOptions = {
    duration: type === 'error' ? 5000 : type === 'warning' ? 4000 : 3000,
    style: getToastStyles(isDark),
    iconTheme: getIconTheme(type),
    ...options,
  }

  switch (type) {
    case 'success':
      return toast.success(message, baseOptions)
    case 'error':
      return toast.error(message, baseOptions)
    case 'warning':
      return toast(message, {
        ...baseOptions,
        icon: '⚠️',
      })
    case 'info':
      return toast(message, {
        ...baseOptions,
        icon: 'ℹ️',
      })
    default:
      return toast(message, baseOptions)
  }
}

/**
 * Success toast
 */
export function toastSuccess(message: string, options?: ToastOptions): string {
  return showToast(message, 'success', options)
}

/**
 * Error toast
 */
export function toastError(message: string, options?: ToastOptions): string {
  return showToast(message, 'error', options)
}

/**
 * Warning toast
 */
export function toastWarning(message: string, options?: ToastOptions): string {
  return showToast(message, 'warning', options)
}

/**
 * Info toast
 */
export function toastInfo(message: string, options?: ToastOptions): string {
  return showToast(message, 'info', options)
}

/**
 * Dismiss toast by ID
 */
export function dismissToast(toastId: string): void {
  toast.dismiss(toastId)
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts(): void {
  toast.dismiss()
}

