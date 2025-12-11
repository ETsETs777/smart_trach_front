import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { GET_COLLECTION_AREAS, GET_COLLECTION_AREA } from '@/lib/graphql/queries'
import { CREATE_COLLECTION_AREA, UPDATE_COLLECTION_AREA, DELETE_COLLECTION_AREA } from '@/lib/graphql/mutations'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Plus, Edit, Trash2, ArrowLeft, X, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWasteStore } from '@/store/useWasteStore'
import { TrashBinType, BIN_CONFIGS } from '@/types'

interface CollectionAreaFormData {
  name: string
  description?: string
  presentBinTypes: TrashBinType[]
}

export default function CollectionAreasPage() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data, loading, refetch } = useQuery(GET_COLLECTION_AREAS, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const [createArea] = useMutation(CREATE_COLLECTION_AREA, {
    onCompleted: () => {
      toast.success('Область сбора создана!')
      setIsCreating(false)
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка создания области')
    },
  })

  const [updateArea] = useMutation(UPDATE_COLLECTION_AREA, {
    onCompleted: () => {
      toast.success('Область сбора обновлена!')
      setEditingId(null)
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка обновления области')
    },
  })

  const [deleteArea] = useMutation(DELETE_COLLECTION_AREA, {
    onCompleted: () => {
      toast.success('Область сбора удалена!')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка удаления области')
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CollectionAreaFormData>({
    defaultValues: {
      presentBinTypes: [],
    },
  })

  const selectedBins = watch('presentBinTypes') || []

  const toggleBinType = (type: TrashBinType) => {
    const current = selectedBins
    if (current.includes(type)) {
      setValue('presentBinTypes', current.filter(t => t !== type))
    } else {
      setValue('presentBinTypes', [...current, type])
    }
  }

  const onSubmit = async (data: CollectionAreaFormData) => {
    if (!companyId) {
      toast.error('Компания не выбрана')
      return
    }

    if (selectedBins.length === 0) {
      toast.error('Выберите хотя бы один тип контейнера')
      return
    }

    try {
      if (editingId) {
        await updateArea({
          variables: {
            input: {
              id: editingId,
              name: data.name,
              description: data.description || null,
            },
          },
        })
      } else {
        await createArea({
          variables: {
            input: {
              companyId,
              name: data.name,
              description: data.description || null,
              presentBinTypes: selectedBins,
            },
          },
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту область сбора?')) {
      return
    }

    try {
      await deleteArea({
        variables: { id },
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const areas = data?.collectionAreas || []

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              onClick={() => navigate('/admin/dashboard')}
              variant="ghost"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад
            </Button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-4">
              Области сбора
            </h1>
            <p className="text-gray-600 mt-2">Управление точками сбора отходов</p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            variant="primary"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Создать область
          </Button>
        </div>

        {/* Create/Edit Form */}
        <AnimatePresence>
          {(isCreating || editingId) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Редактировать область' : 'Создать новую область'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false)
                      setEditingId(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название области *
                    </label>
                    <input
                      {...register('name', { required: 'Название обязательно' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Например: Кухня 1 этаж"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание (опционально)
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                      placeholder="Дополнительная информация об области сбора"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Типы контейнеров *
                    </label>
                    <div className="grid grid-cols-4 gap-4">
                      {Object.values(TrashBinType).map((type) => {
                        const config = BIN_CONFIGS[type]
                        const isSelected = selectedBins.includes(type)
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleBinType(type)}
                            className={`
                              p-4 rounded-xl border-2 transition-all
                              ${isSelected
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                              }
                            `}
                          >
                            <div className="text-3xl mb-2">{config.icon}</div>
                            <div className="text-sm font-semibold text-gray-800">
                              {config.label}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {selectedBins.length === 0 && (
                      <p className="mt-2 text-sm text-red-600">
                        Выберите хотя бы один тип контейнера
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={selectedBins.length === 0}
                    >
                      {editingId ? 'Сохранить' : 'Создать'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setIsCreating(false)
                        setEditingId(null)
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Areas List */}
        {loading ? (
          <Card className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </Card>
        ) : areas.length === 0 ? (
          <Card className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Нет областей сбора</h2>
            <p className="text-gray-600 mb-6">
              Создайте первую область сбора для вашей компании
            </p>
            <Button onClick={() => setIsCreating(true)} variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Создать область
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area: any) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {area.name}
                    </h3>
                    {area.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {area.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(area.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Контейнеры ({area.bins?.length || 0}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {area.bins?.map((bin: any) => {
                      const config = BIN_CONFIGS[bin.type]
                      return (
                        <span
                          key={bin.id}
                          className="px-3 py-1 rounded-lg text-sm font-medium text-white"
                          style={{ backgroundColor: config.color.replace('bg-', '') }}
                        >
                          {config.icon} {config.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

