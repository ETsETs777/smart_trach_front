import { motion } from 'framer-motion'
import { TrashBinType, BIN_CONFIGS } from '@/types'
import BinIcon from './ui/BinIcon'

interface BinLayoutProps {
  availableBins: TrashBinType[]
  highlightedBin?: TrashBinType | null
  onBinClick?: (type: TrashBinType) => void
  showInfoOnHover?: boolean
}

export default function BinLayout({
  availableBins,
  highlightedBin,
  onBinClick,
  showInfoOnHover = true,
}: BinLayoutProps) {
  // Расположение контейнеров в виде сетки
  const getBinPosition = (index: number, total: number) => {
    if (total <= 4) {
      // 2x2 сетка
      const cols = 2
      const row = Math.floor(index / cols)
      const col = index % cols
      return { row, col, cols }
    } else {
      // 3 колонки
      const cols = 3
      const row = Math.floor(index / cols)
      const col = index % cols
      return { row, col, cols }
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Контейнеры в этой области
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {availableBins.map((binType, index) => {
          const config = BIN_CONFIGS[binType]
          const isHighlighted = highlightedBin === binType

          return (
            <motion.div
              key={binType}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isHighlighted ? 1.1 : 1,
              }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div
                className={`
                  relative cursor-pointer
                  ${isHighlighted ? 'z-10' : ''}
                `}
                onClick={() => onBinClick?.(binType)}
              >
                <BinIcon 
                  type={binType} 
                  size="lg" 
                  highlighted={isHighlighted}
                />
                {isHighlighted && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity 
                    }}
                  >
                    <span className="text-white text-lg">✓</span>
                  </motion.div>
                )}
              </div>
              <div className="mt-3 text-center">
                <p className={`font-semibold ${isHighlighted ? 'text-green-600' : 'text-gray-700'}`}>
                  {config.label}
                </p>
                {isHighlighted && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-green-600 font-medium mt-1"
                  >
                    Используйте этот контейнер
                  </motion.p>
                )}
                {showInfoOnHover && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="p-3 rounded-xl bg-white shadow-lg border border-gray-200 text-left text-sm text-gray-700">
                      <div className="font-semibold mb-1">Подготовка:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {config.instructions.slice(0, 3).map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {highlightedBin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-green-50 border-2 border-green-500 rounded-xl text-center"
        >
          <p className="text-lg font-semibold text-green-800">
            🎯 Выбросьте отход в контейнер: <strong>{BIN_CONFIGS[highlightedBin].label}</strong>
          </p>
        </motion.div>
      )}
    </div>
  )
}

