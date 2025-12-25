import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { QrCode, Camera, ArrowLeft, X, CheckCircle, AlertCircle } from 'lucide-react'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import logger from '@/lib/logger'

export default function BarcodeScannerPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isScanning, setIsScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scanAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch((err) => {
          logger.warn('Error stopping scanner', err, 'BarcodeScannerPage')
        })
      }
    }
  }, [isScanning])

  const startScanning = async () => {
    try {
      setError(null)
      setScannedCode(null)
      
      const scanner = new Html5Qrcode('scanner-container')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback
          handleScannedCode(decodedText)
        },
        (errorMessage) => {
          // Error callback - ignore most errors as they're just "no QR code found"
          if (errorMessage && !errorMessage.includes('NotFoundException')) {
            logger.debug('Scanning error', new Error(errorMessage), 'BarcodeScannerPage')
          }
        }
      )

      setIsScanning(true)
      toast.success(t('barcode.scanningStarted') || 'Сканирование начато')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      logger.error('Failed to start scanner', err instanceof Error ? err : new Error(errorMessage), 'BarcodeScannerPage')
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setError(t('barcode.cameraPermissionDenied') || 'Доступ к камере запрещен. Разрешите доступ в настройках браузера.')
      } else if (errorMessage.includes('NotFoundError')) {
        setError(t('barcode.cameraNotFound') || 'Камера не найдена. Убедитесь, что устройство имеет камеру.')
      } else {
        setError(t('barcode.scanningError') || `Ошибка сканирования: ${errorMessage}`)
      }
      setIsScanning(false)
      toast.error(errorMessage)
    }
  }

  const stopScanning = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop()
        scannerRef.current.clear()
        scannerRef.current = null
      }
      setIsScanning(false)
      toast.success(t('barcode.scanningStopped') || 'Сканирование остановлено')
    } catch (err) {
      logger.error('Error stopping scanner', err instanceof Error ? err : new Error(String(err)), 'BarcodeScannerPage')
    }
  }

  const handleScannedCode = (code: string) => {
    setScannedCode(code)
    stopScanning()
    
    // Try to determine waste type from barcode
    // For now, navigate to manual selection with barcode info
    // In future, this could query a barcode database
    toast.success(t('barcode.codeScanned') || `Код отсканирован: ${code}`)
    
    // Navigate to result page with barcode info
    // This could be enhanced to lookup barcode in database
    setTimeout(() => {
      navigate(`/result/barcode-${encodeURIComponent(code)}`)
    }, 1500)
  }

  const handleFileScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setError(null)
      const scanner = new Html5Qrcode('scanner-container')
      
      const decodedText = await scanner.scanFile(file, false)
      handleScannedCode(decodedText)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      logger.error('File scan error', err instanceof Error ? err : new Error(errorMessage), 'BarcodeScannerPage')
      setError(t('barcode.fileScanError') || `Ошибка сканирования файла: ${errorMessage}`)
      toast.error(errorMessage)
    }
  }

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 landscape:px-8 lg:landscape:px-16 text-white">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            size="lg" 
            className="mb-6 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </Button>

          <Card className="p-6 sm:p-8 md:p-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-8"
            >
              <div className="w-24 h-24 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-12 h-12 text-purple-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                {t('home.barcodeScanning') || 'Сканирование штрихкода'}
              </h1>
              <p className="text-gray-600 mb-6">
                {t('barcode.description') || 'Отсканируйте штрихкод или QR-код на упаковке для определения типа отхода'}
              </p>
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Закрыть"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success message */}
            <AnimatePresence>
              {scannedCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      {t('barcode.codeScanned') || 'Код успешно отсканирован!'}
                    </p>
                    <p className="text-xs text-green-600 font-mono break-all">{scannedCode}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanner container */}
            <div className="mb-6">
              <div
                id="scanner-container"
                ref={scanAreaRef}
                className={`w-full rounded-xl overflow-hidden bg-gray-900 ${
                  isScanning ? 'min-h-[400px]' : 'min-h-[200px] flex items-center justify-center'
                }`}
              >
                {!isScanning && (
                  <div className="text-center text-white/60 p-8">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">
                      {t('barcode.clickToStart') || 'Нажмите кнопку ниже, чтобы начать сканирование'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isScanning ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={startScanning}
                    className="min-h-[56px] text-lg"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {t('barcode.startScanning') || 'Начать сканирование'}
                  </Button>
                  <label className="cursor-pointer">
                    <Button
                      variant="outline"
                      size="lg"
                      className="min-h-[56px] text-lg w-full sm:w-auto"
                      as="span"
                    >
                      <QrCode className="w-5 h-5 mr-2" />
                      {t('barcode.scanFromFile') || 'Сканировать из файла'}
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileScan}
                      className="hidden"
                      aria-label={t('barcode.scanFromFile') || 'Сканировать из файла'}
                    />
                  </label>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={stopScanning}
                  className="min-h-[56px] text-lg"
                >
                  <X className="w-5 h-5 mr-2" />
                  {t('barcode.stopScanning') || 'Остановить сканирование'}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/')}
                className="min-h-[56px] text-lg"
              >
                {t('common.back')} to Home
              </Button>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                {t('barcode.instructions') || 'Инструкция:'}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>{t('barcode.instruction1') || 'Разрешите доступ к камере при запросе'}</li>
                <li>{t('barcode.instruction2') || 'Наведите камеру на штрихкод или QR-код'}</li>
                <li>{t('barcode.instruction3') || 'Держите устройство неподвижно до распознавания'}</li>
                <li>{t('barcode.instruction4') || 'Или загрузите фото с кодом через кнопку "Сканировать из файла"'}</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </GreenGradientBackground>
  )
}


