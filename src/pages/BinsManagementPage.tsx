import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  GET_COLLECTION_AREAS,
  GET_COLLECTION_AREA_BINS,
} from '@/lib/graphql/queries'
import {
  ADD_BINS_TO_COLLECTION_AREA,
  DELETE_COLLECTION_AREA_BIN,
  UPDATE_COLLECTION_AREA_BIN,
} from '@/lib/graphql/mutations'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { useWasteStore } from '@/store/useWasteStore'
import { TrashBinType, BIN_CONFIGS } from '@/types'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Plus, Trash2, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AddBinsFormData {
  types: TrashBinType[]
}

export default function BinsManagementPage() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)

  const { data: areasData, loading: areasLoading } = useQuery(GET_COLLECTION_AREAS, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const { data: binsData, loading: binsLoading, refetch: refetchBins } = useQuery(
    GET_COLLECTION_AREA_BINS,
    {
      variables: { areaId: selectedAreaId },
      skip: !selectedAreaId,
    },
  )

  const [addBins, { loading: adding }] = useMutation(ADD_BINS_TO_COLLECTION_AREA, {
    onCompleted: () => {
      toast.success('Контейнеры добавлены')
      refetchBins()
      reset()
    },
    onError: (error) => toast.error(error.message || 'Ошибка добавления контейнеров'),
  })

  const [deleteBin] = useMutation(DELETE_COLLECTION_AREA_BIN, {
    onCompleted: () => {
      toast.success('Контейнер удалён')
      refetchBins()
    },
    onError: (error) => toast.error(error.message || 'Ошибка удаления контейнера'),
  })

  const [updateBin, { loading: updatingBin }] = useMutation(UPDATE_COLLECTION_AREA_BIN, {
    onCompleted: () => {
      toast.success('Контейнер обновлён')
      refetchBins()
    },
    onError: (error) => toast.error(error.message || 'Ошибка обновления контейнера'),
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddBinsFormData>({
    defaultValues: {
      types: [],
    },
  })

  const selectedTypes = watch('types') || []

  const toggleType = (type: TrashBinType) => {
    const current = selectedTypes
    if (current.includes(type)) {
      setValue(
        'types',
        current.filter((t) => t !== type),
      )
    } else {
      setValue('types', [...current, type])
    }
  }

  const onSubmit = async (data: AddBinsFormData) => {
    if (!selectedAreaId) {
      toast.error('Выберите область сбора')
      return
    }
    if (data.types.length === 0) {
      toast.error('Выберите хотя бы один тип контейнера')
      return
    }
    await addBins({
      variables: {
        input: {
          areaId: selectedAreaId,
          types: data.types,
        },
      },
    })
  }

  const areas = useMemo(() => areasData?.collectionAreas || [], [areasData])
  const bins = useMemo(() => binsData?.collectionAreaBins || [], [binsData])

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
              Контейнеры
            </h1>
            <p className="text-gray-600 mt-2">Управление контейнерами в точках сбора</p>
          </div>
        </div>

        {/* Select area */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Выберите область сбора</h2>
          {areasLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <SkeletonLoader key={i} variant="rectangular" height="60px" className="bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : areas.length === 0 ? (
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5" />
              Сначала создайте область сбора
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {areas.map((area: any) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${
                    selectedAreaId === area.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {area.name}
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Bins list and add form */}
        {selectedAreaId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Добавить контейнеры</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(TrashBinType).map((type) => {
                    const config = BIN_CONFIGS[type]
                    const selected = selectedTypes.includes(type)
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          selected
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl">{config.icon}</div>
                        <div className="text-sm font-semibold text-gray-800 mt-1">{config.label}</div>
                      </button>
                    )
                  })}
                </div>
                {errors.types && (
                  <p className="text-sm text-red-600">Выберите хотя бы один тип</p>
                )}
                <Button type="submit" variant="primary" size="lg" isLoading={adding}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Контейнеры области</h3>
                  <p className="text-sm text-gray-600">Изменяйте тип или удаляйте контейнер</p>
                </div>
              </div>

              {binsLoading ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
              ) : bins.length === 0 ? (
                <div className="text-center text-gray-600 py-6">Контейнеров пока нет</div>
              ) : (
                <div className="space-y-3">
                  {bins.map((bin: any, index: number) => {
                    const config = BIN_CONFIGS[bin.type]
                    return (
                      <motion.div
                        key={bin.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{config.icon}</div>
                          <div>
                            <div className="font-semibold text-gray-800">{config.label}</div>
                            <div className="text-sm text-gray-500">{bin.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={bin.type}
                            onChange={(e) =>
                              updateBin({
                                variables: {
                                  input: {
                                    id: bin.id,
                                    type: e.target.value,
                                  },
                                },
                              })
                            }
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                            disabled={updatingBin}
                          >
                            {Object.values(TrashBinType).map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              deleteBin({
                                variables: { id: bin.id },
                              })
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

