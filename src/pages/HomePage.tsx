import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import WasteMethodSelector from '@/components/WasteMethodSelector'
import PhotoUploader from '@/components/PhotoUploader'
import ManualSelector from '@/components/ManualSelector'
import { CREATE_WASTE_PHOTO } from '@/lib/graphql/queries'
import { useWasteStore } from '@/store/useWasteStore'
import { TrashBinType } from '@/types'
import { Recycle, Sparkles } from 'lucide-react'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'

type Method = 'photo' | 'manual' | 'barcode' | null

export default function HomePage() {
  const [method, setMethod] = useState<Method>(null)
  const [createWastePhoto, { loading }] = useMutation(CREATE_WASTE_PHOTO)
  const navigate = useNavigate()
  const { companyId, collectionAreaId, setCompanyId } = useWasteStore()
  
  // Проверяем, авторизован ли пользователь
  const isAuthenticated = !!localStorage.getItem('auth_token')
  
  // Если не авторизован и нет companyId, используем дефолтный или показываем предупреждение
  const effectiveCompanyId = companyId || import.meta.env.VITE_DEFAULT_COMPANY_ID || null

  const handlePhotoUpload = async (file: File) => {
    try {
      // First, upload the image
      const formData = new FormData()
      formData.append('file', file)

      // Upload image first
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const uploadResponse = await fetch(`${apiUrl}/images/upload`, {
        method: 'POST',
        body: formData,
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
        toast.success('Фото отправлено на анализ!')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Ошибка при загрузке фото')
    }
  }

  const handleManualSelect = (type: TrashBinType) => {
    // For manual selection, we can navigate directly to result
    // or create a waste photo with the selected type
    navigate(`/result/manual/${type}`)
  }

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white">
      {/* Предупреждение для неавторизованных пользователей */}
      {!isAuthenticated && !effectiveCompanyId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 glass rounded-xl p-4 border border-yellow-300/50 bg-yellow-500/20"
        >
          <p className="text-sm text-white">
            ⚠️ Вы используете демо-режим. Для полного функционала{' '}
            <button
              onClick={() => navigate('/register')}
              className="underline font-semibold"
            >
              зарегистрируйте компанию
            </button>
            {' '}или{' '}
            <button
              onClick={() => navigate('/login')}
              className="underline font-semibold"
            >
              войдите в систему
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
          <h1 className="text-6xl font-bold text-white">
            Smart Trash
          </h1>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
        </div>
        <p className="text-2xl text-white/90 mb-4">
          Интерактивный помощник по раздельному сбору отходов
        </p>
        <p className="text-lg text-white/80">
          Определите тип отхода и получите инструкции по правильной утилизации
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
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Сканирование штрихкода</h2>
            <p className="text-white/90 mb-8">
              Функция сканирования штрихкода будет доступна в ближайшее время
            </p>
            <button
              onClick={() => setMethod(null)}
              className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Назад
            </button>
          </div>
        </div>
      ) : null}

      {/* Stats or additional info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex gap-8 glass rounded-2xl px-12 py-6">
          <div>
            <div className="text-4xl font-bold text-green-600">♻️</div>
            <div className="text-sm text-white/80 mt-2">Экологично</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">⚡</div>
            <div className="text-sm text-white/80 mt-2">Быстро</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">🎯</div>
            <div className="text-sm text-white/80 mt-2">Точно</div>
          </div>
        </div>
      </motion.div>
      </div>
    </GreenGradientBackground>
  )
}

