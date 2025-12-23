import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { GET_COMPANY_ANALYTICS, GET_ME } from '@/lib/graphql/queries'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWasteStore } from '@/store/useWasteStore'

export default function LeaderboardPage() {
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
    <div className="min-h-screen p-8 landscape:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Таблица лидеров
          </h1>
          <Button onClick={() => navigate('/')} variant="ghost" size="lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonLoader key={i} variant="card" className="bg-white" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Пока нет данных</h2>
            <p className="text-gray-600 mb-6">
              Начните сортировать отходы, чтобы попасть в рейтинг!
            </p>
            <Button onClick={() => navigate('/')} variant="primary" size="lg">
              Начать сортировку
            </Button>
          </Card>
        ) : (
          <>
            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-4 mb-6">
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
                  <div className="text-lg font-bold text-gray-800">
                    {entry.employee?.fullName || `Пользователь ${index + 1}`}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {entry.totalClassifiedPhotos || 0} сортировок
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
            <Card className="p-8">
              <div className="space-y-4">
                {rest.map((entry: any, index: number) => (
                  <motion.div
                    key={entry.employee?.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-6 p-6 rounded-xl bg-gray-50"
                  >
                    <div className="flex-shrink-0 w-10 text-center text-gray-500 font-semibold">
                      #{index + 4}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        {entry.employee?.fullName || `Пользователь ${index + 4}`}
                      </h3>
                      <p className="text-gray-600">Сортировок: {entry.totalClassifiedPhotos || 0}</p>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                    <div className="text-2xl font-bold text-green-600">
                      {entry.totalClassifiedPhotos || 0}
                    </div>
                  </motion.div>
                ))}
              </div>

              {myEntry && (
                <div className="mt-8 p-4 rounded-xl border border-green-200 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold overflow-hidden">
                        {myEntry.employee?.logo?.url ? (
                          <img src={myEntry.employee.logo.url} alt={myEntry.employee.fullName} className="w-full h-full object-cover" />
                        ) : (
                          myEntry.employee?.fullName?.[0] || 'U'
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {myEntry.employee?.fullName || 'Вы'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Ваша позиция: #{myIndex + 1}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">{myEntry.totalClassifiedPhotos || 0}</div>
                  </div>
                </div>
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
            className="mt-8 grid grid-cols-3 gap-6"
          >
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {data.companyAnalytics.areas?.reduce((sum: number, area: any) => sum + (area.totalPhotos || 0), 0) || 0}
              </div>
              <div className="text-gray-600">Всего сортировок</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {data.companyAnalytics.binUsage?.length || 0}
              </div>
              <div className="text-gray-600">Типов контейнеров</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {leaderboard.length}
              </div>
              <div className="text-gray-600">Участников</div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

