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
    <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              className="text-center h-full flex flex-col items-center justify-center p-8 cursor-pointer"
            >
              <motion.div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-6 shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {method.title}
              </h3>
              <p className="text-gray-600 text-lg">
                {method.description}
              </p>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

