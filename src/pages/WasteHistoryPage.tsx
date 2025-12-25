import { motion } from 'framer-motion'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { ArrowLeft, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_WASTE_PHOTOS_PAGINATED, GET_ME } from '@/lib/graphql/queries'
import { useWasteStore } from '@/store/useWasteStore'
import { TrashBinType, BIN_CONFIGS, WastePhotoStatus } from '@/types'
import { useMemo, useState, useCallback } from 'react'
import Pagination from '@/components/ui/Pagination'
import { formatDateTime } from '@/lib/utils/dateFormat'

function WasteHistoryPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { companyId } = useWasteStore()
  const { data: meData } = useQuery(GET_ME)
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const { data, loading, error } = useQuery(GET_WASTE_PHOTOS_PAGINATED, {
    variables: {
      companyId: companyId || 'default-company-id',
      userId: meData?.me?.id,
      page: currentPage,
      pageSize,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    },
    skip: !companyId || !meData?.me?.id,
    fetchPolicy: 'network-only',
  })

  // Reset to page 1 when filters change
  const handleFilterChange = useCallback((filterType: 'type' | 'dateFrom' | 'dateTo', value: string) => {
    setCurrentPage(1)
    if (filterType === 'type') {
      setTypeFilter(value)
    } else if (filterType === 'dateFrom') {
      setDateFrom(value)
    } else if (filterType === 'dateTo') {
      setDateTo(value)
    }
  }, [])

  const wastePhotos = useMemo(() => {
    const list = data?.wastePhotosPaginated?.items || []
    return typeFilter === 'ALL'
      ? list
      : list.filter((item: any) => item.recommendedBinType === typeFilter)
  }, [data, typeFilter])

  const paginationMeta = data?.wastePhotosPaginated?.meta

  const renderHistoryItem = useCallback((item: any, index: number) => {
    const type = item.recommendedBinType
    const config = type ? BIN_CONFIGS[type as TrashBinType] : null
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
            {config?.icon || '•'}
          </div>
          <div>
            <div className="font-semibold text-gray-800">
              {config?.label || 'Не определено'}
            </div>
            <div className="text-sm text-gray-600">{item.collectionArea?.name || '—'}</div>
            <div className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-semibold ${item.status === WastePhotoStatus.FAILED ? 'text-red-600' : 'text-green-600'}`}>
            {item.status}
          </div>
          {item.aiExplanation && (
            <div className="text-xs text-gray-500 max-w-xs line-clamp-2">
              {item.aiExplanation}
            </div>
          )}
        </div>
      </motion.div>
    )
  }, [])

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate(-1)} variant="ghost" size="lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </Button>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            Фильтры будут добавлены позже
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">История сортировок</h1>

        <Card className="p-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              value={typeFilter}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="ALL">Все типы</option>
              {Object.values(TrashBinType).map((type) => (
                <option key={type} value={type}>
                  {BIN_CONFIGS[type].label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {loading ? (
            <SkeletonLoader variant="list" count={5} className="bg-white" />
          ) : error ? (
            <div className="text-center text-red-600">Ошибка загрузки истории: {error.message}</div>
          ) : wastePhotos.length === 0 ? (
            <div className="text-center text-gray-600">
              История пока пустая. Начните сортировать отходы.
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {wastePhotos.map((item: any, index: number) => renderHistoryItem(item, index))}
              </div>
              {paginationMeta && (
                <Pagination
                  currentPage={paginationMeta.page}
                  totalPages={paginationMeta.totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={paginationMeta.pageSize}
                  total={paginationMeta.total}
                />
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export default memo(WasteHistoryPage)

