import { motion } from 'framer-motion'
import { Clock, User, Recycle, Award, Users, MapPin } from 'lucide-react'
import Card from './ui/Card'
import { useTranslation } from 'react-i18next'
import { formatDistanceToNow } from 'date-fns'

interface Activity {
  id: string
  type: 'sorting' | 'achievement' | 'employee_added' | 'area_created'
  user?: {
    name: string
    email?: string
  }
  description: string
  timestamp: Date | string
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  activities: Activity[]
  maxItems?: number
}

const activityIcons = {
  sorting: Recycle,
  achievement: Award,
  employee_added: Users,
  area_created: MapPin,
}

const activityColors = {
  sorting: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  achievement: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  employee_added: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  area_created: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
}

export default function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const { t } = useTranslation()

  const displayActivities = activities.slice(0, maxItems)

  if (displayActivities.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('activity.noActivities')}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        {t('activity.recentActivity')}
      </h2>
      <div className="space-y-4">
        {displayActivities.map((activity, index) => {
          const Icon = activityIcons[activity.type] || Clock
          const colorClass = activityColors[activity.type] || 'text-gray-600 bg-gray-50'
          const timestamp = typeof activity.timestamp === 'string' 
            ? new Date(activity.timestamp) 
            : activity.timestamp

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {activity.description}
                </p>
                {activity.user && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activity.user.name}
                    {activity.user.email && ` (${activity.user.email})`}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(timestamp, { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}


