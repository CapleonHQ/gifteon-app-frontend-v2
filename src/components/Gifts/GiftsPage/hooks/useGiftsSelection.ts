import { useMemo, useState } from 'react'
import { type GiftPageItem } from '@/components/Gifts/GiftsPage/types'

export const useGiftsSelection = (items: GiftPageItem[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)

  const allSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items, selectedIds]
  )

  const isIndeterminate = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < items.length,
    [items, selectedIds]
  )

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (items.length === 0) return prev
      if (prev.size === items.length) return new Set()
      return new Set(items.map((item) => item.id))
    })
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectOne = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  const toggleMobileOpen = (id: string) => {
    setOpenMobileId((prev) => (prev === id ? null : id))
  }

  return {
    selectedIds,
    openMobileId,
    allSelected,
    isIndeterminate,
    toggleSelectAll,
    toggleSelectOne,
    selectOne,
    clearSelection,
    toggleMobileOpen,
  }
}
