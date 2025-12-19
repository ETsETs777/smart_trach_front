import { motion } from 'framer-motion'
import { TrashBinType, BIN_CONFIGS } from '@/types'
import BinIcon from './ui/BinIcon'
import Card from './ui/Card'
import Button from './ui/Button'
import { X } from 'lucide-react'

interface ManualSelectorProps {
  onSelect: (type: TrashBinType) => void
  onCancel: () => void
}

export default function ManualSelector({ onSelect, onCancel }: ManualSelectorProps) {
  const binTypes = Object.values(TrashBinType)

  return (
    <Card className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Выберите тип отхода</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {binTypes.map((type, index) => {
          const config = BIN_CONFIGS[type]
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => onSelect(type)}
                className="w-full glass rounded-xl p-6 hover:shadow-xl transition-all duration-200 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <BinIcon type={type} size="md" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {config.label}
                </h3>
              </button>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-8">
        <Button onClick={onCancel} variant="outline" size="lg" className="w-full">
          Отмена
        </Button>
      </div>
    </Card>
  )
}


