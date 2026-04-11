'use client'

import { useMemo, useState } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import { useContributions } from '@/hooks/tanstack/contributions'
import DashboardEmptyState from '@/components/Dashboard/DashboardEmptyState'
import EmptyBox from '@/assets/icons/EmptyBox'
import GiftsPagination from '@/components/Gifts/GiftsPage/GiftsPagination'
import GiftsListWithActions from '@/components/Gifts/GiftsListWithActions'
import type { GiftItem } from '@/types/Gifts/'
import { formatCurrency } from '@/lib/utils/currency'
import RecentGiftsSkeleton from '@/components/Dashboard/Skeletons/RecentGiftsSkeleton'

const PAGE_SIZE = 20

const formatGiftDate = (value: string) => {
  const parsed = parseISO(value)
  if (!isValid(parsed)) return value
  return format(parsed, 'dd MMM, yyyy')
}

const normalizeGiftStatus = (
  value: string
): 'Delivered' | 'Fulfilled' | 'Shipped' | 'Not fulfilled' => {
  const normalized = value.toLowerCase()
  if (normalized === 'success' || normalized === 'fulfilled') return 'Fulfilled'
  if (normalized === 'delivered') return 'Delivered'
  if (normalized === 'shipped') return 'Shipped'
  return 'Not fulfilled'
}

const toActionType = (
  status: GiftItem['status'],
  type: string
): GiftItem['actionType'] => {
  if (status === 'Shipped') return 'deliver'
  if (status !== 'Fulfilled') return undefined
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
  const [offset, setOffset] = useState(0)
  const contributionsQuery = useContributions()

  const items = useMemo<GiftItem[]>(() => {
    return (contributionsQuery.data?.data.contributions ?? []).map((item) => {
      const status = normalizeGiftStatus(item.status)
      const actionType = toActionType(status, item.type)
      return {
        id: item.id,
        name: item.type.toLowerCase() === 'cash' ? 'Cash Gift' : item.giftName,
        type: item.type,
        date: formatGiftDate(item.createdAt),
        image:
          item.imageUrl && item.imageUrl !== 'none' ? item.imageUrl : undefined,
        worth: formatCurrency(Number(item.amount), {
          currency: item.currency,
          maximumFractionDigits: 0,
        }),
        status,
        fromName: item.sender,
        actionType,
        actionLabel: toActionLabel(actionType),
      }
    })
  }, [contributionsQuery.data?.data])
  const total = items.length
  const maxOffset = Math.max(total - PAGE_SIZE, 0)
  const safeOffset = Math.min(offset, maxOffset)
  const pagedItems = useMemo(
    () => items.slice(safeOffset, safeOffset + PAGE_SIZE),
    [items, safeOffset]
  )

  const isLoading = contributionsQuery.isLoading && items.length === 0
  const hasError =
    (contributionsQuery.isError || contributionsQuery.isRefetchError) &&
    items.length === 0

  return (
    <div className='w-full bg-white lg:rounded-[20px] mt-4 lg:mt-0 flex-1 h-full'>
      <div className='flex flex-col h-full'>
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
                message='You have no gifts yet!'
                icon={<EmptyBox />}
              />
            </div>
          ) : (
            <>
              <GiftsListWithActions items={pagedItems} source='contributions' />

              {total > PAGE_SIZE ? (
                <div className='border-t border-grey-50'>
                  <GiftsPagination
                    total={total}
                    limit={PAGE_SIZE}
                    offset={safeOffset}
                    onPrevious={() =>
                      setOffset((prev) => Math.max(0, prev - PAGE_SIZE))
                    }
                    onNext={() =>
                      setOffset((prev) => Math.min(prev + PAGE_SIZE, maxOffset))
                    }
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContributionsPageClient
