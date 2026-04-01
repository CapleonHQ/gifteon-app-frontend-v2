'use client'

import Link from 'next/link'
import type { GiftItem } from '@/types/Gifts/index'
import RecentGiftsTable from './RecentGiftsTable'
import RecentGiftsMobileList from './RecentGiftsMobileList'
import DashboardEmptyState from './DashboardEmptyState'
import EmptyBox from '@/assets/icons/EmptyBox'
import RecentGiftsSkeleton from './Skeletons/RecentGiftsSkeleton'
import { analytics } from '@/lib/analytics/events'

type RecentGiftsSectionProps = {
  items: GiftItem[]
  onAction: (item: GiftItem) => void
  isLoading?: boolean
  hasError?: boolean
  isRetrying?: boolean
  onRetry?: () => void
}

const RecentGiftsSection = ({
  items,
  onAction,
  isLoading = false,
  hasError = false,
  isRetrying = false,
  onRetry,
}: RecentGiftsSectionProps) => {
  const isEmpty = items.length === 0

  if (isLoading) {
    return <RecentGiftsSkeleton />
  }

  return (
    <div className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] overflow-hidden'>
      <div className='px-4 py-3 flex items-center justify-between'>
        <h2 className='text-lg font-medium text-blackish'>Recent Gifts</h2>
        <Link
          href='/gifts'
          onClick={() => analytics.trackDashboardSeeAllGiftPagesClicked()}
          className='text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors duration-300 underline'
        >
          See all Gift Pages
        </Link>
      </div>
      {hasError ? (
        <div className='px-4 py-10 text-center'>
          <p className='text-base font-medium text-error-500'>
            We couldn&apos;t load your recent gifts.
          </p>
          <p className='mt-1 text-sm text-grey-700'>
            Check your connection and try again.
          </p>
          <button
            type='button'
            onClick={() => {
              analytics.trackDashboardRecentGiftsRetryClicked()
              onRetry?.()
            }}
            disabled={isRetrying || !onRetry}
            className='mt-4 inline-flex items-center justify-center px-4 py-2 rounded-[10px] border border-grey-200 text-sm text-grey-800 hover:bg-grey-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200'
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      ) : isEmpty ? (
        <div className='px-4 py-10 lg:py-16'>
          <DashboardEmptyState
            message='You have no gifts yet!'
            icon={<EmptyBox />}
          />
        </div>
      ) : (
        <>
          <RecentGiftsTable items={items} onAction={onAction} />
          <RecentGiftsMobileList items={items} onAction={onAction} />
        </>
      )}
    </div>
  )
}

export default RecentGiftsSection
