'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeactivateModal from '@/components/Gifts/GiftsPage/DeactivateModal'
import { useSuccessModal } from '@/context/SuccessModalContext'
import FilterModal from '@/components/Gifts/GiftsPage/FilterModal'
import GiftsHeader from '@/components/Gifts/GiftsPage/GiftsHeader'
import GiftsTable from '@/components/Gifts/GiftsPage/GiftsTable'
import GiftsMobileList from '@/components/Gifts/GiftsPage/GiftsMobileList'
import GiftsPagination from '@/components/Gifts/GiftsPage/GiftsPagination'
import GiftsEmptyState from '@/components/Gifts/GiftsPage/GiftsEmptyState'
import GiftsNoResults from '@/components/Gifts/GiftsPage/GiftsNoResults'
import GiftsSkeleton from '@/components/Gifts/GiftsPage/GiftsSkeleton'
import { type GiftPageItem } from '@/components/Gifts/GiftsPage/types'
import { usePages } from '@/hooks/tanstack/pages'
import { useGiftsFilters } from './hooks/useGiftsFilters'
import { useGiftsSelection } from './hooks/useGiftsSelection'

const GiftsPageClient = () => {
  const router = useRouter()
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)
  const [deactivateCount, setDeactivateCount] = useState(0)
  const { openSuccess } = useSuccessModal()

  const {
    searchValue,
    queryParams,
    offset,
    setOffset,
    hasActiveFilters,
    isFilterOpen,
    setIsFilterOpen,
    filterValues,
    handleFilterChange,
    applyFilters,
    resetAppliedFilters,
    clearAllFiltersAndSearch,
    setSearchAndReset,
  } = useGiftsFilters()

  const pagesQuery = usePages(queryParams)
  const giftPages: GiftPageItem[] = pagesQuery.data?.data.pages ?? []
  const totalCount = pagesQuery.data?.data.total ?? giftPages.length
  const limit = pagesQuery.data?.data.limit ?? 20
  const currentOffset = pagesQuery.data?.data.offset ?? offset
  const isLoading = pagesQuery.isLoading
  const hasError = pagesQuery.isError
  const {
    selectedIds,
    openMobileId,
    allSelected,
    isIndeterminate,
    toggleSelectAll,
    toggleSelectOne,
    selectOne,
    clearSelection,
    toggleMobileOpen,
  } = useGiftsSelection(giftPages)

  const hasPages = totalCount > 0
  const hasResults = giftPages.length > 0
  const hasMultiplePages = totalCount > limit
  const showHeadlessEmpty =
    !isLoading && !hasError && !hasPages && !hasActiveFilters

  const openDeactivate = (count: number) => {
    setDeactivateCount(count)
    setIsDeactivateOpen(true)
  }

  const deactivateMessage =
    deactivateCount === 1
      ? 'This will make this gift page temporarily unavailable to others. People won’t be able to view, send gifts, or leave wishes until you reactivate it.'
      : 'This will make selected gift pages temporarily unavailable to others. People won’t be able to view, send gifts, or leave wishes until you reactivate them.'

  const successMessage =
    deactivateCount === 1
      ? 'Selected gift page has been successfully deactivated.'
      : 'Selected gift pages have been successfully deactivated.'

  const handlePreviousPage = () => {
    if (currentOffset <= 0) return
    setOffset((prev) => Math.max(0, prev - limit))
  }

  const handleNextPage = () => {
    if (currentOffset + limit >= totalCount) return
    setOffset((prev) => prev + limit)
  }

  const handleViewPage = (id: string) => {
    router.push(`/gifts/${id}`)
  }

  return (
    <div className='w-full bg-white lg:rounded-[20px] mt-4 lg:mt-0 flex-1 h-full'>
      {showHeadlessEmpty ? (
        <GiftsEmptyState />
      ) : (
        <div className='flex flex-col gap-2 lg:gap-0 md:gap-1 h-full'>
          <GiftsHeader
            onFilterClick={() => setIsFilterOpen(true)}
            totalPages={totalCount}
            searchValue={searchValue}
            onSearchChange={setSearchAndReset}
          />

          <div className='overflow-x-auto flex-1 min-h-0'>
            {isLoading ? (
              <GiftsSkeleton />
            ) : hasError ? (
              <div className='px-4 py-10 text-center'>
                <p className='text-base font-medium text-error-500'>
                  We couldn&apos;t load your gift pages.
                </p>
                <p className='mt-1 text-sm text-grey-700'>
                  Check your connection and try again.
                </p>
                <button
                  type='button'
                  onClick={() => pagesQuery.refetch()}
                  disabled={pagesQuery.isFetching}
                  className='mt-4 inline-flex items-center justify-center px-4 py-2 rounded-[10px] border border-grey-200 text-sm text-grey-800 hover:bg-grey-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200'
                >
                  {pagesQuery.isFetching ? 'Retrying...' : 'Retry'}
                </button>
              </div>
            ) : !hasResults ? (
              <GiftsNoResults onReset={clearAllFiltersAndSearch} />
            ) : (
              <div className='flex flex-col min-h-full'>
                <GiftsTable
                  items={giftPages}
                  selectedIds={selectedIds}
                  isIndeterminate={isIndeterminate}
                  allSelected={allSelected}
                  onToggleAll={toggleSelectAll}
                  onToggleOne={toggleSelectOne}
                  onView={handleViewPage}
                  onDeactivateSelected={() => openDeactivate(selectedIds.size)}
                  onDeactivateSingle={() => openDeactivate(1)}
                />

                <GiftsMobileList
                  items={giftPages}
                  selectedIds={selectedIds}
                  openId={openMobileId}
                  onToggle={toggleMobileOpen}
                  onSelect={toggleSelectOne}
                  onLongPressSelect={selectOne}
                  onView={handleViewPage}
                  onDeactivateSelected={() => openDeactivate(selectedIds.size)}
                  onClearSelection={clearSelection}
                  onDeactivateSingle={() => openDeactivate(1)}
                />

                {hasMultiplePages ? (
                  <GiftsPagination
                    total={totalCount}
                    limit={limit}
                    offset={currentOffset}
                    onPrevious={handlePreviousPage}
                    onNext={handleNextPage}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
      <DeactivateModal
        isOpen={isDeactivateOpen}
        count={deactivateCount}
        message={deactivateMessage}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={() => {
          setIsDeactivateOpen(false)
          openSuccess({ message: successMessage })
        }}
      />

      <FilterModal
        isOpen={isFilterOpen}
        values={filterValues}
        onChange={handleFilterChange}
        onClose={() => setIsFilterOpen(false)}
        onReset={resetAppliedFilters}
        onApply={applyFilters}
      />
    </div>
  )
}

export default GiftsPageClient
