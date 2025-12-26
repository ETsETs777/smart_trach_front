import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import { useTranslation } from 'react-i18next'
import WasteMethodSelector from '@/components/WasteMethodSelector'
import PhotoUploader from '@/components/PhotoUploader'
import ManualSelector from '@/components/ManualSelector'
import { CREATE_WASTE_PHOTO } from '@/lib/graphql/queries'
import { useWasteStore } from '@/store/useWasteStore'
import { TrashBinType } from '@/types'
import { Recycle, Sparkles, QrCode } from 'lucide-react'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import logger from '@/lib/logger'
import { tokenStorage } from '@/lib/auth/tokenStorage'
import { getCsrfToken } from '@/lib/auth/csrf'
import { withRateLimit, RATE_LIMITS } from '@/lib/utils/rateLimiter'

type Method = 'photo' | 'manual' | 'barcode' | null

export default function HomePage() {
  const { t } = useTranslation()
  const [method, setMethod] = useState<Method>(null)
  const [createWastePhoto, { loading }] = useMutation(CREATE_WASTE_PHOTO)
  const navigate = useNavigate()
  const { companyId, collectionAreaId } = useWasteStore()
  
  // Проверяем, авторизован ли пользователь
  const isAuthenticated = tokenStorage.isAuthenticated()
  
  // Если не авторизован и нет companyId, используем дефолтный или показываем предупреждение
  const effectiveCompanyId = companyId || import.meta.env.VITE_DEFAULT_COMPANY_ID || null

  const handlePhotoUpload = async (file: File) => {
    try {
      await withRateLimit(
        'UPLOAD',
        async () => {
          // First, upload the image
          const formData = new FormData()
          formData.append('file', file)

          // Upload image first
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
          const csrfToken = await getCsrfToken()
          const uploadResponse = await fetch(`${apiUrl}/images/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include', // Include cookies
            headers: {
              ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
            },
          })

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            throw new Error(`Failed to upload image: ${errorText}`)
          }

          const imageData = await uploadResponse.json()
          const imageId = imageData.id

          // Then create waste photo
          const { data } = await createWastePhoto({
            variables: {
              input: {
                companyId: effectiveCompanyId || 'default-company-id',
                imageId,
                collectionAreaId: collectionAreaId || import.meta.env.VITE_DEFAULT_COLLECTION_AREA_ID || null,
              },
            },
          })

          if (data?.createWastePhoto?.id) {
            // Сохраняем ID для использования
            const wastePhotoId = data.createWastePhoto.id
            navigate(`/result/${wastePhotoId}`)
            toastSuccess(t('home.photoSent'))
          }
        },
        RATE_LIMITS.UPLOAD.maxRequests,
        RATE_LIMITS.UPLOAD.windowMs,
      )
    } catch (error) {
      logger.error('Error uploading photo', error instanceof Error ? error : new Error(String(error)), 'HomePage')
      toastError(t('home.photoUploadError', { error: error instanceof Error ? error.message : String(error) }))
    }
  }

  const handleManualSelect = (type: TrashBinType) => {
    // For manual selection, we can navigate directly to result
    // or create a waste photo with the selected type
    navigate(`/result/manual-${type}`)
  }

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 landscape:px-8 lg:landscape:px-16 text-white">
      {/* Предупреждение для неавторизованных пользователей */}
      {!isAuthenticated && !effectiveCompanyId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 glass rounded-xl p-4 border border-yellow-300/50 bg-yellow-500/20"
        >
          <p className="text-sm text-white">
            {t('home.demoWarning')}{' '}
            <button
              onClick={() => navigate('/register')}
              className="underline font-semibold hover:text-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
              aria-label={t('home.registerCompany')}
            >
              {t('home.registerCompany')}
            </button>
            {' '}{t('home.or')}{' '}
            <button
              onClick={() => navigate('/login')}
              className="underline font-semibold hover:text-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
              aria-label={t('home.loginToSystem')}
            >
              {t('home.loginToSystem')}
            </button>
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Recycle className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            {t('home.title')}
          </h1>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
        </div>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-4">
          {t('home.subtitle')}
        </p>
        <p className="text-sm sm:text-base md:text-lg text-white/80">
          {t('home.description')}
        </p>
      </motion.div>

      {!method ? (
        <WasteMethodSelector onSelectMethod={setMethod} />
      ) : method === 'photo' ? (
        <PhotoUploader
          onUpload={handlePhotoUpload}
          onCancel={() => setMethod(null)}
          isLoading={loading}
        />
      ) : method === 'manual' ? (
        <ManualSelector
          onSelect={handleManualSelect}
          onCancel={() => setMethod(null)}
        />
      ) : method === 'barcode' ? (
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-8 sm:p-12 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              {t('home.barcodeScanning')}
            </h2>
            <p className="text-white/90 mb-8 text-lg sm:text-xl">
              {t('barcode.description') || 'Отсканируйте штрихкод или QR-код на упаковке'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/barcode')}
                variant="primary"
                size="xl"
                className="min-h-[64px] text-xl px-12 touch-target"
                aria-label={t('barcode.startScanning') || 'Начать сканирование'}
              >
                <QrCode className="w-6 h-6 mr-2" aria-hidden="true" />
                {t('barcode.startScanning') || 'Начать сканирование'}
              </Button>
              <Button
                onClick={() => setMethod(null)}
                variant="outline"
                size="xl"
                className="min-h-[64px] text-xl px-12 bg-white/10 border-white/30 text-white hover:bg-white/20 touch-target"
                aria-label={t('common.back')}
              >
                {t('common.back')}
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}

      {/* Stats or additional info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 glass rounded-2xl px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6">
          <div>
            <div className="text-4xl font-bold text-green-600">♻️</div>
            <div className="text-sm text-white/80 mt-2">{t('home.ecoFriendly')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">⚡</div>
            <div className="text-sm text-white/80 mt-2">{t('home.fast')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">🎯</div>
            <div className="text-sm text-white/80 mt-2">{t('home.accurate')}</div>
          </div>
        </div>
      </motion.div>
      </div>
    </GreenGradientBackground>
  )
}

