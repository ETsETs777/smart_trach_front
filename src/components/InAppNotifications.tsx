import { useState, useEffect } from 'react'
import { useSubscription, useQuery } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Award, Trophy, TrendingUp, CheckCircle2 } from 'lucide-react'
import { ACHIEVEMENT_EARNED_SUBSCRIPTION, LEVEL_UP_SUBSCRIPTION } from '@/lib/graphql/subscriptions'
import { GET_ME } from '@/lib/graphql/queries'
import { useWasteStore } from '@/store/useWasteStore'
import { pushNotificationService } from '@/lib/pushNotifications'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export interface Notification {
  id: string
  type: 'achievement' | 'level_up' | 'rank_change' | 'challenge_completed'
  title: string
  message: string
  timestamp: Date
  read: boolean
  data?: any
}

interface InAppNotificationsProps {
  maxVisible?: number
  autoHide?: boolean
  autoHideDelay?: number
}

export default function InAppNotifications({
  maxVisible = 5,
  autoHide = true,
  autoHideDelay = 5000,
}: InAppNotificationsProps) {
  const { companyId } = useWasteStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Get current user ID
  const { data: meData } = useQuery(GET_ME, {
    skip: false,
  })
  const currentUserId = meData?.me?.id

  // Subscribe to achievement earned events
  const { data: achievementData } = useSubscription(ACHIEVEMENT_EARNED_SUBSCRIPTION, {
    variables: { companyId: companyId || null },
    skip: !companyId,
  })

  // Subscribe to level up events
  const { data: levelUpData } = useSubscription(LEVEL_UP_SUBSCRIPTION, {
    variables: { userId: currentUserId || '' },
    skip: !currentUserId,
  })

  useEffect(() => {
    if (achievementData?.achievementEarned) {
      const payload = achievementData.achievementEarned
      const notification: Notification = {
        id: `achievement-${payload.employeeAchievement.id}-${Date.now()}`,
        type: 'achievement',
        title: 'Новая ачивка! 🎉',
        message: `Вы получили ачивку "${payload.achievement.title}"`,
        timestamp: new Date(),
        read: false,
        data: payload,
      }

      addNotification(notification)

      // Show push notification
      pushNotificationService.showNotification({
        title: notification.title,
        body: notification.message,
        icon: '/icon-192x192.png',
        tag: 'achievement',
      })
    }
  }, [achievementData])

  useEffect(() => {
    if (levelUpData?.levelUp) {
      const payload = levelUpData.levelUp
      const notification: Notification = {
        id: `level-up-${payload.user.id}-${Date.now()}`,
        type: 'level_up',
        title: 'Повышение уровня! ⬆️',
        message: `Поздравляем! Вы достигли уровня ${payload.newLevel}`,
        timestamp: new Date(),
        read: false,
        data: payload,
      }

      addNotification(notification)

      // Show push notification
      pushNotificationService.showNotification({
        title: notification.title,
        body: notification.message,
        icon: '/icon-192x192.png',
        tag: 'level-up',
      })
    }
  }, [levelUpData])

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => {
      const newNotifications = [notification, ...prev]
      return newNotifications.slice(0, 50) // Keep max 50 notifications
    })

    if (autoHide) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, autoHideDelay)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const visibleNotifications = notifications.slice(0, maxVisible)

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return Award
      case 'level_up':
        return TrendingUp
      case 'rank_change':
        return Trophy
      case 'challenge_completed':
        return CheckCircle2
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return 'bg-yellow-500/20 border-yellow-400/50'
      case 'level_up':
        return 'bg-blue-500/20 border-blue-400/50'
      case 'rank_change':
        return 'bg-purple-500/20 border-purple-400/50'
      case 'challenge_completed':
        return 'bg-green-500/20 border-green-400/50'
      default:
        return 'bg-white/10 border-white/20'
    }
  }

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative text-white hover:bg-white/20"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </Button>

        {/* Notifications Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-y-auto z-50"
            >
              <Card className="p-0 border-white/20 shadow-xl">
                <div className="p-4 border-b border-white/20 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Уведомления</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-white/80 hover:text-white"
                      >
                        Отметить все как прочитанные
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {visibleNotifications.length === 0 ? (
                    <div className="p-8 text-center text-white/60">
                      <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Нет уведомлений</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {visibleNotifications.map((notification) => {
                        const Icon = getNotificationIcon(notification.type)
                        const colorClass = getNotificationColor(notification.type)

                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-white/5' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${colorClass}`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-white text-sm">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-sm text-white/80 mb-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-white/60">
                                  {new Date(notification.timestamp).toLocaleString('ru-RU', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="text-white/60 hover:text-white"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

