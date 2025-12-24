import { useMemo, useState, memo } from 'react'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { useWasteStore } from '@/store/useWasteStore'
import { GET_COMPANY_ANALYTICS } from '@/lib/graphql/queries'
import { ArrowLeft, BarChart3, Activity, Users, Trophy, TrendingUp, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AnalyticsPage() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  const { data, loading, error, refetch } = useQuery(GET_COMPANY_ANALYTICS, {
    variables: { companyId: companyId || 'default-company-id', dateFrom, dateTo },
    skip: !companyId,
  })

  const analytics = data?.companyAnalytics
  const bins = analytics?.binUsage || []
  const leaderboard = analytics?.leaderboard || []

  const totalBins = bins.reduce((acc: number, b: any) => acc + Number(b.count || 0), 0)

  const binsWithPercent = useMemo(() => {
    if (!totalBins) return bins
    return bins.map((b: any) => ({
      ...b,
      percent: Math.round(((Number(b.count || 0)) / totalBins) * 100),
    }))
  }, [bins, totalBins])

  const handleExportCSV = () => {
    if (!binsWithPercent.length) {
      toast.error('Нет данных для экспорта')
      return
    }
    const rows = [
      ['binType', 'count', 'percent'],
      ...binsWithPercent.map((b: any) => [b.binType, b.count, b.percent]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'bin-usage.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button onClick={() => navigate('/admin/dashboard')} variant="ghost" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад
            </Button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-4">
              Аналитика компании
            </h1>
            <p className="text-gray-600 mt-2">Использование контейнеров и активность</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonLoader key={i} variant="card" className="bg-white" />
            ))}
          </div>
          <div className="space-y-6">
            <SkeletonLoader variant="card" className="bg-white" />
            <SkeletonLoader variant="card" className="bg-white" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center text-red-600">
            Ошибка загрузки аналитики: {error.message}
          </Card>
        ) : !analytics ? (
          <Card className="p-6 text-center text-gray-600">
            Данные аналитики недоступны
          </Card>
        ) : (
          <>
            {/* Filters */}
            <Card className="p-6 mb-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">С даты</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">По дату</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch({ companyId, dateFrom: dateFrom || null, dateTo: dateTo || null })}
                  disabled={!companyId}
                >
                  Применить
                </Button>
              </div>
            </Card>

            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {analytics.areas?.reduce((sum: number, area: any) => sum + (area.totalPhotos || 0), 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Всего сортировок</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {bins.length || 0}
                </div>
                <div className="text-sm text-gray-600">Типов контейнеров</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {leaderboard.length || 0}
                </div>
                <div className="text-sm text-gray-600">Активных сотрудников</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {leaderboard?.[0]?.totalClassifiedPhotos || 0}
                </div>
                <div className="text-sm text-gray-600">Лидер сортировок</div>
              </Card>
            </div>

            {/* Bin usage chart (simple bars) */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Использование контейнеров</h2>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт CSV
                </Button>
              </div>
              {binsWithPercent.length === 0 ? (
                <p className="text-gray-600">Нет данных по контейнерам</p>
              ) : (
                <div className="space-y-3">
                  {binsWithPercent.map((bin: any, index: number) => (
                    <motion.div
                      key={bin.binType}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-1"
                    >
                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <span>{bin.binType}</span>
                        <span className="font-semibold">{bin.count} ({bin.percent || 0}%)</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                          style={{ width: `${Math.min(bin.percent || 0, 100)}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

            {/* Leaderboard preview */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Топ сотрудников</h2>
              {leaderboard.length === 0 ? (
                <p className="text-gray-600">Нет данных по активности сотрудников</p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.slice(0, 8).map((entry: any, index: number) => (
                    <motion.div
                      key={entry.employee?.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {entry.employee?.fullName || `Пользователь ${index + 1}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {entry.totalClassifiedPhotos || 0} сортировок
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        +{entry.totalClassifiedPhotos || 0}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

