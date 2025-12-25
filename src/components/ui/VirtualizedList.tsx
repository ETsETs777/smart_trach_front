import { FixedSizeList, ListChildComponentProps } from 'react-window'
import { memo } from 'react'

interface VirtualizedListProps<T> {
  items: T[]
  height?: number
  itemHeight?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscanCount?: number
}

/**
 * Virtualized list component for rendering large lists efficiently
 * Only renders visible items, improving performance for long lists
 */
function VirtualizedList<T extends { id: string | number }>({
  items,
  height = 600,
  itemHeight = 80,
  renderItem,
  className = '',
  overscanCount = 5,
}: VirtualizedListProps<T>) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = items[index]
    if (!item) return null

    return (
      <div style={style} className="px-2">
        {renderItem(item, index)}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center h-${height} ${className}`}>
        <p className="text-gray-500">No items to display</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <FixedSizeList
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width="100%"
        overscanCount={overscanCount}
      >
        {Row}
      </FixedSizeList>
    </div>
  )
}

export default memo(VirtualizedList) as typeof VirtualizedList

