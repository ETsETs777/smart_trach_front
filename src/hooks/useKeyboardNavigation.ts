/**
 * Keyboard Navigation Hook
 * Provides keyboard navigation support (Tab, Enter, Escape)
 */

import { useEffect, useCallback } from 'react'

interface UseKeyboardNavigationOptions {
  onEnter?: () => void
  onEscape?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  enabled?: boolean
  target?: HTMLElement | null
}

export function useKeyboardNavigation({
  onEnter,
  onEscape,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  enabled = true,
  target,
}: UseKeyboardNavigationOptions = {}) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      switch (event.key) {
        case 'Enter':
          if (onEnter && !event.shiftKey) {
            event.preventDefault()
            onEnter()
          }
          break
        case 'Escape':
          if (onEscape) {
            event.preventDefault()
            onEscape()
          }
          break
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault()
            onArrowUp()
          }
          break
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault()
            onArrowDown()
          }
          break
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault()
            onArrowLeft()
          }
          break
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault()
            onArrowRight()
          }
          break
      }
    },
    [enabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]
  )

  useEffect(() => {
    const element = target || document
    if (enabled) {
      element.addEventListener('keydown', handleKeyDown)
      return () => {
        element.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [enabled, handleKeyDown, target])
}

/**
 * Hook for modal/dialog keyboard navigation
 */
export function useModalKeyboardNavigation(onClose: () => void, enabled = true) {
  useKeyboardNavigation({
    onEscape: onClose,
    enabled,
  })

  // Trap focus within modal
  useEffect(() => {
    if (!enabled) return

    const modal = document.querySelector('[role="dialog"]')
    if (!modal) return

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTabKey)
    firstElement.focus()

    return () => {
      modal.removeEventListener('keydown', handleTabKey)
    }
  }, [enabled])
}



