import { useEffect, useState, useCallback } from 'react'
import { pushNotificationService, PushNotificationOptions } from '@/lib/pushNotifications'
import { logger } from '@/lib/logger'

export interface UsePushNotificationsReturn {
  isSupported: boolean
  hasPermission: boolean
  isSubscribed: boolean
  requestPermission: () => Promise<boolean>
  showNotification: (options: PushNotificationOptions) => Promise<void>
  subscribe: () => Promise<boolean>
  unsubscribe: () => Promise<boolean>
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const init = async () => {
      const supported = pushNotificationService.isSupported()
      setIsSupported(supported)

      if (supported) {
        const initialized = await pushNotificationService.initialize()
        setHasPermission(initialized)

        // Check if already subscribed
        const subscription = await pushNotificationService.getSubscription()
        setIsSubscribed(!!subscription)
      }
    }

    init()
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await pushNotificationService.requestPermission()
    setHasPermission(granted)
    return granted
  }, [])

  const showNotification = useCallback(
    async (options: PushNotificationOptions): Promise<void> => {
      try {
        await pushNotificationService.showNotification(options)
      } catch (error) {
        logger.error('Failed to show notification', { error })
      }
    },
    [],
  )

  const subscribe = useCallback(async (): Promise<boolean> => {
    try {
      const subscription = await pushNotificationService.subscribeToPush()
      setIsSubscribed(!!subscription)

      if (subscription) {
        // Here you would typically send the subscription to your backend
        // to store it and send push notifications later
        logger.log('Push subscription created', { subscription })
        return true
      }
      return false
    } catch (error) {
      logger.error('Failed to subscribe to push notifications', { error })
      return false
    }
  }, [])

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      const success = await pushNotificationService.unsubscribeFromPush()
      setIsSubscribed(!success)
      return success
    } catch (error) {
      logger.error('Failed to unsubscribe from push notifications', { error })
      return false
    }
  }, [])

  return {
    isSupported,
    hasPermission,
    isSubscribed,
    requestPermission,
    showNotification,
    subscribe,
    unsubscribe,
  }
}

