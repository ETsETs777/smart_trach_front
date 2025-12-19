import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'

interface PhotoUploaderProps {
  onUpload: (file: File) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function PhotoUploader({ onUpload, onCancel, isLoading }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = (file: File) => {
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
      onUpload(fileInputRef.current.files[0])
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Загрузите фото отхода</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className={`
          border-4 border-dashed rounded-2xl p-12
          transition-all duration-300
          ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}
          ${preview ? 'border-solid' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
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
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
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
              <Upload className="w-24 h-24 text-gray-400 mx-auto" />
            </motion.div>
            <p className="text-xl text-gray-600 mb-6">
              Перетащите фото сюда или нажмите кнопку ниже
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleCapture} variant="primary" size="lg">
                <Camera className="w-5 h-5 mr-2 inline" />
                Выбрать файл
              </Button>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />

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
          >
            Отправить на анализ
          </Button>
          <Button
            onClick={() => {
              setPreview(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            variant="outline"
            size="lg"
          >
            Отмена
          </Button>
        </motion.div>
      )}
    </Card>
  )
}


