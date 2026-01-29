'use client'

import { useMemo, useState } from 'react'
import DeactivateModal from '@/components/Gifts/GiftsPage/DeactivateModal'
import DeactivateSuccessModal from '@/components/Gifts/GiftsPage/DeactivateSuccessModal'
import FilterModal from '@/components/Gifts/GiftsPage/FilterModal'
import GiftsHeader from '@/components/Gifts/GiftsPage/GiftsHeader'
import GiftsTable from '@/components/Gifts/GiftsPage/GiftsTable'
import GiftsMobileList from '@/components/Gifts/GiftsPage/GiftsMobileList'
import GiftsPagination from '@/components/Gifts/GiftsPage/GiftsPagination'
import GiftsEmptyState from '@/components/Gifts/GiftsPage/GiftsEmptyState'
import GiftsNoResults from '@/components/Gifts/GiftsPage/GiftsNoResults'
import GiftsSkeleton from '@/components/Gifts/GiftsPage/GiftsSkeleton'
import { type GiftsFilterState } from '@/types/Gifts/filters'
import { type GiftPageItem } from '@/components/Gifts/GiftsPage/types'

const giftPages: GiftPageItem[] = [
  {
    id: '1',
    title: "Adenike's Birthday...",
    category: 'Birthday',
    visibility: 'Public',
    createdOn: 'Aug 28, 2025',
    totalGifts: 27,
    totalWishes: 8,
    views: 8,
    status: 'Active',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '2',
    title: 'Graduation Celeb...',
    category: 'Graduation',
    visibility: 'Shareable',
    createdOn: 'Aug 13, 2025',
    totalGifts: 8,
    totalWishes: 19,
    views: 8342,
    status: 'Active',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '3',
    title: 'Wedding Fund',
    category: 'Wedding',
    visibility: 'Public',
    createdOn: 'Aug 2, 2025',
    totalGifts: 12,
    totalWishes: 2,
    views: 679,
    status: 'Active',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '4',
    title: 'Anniversary Surpr...',
    category: 'Anniversary',
    visibility: 'Private',
    createdOn: 'Aug 28, 2025',
    totalGifts: 27,
    totalWishes: 8,
    views: 8,
    status: 'Ended',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '5',
    title: 'House Warming P...',
    category: 'Anniversary',
    visibility: 'Public',
    createdOn: 'Aug 28, 2025',
    totalGifts: 27,
    totalWishes: 8,
    views: 8,
    status: 'Active',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '6',
    title: 'Wedding Fund',
    category: 'Wedding',
    visibility: 'Public',
    createdOn: 'Aug 2, 2025',
    totalGifts: 12,
    totalWishes: 2,
    views: 679,
    status: 'Active',
    image: '/assets/images/place-holder-image.jpg',
  },
]

const isWithinRange = (dateValue: string, fromDate?: Date, toDate?: Date) => {
  if (!fromDate && !toDate) return true
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return true
  if (fromDate && parsed < fromDate) return false
  if (toDate && parsed > toDate) return false
  return true
}

const GiftsPageClient = () => {
  const isLoading = false
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)
  const [isDeactivateSuccessOpen, setIsDeactivateSuccessOpen] = useState(false)
  const [deactivateCount, setDeactivateCount] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState<Date | undefined>()
  const [filterToDate, setFilterToDate] = useState<Date | undefined>()
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterVisibility, setFilterVisibility] = useState('all')

  const allSelected = useMemo(
    () => giftPages.length > 0 && selectedIds.size === giftPages.length,
    [selectedIds]
  )

  const isIndeterminate = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < giftPages.length,
    [selectedIds]
  )

  const filteredPages = useMemo(() => {
    return giftPages.filter((page) => {
      const statusMatch =
        filterStatus === 'all' || page.status.toLowerCase() === filterStatus
      const categoryMatch =
        filterCategory === 'all' ||
        page.category.toLowerCase() === filterCategory
      const visibilityMatch =
        filterVisibility === 'all' ||
        page.visibility.toLowerCase() === filterVisibility
      const dateMatch = isWithinRange(
        page.createdOn,
        filterFromDate,
        filterToDate
      )
      return statusMatch && categoryMatch && visibilityMatch && dateMatch
    })
  }, [
    filterStatus,
    filterCategory,
    filterVisibility,
    filterFromDate,
    filterToDate,
  ])

  const hasPages = giftPages.length > 0
  const hasResults = filteredPages.length > 0

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (giftPages.length === 0) return prev
      if (prev.size === giftPages.length) return new Set()
      return new Set(giftPages.map((page) => page.id))
    })
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  const selectOne = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const openDeactivate = (count: number) => {
    setDeactivateCount(count)
    setIsDeactivateOpen(true)
  }

  const handleDeactivateConfirm = () => {
    setIsDeactivateOpen(false)
    setIsDeactivateSuccessOpen(true)
  }

  const deactivateMessage =
    deactivateCount === 1
      ? 'This will make this gift page temporarily unavailable to others. People won’t be able to view, send gifts, or leave wishes until you reactivate it.'
      : 'This will make selected gift pages temporarily unavailable to others. People won’t be able to view, send gifts, or leave wishes until you reactivate them.'

  const successMessage =
    deactivateCount === 1
      ? 'Selected gift page has been successfully deactivated.'
      : 'Selected gift pages have been successfully deactivated.'

  const resetFilters = () => {
    setFilterFromDate(undefined)
    setFilterToDate(undefined)
    setFilterStatus('all')
    setFilterCategory('all')
    setFilterVisibility('all')
  }

  const filterValues: GiftsFilterState = {
    fromDate: filterFromDate,
    toDate: filterToDate,
    status: filterStatus,
    category: filterCategory,
    visibility: filterVisibility,
  }

  const handleFilterChange = (next: GiftsFilterState) => {
    setFilterFromDate(next.fromDate)
    setFilterToDate(next.toDate)
    setFilterStatus(next.status)
    setFilterCategory(next.category)
    setFilterVisibility(next.visibility)
  }

  return (
    <div className='w-full bg-white lg:rounded-[20px] mt-4 lg:mt-0 flex-1 '>
      {!hasPages ? (
        <GiftsEmptyState />
      ) : (
        <div className='flex flex-col gap-2 lg:gap-0 md:gap-1'>
          <GiftsHeader onFilterClick={() => setIsFilterOpen(true)} />

          <div className='overflow-x-auto'>
            {isLoading ? (
              <GiftsSkeleton />
            ) : !hasResults ? (
              <GiftsNoResults onReset={resetFilters} />
            ) : (
              <>
                <GiftsTable
                  items={filteredPages}
                  selectedIds={selectedIds}
                  isIndeterminate={isIndeterminate}
                  allSelected={allSelected}
                  onToggleAll={toggleSelectAll}
                  onToggleOne={toggleSelectOne}
                  onDeactivateSelected={() => openDeactivate(selectedIds.size)}
                  onDeactivateSingle={() => openDeactivate(1)}
                />

                <GiftsMobileList
                  items={filteredPages}
                  selectedIds={selectedIds}
                  openId={openMobileId}
                  onToggle={(id) =>
                    setOpenMobileId((prev) => (prev === id ? null : id))
                  }
                  onSelect={toggleSelectOne}
                  onLongPressSelect={selectOne}
                  onDeactivateSelected={() => openDeactivate(selectedIds.size)}
                  onClearSelection={clearSelection}
                  onDeactivateSingle={() => openDeactivate(1)}
                />

                <GiftsPagination />
              </>
            )}
          </div>
        </div>
      )}

      <DeactivateModal
        isOpen={isDeactivateOpen}
        count={deactivateCount}
        message={deactivateMessage}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
      />

      <DeactivateSuccessModal
        isOpen={isDeactivateSuccessOpen}
        message={successMessage}
        onClose={() => setIsDeactivateSuccessOpen(false)}
      />

      <FilterModal
        isOpen={isFilterOpen}
        values={filterValues}
        onChange={handleFilterChange}
        onClose={() => setIsFilterOpen(false)}
        onReset={resetFilters}
        onApply={() => setIsFilterOpen(false)}
      />
    </div>
  )
}

export default GiftsPageClient
