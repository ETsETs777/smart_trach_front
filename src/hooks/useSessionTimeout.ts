/**
 * Hook for managing session timeout
 * Automatically logs out user after period of inactivity
 */

import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokenStorage } from '@/lib/auth/tokenStorage'
import { toastWarning, toastInfo } from '@/lib/utils/toast'
import { useTranslation } from 'react-i18next'

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number // Total session timeout
  warningMinutes?: number // Show warning before timeout
  onTimeout?: () => void // Callback when session times out
  enabled?: boolean // Enable/disable timeout
}

const DEFAULT_TIMEOUT_MINUTES = 30 // 30 minutes
const DEFAULT_WARNING_MINUTES = 5 // Warn 5 minutes before timeout

export function useSessionTimeout(options: UseSessionTimeoutOptions = {}) {
  const {
    timeoutMinutes = DEFAULT_TIMEOUT_MINUTES,
    warningMinutes = DEFAULT_WARNING_MINUTES,
    onTimeout,
    enabled = true,
  } = options

  const navigate = useNavigate()
  const { t } = useTranslation()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActivityRef = useRef<number>(Date.now())
  const warningShownRef = useRef<boolean>(false)

  const resetTimeout = useCallback(() => {
    if (!enabled || !tokenStorage.isAuthenticated()) {
      return
    }

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
    }

    lastActivityRef.current = Date.now()
    warningShownRef.current = false

    const timeoutMs = timeoutMinutes * 60 * 1000
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000

    // Set warning timeout
    if (warningMs > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        if (tokenStorage.isAuthenticated() && !warningShownRef.current) {
          warningShownRef.current = true
          toastWarning(
            t('session.warning', { minutes: warningMinutes }) ||
              `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
            { duration: 10000 },
          )
        }
      }, warningMs)
    }

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      if (tokenStorage.isAuthenticated()) {
        tokenStorage.clearAll()
        toastInfo(
          t('session.expired') || 'Your session has expired due to inactivity. Please log in again.',
        )
        
        if (onTimeout) {
          onTimeout()
        } else {
          navigate('/login')
        }
      }
    }, timeoutMs)
  }, [enabled, timeoutMinutes, warningMinutes, navigate, onTimeout, t])

  const handleActivity = useCallback(() => {
    const now = Date.now()
    const timeSinceLastActivity = now - lastActivityRef.current

    // Only reset if there was significant activity (more than 1 second)
    if (timeSinceLastActivity > 1000) {
      resetTimeout()
    }
  }, [resetTimeout])

  useEffect(() => {
    if (!enabled || !tokenStorage.isAuthenticated()) {
      return
    }

    // Initialize timeout on mount
    resetTimeout()

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current)
      }
    }
  }, [enabled, resetTimeout, handleActivity])

  return {
    resetTimeout,
    getTimeUntilExpiry: () => {
      if (!enabled || !tokenStorage.isAuthenticated()) {
        return null
      }
      const elapsed = Date.now() - lastActivityRef.current
      const remaining = timeoutMinutes * 60 * 1000 - elapsed
      return remaining > 0 ? remaining : 0
    },
  }
}

