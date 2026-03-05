'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeactivateModal from '@/components/Gifts/GiftsPage/DeactivateModal'
import ReactivateModal from '@/components/Gifts/GiftDetails/ReactivateModal'
import ShareGiftPageModal from '@/components/Gifts/GiftDetails/ShareGiftPageModal'
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
import { useArchivePage, usePages, useUnarchivePage } from '@/hooks/tanstack/pages'
import { useGiftsFilters } from './hooks/useGiftsFilters'
import { useGiftsSelection } from './hooks/useGiftsSelection'

const GiftsPageClient = () => {
  const router = useRouter()
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)
  const [deactivateCount, setDeactivateCount] = useState(0)
  const [deactivateIds, setDeactivateIds] = useState<string[]>([])
  const [isReactivateOpen, setIsReactivateOpen] = useState(false)
  const [reactivateId, setReactivateId] = useState<string | null>(null)
  const [sharePage, setSharePage] = useState<{
    title: string
    url: string
    slug: string
  } | null>(null)
  const { openSuccess } = useSuccessModal()
  const archiveMutation = useArchivePage()
  const unarchiveMutation = useUnarchivePage()

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

  const openDeactivate = (ids: string[]) => {
    setDeactivateIds(ids)
    setDeactivateCount(ids.length)
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

  const handleSharePage = (id: string) => {
    const page = giftPages.find((item) => item.id === id)
    if (!page) return
    const slug = page.publicUrl.replace(/^\/u\//, '').trim()
    setSharePage({
      title: page.title,
      url: page.publicUrl,
      slug,
    })
  }

  const handleStatusActionSingle = async (id: string) => {
    const page = giftPages.find((item) => item.id === id)
    if (!page) return

    if (page.status === 'Deactivated') {
      setReactivateId(id)
      setIsReactivateOpen(true)
      return
    }

    openDeactivate([id])
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
                  onShare={handleSharePage}
                  onDeactivateSelected={() => openDeactivate([...selectedIds])}
                  onStatusActionSingle={handleStatusActionSingle}
                />

                <GiftsMobileList
                  items={giftPages}
                  selectedIds={selectedIds}
                  openId={openMobileId}
                  onToggle={toggleMobileOpen}
                  onSelect={toggleSelectOne}
                  onLongPressSelect={selectOne}
                  onView={handleViewPage}
                  onShare={handleSharePage}
                  onDeactivateSelected={() => openDeactivate([...selectedIds])}
                  onClearSelection={clearSelection}
                  onStatusActionSingle={handleStatusActionSingle}
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
        isSubmitting={archiveMutation.isPending}
        onClose={() => {
          if (archiveMutation.isPending) return
          setIsDeactivateOpen(false)
        }}
        onConfirm={async () => {
          if (deactivateIds.length === 0) return
          try {
            await archiveMutation.mutateAsync(deactivateIds)
            setIsDeactivateOpen(false)
            clearSelection()
            openSuccess({ message: successMessage })
          } catch {
            // Query error states will recover via refetch/invalidation.
          }
        }}
      />
      <ReactivateModal
        isOpen={isReactivateOpen}
        isSubmitting={unarchiveMutation.isPending}
        onClose={() => {
          if (unarchiveMutation.isPending) return
          setIsReactivateOpen(false)
          setReactivateId(null)
        }}
        onConfirm={async () => {
          if (!reactivateId) return
          try {
            await unarchiveMutation.mutateAsync([reactivateId])
            setIsReactivateOpen(false)
            setReactivateId(null)
            openSuccess({
              message: 'Selected gift page has been successfully activated.',
            })
          } catch {
            openSuccess({ message: 'Unable to activate gift page. Please try again.' })
          }
        }}
      />

      <FilterModal
        isOpen={isFilterOpen}
        values={filterValues}
        searchValue={searchValue}
        onSearchChange={setSearchAndReset}
        onChange={handleFilterChange}
        onClose={() => setIsFilterOpen(false)}
        onReset={resetAppliedFilters}
        onApply={applyFilters}
      />
      <ShareGiftPageModal
        isOpen={Boolean(sharePage)}
        onClose={() => setSharePage(null)}
        pageTitle={sharePage?.title ?? ''}
        pageUrl={sharePage?.url ?? ''}
        trackShareSlug={sharePage?.slug}
      />
    </div>
  )
}

export default GiftsPageClient
