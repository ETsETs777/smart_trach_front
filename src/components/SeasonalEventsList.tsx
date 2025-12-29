import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { GET_SEASONAL_EVENTS } from '@/lib/graphql/queries'
import { useWasteStore } from '@/store/useWasteStore'
import Card from '@/components/ui/Card'
import { Sparkles, Calendar, TrendingUp, Award } from 'lucide-react'

export default function SeasonalEventsList() {
  const { companyId } = useWasteStore()
  const { data, loading, error } = useQuery(GET_SEASONAL_EVENTS, {
    variables: { companyId: companyId || null },
    pollInterval: 60000, // Обновлять каждую минуту
  })

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center text-red-400">
        Ошибка загрузки событий: {error.message}
      </Card>
    )
  }

  const events = data?.seasonalEvents || []

  if (events.length === 0) {
    return (
      <Card className="p-6 text-center text-white/60">
        На данный момент нет активных сезонных событий
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event: any, index: number) => {
        const startDate = new Date(event.startDate)
        const endDate = new Date(event.endDate)
        const now = new Date()
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        const hasMultiplier = event.pointsMultiplier > 1 || event.experienceMultiplier > 1

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-purple-500/30 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                <p className="text-sm text-white/80 mb-3">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {startDate.toLocaleDateString('ru-RU')} - {endDate.toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  {daysRemaining > 0 && (
                    <span className="text-purple-300">Осталось дней: {daysRemaining}</span>
                  )}
                </div>

                {hasMultiplier && (
                  <div className="flex items-center gap-4 mt-3">
                    {event.pointsMultiplier > 1 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-lg border border-green-400/30">
                        <TrendingUp className="w-4 h-4 text-green-300" />
                        <span className="text-sm font-semibold text-green-300">
                          x{event.pointsMultiplier} очков
                        </span>
                      </div>
                    )}
                    {event.experienceMultiplier > 1 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30">
                        <Award className="w-4 h-4 text-blue-300" />
                        <span className="text-sm font-semibold text-blue-300">
                          x{event.experienceMultiplier} опыта
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {event.specialAchievements && event.specialAchievements.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="text-xs text-white/60 mb-2">Специальные ачивки:</div>
                    <div className="flex flex-wrap gap-2">
                      {event.specialAchievements.map((achievement: any) => (
                        <div
                          key={achievement.id}
                          className="px-2 py-1 bg-yellow-500/20 rounded border border-yellow-400/30"
                        >
                          <span className="text-xs text-yellow-300">{achievement.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

