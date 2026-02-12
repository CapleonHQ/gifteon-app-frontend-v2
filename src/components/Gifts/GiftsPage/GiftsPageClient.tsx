'use client'

import { useMemo, useState } from 'react'
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
import { type GiftsFilterState } from '@/types/Gifts/filters'
import { type GiftPageItem } from '@/components/Gifts/GiftsPage/types'
import { usePages } from '@/hooks/tanstack/pages'
import { useDebounce } from '@/hooks/useDebounce'
import { type PagesQueryParams } from '@/types/Pages'

const PAGE_SIZE = 20

const toDateParam = (value?: Date) => {
  if (!value) return undefined
  return value.toISOString().slice(0, 10)
}

const buildFilterParams = (filters: GiftsFilterState): PagesQueryParams => {
  const params: PagesQueryParams = {}

  if (filters.status !== 'all') {
    params.status = filters.status === 'active' ? 'active' : 'ended'
  }
  if (filters.category !== 'all') {
    params.category = filters.category
  }
  if (filters.visibility !== 'all') {
    params.visibility = filters.visibility as 'public' | 'shareable' | 'private'
  }

  const fromDate = toDateParam(filters.fromDate)
  const toDate = toDateParam(filters.toDate)
  if (fromDate) params.fromDate = fromDate
  if (toDate) params.toDate = toDate

  return params
}

const GiftsPageClient = () => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue.trim(), 400)
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)
  const [deactivateCount, setDeactivateCount] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterFromDate, setFilterFromDate] = useState<Date | undefined>()
  const [filterToDate, setFilterToDate] = useState<Date | undefined>()
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterVisibility, setFilterVisibility] = useState('all')
  const [appliedFilterParams, setAppliedFilterParams] =
    useState<PagesQueryParams>({})
  const [offset, setOffset] = useState(0)
  const { openSuccess } = useSuccessModal()

  const queryParams: PagesQueryParams = useMemo(
    () => ({
      ...appliedFilterParams,
      search: debouncedSearch || undefined,
      limit: PAGE_SIZE,
      offset,
    }),
    [appliedFilterParams, debouncedSearch, offset]
  )

  const pagesQuery = usePages(queryParams)
  const giftPages: GiftPageItem[] = useMemo(
    () => pagesQuery.data?.data.pages ?? [],
    [pagesQuery.data?.data.pages]
  )
  const totalCount = pagesQuery.data?.data.total ?? giftPages.length
  const limit = pagesQuery.data?.data.limit ?? PAGE_SIZE
  const currentOffset = pagesQuery.data?.data.offset ?? offset
  const isLoading = pagesQuery.isLoading
  const hasError = pagesQuery.isError
  const hasActiveFilters = Boolean(
    debouncedSearch ||
      appliedFilterParams.status ||
      appliedFilterParams.category ||
      appliedFilterParams.visibility ||
      appliedFilterParams.fromDate ||
      appliedFilterParams.toDate
  )

  const allSelected = useMemo(
    () => giftPages.length > 0 && selectedIds.size === giftPages.length,
    [giftPages, selectedIds]
  )

  const isIndeterminate = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < giftPages.length,
    [giftPages, selectedIds]
  )

  const hasPages = totalCount > 0
  const hasResults = giftPages.length > 0
  const hasMultiplePages = totalCount > limit
  const showHeadlessEmpty =
    !isLoading && !hasError && !hasPages && !hasActiveFilters

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
      if (next.has(id)) next.delete(id)
      else next.add(id)
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

  const deactivateMessage =
    deactivateCount === 1
      ? 'This will make this gift page temporarily unavailable to others. People won’t be able to view, send gifts, or leave wishes until you reactivate it.'
      : 'This will make selected gift pages temporarily unavailable to others. People won’t be able to view, send gifts, or leave wishes until you reactivate them.'

  const successMessage =
    deactivateCount === 1
      ? 'Selected gift page has been successfully deactivated.'
      : 'Selected gift pages have been successfully deactivated.'

  const resetFilterForm = () => {
    setFilterFromDate(undefined)
    setFilterToDate(undefined)
    setFilterStatus('all')
    setFilterCategory('all')
    setFilterVisibility('all')
  }

  const clearAllFiltersAndSearch = () => {
    resetFilterForm()
    setAppliedFilterParams({})
    setSearchValue('')
    setOffset(0)
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
            onSearchChange={(value) => {
              setSearchValue(value)
              setOffset(0)
            }}
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
                  onToggle={(id) =>
                    setOpenMobileId((prev) => (prev === id ? null : id))
                  }
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
        onReset={() => {
          resetFilterForm()
          setAppliedFilterParams({})
          setOffset(0)
        }}
        onApply={() => {
          setAppliedFilterParams(buildFilterParams(filterValues))
          setOffset(0)
          setIsFilterOpen(false)
        }}
      />
    </div>
  )
}

export default GiftsPageClient
