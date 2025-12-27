import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useSubscription } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GET_WASTE_PHOTO } from '@/lib/graphql/queries'
import { WASTE_PHOTO_STATUS_SUBSCRIPTION } from '@/lib/graphql/subscriptions'
import { TrashBinType, WastePhotoStatus, BIN_CONFIGS } from '@/types'
import BinIcon from '@/components/ui/BinIcon'
import BinLayout from '@/components/BinLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProgressBar from '@/components/ui/ProgressBar'
import { CheckCircle, Loader, XCircle, ArrowLeft, Trophy, Info, RefreshCw, AlertTriangle } from 'lucide-react'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import LazyImage from '@/components/ui/LazyImage'

export default function ResultPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { wastePhotoId } = useParams<{ wastePhotoId: string }>()
  
  if (!wastePhotoId) {
    useEffect(() => {
      navigate('/')
    }, [])
    return null
  }
  const [progress, setProgress] = useState(15)
  const { showNotification, hasPermission } = usePushNotifications()

  // Handle manual selection
  const isManual = wastePhotoId?.startsWith('manual-')
  const manualBinType = isManual
    ? (wastePhotoId.replace('manual-', '') as TrashBinType)
    : null

  // Initial query to get waste photo
  const { data, loading, error } = useQuery(GET_WASTE_PHOTO, {
    variables: { id: wastePhotoId },
    skip: !wastePhotoId || isManual,
    fetchPolicy: 'network-only',
  })

  // Real-time subscription for status updates
  const { data: subscriptionData } = useSubscription(WASTE_PHOTO_STATUS_SUBSCRIPTION, {
    variables: { wastePhotoId },
    skip: !wastePhotoId || isManual,
    onData: ({ data: subData }) => {
      if (subData?.data?.wastePhotoStatusUpdated) {
        const updatedStatus = subData.data.wastePhotoStatusUpdated.status
        const updatedPhoto = subData.data.wastePhotoStatusUpdated
        
        if (updatedStatus === WastePhotoStatus.CLASSIFIED) {
          setProgress(100)
          toastSuccess(t('result.classificationComplete'))
          
          // Show push notification if permission granted
          if (hasPermission) {
            const binType = updatedPhoto.recommendedBinType as TrashBinType | undefined
            const binConfig = binType && binType in BIN_CONFIGS ? BIN_CONFIGS[binType] : null
            showNotification({
              title: t('result.classificationComplete'),
              body: binConfig 
                ? t('result.recommendedBin', { bin: binConfig.label })
                : t('result.wasteClassified'),
              icon: '/icon-192x192.png',
              tag: `waste-photo-${wastePhotoId}`,
              data: { url: `/result/${wastePhotoId}` },
              requireInteraction: false,
            })
          }
        } else if (updatedStatus === WastePhotoStatus.FAILED) {
          setProgress(0)
          toastError(t('result.failedToDetermine'))
          
          // Show push notification for failure
          if (hasPermission) {
            showNotification({
              title: t('result.classificationFailed'),
              body: t('result.failedToDetermine'),
              icon: '/icon-192x192.png',
              tag: `waste-photo-${wastePhotoId}`,
              data: { url: `/result/${wastePhotoId}` },
            })
          }
        }
      }
    },
  })

  // Use subscription data if available, otherwise use query data
  const wastePhoto = subscriptionData?.wastePhotoStatusUpdated || data?.wastePhoto
  const status = wastePhoto?.status
  const recommendedBinType = wastePhoto?.recommendedBinType
  const aiExplanation = wastePhoto?.aiExplanation

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
      toastError(t('result.failedToDetermine'))
    }
  }, [status, t])

  if (loading && !wastePhoto) {
    return <LoadingSpinner fullScreen text={t('result.loadingResult')} />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-2xl text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">{t('result.error')}</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <Button onClick={() => navigate('/')} variant="primary">
            {t('result.returnHome')}
          </Button>
        </Card>
      </div>
    )
  }

  const binType = (isManual ? manualBinType : recommendedBinType) as TrashBinType | undefined
  const config = binType && binType in BIN_CONFIGS ? BIN_CONFIGS[binType] : null

  return (
    <div className="min-h-screen p-8 landscape:px-16">
      <main id="main-content" className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('common.back')}
            </Button>
          </header>

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
                      <h3 className="font-semibold text-lg">{t('result.processing')}</h3>
                      <p className="text-gray-600">{t('result.analyzingWaste')}</p>
                      <div className="mt-3 w-full">
                        <ProgressBar
                          progress={progress}
                          animated
                          showLabel
                          ariaLabel={t('result.processing')}
                        />
                        <p className="text-xs text-gray-500 mt-2">{t('result.usuallyTakes')}</p>
                      </div>
                    </div>
                  </>
                )}
                {(status === WastePhotoStatus.CLASSIFIED || status === 'COMPLETED') && (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold text-lg">{t('result.ready')}</h3>
                      <p className="text-gray-600">{t('result.analysisComplete')}</p>
                    </div>
                  </>
                )}
                {status === WastePhotoStatus.FAILED && (
                  <>
                    <XCircle className="w-8 h-8 text-red-500" />
                    <div>
                      <h3 className="font-semibold text-lg">{t('result.error')}</h3>
                      <p className="text-gray-600">{t('result.failedToDetermine')}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate('/tablet')}
                          className="flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          {t('result.selectTypeManually')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/tablet')}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          {t('result.tryAgain')}
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
                  <div className="text-center mb-6" role="region" aria-label={t('result.useThisContainer')}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      {t('result.useThisContainer')}
                    </h2>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 200, 
                        damping: 15,
                        duration: 0.6
                      }}
                      aria-hidden="true"
                    >
                      {binType && <BinIcon type={binType} size="xl" highlighted />}
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-gray-800 mt-6" aria-label={`${t('result.useThisContainer')}: ${config.label}`}>
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
                    {t('result.instructions')}
                  </h2>
                  <ul className="space-y-4" role="list" aria-label={t('result.instructions')}>
                    {config.instructions.map((instruction: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          type: 'spring',
                          stiffness: 100,
                          damping: 15
                        }}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                        role="listitem"
                      >
                        <CheckCircle 
                          className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" 
                          aria-hidden="true"
                        />
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
                        <p className="text-sm opacity-90">{t('result.pointsEarned')}</p>
                        <p className="text-3xl font-bold">+10 {t('result.points')}</p>
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
                    <h3 className="text-xl font-semibold mb-4">{t('result.yourPhoto')}</h3>
                    <LazyImage
                      src={wastePhoto.image.url}
                      alt={t('result.yourPhoto')}
                      className="w-full max-w-md mx-auto rounded-xl"
                      aria-label={t('result.yourPhoto')}
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
                  {t('result.excellentContinue')}
                </Button>
                <Button
                  onClick={() => navigate('/leaderboard')}
                  variant="outline"
                  size="lg"
                >
                  {t('result.viewLeaderboard')}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {!config && status === WastePhotoStatus.FAILED && (
          <Card className="text-center p-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">{t('result.failedToDetermineType')}</h2>
            <p className="text-gray-600 mb-6">
              {t('result.tryClearerPhoto')}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/')} variant="primary" size="lg">
                {t('result.tryAgain')}
              </Button>
            </div>
          </Card>
        )}
        </motion.div>
      </main>
    </div>
  )
}


      </main>
    </div>
  )
}


      </main>
    </div>
  )
}

