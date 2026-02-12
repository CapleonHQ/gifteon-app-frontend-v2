'use client'

import { useRef } from 'react'
import { type GiftPageItem } from './types'
import GiftsMobileSelectionBar from './GiftsMobileSelectionBar'
import GiftsMobileCard from './GiftsMobileCard'

type GiftsMobileListProps = {
  items: GiftPageItem[]
  selectedIds: Set<string>
  openId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  onLongPressSelect: (id: string) => void
  onView: (id: string) => void
  onDeactivateSelected: () => void
  onClearSelection: () => void
  onDeactivateSingle: () => void
}

const GiftsMobileList = ({
  items,
  selectedIds,
  openId,
  onToggle,
  onSelect,
  onLongPressSelect,
  onView,
  onDeactivateSelected,
  onClearSelection,
  onDeactivateSingle,
}: GiftsMobileListProps) => {
  const pressTimer = useRef<number | null>(null)
  const selectionMode = selectedIds.size > 0

  const startPress = (id: string) => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current)
    pressTimer.current = window.setTimeout(() => {
      onLongPressSelect(id)
      pressTimer.current = null
    }, 550)
  }

  const clearPress = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }

  return (
    <div className='lg:hidden px-4 py-4 space-y-1'>
      {selectionMode && (
        <GiftsMobileSelectionBar
          count={selectedIds.size}
          onClear={onClearSelection}
          onDeactivate={onDeactivateSelected}
        />
      )}
      {items.map((page) => (
        <GiftsMobileCard
          key={page.id}
          page={page}
          isSelected={selectedIds.has(page.id)}
          isOpen={openId === page.id}
          selectionMode={selectionMode}
          onToggle={() => onToggle(page.id)}
          onSelect={() => onSelect(page.id)}
          onView={() => onView(page.id)}
          onDeactivate={onDeactivateSingle}
          onStartPress={() => startPress(page.id)}
          onClearPress={clearPress}
        />
      ))}
    </div>
  )
}

export default GiftsMobileList
