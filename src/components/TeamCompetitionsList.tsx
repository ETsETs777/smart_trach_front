import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { GET_TEAM_COMPETITIONS } from '@/lib/graphql/queries'
import { useWasteStore } from '@/store/useWasteStore'
import Card from '@/components/ui/Card'
import { Trophy, Users, Calendar, Award } from 'lucide-react'

export default function TeamCompetitionsList() {
  const { companyId } = useWasteStore()
  const { data, loading, error } = useQuery(GET_TEAM_COMPETITIONS, {
    variables: { companyId: companyId || '' },
    skip: !companyId,
    pollInterval: 60000, // Обновлять каждую минуту
  })

  if (!companyId) {
    return (
      <Card className="p-6 text-center text-sm text-white/60">
        Для отображения соревнований выберите компанию
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
      <Card className="p-6 text-center text-red-400">
        Ошибка загрузки соревнований: {error.message}
      </Card>
    )
  }

  const competitions = data?.teamCompetitions || []

  if (competitions.length === 0) {
    return (
      <Card className="p-6 text-center text-white/60">
        На данный момент нет активных соревнований
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {competitions.map((competition: any, index: number) => {
        const participants = competition.participants || []
        const sortedParticipants = [...participants].sort(
          (a: any, b: any) => (b.totalPoints || 0) - (a.totalPoints || 0)
        )
        const startDate = new Date(competition.startDate)
        const endDate = new Date(competition.endDate)
        const now = new Date()
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        return (
          <motion.div
            key={competition.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-white/10 rounded-xl border border-white/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{competition.title}</h3>
                <p className="text-sm text-white/80 mb-3">{competition.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {startDate.toLocaleDateString('ru-RU')} - {endDate.toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  {daysRemaining > 0 && (
                    <span className="text-green-400">Осталось дней: {daysRemaining}</span>
                  )}
                </div>
              </div>
            </div>

            {sortedParticipants.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">Рейтинг команд</span>
                </div>
                {sortedParticipants.slice(0, 5).map((participant: any, rank: number) => (
                  <div
                    key={participant.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      rank === 0
                        ? 'bg-yellow-500/20 border border-yellow-400/50'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          rank === 0
                            ? 'bg-yellow-400 text-yellow-900'
                            : rank === 1
                            ? 'bg-gray-300 text-gray-700'
                            : rank === 2
                            ? 'bg-orange-400 text-orange-900'
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        {rank + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{participant.teamName}</div>
                        <div className="text-xs text-white/60 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {participant.members?.length || 0} участников
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="font-bold text-white">{participant.totalPoints || 0}</span>
                      <span className="text-xs text-white/60">очков</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

