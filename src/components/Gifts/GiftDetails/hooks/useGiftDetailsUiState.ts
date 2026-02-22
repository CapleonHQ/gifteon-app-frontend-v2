import { useState } from 'react'

export const useGiftDetailsUiState = (giftId: string, fallbackActive = true) => {
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)
  const [visitRange, setVisitRange] = useState('last-7-days')
  const [wishSort, setWishSort] = useState('most-recent')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)
  const [isReactivateOpen, setIsReactivateOpen] = useState(false)
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({})

  const isActive = activeOverrides[giftId] ?? fallbackActive

  const markInactive = () => {
    setActiveOverrides((prev) => ({ ...prev, [giftId]: false }))
  }

  const markActive = () => {
    setActiveOverrides((prev) => ({ ...prev, [giftId]: true }))
  }

  const toggleMobileRow = (id: string) => {
    setOpenMobileId((prev) => (prev === id ? null : id))
  }

  return {
    openMobileId,
    visitRange,
    wishSort,
    isEditOpen,
    isShareOpen,
    isDeactivateOpen,
    isReactivateOpen,
    isActive,
    setVisitRange,
    setWishSort,
    setIsEditOpen,
    setIsShareOpen,
    setIsDeactivateOpen,
    setIsReactivateOpen,
    markInactive,
    markActive,
    toggleMobileRow,
  }
}
