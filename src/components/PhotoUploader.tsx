import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Camera, Upload, X, AlertCircle } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import toast from 'react-hot-toast'

interface PhotoUploaderProps {
  onUpload: (file: File) => void
  onCancel: () => void
  isLoading?: boolean
  maxSizeMB?: number
  acceptedFormats?: string[]
}

const DEFAULT_MAX_SIZE_MB = 10
const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export default function PhotoUploader({ 
  onUpload, 
  onCancel, 
  isLoading = false,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
}: PhotoUploaderProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return t('fileUpload.invalidFormat')
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      return t('fileUpload.fileTooLarge', { maxSize: maxSizeMB })
    }

    return null
  }

  const handleFile = (file: File) => {
    setError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      return
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleCapture = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = () => {
    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0]
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        toast.error(validationError)
        return
      }
      
      // Simulate upload progress (in real app, this would come from upload handler)
      setUploadProgress(0)
      onUpload(file)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto" role="region" aria-label={t('fileUpload.title')}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{t('fileUpload.title')}</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={t('common.cancel')}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 text-sm">{error}</p>
        </motion.div>
      )}

      <div
        className={`
          border-4 border-dashed rounded-2xl p-12
          transition-all duration-300
          ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}
          ${preview ? 'border-solid' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={t('fileUpload.dragDrop')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCapture()
          }
        }}
      >
        {preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-xl max-h-96 object-contain mx-auto"
            />
            <button
              onClick={() => {
                setPreview(null)
                setError(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              aria-label={t('common.delete')}
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-6"
            >
              <Upload className="w-24 h-24 text-gray-400 mx-auto" aria-hidden="true" />
            </motion.div>
            <p className="text-xl text-gray-600 mb-6">
              {t('fileUpload.dragDrop')}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleCapture} variant="primary" size="lg">
                <Camera className="w-5 h-5 mr-2 inline" aria-hidden="true" />
                {t('fileUpload.selectFile')}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {t('fileUpload.invalidFormat')} (JPEG, PNG, WebP). {t('fileUpload.fileTooLarge', { maxSize: maxSizeMB })}.
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        capture="environment"
        onChange={handleChange}
        className="hidden"
        aria-label={t('fileUpload.selectFile')}
      />

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{t('fileUpload.uploading')}</span>
            <span className="text-sm font-semibold text-gray-800">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              className="bg-green-500 h-2 rounded-full"
            />
          </div>
        </div>
      )}

      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mt-6"
        >
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="flex-1"
            disabled={!!error}
          >
            {t('fileUpload.sendForAnalysis')}
          </Button>
          <Button
            onClick={() => {
              setPreview(null)
              setError(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            variant="outline"
            size="lg"
          >
            {t('common.cancel')}
          </Button>
        </motion.div>
      )}
    </Card>
  )
}
