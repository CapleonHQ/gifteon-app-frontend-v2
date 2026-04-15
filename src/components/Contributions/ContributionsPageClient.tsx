'use client'

import { useMemo } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import { useContributions } from '@/hooks/tanstack/contributions'
import DashboardEmptyState from '@/components/Dashboard/DashboardEmptyState'
import EmptyBox from '@/assets/icons/EmptyBox'
import GiftsPagination from '@/components/Gifts/GiftsPage/GiftsPagination'
import GiftsListWithActions from '@/components/Gifts/GiftsListWithActions'
import type { GiftItem } from '@/types/Gifts/'
import { formatCurrency } from '@/lib/utils/currency'
import RecentGiftsSkeleton from '@/components/Dashboard/Skeletons/RecentGiftsSkeleton'
import ContributionsHeader from './ContributionsHeader'
import ContributionsFilterModal from './ContributionsFilterModal'
import { useContributionsFilters } from './hooks/useContributionsFilters'

const formatGiftDate = (value: string) => {
  const parsed = parseISO(value)
  if (!isValid(parsed)) return value
  return format(parsed, 'dd MMM, yyyy')
}

const normalizeGiftStatus = (
  value: string
): 'Delivered' | 'Fulfilled' | 'Claimed' | 'Shipped' | 'Not fulfilled' => {
  const normalized = value.toLowerCase()
  if (normalized === 'claimed') return 'Claimed'
  if (normalized === 'success' || normalized === 'fulfilled') return 'Fulfilled'
  if (normalized === 'delivered') return 'Delivered'
  if (normalized === 'shipped') return 'Shipped'
  return 'Not fulfilled'
}

const toActionType = (
  rawStatus: string,
  type: string
): GiftItem['actionType'] => {
  const normalized = rawStatus.toLowerCase()
  if (normalized === 'shipped') return 'deliver'
  if (normalized !== 'success') return undefined
  return type.toLowerCase().includes('cash') ? 'claim_cash' : 'claim_gift'
}

const toActionLabel = (
  actionType: GiftItem['actionType']
): GiftItem['actionLabel'] => {
  if (actionType === 'deliver') return 'Mark as delivered'
  if (actionType === 'claim_cash' || actionType === 'claim_gift') {
    return 'Claim gift'
  }
  return undefined
}

const ContributionsPageClient = () => {
  const {
    currentPage,
    setCurrentPage,
    queryParams,
    hasActiveFilters,
    activeFilterCount,
    isFilterOpen,
    setIsFilterOpen,
    filterValues,
    handleFilterChange,
    applyFilters,
    resetAppliedFilters,
  } = useContributionsFilters()

  const contributionsQuery = useContributions(queryParams)
  const contributionsData = contributionsQuery.data?.data

  const items = useMemo<GiftItem[]>(() => {
    return (contributionsData?.contributions ?? []).map((item) => {
      const status = normalizeGiftStatus(item.status)
      const actionType = toActionType(item.status, item.type)
      const isClaimed = item.status.toLowerCase() === 'claimed'
      const amountValue = isClaimed
        ? Number(item.claimedAmount ?? 0)
        : Number(item.amount)
      return {
        id: item.id,
        name: item.type.toLowerCase() === 'cash' ? 'Cash Gift' : item.giftName,
        type: item.type,
        date: formatGiftDate(item.createdAt),
        image:
          item.imageUrl && item.imageUrl !== 'none' ? item.imageUrl : undefined,
        worth: formatCurrency(amountValue, {
          currency: item.currency,
          maximumFractionDigits: 0,
        }),
        status,
        fromName: item.sender,
        actionType,
        actionLabel: toActionLabel(actionType),
      }
    })
  }, [contributionsData?.contributions])

  const total = contributionsData?.total ?? 0
  const page = contributionsData?.page ?? currentPage
  const limit = contributionsData?.limit ?? 20
  const offset = (page - 1) * limit
  const hasMore = contributionsData?.hasMore ?? false

  const isLoading = contributionsQuery.isLoading
  const hasError =
    (contributionsQuery.isError || contributionsQuery.isRefetchError) &&
    items.length === 0

  return (
    <div className='w-full bg-white lg:rounded-[20px] mt-4 lg:mt-0 flex-1 h-full'>
      <div className='flex flex-col gap-2 lg:gap-0 md:gap-1 h-full'>
        <ContributionsHeader
          onFilterClick={() => setIsFilterOpen(true)}
          totalCount={total}
          activeFilterCount={activeFilterCount}
        />

        <div className='overflow-x-auto flex-1 min-h-0'>
          {isLoading ? (
            <RecentGiftsSkeleton />
          ) : hasError ? (
            <div className='px-4 py-10 text-center'>
              <p className='text-base font-medium text-error-500'>
                We couldn&apos;t load your recent gifts.
              </p>
              <p className='mt-1 text-sm text-grey-700'>
                Check your connection and try again.
              </p>
              <button
                type='button'
                onClick={() => contributionsQuery.refetch()}
                className='mt-4 inline-flex items-center justify-center px-4 py-2 rounded-[10px] border border-grey-200 text-sm text-grey-800 hover:bg-grey-50 transition-colors duration-200'
              >
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className='p-6'>
              <DashboardEmptyState
                message={
                  hasActiveFilters
                    ? 'No gifts match these filters.'
                    : 'You have no gifts yet!'
                }
                icon={<EmptyBox />}
              />
            </div>
          ) : (
            <>
              <GiftsListWithActions items={items} source='contributions' />

              {total > limit ? (
                <div className='border-t border-grey-50'>
                  <GiftsPagination
                    total={total}
                    limit={limit}
                    offset={offset}
                    onPrevious={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    onNext={() =>
                      setCurrentPage((prev) => (hasMore ? prev + 1 : prev))
                    }
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <ContributionsFilterModal
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

export default ContributionsPageClient
