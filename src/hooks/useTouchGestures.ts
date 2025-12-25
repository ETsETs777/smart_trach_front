import { useEffect, useRef, useState } from 'react'

interface TouchGestureState {
  isTouching: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
}

interface UseTouchGesturesOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  swipeThreshold?: number
  enabled?: boolean
}

/**
 * Hook for handling touch gestures (swipe, tap, etc.)
 * Useful for mobile navigation and interactions
 */
export function useTouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  enabled = true,
}: UseTouchGesturesOptions = {}) {
  const [gestureState, setGestureState] = useState<TouchGestureState>({
    isTouching: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
  })

  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!enabled) return

    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      setGestureState({
        isTouching: true,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
      })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!gestureState.isTouching) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - gestureState.startX
      const deltaY = touch.clientY - gestureState.startY

      setGestureState((prev) => ({
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX,
        deltaY,
      }))
    }

    const handleTouchEnd = () => {
      if (!gestureState.isTouching) return

      const { deltaX, deltaY } = gestureState
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Determine swipe direction
      if (absX > swipeThreshold || absY > swipeThreshold) {
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipeRight?.()
          } else {
            onSwipeLeft?.()
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipeDown?.()
          } else {
            onSwipeUp?.()
          }
        }
      }

      setGestureState({
        isTouching: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        deltaX: 0,
        deltaY: 0,
      })
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, gestureState.isTouching, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, swipeThreshold])

  return {
    ref: elementRef,
    gestureState,
  }
}

