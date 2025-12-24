import { useMemo, useState, memo } from 'react'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { SimpleBarChart, SimplePieChart, SimpleLineChart, SimpleAreaChart } from '@/components/ui/Charts'
import { useWasteStore } from '@/store/useWasteStore'
import { GET_COMPANY_ANALYTICS } from '@/lib/graphql/queries'
import { ArrowLeft, BarChart3, Activity, Users, Trophy, TrendingUp, Download, FileSpreadsheet, FileText, Printer } from 'lucide-react'
import { printAnalyticsReport } from '@/lib/utils/printUtils'
import { useNavigate } from 'react-router-dom'
import { exportToExcel, exportToCSV, exportAnalyticsToPDF } from '@/lib/utils/exportUtils'

function AnalyticsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
      toast.error(t('analytics.noDataExport'))
      return
    }
    const data = binsWithPercent.map((b: any) => ({
      'Container Type': b.binType,
      'Count': b.count,
      'Percentage': `${b.percent || 0}%`,
    }))
    exportToCSV(data, `analytics-${new Date().toISOString().split('T')[0]}.csv`)
    toast.success(t('analytics.exportSuccess'))
  }

  const handleExportExcel = () => {
    if (!binsWithPercent.length && !leaderboard.length) {
      toast.error(t('analytics.noDataExport'))
      return
    }

    const data: any[] = []
    
    // Add bins data
    if (binsWithPercent.length > 0) {
      data.push(...binsWithPercent.map((b: any) => ({
        'Type': 'Container',
        'Container Type': b.binType,
        'Count': b.count,
        'Percentage': `${b.percent || 0}%`,
      })))
    }

    // Add leaderboard data
    if (leaderboard.length > 0) {
      data.push(...leaderboard.map((entry: any, index: number) => ({
        'Type': 'Employee',
        'Rank': index + 1,
        'Name': entry.employee?.fullName || t('analytics.user', { number: index + 1 }),
        'Email': entry.employee?.email || '',
        'Total Sortings': entry.totalClassifiedPhotos || 0,
      })))
    }

    exportToExcel(data, `analytics-${new Date().toISOString().split('T')[0]}.xlsx`, 'Analytics')
    toast.success(t('analytics.exportSuccess'))
  }

  const handleExportPDF = async () => {
    try {
      await exportAnalyticsToPDF(
        t('analytics.title'),
        {
          bins: binsWithPercent,
          leaderboard: leaderboard.slice(0, 10),
          stats: {
            'Total Sortings': analytics?.areas?.reduce((sum: number, area: any) => sum + (area.totalPhotos || 0), 0) || 0,
            'Container Types': bins.length,
            'Active Employees': leaderboard.length,
          },
        },
        `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`
      )
      toast.success(t('analytics.exportSuccess'))
    } catch (error) {
      toast.error(t('analytics.exportError'))
    }
  }

  // Prepare chart data
  const chartData = useMemo(() => {
    return binsWithPercent.map((bin: any) => ({
      name: bin.binType,
      value: bin.count,
      percent: bin.percent || 0,
    }))
  }, [binsWithPercent])

  const leaderboardChartData = useMemo(() => {
    return leaderboard.slice(0, 10).map((entry: any, index: number) => ({
      name: entry.employee?.fullName || `User ${index + 1}`,
      value: entry.totalClassifiedPhotos || 0,
      rank: index + 1,
    }))
  }, [leaderboard])

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button onClick={() => navigate('/admin/dashboard')} variant="ghost" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('common.back')}
            </Button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-4">
              {t('analytics.title')}
            </h1>
            <p className="text-gray-600 mt-2">{t('analytics.subtitle')}</p>
          </div>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonLoader key={i} variant="card" className="bg-white" />
              ))}
            </div>
            <div className="space-y-6">
              <SkeletonLoader variant="card" className="bg-white" />
              <SkeletonLoader variant="card" className="bg-white" />
            </div>
          </>
        ) : error ? (
          <Card className="p-6 text-center text-red-600">
            {t('analytics.loadError')}: {error.message}
          </Card>
        ) : !analytics ? (
          <Card className="p-6 text-center text-gray-600">
            {t('analytics.noData')}
          </Card>
        ) : (
          <>
            {/* Filters */}
            <Card className="p-6 mb-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t('analytics.fromDate')}</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t('analytics.toDate')}</label>
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
                  {t('analytics.apply')}
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
                <div className="text-sm text-gray-600">{t('analytics.totalSortings')}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {bins.length || 0}
                </div>
                <div className="text-sm text-gray-600">{t('analytics.containerTypes')}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {leaderboard.length || 0}
                </div>
                <div className="text-sm text-gray-600">{t('analytics.activeEmployees')}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {leaderboard?.[0]?.totalClassifiedPhotos || 0}
                </div>
                <div className="text-sm text-gray-600">{t('analytics.leaderSortings')}</div>
              </Card>
            </div>

            {/* Export buttons */}
            <Card className="p-4 mb-6">
              <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => printAnalyticsReport({
                    title: t('analytics.title'),
                    stats: {
                      'Total Sortings': analytics?.areas?.reduce((sum: number, area: any) => sum + (area.totalPhotos || 0), 0) || 0,
                      'Container Types': bins.length,
                      'Active Employees': leaderboard.length,
                    },
                    bins: binsWithPercent,
                    leaderboard: leaderboard.slice(0, 10),
                  })}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  {t('common.print')}
                </Button>
              </div>
            </Card>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Bin usage bar chart */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('analytics.containerUsage')}</h2>
                {chartData.length === 0 ? (
                  <p className="text-gray-600">{t('analytics.noContainerData')}</p>
                ) : (
                  <SimpleBarChart data={chartData} dataKey="value" color="#22c55e" height={300} />
                )}
              </Card>

              {/* Bin usage pie chart */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('analytics.containerDistribution')}</h2>
                {chartData.length === 0 ? (
                  <p className="text-gray-600">{t('analytics.noContainerData')}</p>
                ) : (
                  <SimplePieChart data={chartData} height={300} />
                )}
              </Card>
            </div>

            {/* Employee activity chart */}
            {leaderboardChartData.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('analytics.employeeActivity')}</h2>
                <SimpleBarChart 
                  data={leaderboardChartData} 
                  dataKey="value" 
                  nameKey="name"
                  color="#3b82f6" 
                  height={300} 
                />
              </Card>
            )}

            {/* Bin usage detailed list */}
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('analytics.containerUsage')} - {t('analytics.details')}</h2>
              {binsWithPercent.length === 0 ? (
                <p className="text-gray-600">{t('analytics.noContainerData')}</p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('analytics.topEmployees')}</h2>
              {leaderboard.length === 0 ? (
                <p className="text-gray-600">{t('analytics.noEmployeeData')}</p>
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
                            {entry.employee?.fullName || t('analytics.user', { number: index + 1 })}
                          </div>
                          <div className="text-sm text-gray-600">
                            {entry.totalClassifiedPhotos || 0} {t('analytics.sortings')}
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

export default memo(AnalyticsPage)
