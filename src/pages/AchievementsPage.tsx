import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { GET_COMPANY_ACHIEVEMENTS } from '@/lib/graphql/queries'
import { CREATE_ACHIEVEMENT } from '@/lib/graphql/mutations'
import { UPDATE_ACHIEVEMENT, DELETE_ACHIEVEMENT } from '@/lib/graphql/mutations'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { Plus, Trophy, Target, Calendar, Award, ArrowLeft, X, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWasteStore } from '@/store/useWasteStore'

interface AchievementFormData {
  title: string
  description: string
  criterionType: 'TOTAL_PHOTOS' | 'CORRECT_BIN_MATCHES' | 'STREAK_DAYS'
  threshold: number
}

const criterionTypes = [
  {
    value: 'TOTAL_PHOTOS',
    label: 'Общее количество сортировок',
    icon: Target,
    description: 'Ачивка за общее количество выполненных сортировок',
  },
  {
    value: 'CORRECT_BIN_MATCHES',
    label: 'Правильные сортировки',
    icon: Award,
    description: 'Ачивка за количество правильных сортировок',
  },
  {
    value: 'STREAK_DAYS',
    label: 'Дни подряд',
    icon: Calendar,
    description: 'Ачивка за количество дней подряд с сортировкой',
  },
]

export default function AchievementsPage() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()
  const [isCreating, setIsCreating] = useState(false)

  const { data, loading, refetch } = useQuery(GET_COMPANY_ACHIEVEMENTS, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const [createAchievement] = useMutation(CREATE_ACHIEVEMENT, {
    onCompleted: () => {
      toast.success('Ачивка создана!')
      setIsCreating(false)
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка создания ачивки')
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AchievementFormData>({
    defaultValues: {
      criterionType: 'TOTAL_PHOTOS',
      threshold: 10,
    },
  })

  const selectedCriterionType = watch('criterionType')
  
  const handleCriterionChange = (value: 'TOTAL_PHOTOS' | 'CORRECT_BIN_MATCHES' | 'STREAK_DAYS') => {
    setValue('criterionType', value)
  }

  const [updateAchievement] = useMutation(UPDATE_ACHIEVEMENT, {
    onCompleted: () => {
      toast.success('Ачивка обновлена')
      refetch()
    },
    onError: (error) => toast.error(error.message || 'Ошибка обновления ачивки'),
  })

  const [deleteAchievement] = useMutation(DELETE_ACHIEVEMENT, {
    onCompleted: () => {
      toast.success('Ачивка удалена')
      refetch()
    },
    onError: (error) => toast.error(error.message || 'Ошибка удаления ачивки'),
  })

  const onSubmit = async (data: AchievementFormData) => {
    if (!companyId) {
      toast.error('Компания не выбрана')
      return
    }

    try {
      await createAchievement({
        variables: {
          input: {
            companyId,
            title: data.title,
            description: data.description,
            criterionType: data.criterionType,
            threshold: data.threshold,
          },
        },
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const achievements = data?.companyAchievements || []

  const getCriterionLabel = (type: string) => {
    const criterion = criterionTypes.find(c => c.value === type)
    return criterion ? t(criterion.label) : type
  }

  const getCriterionIcon = (type: string) => {
    const criterion = criterionTypes.find(c => c.value === type)
    const Icon = criterion?.icon || Trophy
    return Icon
  }

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
              {t('common.back')}
            </Button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-4">
              {t('admin.achievements.title')}
            </h1>
            <p className="text-gray-600 mt-2">{t('admin.achievements.subtitle')}</p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            variant="primary"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('admin.achievements.createAchievement')}
          </Button>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{t('admin.achievements.createNewAchievement')}</h2>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название ачивки *
                    </label>
                    <input
                      {...register('title', { required: t('admin.achievements.achievementNameRequired') })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder={t('admin.achievements.achievementNamePlaceholder')}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.achievements.achievementDescription')} *
                    </label>
                    <textarea
                      {...register('description', { required: t('admin.achievements.achievementDescriptionRequired') })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                      placeholder={t('admin.achievements.achievementDescriptionPlaceholder')}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t('admin.achievements.criterionType')} *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {criterionTypes.map((criterion) => {
                        const Icon = criterion.icon
                        const isSelected = selectedCriterionType === criterion.value
                        return (
                          <label
                            key={criterion.value}
                            onClick={() => handleCriterionChange(criterion.value as any)}
                            className={`
                              p-4 rounded-xl border-2 transition-all text-left cursor-pointer
                              ${isSelected
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              {...register('criterionType', { required: true })}
                              value={criterion.value}
                              className="hidden"
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                            <div className="font-semibold text-gray-800 mb-1">
                              {t(criterion.label)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {t(criterion.description)}
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.achievements.threshold')} *
                    </label>
                    <input
                      type="number"
                      {...register('threshold', {
                        required: t('admin.achievements.thresholdRequired'),
                        min: { value: 1, message: t('admin.achievements.thresholdMin') },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="10"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {t('admin.achievements.thresholdDescription')}
                    </p>
                    {errors.threshold && (
                      <p className="mt-1 text-sm text-red-600">{errors.threshold.message}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                    >
                      {t('admin.achievements.createAchievement')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setIsCreating(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements List */}
        {loading ? (
          <Card className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </Card>
        ) : achievements.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Нет ачивок</h2>
            <p className="text-gray-600 mb-6">
              Создайте первую ачивку для мотивации сотрудников
            </p>
            <Button onClick={() => setIsCreating(true)} variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Создать ачивку
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement: any) => {
              const CriterionIcon = getCriterionIcon(achievement.criterionType)
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-2xl p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => {
                          const newTitle = prompt('Новое название ачивки', achievement.title) || achievement.title
                          const newDesc = prompt('New description', achievement.description) || achievement.description
                          const newThreshold = Number(
                            prompt('Threshold value', String(achievement.threshold)) || achievement.threshold,
                          )
                          updateAchievement({
                            variables: {
                              id: achievement.id,
                              title: newTitle,
                              description: newDesc,
                              threshold: Number.isFinite(newThreshold) ? newThreshold : achievement.threshold,
                            },
                          })
                        }}
                      >
                        <Award className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() =>
                          deleteAchievement({
                            variables: { id: achievement.id },
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {achievement.description}
                  </p>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <CriterionIcon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">
                        {getCriterionLabel(achievement.criterionType)}
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {achievement.threshold}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

