import type {
  PageApiItem,
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

const toStatusLabel = (active: boolean): PageStatus => {
  return active ? 'Active' : 'Ended'
}

const toPublicUrl = (slug: string): string => `/u/${slug}`

const toSummaryItem = (item: PageApiItem): PageSummary => {
  return {
    id: item.id,
    title: item.title,
    category: item.EventCategory?.name ?? 'Uncategorized',
    visibility: toVisibilityLabel(item.settings.privacy),
    createdOn: formatCreatedOn(item.createdAt),
    totalGifts: 0,
    totalWishes: 0,
    views: 0,
    status: toStatusLabel(item.active),
    image: item.coverImageUrl || item.media[0]?.url || '/assets/images/place-holder-image.jpg',
    isActive: item.active,
    publicUrl: toPublicUrl(item.slug),
  }
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
    pages: data.pages.map(toSummaryItem),
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
  return toSummaryItem(data)
}
