import { useMemo } from 'react'
import { usePageById } from '@/hooks/tanstack/pages'
import { flattenWishPages, usePageComments } from '@/hooks/tanstack/pageComments'
import {
  flattenContributionPages,
  usePageContributions,
} from '@/hooks/tanstack/pageContributions'
import {
  mapContributionItems,
  mapGiftDistributionChartData,
  mapSummaryCards,
  mapVisitsChartData,
} from '@/components/Gifts/GiftDetails/utils/mappers'

export const useGiftDetailsData = (giftId: string, wishSort: string) => {
  const pageQuery = usePageById(giftId)
  const commentsQuery = usePageComments(giftId, wishSort)
  const contributionsQuery = usePageContributions(giftId)

  const page = pageQuery.data?.data
  const giftTitle = page?.title ?? 'Gift Page'
  const giftUrl = page?.publicUrl ?? `/u/${giftId}`

  const wishItems = useMemo(
    () => flattenWishPages(commentsQuery.data?.pages),
    [commentsQuery.data?.pages]
  )

  const activityItems = useMemo(
    () => mapContributionItems(flattenContributionPages(contributionsQuery.data?.pages)),
    [contributionsQuery.data?.pages]
  )

  const summaryCards = useMemo(() => mapSummaryCards(page ?? undefined), [page])

  const barData = useMemo(
    () => mapVisitsChartData(page?.chartData.pageVisits ?? []),
    [page?.chartData.pageVisits]
  )

  const doughnutData = useMemo(
    () => mapGiftDistributionChartData(page?.chartData.giftDistribution),
    [page?.chartData.giftDistribution]
  )

  const isLoadingActivity = contributionsQuery.isLoading && activityItems.length === 0
  const hasActivityError =
    (contributionsQuery.isError || contributionsQuery.isRefetchError) &&
    activityItems.length === 0

  return {
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
    canLoadMoreActivity: Boolean(contributionsQuery.hasNextPage),
    isLoadingMoreActivity: contributionsQuery.isFetchingNextPage,
    canLoadMoreWishes: Boolean(commentsQuery.hasNextPage),
    isLoadingMoreWishes: commentsQuery.isFetchingNextPage,
    pageQuery,
    commentsQuery,
    contributionsQuery,
  }
}
