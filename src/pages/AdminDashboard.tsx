import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { memo, useMemo } from 'react'
import { GET_COMPANY_ANALYTICS, GET_COMPANY } from '@/lib/graphql/queries'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import ActivityFeed from '@/components/ActivityFeed'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import { 
  BarChart3, 
  Users, 
  Recycle, 
  Settings, 
  Plus, 
  Trophy,
  LogOut,
  TrendingUp,
  Book,
  HelpCircle,
  Info,
  Code,
  GitBranch,
  BookOpen
} from 'lucide-react'
import { useWasteStore } from '@/store/useWasteStore'
import { tokenStorage } from '@/lib/auth/tokenStorage'

function AdminDashboard() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()
  const { t } = useTranslation()

  const { data, loading } = useQuery(GET_COMPANY_ANALYTICS, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
    errorPolicy: 'all',
  })

  const { data: companyData } = useQuery(GET_COMPANY, {
    variables: { id: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const handleLogout = () => {
    tokenStorage.clearAll()
    navigate('/')
  }

  const analytics = data?.companyAnalytics

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white flex flex-col">
        <div className="max-w-7xl mx-auto flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
              {t('admin.dashboard.title')}
            </h1>
            <p className="text-white/95 text-lg font-medium">{t('admin.dashboard.subtitle')}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            {companyData?.company?.logo?.url && (
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md border-2 border-white/30 overflow-hidden flex items-center justify-center shadow-lg">
                <img 
                  src={companyData.company.logo.url} 
                  alt={companyData.company.name || t('company.logo')} 
                  className="w-full h-full object-cover"
                />
          </div>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-md"
            >
            <LogOut className="w-5 h-5 mr-2" />
              {t('common.logout')}
          </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Recycle className="w-6 h-6 text-white" />
            </div>
              <TrendingUp className="w-5 h-5 text-emerald-600 opacity-70" />
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {analytics?.areas?.reduce((sum: number, area: any) => sum + (area.totalPhotos || 0), 0) || 0}
          </div>
            <div className="text-sm font-medium text-gray-600">{t('admin.dashboard.totalSorts')}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
            </div>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {analytics?.binUsage?.length || 0}
          </div>
            <div className="text-sm font-medium text-gray-600">{t('admin.dashboard.containerTypes')}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {analytics?.leaderboard?.length || 0}
            </div>
            <div className="text-sm font-medium text-gray-600">{t('admin.dashboard.activeEmployees')}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
            </div>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {analytics?.leaderboard?.[0]?.totalClassifiedPhotos || 0}
          </div>
            <div className="text-sm font-medium text-gray-600">{t('admin.dashboard.sortLeader')}</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card hover className="p-6 cursor-pointer bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300" onClick={() => navigate('/admin/areas')}>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Plus className="w-7 h-7 text-white" />
              </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{t('admin.dashboard.collectionAreas')}</h3>
                  <p className="text-sm text-gray-600">{t('admin.dashboard.collectionAreasDesc')}</p>
              </div>
            </div>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card hover className="p-6 cursor-pointer bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300" onClick={() => navigate('/admin/employees')}>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
              </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{t('admin.dashboard.employees')}</h3>
                  <p className="text-sm text-gray-600">{t('admin.dashboard.employeesDesc')}</p>
              </div>
            </div>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card hover className="p-6 cursor-pointer bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300" onClick={() => navigate('/admin/settings')}>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-lg">
                  <Settings className="w-7 h-7 text-white" />
              </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{t('admin.dashboard.settings')}</h3>
                  <p className="text-sm text-gray-600">{t('admin.dashboard.settingsDesc')}</p>
              </div>
            </div>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card hover className="p-6 cursor-pointer bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300" onClick={() => navigate('/admin/achievements')}>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
              </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{t('admin.dashboard.achievements')}</h3>
                  <p className="text-sm text-gray-600">{t('admin.dashboard.achievementsDesc')}</p>
              </div>
            </div>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card hover className="p-6 cursor-pointer bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300" onClick={() => navigate('/admin/bins')}>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Recycle className="w-7 h-7 text-white" />
              </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{t('admin.dashboard.containers')}</h3>
                  <p className="text-sm text-gray-600">{t('admin.dashboard.containersDesc')}</p>
              </div>
            </div>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card hover className="p-6 cursor-pointer bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300" onClick={() => navigate('/admin/analytics')}>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
              </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{t('admin.dashboard.analytics')}</h3>
                  <p className="text-sm text-gray-600">{t('admin.dashboard.analyticsDesc')}</p>
              </div>
            </div>
          </Card>
          </motion.div>
        </div>

        {/* Activity Feed and Leaderboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Leaderboard Preview */}
        {analytics?.leaderboard && analytics.leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-xl dark:bg-gray-800/95 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">{t('admin.dashboard.topEmployees')}</h2>
            <div className="space-y-3">
              {analytics.leaderboard.slice(0, 5).map((entry: any, index: number) => (
                <motion.div
                    key={entry.employee?.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                          index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400' :
                          'bg-gradient-to-br from-blue-400 to-blue-500'
                        }`}>
                      {index + 1}
                    </div>
                    <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {entry.employee?.fullName || t('analytics.user', { number: index + 1 })}
                      </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.totalClassifiedPhotos || 0} {t('admin.dashboard.sorts')}
                      </div>
                    </div>
                  </div>
                  <Button
                        variant="outline"
                    size="sm"
                    onClick={() => navigate('/leaderboard')}
                        className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
                  >
                        {t('admin.dashboard.moreDetails')}
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
            </motion.div>
        )}

          {/* Performance Monitor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <PerformanceMonitor />
          </motion.div>
        </div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
            <ActivityFeed
              activities={useMemo(() => {
                const activities: any[] = []
                
                // Add sorting activities from leaderboard
                if (analytics?.leaderboard) {
                  analytics.leaderboard.slice(0, 3).forEach((entry: any) => {
                    if (entry.totalClassifiedPhotos > 0) {
                      activities.push({
                        id: `sort-${entry.employee?.id}`,
                        type: 'sorting' as const,
                        user: {
                          name: entry.employee?.fullName || 'User',
                          email: entry.employee?.email,
                        },
                        description: t('activity.sortingActivity', { count: entry.totalClassifiedPhotos }),
                        timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
                      })
                    }
                  })
                }

                // Add area activities
                if (analytics?.areas) {
                  analytics.areas.slice(0, 2).forEach((area: any) => {
                    if (area.totalPhotos > 0) {
                      activities.push({
                        id: `area-${area.area?.id}`,
                        type: 'area_created' as const,
                        description: t('activity.areaActivity', { name: area.area?.name || 'Area', count: area.totalPhotos }),
                        timestamp: new Date(Date.now() - Math.random() * 172800000), // Random time in last 48h
                      })
                    }
                  })
                }

                return activities.sort((a, b) => {
                  const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp.getTime()
                  const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp.getTime()
                  return timeB - timeA
                })
              }, [analytics, t])}
              maxItems={5}
            />
          </motion.div>

        {/* Bin Usage Stats */}
        {analytics?.binUsageStats && analytics.binUsageStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-6"
          >
            <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('admin.dashboard.containerUsage')}</h2>
              <div className="space-y-4">
                {analytics.binUsage?.map((stat: any, index: number) => (
                  <motion.div
                    key={stat.binType}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                  <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm"></div>
                      <span className="font-medium text-gray-800">{stat.binType}</span>
                  </div>
                    <span className="text-xl font-bold text-gray-800">{stat.count || 0}</span>
                  </motion.div>
              ))}
            </div>
          </Card>
          </motion.div>
        )}
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-auto pt-8 border-t border-white/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button
              onClick={() => navigate('/admin/docs')}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 text-white group"
            >
              <Book className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('admin.footer.documentation')}</span>
            </button>

            <button
              onClick={() => navigate('/admin/help')}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 text-white group"
            >
              <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('admin.footer.help')}</span>
            </button>

            <button
              onClick={() => navigate('/admin/about-system')}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 text-white group"
            >
              <Info className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('admin.footer.aboutSystem')}</span>
            </button>

            <button
              onClick={() => navigate('/admin/api-docs')}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 text-white group"
            >
              <Code className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('admin.footer.api')}</span>
            </button>

            <button
              onClick={() => navigate('/admin/changelog')}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 text-white group"
            >
              <GitBranch className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('admin.footer.changelog')}</span>
            </button>

            <button
              onClick={() => navigate('/admin/guide')}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 text-white group"
            >
              <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('admin.footer.guide')}</span>
            </button>
          </div>

          <div className="mt-8 text-center text-white/70 text-sm">
            <p>{t('admin.footer.copyright')}</p>
          </div>
        </motion.footer>
      </div>
    </GreenGradientBackground>
  )
}

export default memo(AdminDashboard)
