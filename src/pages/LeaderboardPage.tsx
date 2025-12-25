import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GET_COMPANY_ANALYTICS, GET_ME } from '@/lib/graphql/queries'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { Trophy, Medal, Award, ArrowLeft, Users, Package, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWasteStore } from '@/store/useWasteStore'

export default function LeaderboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { companyId } = useWasteStore()
  const { data: meData } = useQuery(GET_ME)

  const { data, loading } = useQuery(GET_COMPANY_ANALYTICS, {
    variables: { 
      companyId: companyId || import.meta.env.VITE_DEFAULT_COMPANY_ID || 'default-company-id' 
    },
    skip: !companyId && !import.meta.env.VITE_DEFAULT_COMPANY_ID,
  })

  const leaderboard = data?.companyAnalytics?.leaderboard || []
  const meId = meData?.me?.id
  const myIndex = leaderboard.findIndex((entry: any) => entry.employee?.id === meId)
  const myEntry = myIndex >= 0 ? leaderboard[myIndex] : null
  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-8 h-8 text-yellow-500" />
    if (index === 1) return <Medal className="w-8 h-8 text-gray-400" />
    if (index === 2) return <Award className="w-8 h-8 text-amber-600" />
    return <span className="w-8 h-8 flex items-center justify-center text-gray-500 font-bold">{index + 1}</span>
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 landscape:px-8 lg:landscape:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t('leaderboard.title')}
          </h1>
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            size="lg"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
            {t('common.back')}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonLoader key={i} variant="card" className="bg-white" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center" role="status" aria-live="polite">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('leaderboard.noData')}</h2>
            <p className="text-gray-600 mb-6">
              {t('leaderboard.startSorting')}
            </p>
            <Button onClick={() => navigate('/')} variant="primary" size="lg">
              {t('leaderboard.startSortingButton')}
            </Button>
          </Card>
        ) : (
          <>
            {/* Top 3 podium */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6" role="list" aria-label={t('leaderboard.topThree')}>
              {top3.map((entry: any, index: number) => (
                <Card
                  key={entry.employee?.id || index}
                  className={`
                    p-6 text-center relative overflow-hidden
                    ${index === 0 ? 'bg-gradient-to-br from-yellow-100 to-amber-50' : 'bg-gray-50'}
                  `}
                >
                  <div className="absolute top-3 right-3 text-sm text-gray-400">
                    #{index + 1}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                    {entry.employee?.logo?.url ? (
                      <img src={entry.employee.logo.url} alt={entry.employee.fullName} className="w-full h-full object-cover" />
                    ) : (
                      entry.employee?.fullName?.[0] || 'U'
                    )}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-gray-800">
                    {entry.employee?.fullName || t('leaderboard.user', { number: index + 1 })}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-3">
                    {entry.totalClassifiedPhotos || 0} {t('leaderboard.sorts')}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          ((entry.totalClassifiedPhotos || 0) / (top3[0]?.totalClassifiedPhotos || 1)) * 100,
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Rest of leaderboard */}
            <Card className="p-4 sm:p-6 md:p-8">
              <div className="space-y-3 sm:space-y-4" role="list" aria-label={t('leaderboard.restOfLeaderboard')}>
                {rest.map((entry: any, index: number) => (
                  <motion.div
                    key={entry.employee?.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-4 sm:p-6 rounded-xl bg-gray-50"
                    role="listitem"
                  >
                    <div className="flex-shrink-0 w-10 text-center text-gray-500 font-semibold">
                      #{index + 4}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                        {entry.employee?.fullName || t('leaderboard.user', { number: index + 4 })}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">{t('leaderboard.sorts')}: {entry.totalClassifiedPhotos || 0}</p>
                    </div>
                    <div className="w-full sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={entry.totalClassifiedPhotos || 0} aria-valuemin={0} aria-valuemax={top3[0]?.totalClassifiedPhotos || 1}>
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            ((entry.totalClassifiedPhotos || 0) / (top3[0]?.totalClassifiedPhotos || 1)) * 100,
                            100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {entry.totalClassifiedPhotos || 0}
                    </div>
                  </motion.div>
                ))}
              </div>

              {myEntry && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 sm:mt-8 p-4 rounded-xl border-2 border-green-300 bg-green-50 shadow-lg"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold overflow-hidden ring-2 ring-green-300">
                        {myEntry.employee?.logo?.url ? (
                          <img src={myEntry.employee.logo.url} alt={myEntry.employee.fullName} className="w-full h-full object-cover" />
                        ) : (
                          myEntry.employee?.fullName?.[0] || 'U'
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {myEntry.employee?.fullName || t('leaderboard.you')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t('leaderboard.yourPosition')}: #{myIndex + 1}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">{myEntry.totalClassifiedPhotos || 0}</div>
                  </div>
                </motion.div>
              )}
            </Card>
          </>
        )}

        {/* Stats */}
        {data?.companyAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            role="region"
            aria-label={t('leaderboard.statistics')}
          >
            <Card className="text-center p-4 sm:p-6">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" aria-hidden="true" />
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                {data.companyAnalytics.areas?.reduce((sum: number, area: any) => sum + (area.totalPhotos || 0), 0) || 0}
              </div>
              <div className="text-sm sm:text-base text-gray-600">{t('leaderboard.totalSorts')}</div>
            </Card>
            <Card className="text-center p-4 sm:p-6">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" aria-hidden="true" />
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {data.companyAnalytics.binUsage?.length || 0}
              </div>
              <div className="text-sm sm:text-base text-gray-600">{t('leaderboard.containerTypes')}</div>
            </Card>
            <Card className="text-center p-4 sm:p-6">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" aria-hidden="true" />
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                {leaderboard.length}
              </div>
              <div className="text-sm sm:text-base text-gray-600">{t('leaderboard.participants')}</div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}




