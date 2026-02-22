'use client'

import { useEffect, useMemo, useState } from 'react'
import GiftIcon from '@/assets/icons/GiftIcon'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { format, isValid, parseISO } from 'date-fns'
import { useMobileBack } from '@/components/Layout/MobileTitleContext'
import { useParams, useRouter } from 'next/navigation'
import MessageIcon from '@/assets/icons/MessageIcon'
import CashIcon from '@/assets/icons/CashIcon'
import CardBgSvg from '@/assets/icons/CardBgSvg'
import { GiftActivityItem } from '../GiftsPage/types'
import type { SummaryCard, WishItem } from '@/types/Gifts/giftDetails'
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
import EyeOnIcon from '@/assets/icons/EyeOnIcon'
import { usePageById } from '@/hooks/tanstack/pages'
import { toApiError } from '@/api/errorHelpers'
import GiftDetailsErrorState from './GiftDetailsErrorState'
import { flattenWishPages, usePageComments } from '@/hooks/tanstack/pageComments'
import type { ActivityStatus } from '../GiftsPage/types'
import {
  flattenContributionPages,
  usePageContributions,
} from '@/hooks/tanstack/pageContributions'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

const ACTIVITY_STATUS_MAP: Record<string, ActivityStatus> = {
  unclaimed: 'Unclaimed',
  shipped: 'Shipped',
  claimed: 'Claimed',
  pending: 'Pending',
  used: 'Used',
}

const GiftDetailsPageClient = () => {
  const router = useRouter()
  const params = useParams()
  const { setOnBack } = useMobileBack()
  const [openMobileId, setOpenMobileId] = useState<string | null>(null)
  const [visitRange, setVisitRange] = useState('last-7-days')
  const [wishSort, setWishSort] = useState('most-recent')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)
  const [isReactivateOpen, setIsReactivateOpen] = useState(false)
  const { openSuccess } = useSuccessModal()
  const [activeOverrides, setActiveOverrides] = useState<
    Record<string, boolean>
  >({})

  const giftId = typeof params?.id === 'string' ? params.id : '1'
  const pageQuery = usePageById(giftId)
  const commentsQuery = usePageComments(giftId, wishSort)
  const contributionsQuery = usePageContributions(giftId)
  const page = pageQuery.data?.data
  const giftTitle = page?.title ?? 'Gift Page'
  const giftUrl = page?.publicUrl ?? `/u/${giftId}`
  const isActive = activeOverrides[giftId] ?? page?.isActive ?? true
  const wishItems: WishItem[] = useMemo(
    () => flattenWishPages(commentsQuery.data?.pages),
    [commentsQuery.data?.pages]
  )

  const formatMoney = (value: number) => {
    try {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 0,
      }).format(value)
    } catch {
      return `₦${value}`
    }
  }

  const summaryCards = useMemo<SummaryCard[]>(
    () => [
      {
        id: 'gifts',
        title: 'Total gifts received',
        value: String(page?.engagement.totalContributions ?? 0),
        icon: GiftIcon,
        borderColor: 'border-success-50',
        accent: 'bg-success-50/30',
        iconColor: 'text-success-400',
        svgColor: 'text-success-50',
      },
      {
        id: 'wishes',
        title: 'Wishes',
        value: String(page?.engagement.totalWishes ?? 0),
        icon: MessageIcon,
        borderColor: 'border-warning-50',
        accent: 'bg-warning-50/30',
        iconColor: 'text-warning-400',
        svgColor: 'text-warning-50',
      },
      {
        id: 'views',
        title: 'Page views',
        value: String(page?.engagement.totalViews ?? 0),
        icon: EyeOnIcon,
        borderColor: 'border-[#EDE7FC]',
        accent: 'bg-[#EDE7FC]/30',
        iconColor: 'text-[#4B14CB]',
        svgColor: 'text-[#EDE7FC]',
      },
      {
        id: 'value',
        title: 'Total value (Cash & Gifts)',
        value: formatMoney(page?.engagement.totalContibutionsValue ?? 0),
        icon: CashIcon,
        borderColor: 'border-[#E8F1FB]',
        accent: 'bg-[#E8F1FB]/30',
        iconColor: 'text-information-400',
        svgColor: 'text-[#E8F1FB]',
      },
    ],
    [page]
  )

  const activityItems: GiftActivityItem[] = useMemo(
    () =>
      flattenContributionPages(contributionsQuery.data?.pages).map(
        (item, index) => {
        const record = item as Record<string, unknown>
        const rawStatus = String(record.status ?? 'pending').toLowerCase()
        const status = ACTIVITY_STATUS_MAP[rawStatus] ?? 'Pending'
        const worthValue =
          typeof record.amount === 'number'
            ? record.amount
            : typeof record.worth === 'number'
              ? record.worth
              : 0

        return {
          id: String(record.id ?? index),
          gift: String(record.gift ?? record.title ?? record.name ?? 'Gift'),
          type: String(record.type ?? 'Contribution'),
          sender: String(record.sender ?? record.fullName ?? 'Unknown sender'),
          status,
          worth:
            typeof record.amount === 'string' || typeof record.worth === 'string'
              ? String(record.amount ?? record.worth)
              : formatMoney(worthValue),
        }
      }
      ),
    [contributionsQuery.data?.pages]
  )
  const isLoadingActivity = contributionsQuery.isLoading && activityItems.length === 0
  const hasActivityError =
    (contributionsQuery.isError || contributionsQuery.isRefetchError) &&
    activityItems.length === 0
  const canLoadMoreActivity = Boolean(contributionsQuery.hasNextPage)
  const isLoadingMoreActivity = contributionsQuery.isFetchingNextPage

  const canLoadMoreWishes = Boolean(commentsQuery.hasNextPage)
  const isLoadingMoreWishes = commentsQuery.isFetchingNextPage

  useEffect(() => {
    setOnBack(() => () => {
      router.back()
    })

    return () => setOnBack(undefined)
  }, [router, setOnBack])

  const barData = useMemo(
    () => ({
      labels: (page?.chartData.pageVisits ?? []).map((point) => {
        const parsed = parseISO(point.date)
        return isValid(parsed) ? format(parsed, 'MMM d') : point.date
      }),
      datasets: [
        {
          label: 'Visits',
          data: (page?.chartData.pageVisits ?? []).map((point) => point.count),
          backgroundColor: '#089BC4',
          borderRadius: 2,
          barThickness: 22,
        },
      ],
    }),
    [page?.chartData.pageVisits]
  )

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#7B7574', font: { size: 11 } },
          border: { display: false },
        },
        y: {
          grid: { color: '#F3F2F2' },
          ticks: { color: '#9F9A99', font: { size: 10 }, stepSize: 30 },
          border: { display: false },
        },
      },
    }),
    []
  )

  const doughnutData = useMemo(
    () => ({
      labels: ['Items', 'Cash', 'Custom Gifts'],
      datasets: [
        {
          data: [
            page?.chartData.giftDistribution.store ?? 0,
            page?.chartData.giftDistribution.cash ?? 0,
            page?.chartData.giftDistribution.custom ?? 0,
          ],
          backgroundColor: ['#089BC4', '#C19348', '#5AB579'],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    }),
    [page?.chartData.giftDistribution]
  )

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
    }),
    []
  )

  const handleViewPage = () => {
    if (typeof window === 'undefined') return
    window.open(giftUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDeactivateConfirm = () => {
    setIsDeactivateOpen(false)
    setActiveOverrides((prev) => ({ ...prev, [giftId]: false }))
    openSuccess({ message: 'Your gift page has been successfully deactivated' })
  }

  const handleReactivateConfirm = () => {
    setIsReactivateOpen(false)
    setActiveOverrides((prev) => ({ ...prev, [giftId]: true }))
    openSuccess({ message: 'Your gift page has been successfully activated' })
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
            onEdit={() => setIsEditOpen(true)}
            onShare={() => setIsShareOpen(true)}
            onToggleActive={() =>
              isActive ? setIsDeactivateOpen(true) : setIsReactivateOpen(true)
            }
          />

          <SummaryCardsGrid cards={summaryCards} CardBgSvg={CardBgSvg} />

          <div className='mt-4 lg:mt-1 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,364px)] gap-5'>
            <div className='flex flex-col gap-5'>
              <GiftActivitySection
                items={activityItems}
                openMobileId={openMobileId}
                onToggleMobile={(id) =>
                  setOpenMobileId((prev) => (prev === id ? null : id))
                }
                isLoading={isLoadingActivity}
                isError={hasActivityError}
                onRetry={() => contributionsQuery.refetch()}
                canLoadMore={canLoadMoreActivity}
                isLoadingMore={isLoadingMoreActivity}
                onLoadMore={() => contributionsQuery.fetchNextPage()}
              />

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <PageVisitsCard
                  visitRange={visitRange}
                  onVisitRangeChange={setVisitRange}
                  data={barData}
                  options={barOptions}
                />

                <GiftTypeDistributionCard
                  data={doughnutData}
                  options={doughnutOptions}
                />
              </div>
            </div>

            <WishesSection
              wishes={wishItems}
              wishSort={wishSort}
              onWishSortChange={setWishSort}
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
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          openSuccess({ message: 'Your updates have been saved successfully.' })
        }}
      />

      <ShareGiftPageModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        pageTitle={giftTitle}
        pageUrl={giftUrl}
      />

      <DeactivateModal
        isOpen={isDeactivateOpen}
        count={1}
        message='This will make this gift page temporarily unavailable to others. People won’t be able to view, send gifts, or leave wishes until you reactivate it.'
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
      />

      <ReactivateModal
        isOpen={isReactivateOpen}
        onClose={() => setIsReactivateOpen(false)}
        onConfirm={handleReactivateConfirm}
      />
    </div>
  )
}

export default GiftDetailsPageClient
