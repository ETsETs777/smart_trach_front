import { motion } from 'framer-motion'
import { Camera, List, QrCode } from 'lucide-react'
import Card from './ui/Card'

interface WasteMethodSelectorProps {
  onSelectMethod: (method: 'photo' | 'manual' | 'barcode') => void
}

export default function WasteMethodSelector({ onSelectMethod }: WasteMethodSelectorProps) {
  const methods = [
    {
      id: 'photo' as const,
      icon: Camera,
      title: 'Сфотографировать',
      description: 'Сделайте фото отхода, и мы определим его тип',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'manual' as const,
      icon: List,
      title: 'Выбрать вручную',
      description: 'Выберите тип отхода из списка',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'barcode' as const,
      icon: QrCode,
      title: 'Сканировать код',
      description: 'Отсканируйте штрихкод на упаковке',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
      {methods.map((method, index) => {
        const Icon = method.icon
        return (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hover
              onClick={() => onSelectMethod(method.id)}
              className="text-center h-full flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 cursor-pointer min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] transition-all duration-300 hover:shadow-2xl"
            >
              <motion.div
                className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                {method.title}
              </h3>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl">
                {method.description}
              </p>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}


