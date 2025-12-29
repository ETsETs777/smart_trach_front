import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { GET_MY_DAILY_CHALLENGE_PROGRESS } from '@/lib/graphql/queries'
import { useWasteStore } from '@/store/useWasteStore'
import Card from '@/components/ui/Card'
import { Target, CheckCircle2, Circle } from 'lucide-react'

export default function DailyChallengesList() {
  const { companyId } = useWasteStore()
  const { data, loading, error } = useQuery(GET_MY_DAILY_CHALLENGE_PROGRESS, {
    variables: { companyId: companyId || '' },
    skip: !companyId,
    pollInterval: 30000, // Обновлять каждые 30 секунд
  })

  if (!companyId) {
    return (
      <Card className="p-6 text-center text-sm text-white/60">
        Для отображения заданий выберите компанию
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
        Ошибка загрузки заданий: {error.message}
      </Card>
    )
  }

  const challenges = data?.myDailyChallengeProgress || []

  if (challenges.length === 0) {
    return (
      <Card className="p-6 text-center text-white/60">
        На сегодня нет активных заданий
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {challenges.map((challenge: any, index: number) => {
        const progress = challenge.challenge?.target
          ? Math.min((challenge.currentProgress / challenge.challenge.target) * 100, 100)
          : 0
        const isCompleted = challenge.isCompleted

        return (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/10 rounded-xl border border-white/20"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-white/40" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">
                    {challenge.challenge?.title || 'Задание'}
                  </h3>
                  {isCompleted && (
                    <span className="text-xs text-green-400 font-semibold">
                      +{challenge.challenge?.rewardPoints || 0} очков
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/80 mb-3">
                  {challenge.challenge?.description || ''}
                </p>
                {!isCompleted && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                      <span>Прогресс</span>
                      <span>
                        {challenge.currentProgress} / {challenge.challenge?.target || 0}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      />
                    </div>
                  </div>
                )}
                {isCompleted && challenge.completedAt && (
                  <div className="text-xs text-green-400">
                    Выполнено {new Date(challenge.completedAt).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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

