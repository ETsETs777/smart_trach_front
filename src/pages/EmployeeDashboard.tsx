import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
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
import { GET_COMPANY_LEADERBOARD } from '@/lib/graphql/queries'
import { useQuery } from '@apollo/client'
import { useWasteStore } from '@/store/useWasteStore'

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()

  const { data } = useQuery(GET_COMPANY_LEADERBOARD, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_role')
    navigate('/')
  }

  // TODO: Получить реальные данные через GraphQL
  const stats = {
    totalSorts: 42,
    currentRank: 5,
    achievements: 3,
    streak: 7,
    topCount: data?.companyAnalytics?.leaderboard?.[0]?.wasteCount || 0,
  }

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Мой профиль
            </h1>
            <p className="text-gray-600 mt-2">Ваша статистика и достижения</p>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="lg">
            <LogOut className="w-5 h-5 mr-2" />
            Выход
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Recycle className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.totalSorts}
            </div>
            <div className="text-sm text-gray-600">Сортировок</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              #{stats.currentRank}
            </div>
            <div className="text-sm text-gray-600">Место в рейтинге</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.achievements}
            </div>
            <div className="text-sm text-gray-600">Ачивок получено</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.streak}
            </div>
            <div className="text-sm text-gray-600">Дней подряд</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card hover className="p-8 cursor-pointer" onClick={() => navigate('/tablet')}>
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Camera className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Сортировать отходы
              </h3>
              <p className="text-gray-600">
                Определите тип отхода и получите инструкции
              </p>
            </div>
          </Card>

          <Card hover className="p-8 cursor-pointer" onClick={() => navigate('/leaderboard')}>
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Таблица лидеров
              </h3>
              <p className="text-gray-600">
                Посмотрите свой рейтинг и достижения
              </p>
            </div>
          </Card>
        </div>

        {/* Recent Activity + Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Последние активности</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
                <History className="w-4 h-4 mr-2" />
                Вся история
              </Button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">Сортировка отходов</div>
                    <div className="text-sm text-gray-600">Пластик • +10 очков</div>
                  </div>
                  <div className="text-sm text-gray-500">2 часа назад</div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Ачивки компании</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/achievements')}>
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
  )
}

