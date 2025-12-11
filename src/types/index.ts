export enum TrashBinType {
  MIXED = 'MIXED',
  PLASTIC = 'PLASTIC',
  PAPER = 'PAPER',
  GLASS = 'GLASS',
  METAL = 'METAL',
  ORGANIC = 'ORGANIC',
  ELECTRONIC = 'ELECTRONIC',
  HAZARDOUS = 'HAZARDOUS',
}

export enum WastePhotoStatus {
  PENDING = 'PENDING',
  CLASSIFIED = 'CLASSIFIED',
  FAILED = 'FAILED',
}

export interface BinTypeConfig {
  type: TrashBinType
  label: string
  color: string
  icon: string
  instructions: string[]
}

export const BIN_CONFIGS: Record<TrashBinType, BinTypeConfig> = {
  [TrashBinType.MIXED]: {
    type: TrashBinType.MIXED,
    label: 'Смешанные отходы',
    color: 'bg-gray-500',
    icon: '🗑️',
    instructions: [
      'Используйте для отходов, которые нельзя переработать',
      'Убедитесь, что нет опасных материалов',
    ],
  },
  [TrashBinType.PLASTIC]: {
    type: TrashBinType.PLASTIC,
    label: 'Пластик',
    color: 'bg-blue-500',
    icon: '♻️',
    instructions: [
      'Промойте контейнер от остатков пищи',
      'Снимите этикетки и крышки',
      'Сплющите для экономии места',
    ],
  },
  [TrashBinType.PAPER]: {
    type: TrashBinType.PAPER,
    label: 'Бумага',
    color: 'bg-yellow-500',
    icon: '📄',
    instructions: [
      'Убедитесь, что бумага сухая',
      'Удалите скрепки и скотч',
      'Не кладите жирную бумагу',
    ],
  },
  [TrashBinType.GLASS]: {
    type: TrashBinType.GLASS,
    label: 'Стекло',
    color: 'bg-green-500',
    icon: '🍾',
    instructions: [
      'Промойте от остатков',
      'Снимите крышки и этикетки',
      'Не разбивайте стекло',
    ],
  },
  [TrashBinType.METAL]: {
    type: TrashBinType.METAL,
    label: 'Металл',
    color: 'bg-purple-500',
    icon: '🥫',
    instructions: [
      'Промойте контейнеры',
      'Снимите этикетки',
      'Сплющите банки',
    ],
  },
  [TrashBinType.ORGANIC]: {
    type: TrashBinType.ORGANIC,
    label: 'Органика',
    color: 'bg-red-500',
    icon: '🍌',
    instructions: [
      'Используйте для пищевых отходов',
      'Не кладите упаковку',
      'Можно использовать биоразлагаемые пакеты',
    ],
  },
  [TrashBinType.ELECTRONIC]: {
    type: TrashBinType.ELECTRONIC,
    label: 'Электроника',
    color: 'bg-indigo-500',
    icon: '🔌',
    instructions: [
      'Сдавайте в специальные пункты приёма',
      'Не выбрасывайте в обычные контейнеры',
      'Извлеките батарейки, если возможно',
    ],
  },
  [TrashBinType.HAZARDOUS]: {
    type: TrashBinType.HAZARDOUS,
    label: 'Опасные отходы',
    color: 'bg-orange-500',
    icon: '⚠️',
    instructions: [
      'Требует специальной утилизации',
      'Не смешивайте с другими отходами',
      'Сдавайте в специальные пункты',
    ],
  },
}

