import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { QrCode, Camera, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BarcodeScannerPage() {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto">
        <Button onClick={() => navigate(-1)} variant="ghost" size="lg" className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Назад
        </Button>

        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4"
          >
            <QrCode className="w-12 h-12 text-purple-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Сканирование штрихкода</h1>
          <p className="text-gray-600 mb-6">
            Возможность сканирования будет доступна в следующей версии. Пока используйте фото или
            ручной выбор типа отхода.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsScanning(!isScanning)}
              disabled
            >
              <Camera className="w-5 h-5 mr-2" />
              Начать сканирование (скоро)
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/')}>
              На главную
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

