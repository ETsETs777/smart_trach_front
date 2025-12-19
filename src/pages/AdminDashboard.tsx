import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GET_COMPANY_ANALYTICS } from '@/lib/graphql/queries'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import { 
  BarChart3, 
  Users, 
  Recycle, 
  Settings, 
  Plus, 
  Trophy,
  LogOut,
  TrendingUp
} from 'lucide-react'
import { useWasteStore } from '@/store/useWasteStore'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()

  const { data, loading } = useQuery(GET_COMPANY_ANALYTICS, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_role')
    navigate('/')
  }

  const analytics = data?.companyAnalytics

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white">
              Панель администратора
            </h1>
            <p className="text-white/90 mt-2">Управление компанией и аналитика</p>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="lg">
            <LogOut className="w-5 h-5 mr-2" />
            Выход
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Recycle className="w-8 h-8 text-white" />
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {analytics?.totalWastePhotos || 0}
            </div>
            <div className="text-sm text-white/80">Всего сортировок</div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {analytics?.binUsageStats?.length || 0}
            </div>
            <div className="text-sm text-white/80">Типов контейнеров</div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {analytics?.leaderboard?.length || 0}
            </div>
            <div className="text-sm text-white/80">Активных сотрудников</div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {analytics?.leaderboard?.[0]?.wasteCount || 0}
            </div>
            <div className="text-sm text-white/80">Лидер сортировок</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card hover className="p-6 cursor-pointer border-white/20" onClick={() => navigate('/admin/areas')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Области сбора</h3>
                <p className="text-sm text-white/80">Управление точками сбора</p>
              </div>
            </div>
          </Card>

          <Card hover className="p-6 cursor-pointer border-white/20" onClick={() => navigate('/admin/employees')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Сотрудники</h3>
                <p className="text-sm text-white/80">Управление командой</p>
              </div>
            </div>
          </Card>

          <Card hover className="p-6 cursor-pointer border-white/20" onClick={() => navigate('/admin/settings')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Настройки</h3>
                <p className="text-sm text-white/80">Настройки компании</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card hover className="p-6 cursor-pointer border-white/20" onClick={() => navigate('/admin/achievements')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Ачивки</h3>
                <p className="text-sm text-white/80">Управление достижениями</p>
              </div>
            </div>
          </Card>
          <Card hover className="p-6 cursor-pointer border-white/20" onClick={() => navigate('/admin/bins')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Контейнеры</h3>
                <p className="text-sm text-white/80">Управление контейнерами</p>
              </div>
            </div>
          </Card>
          <Card hover className="p-6 cursor-pointer border-white/20" onClick={() => navigate('/admin/analytics')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Аналитика</h3>
                <p className="text-sm text-white/80">Статистика компании</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Leaderboard Preview */}
        {analytics?.leaderboard && analytics.leaderboard.length > 0 && (
          <Card className="p-6 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Топ сотрудников</h2>
            <div className="space-y-3">
              {analytics.leaderboard.slice(0, 5).map((entry: any, index: number) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {entry.userName || `Пользователь ${index + 1}`}
                      </div>
                      <div className="text-sm text-white/80">
                        {entry.wasteCount || 0} сортировок
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/leaderboard')}
                    className="text-white hover:bg-white/20"
                  >
                    Подробнее
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Bin Usage Stats */}
        {analytics?.binUsageStats && analytics.binUsageStats.length > 0 && (
          <Card className="p-6 mt-6 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Использование контейнеров</h2>
            <div className="space-y-3">
              {analytics.binUsageStats.map((stat: any, index: number) => (
                <div key={stat.binType} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                    <span className="font-medium text-white">{stat.binType}</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stat.count || 0}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
        </div>
      </div>
    </GreenGradientBackground>
  )
}

