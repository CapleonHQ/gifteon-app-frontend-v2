'use client'

import { useEffect } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { useMobileBack } from '@/components/Layout/MobileTitleContext'
import { useParams, useRouter } from 'next/navigation'
import CardBgSvg from '@/assets/icons/CardBgSvg'
import EditGiftPageModal from './EditGiftPageModal'
import ShareGiftPageModal from './ShareGiftPageModal'
import DeactivateModal from '@/components/Gifts/GiftsPage/DeactivateModal'
import { useSuccessModal } from '@/context/SuccessModalContext'
import ReactivateModal from './ReactivateModal'
import GiftDetailsHeader from './GiftDetailsHeader'
import SummaryCardsGrid from './SummaryCardsGrid'
import GiftActivitySection from './GiftActivitySection'
import PageVisitsCard from './PageVisitsCard'
import GiftTypeDistributionCard from './GiftTypeDistributionCard'
import WishesSection from './WishesSection'
import { toApiError } from '@/api/errorHelpers'
import GiftDetailsErrorState from './GiftDetailsErrorState'
import { useGiftDetailsData } from './hooks/useGiftDetailsData'
import { useGiftDetailsUiState } from './hooks/useGiftDetailsUiState'
import { useArchivePage, useUnarchivePage } from '@/hooks/tanstack/pages'
import {
  giftDistributionChartOptions,
  pageVisitsChartOptions,
} from './utils/mappers'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

const GiftDetailsPageClient = () => {
  const router = useRouter()
  const params = useParams()
  const { setOnBack } = useMobileBack()
  const { openSuccess } = useSuccessModal()
  const giftId = typeof params?.id === 'string' ? params.id : '1'
  const archiveMutation = useArchivePage()
  const unarchiveMutation = useUnarchivePage()
  const ui = useGiftDetailsUiState(giftId)
  const data = useGiftDetailsData(giftId, ui.wishSort)
  const {
    pageQuery,
    commentsQuery,
    contributionsQuery,
    page,
    giftTitle,
    giftUrl,
    summaryCards,
    activityItems,
    wishItems,
    barData,
    doughnutData,
    isLoadingActivity,
    hasActivityError,
    canLoadMoreActivity,
    isLoadingMoreActivity,
    canLoadMoreWishes,
    isLoadingMoreWishes,
  } = data
  const isActive = ui.isActive ?? page?.isActive ?? true

  useEffect(() => {
    setOnBack(() => () => {
      router.back()
    })

    return () => setOnBack(undefined)
  }, [router, setOnBack])

  const handleViewPage = () => {
    if (typeof window === 'undefined') return
    window.open(giftUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDeactivateConfirm = async () => {
    try {
      const response = await archiveMutation.mutateAsync(giftId)
      ui.setIsDeactivateOpen(false)
      ui.markInactive()
      await pageQuery.refetch()
      openSuccess({
        message:
          response.message || 'Your gift page has been successfully deactivated',
      })
    } catch {
      // Query error states will recover via refetch/invalidation.
    }
  }

  const handleReactivateConfirm = async () => {
    try {
      const response = await unarchiveMutation.mutateAsync(giftId)
      ui.setIsReactivateOpen(false)
      ui.markActive()
      await pageQuery.refetch()
      openSuccess({
        message: response.message || 'Your gift page has been successfully activated',
      })
    } catch {
      // Query error states will recover via refetch/invalidation.
    }
  }

  const showInitialPageLoader = pageQuery.isLoading && !page
  const pageError = pageQuery.isError ? toApiError(pageQuery.error) : null
  const showPageErrorState = !!pageError && !page
  const isMissingPage =
    pageError?.code === 'NOT_FOUND' || pageError?.status === 404

  const errorTitle = isMissingPage
    ? 'This page can’t be found'
    : 'Unable to load this page'
  const errorDescription = isMissingPage
    ? 'This gift page may have been deleted, moved, or the link is no longer valid.'
    : 'Something went wrong while loading this gift page. Please try again.'

  return (
    <div className='w-full bg-white px-4 lg:px-0 lg:bg-inherit lg:rounded-[20px] flex-1'>
      {showInitialPageLoader ? (
        <div className='h-full min-h-[500px] lg:min-h-[700px] flex items-center justify-center'>
          <div className='flex flex-col items-center gap-3'>
            <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500' />
            <p className='text-sm text-grey-700'>Loading page details...</p>
          </div>
        </div>
      ) : showPageErrorState ? (
        <GiftDetailsErrorState
          title={errorTitle}
          description={errorDescription}
          onRetry={() => pageQuery.refetch()}
          isRetrying={pageQuery.isFetching}
        />
      ) : (
        <div className='flex flex-col gap-6 lg:gap-5'>
          <GiftDetailsHeader
            title={giftTitle}
            isActive={isActive}
            onBack={() => router.back()}
            onView={handleViewPage}
            onEdit={() => ui.setIsEditOpen(true)}
            onShare={() => ui.setIsShareOpen(true)}
            onToggleActive={() =>
              isActive
                ? ui.setIsDeactivateOpen(true)
                : ui.setIsReactivateOpen(true)
            }
          />

          <SummaryCardsGrid cards={summaryCards} CardBgSvg={CardBgSvg} />

          <div className='mt-4 lg:mt-1 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,364px)] gap-5'>
            <div className='flex flex-col gap-5'>
              <GiftActivitySection
                items={activityItems}
                openMobileId={ui.openMobileId}
                onToggleMobile={ui.toggleMobileRow}
                isLoading={isLoadingActivity}
                isError={hasActivityError}
                onRetry={() => contributionsQuery.refetch()}
                canLoadMore={canLoadMoreActivity}
                isLoadingMore={isLoadingMoreActivity}
                onLoadMore={() => contributionsQuery.fetchNextPage()}
              />

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <PageVisitsCard
                  visitRange={ui.visitRange}
                  onVisitRangeChange={ui.setVisitRange}
                  data={barData}
                  options={pageVisitsChartOptions}
                />

                <GiftTypeDistributionCard
                  data={doughnutData}
                  options={giftDistributionChartOptions}
                />
              </div>
            </div>

            <WishesSection
              wishes={wishItems}
              wishSort={ui.wishSort}
              onWishSortChange={ui.setWishSort}
              isLoading={commentsQuery.isLoading}
              isError={commentsQuery.isError}
              onRetry={() => commentsQuery.refetch()}
              canLoadMore={canLoadMoreWishes}
              isLoadingMore={isLoadingMoreWishes}
              onLoadMore={() => commentsQuery.fetchNextPage()}
            />
          </div>
        </div>
      )}

      <EditGiftPageModal
        isOpen={ui.isEditOpen}
        onClose={() => ui.setIsEditOpen(false)}
        onSuccess={() => {
          openSuccess({ message: 'Your updates have been saved successfully.' })
        }}
      />

      <ShareGiftPageModal
        isOpen={ui.isShareOpen}
        onClose={() => ui.setIsShareOpen(false)}
        pageTitle={giftTitle}
        pageUrl={giftUrl}
      />

      <DeactivateModal
        isOpen={ui.isDeactivateOpen}
        count={1}
        message='This will make this gift page temporarily unavailable to others. People won’t be able to view, send gifts, or leave wishes until you reactivate it.'
        isSubmitting={archiveMutation.isPending}
        onClose={() => {
          if (archiveMutation.isPending) return
          ui.setIsDeactivateOpen(false)
        }}
        onConfirm={handleDeactivateConfirm}
      />

      <ReactivateModal
        isOpen={ui.isReactivateOpen}
        isSubmitting={unarchiveMutation.isPending}
        onClose={() => {
          if (unarchiveMutation.isPending) return
          ui.setIsReactivateOpen(false)
        }}
        onConfirm={handleReactivateConfirm}
      />
    </div>
  )
}

export default GiftDetailsPageClient
