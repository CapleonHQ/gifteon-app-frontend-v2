import type {
  PageDetailsApiItem,
  PageListApiItem,
  PageDetails,
  PageDetailsApiData,
  PagesListApiData,
  PagesListData,
  PageStatus,
  PageSummary,
  PageVisibility,
} from '@/types/Pages'

const formatCreatedOn = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

const toVisibilityLabel = (privacy: string): PageVisibility => {
  const normalized = privacy.trim().toLowerCase()
  if (normalized === 'private') return 'Private'
  if (normalized === 'shareable') return 'Shareable'
  return 'Public'
}

const toListStatusLabel = (status: string): PageStatus => {
  const normalized = status.trim().toLowerCase()
  if (normalized === 'published' || normalized === 'active') return 'Active'
  if (normalized === 'archived') return 'Deactivated'
  return 'Ended'
}

const toDetailsStatusLabel = (status: string): PageStatus => {
  return toListStatusLabel(status)
}

const toPublicUrl = (slug: string): string => `/u/${slug}`

const toSummaryListItem = (item: PageListApiItem): PageSummary => {
  const statusLabel = toListStatusLabel(item.status)
  return {
    id: item.id,
    title: item.title,
    category: item.categoryName ?? 'Uncategorized',
    visibility: toVisibilityLabel(item.visibility),
    createdOn: formatCreatedOn(item.createdAt),
    totalGifts: item.totalGifts ?? 0,
    totalWishes: item.totalWishes ?? 0,
    views: item.totalViews ?? 0,
    status: statusLabel,
    image: item.coverImageUrl || '/assets/images/place-holder-image.jpg',
    isActive: statusLabel === 'Active',
    publicUrl: toPublicUrl(item.slug),
  }
}

const toSummaryNewDetailsItem = (item: PageDetailsApiItem): PageSummary => {
  const summary: PageSummary = {
    id: item.id,
    title: item.title,
    category: item.categoryName,
    visibility: toVisibilityLabel(item.visibility),
    createdOn: formatCreatedOn(item.createdAt),
    totalGifts: 0,
    totalWishes: item.engagement.totalWishes,
    views: item.engagement.totalViews,
    status: toDetailsStatusLabel(item.status),
    image: item.coverImageUrl,
    isActive: toDetailsStatusLabel(item.status) === 'Active',
    publicUrl: toPublicUrl(item.slug),
  }
  return summary
}

const emptyPagesListData: PagesListData = {
  pages: [],
  total: 0,
  limit: 20,
  offset: 0,
  hasMore: false,
}

export const mapPagesListData = (
  data: PagesListApiData | undefined
): PagesListData => {
  if (!data) return emptyPagesListData

  return {
    pages: data.pages.map(toSummaryListItem),
    total: data.total,
    limit: data.limit,
    offset: data.offset,
    hasMore: data.hasMore,
  }
}

export const mapPageDetails = (
  data: PageDetailsApiData | undefined
): PageDetails | null => {
  if (!data) return null
  const summary = toSummaryNewDetailsItem(data)
  return {
    ...summary,
    contributions: data.contributions,
    engagement: {
      totalViews: data.engagement.totalViews,
      totalShares: data.engagement.totalShares,
      totalContributions: data.engagement.totalContributions,
      totalWishes: data.engagement.totalWishes,
      totalContributionsValue: data.engagement.totalContributionsValue,
    },
    chartData: {
      giftDistribution: {
        cash: data.chartData.giftDistribution.cash,
        store: data.chartData.giftDistribution.store,
        custom: data.chartData.giftDistribution.custom,
      },
      pageVisits: data.chartData.pageVisits.map((point) => ({
        date: point.date,
        count: Number(point.count),
      })),
    },
  }
}
