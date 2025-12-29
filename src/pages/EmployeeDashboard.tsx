import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { memo } from 'react'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import { 
  Recycle, 
  Trophy, 
  TrendingUp, 
  History,
  LogOut,
  Camera,
  Award
} from 'lucide-react'
import AchievementsList from '@/components/AchievementsList'
import DailyChallengesList from '@/components/DailyChallengesList'
import LevelProgressBar from '@/components/LevelProgressBar'
import { GET_COMPANY_LEADERBOARD, GET_MY_PROGRESS } from '@/lib/graphql/queries'
import { useQuery } from '@apollo/client'
import { useWasteStore } from '@/store/useWasteStore'
import { tokenStorage } from '@/lib/auth/tokenStorage'

function EmployeeDashboard() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()

  const { data: leaderboardData } = useQuery(GET_COMPANY_LEADERBOARD, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const { data: progressData, loading: progressLoading } = useQuery(GET_MY_PROGRESS, {
    pollInterval: 30000, // Обновлять каждые 30 секунд
  })

  const handleLogout = () => {
    tokenStorage.clearAll()
    navigate('/')
  }

  const progress = progressData?.myProgress
  const leaderboard = leaderboardData?.companyAnalytics?.leaderboard || []
  
  // Находим позицию текущего пользователя в рейтинге
  const currentUserRank = leaderboard.findIndex((entry: any) => entry.employee?.id) + 1 || null

  const stats = {
    totalSorts: progress?.totalPoints || 0,
    currentRank: currentUserRank || '-',
    achievements: 0, // TODO: получить из запроса ачивок
    streak: progress?.currentStreak || 0,
    topCount: leaderboard[0]?.totalClassifiedPhotos || 0,
  }

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white">
              Мой профиль
            </h1>
            <p className="text-white/90 mt-2">Ваша статистика и достижения</p>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="lg">
            <LogOut className="w-5 h-5 mr-2" />
            Выход
          </Button>
        </div>

        {/* Level Progress */}
        {progress && (
          <Card className="p-6 mb-8 border-white/20">
            <LevelProgressBar
              level={progress.level}
              progress={progress.levelProgress}
              experience={progress.experience}
              experienceToNextLevel={progress.experienceToNextLevel}
            />
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Recycle className="w-8 h-8 text-white" />
            </div>
            {progressLoading ? (
              <SkeletonLoader className="h-10 w-20 mb-1" />
            ) : (
              <>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.totalSorts}
                </div>
                <div className="text-sm text-white/80">Очков</div>
              </>
            )}
          </div>

          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            {progressLoading ? (
              <SkeletonLoader className="h-10 w-20 mb-1" />
            ) : (
              <>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.currentRank !== '-' ? `#${stats.currentRank}` : '-'}
                </div>
                <div className="text-sm text-white/80">Место в рейтинге</div>
              </>
            )}
          </div>

          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            {progressLoading ? (
              <SkeletonLoader className="h-10 w-20 mb-1" />
            ) : (
              <>
                <div className="text-3xl font-bold text-white mb-1">
                  {progress?.level || 1}
                </div>
                <div className="text-sm text-white/80">Уровень</div>
              </>
            )}
          </div>

          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            {progressLoading ? (
              <SkeletonLoader className="h-10 w-20 mb-1" />
            ) : (
              <>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.streak}
                </div>
                <div className="text-sm text-white/80">Дней подряд</div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card hover className="p-8 cursor-pointer border-white/20" onClick={() => navigate('/tablet')}>
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4"
              >
                <Camera className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Сортировать отходы
              </h3>
              <p className="text-white/80">
                Определите тип отхода и получите инструкции
              </p>
            </div>
          </Card>

          <Card hover className="p-8 cursor-pointer border-white/20" onClick={() => navigate('/leaderboard')}>
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Таблица лидеров
              </h3>
              <p className="text-white/80">
                Посмотрите свой рейтинг и достижения
              </p>
            </div>
          </Card>
        </div>

        {/* Daily Challenges + Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Ежедневные задания</h2>
            </div>
            <DailyChallengesList />
          </Card>

          <Card className="p-6 border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Ачивки компании</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/achievements')} className="text-white hover:bg-white/20">
                <Award className="w-4 h-4 mr-2" />
                Все ачивки
              </Button>
            </div>
            <AchievementsList />
          </Card>
        </div>

        {/* Profile & History shortcuts */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button variant="outline" size="lg" onClick={() => navigate('/profile')}>
            Профиль
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/history')}>
            История сортировок
          </Button>
        </div>
        </div>
      </div>
    </GreenGradientBackground>
  )
}

export default memo(EmployeeDashboard)

