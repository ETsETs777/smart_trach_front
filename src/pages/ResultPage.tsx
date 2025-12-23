import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import { GET_WASTE_PHOTO } from '@/lib/graphql/queries'
import { TrashBinType, WastePhotoStatus, BIN_CONFIGS } from '@/types'
import BinIcon from '@/components/ui/BinIcon'
import BinLayout from '@/components/BinLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { CheckCircle, Loader, XCircle, ArrowLeft, Trophy, Info, RefreshCw, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResultPage() {
  const { wastePhotoId } = useParams<{ wastePhotoId: string }>()
  const navigate = useNavigate()
  const [pollingInterval, setPollingInterval] = useState(2000)
  const [progress, setProgress] = useState(15)

  const { data, loading, error, startPolling, stopPolling } = useQuery(GET_WASTE_PHOTO, {
    variables: { id: wastePhotoId },
    skip: !wastePhotoId || wastePhotoId.startsWith('manual'),
    fetchPolicy: 'network-only',
  })

  const wastePhoto = data?.wastePhoto
  const status = wastePhoto?.status
  const recommendedBinType = wastePhoto?.recommendedBinType
  const aiExplanation = wastePhoto?.aiExplanation

  // Handle manual selection
  const isManual = wastePhotoId?.startsWith('manual')
  const manualBinType = isManual
    ? (wastePhotoId.split('/')[1] as TrashBinType)
    : null

  useEffect(() => {
    if (wastePhotoId && !isManual && status === WastePhotoStatus.PENDING) {
      startPolling(pollingInterval)
      return () => stopPolling()
    } else if (status === WastePhotoStatus.CLASSIFIED || status === 'COMPLETED' || status === WastePhotoStatus.FAILED) {
      stopPolling()
      setPollingInterval(0)
    }
  }, [wastePhotoId, status, startPolling, stopPolling, isManual, pollingInterval])

  useEffect(() => {
    if (status === WastePhotoStatus.PENDING) {
      const timer = setInterval(() => {
        setProgress((value) => Math.min(value + Math.random() * 8, 90))
      }, 900)
      return () => clearInterval(timer)
    }

    if (status === WastePhotoStatus.CLASSIFIED || status === 'COMPLETED') {
      setProgress(100)
    }

    if (status === WastePhotoStatus.FAILED) {
      setProgress(0)
      toast.error('Не удалось определить тип отхода, выберите вариант ниже')
    }
  }, [status])

  if (loading && !wastePhoto) {
    return <LoadingSpinner fullScreen text="Загрузка результата..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-2xl text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ошибка</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <Button onClick={() => navigate('/')} variant="primary">
            Вернуться на главную
          </Button>
        </Card>
      </div>
    )
  }

  const binType = isManual ? manualBinType : recommendedBinType
  const config = binType ? BIN_CONFIGS[binType] : null

  return (
    <div className="min-h-screen p-8 landscape:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад
          </Button>
        </div>

        {/* Status indicator */}
        {!isManual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                {status === WastePhotoStatus.PENDING && (
                  <>
                    <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                    <div>
                      <h3 className="font-semibold text-lg">Обработка...</h3>
                      <p className="text-gray-600">Анализируем ваш отход</p>
                      <div className="mt-3">
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <motion.div
                            initial={{ width: '10%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Обычно это занимает до 15 секунд</p>
                      </div>
                    </div>
                  </>
                )}
                {(status === WastePhotoStatus.CLASSIFIED || status === 'COMPLETED') && (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold text-lg">Готово!</h3>
                      <p className="text-gray-600">Анализ завершён</p>
                    </div>
                  </>
                )}
                {status === WastePhotoStatus.FAILED && (
                  <>
                    <XCircle className="w-8 h-8 text-red-500" />
                    <div>
                      <h3 className="font-semibold text-lg">Ошибка</h3>
                      <p className="text-gray-600">Не удалось определить тип отхода</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate('/tablet')}
                          className="flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Выбрать тип вручную
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/tablet')}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Попробовать снова
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Main result */}
        {config && (
          <AnimatePresence mode="wait">
            <motion.div
              key={binType}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-8">
                {/* Left: Bin recommendation */}
                <Card className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Используйте этот контейнер
                    </h2>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <BinIcon type={binType} size="xl" highlighted />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-gray-800 mt-6">
                      {config.label}
                    </h3>
                  </div>

                  {/* Bin Layout if collection area available */}
                  {wastePhoto?.collectionArea?.bins && wastePhoto.collectionArea.bins.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <BinLayout
                        availableBins={wastePhoto.collectionArea.bins.map((bin: any) => bin.type)}
                        highlightedBin={binType}
                      />
                    </div>
                  )}

                  {aiExplanation && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{aiExplanation}</p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Right: Instructions */}
                <Card className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    Инструкции
                  </h2>
                  <ul className="space-y-4">
                    {config.instructions.map((instruction, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                      >
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-lg">{instruction}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Gamification */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Вы получили</p>
                        <p className="text-3xl font-bold">+10 очков</p>
                      </div>
                      <Trophy className="w-12 h-12" />
                    </div>
                  </motion.div>
                </Card>
              </div>

              {/* Image preview if available */}
              {wastePhoto?.image && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Ваше фото</h3>
                    <img
                      src={wastePhoto.image.url}
                      alt="Waste photo"
                      className="w-full max-w-md mx-auto rounded-xl"
                    />
                  </Card>
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="mt-8 flex gap-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  Отлично! Продолжить
                </Button>
                <Button
                  onClick={() => navigate('/leaderboard')}
                  variant="outline"
                  size="lg"
                >
                  Посмотреть рейтинг
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {!config && status === WastePhotoStatus.FAILED && (
          <Card className="text-center p-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Не удалось определить тип</h2>
            <p className="text-gray-600 mb-6">
              Попробуйте сделать более чёткое фото или выберите тип вручную
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/')} variant="primary" size="lg">
                Попробовать снова
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

