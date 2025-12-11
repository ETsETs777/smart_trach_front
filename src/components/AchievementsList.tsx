import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { GET_COMPANY_ACHIEVEMENTS } from '@/lib/graphql/queries'
import Card from '@/components/ui/Card'
import { Trophy, Target, Calendar, Award } from 'lucide-react'
import { useWasteStore } from '@/store/useWasteStore'

const iconMap: Record<string, any> = {
  TOTAL_PHOTOS: Target,
  CORRECT_BIN_MATCHES: Award,
  STREAK_DAYS: Calendar,
}

export default function AchievementsList() {
  const { companyId } = useWasteStore()
  const { data, loading, error } = useQuery(GET_COMPANY_ACHIEVEMENTS, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
  })

  if (!companyId) {
    return (
      <Card className="p-6 text-center text-sm text-gray-600">
        Для отображения ачивок выберите компанию
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center text-red-600">
        Ошибка загрузки ачивок: {error.message}
      </Card>
    )
  }

  const achievements = data?.companyAchievements || []

  if (achievements.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-600">
        Пока нет ачивок. Обратитесь к администратору компании.
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((achievement: any, index: number) => {
        const Icon = iconMap[achievement.criterionType] || Trophy
        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Icon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800">{achievement.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Критерий: {achievement.criterionType} • Порог: {achievement.threshold}
                </p>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

