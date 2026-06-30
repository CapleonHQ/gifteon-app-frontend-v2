'use client'

import { useMemo } from 'react'
import RecentGiftsSection from './RecentGiftsSection'
import DashboardStatsSection from './DashboardStatsSection'
import { useStatsOverview } from '@/hooks/tanstack/stats'
import Image from 'next/image'
import { analytics } from '@/lib/analytics/events'
import { mapDashboardRecentGiftItem } from './utils/recentGifts'

const DashboardPageClient = () => {
  const statsOverview = useStatsOverview()
  const overviewData = statsOverview.data?.data
  const currency = overviewData?.overview.currency
  const recentGifts = useMemo(
    () =>
      overviewData && currency
        ? overviewData.recentGifts.map((item) =>
            mapDashboardRecentGiftItem(item, currency),
          )
        : [],
    [currency, overviewData],
  )
  const isLoadingRecentGifts =
    statsOverview.isLoading && recentGifts.length === 0
  const hasRecentGiftsError =
    (statsOverview.isError || statsOverview.isRefetchError) &&
    recentGifts.length === 0

  return (
    <>
      {' '}
      {/* <KycBanner
        message='You have been sent a huge amount of money. Please update your KYC to access it.'
        actionLabel='Update KYC'
        onAction={() => router.push('/profile?modal=kyc&source=dashboard')}
      /> */}
      <div className='mt-4 lg:mt-0 w-full flex flex-col gap-6 lg:gap-6 px-4 lg:px-0 mb-5 lg:mb-0'>
        <DashboardStatsSection />

        <RecentGiftsSection
          items={recentGifts}
          isLoading={isLoadingRecentGifts}
          hasError={hasRecentGiftsError}
          isRetrying={hasRecentGiftsError && statsOverview.isFetching}
          onRetry={() => statsOverview.refetch()}
        />
      </div>
      <button
        type='button'
        onClick={() => {
          analytics.trackDashboardAiAssistantClicked()
          console.log('button clicked')
        }}
        className='fixed bottom-6 right-6 w-[94px] h-[84px] rounded-[70px] border-2 border-[#B8B8EA0D] shadow-[0px_16px_24px_-4px_#10192814] overflow-hidden flex items-center justify-center bg-white'
        aria-label='AI assistant'
      >
        <div className='w-[80px] h-[70px]'>
          <Image
            src='/assets/images/gifs/ai-animation.gif'
            alt='AI assistant'
            width={80}
            height={70}
            className='object-contain rounded-[12px]'
            unoptimized
          />
        </div>
      </button>
    </>
  )
}

export default DashboardPageClient
