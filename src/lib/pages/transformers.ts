import type {
  PageDetails,
  PageStatus,
  PagesListData,
  PageSummary,
  PageVisibility,
} from '@/types/Pages'

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const toNumberValue = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

const toBooleanValue = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true') return true
    if (normalized === 'false') return false
  }
  return undefined
}

const formatCreatedOn = (value?: string) => {
  if (!value) return 'N/A'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

const toVisibilityLabel = (value?: string): PageVisibility => {
  const normalized = value?.trim().toLowerCase()
  if (normalized === 'private') return 'Private'
  if (normalized === 'shareable' || normalized === 'shared') return 'Shareable'
  return 'Public'
}

const toStatusLabel = (
  statusValue?: string,
  activeValue?: boolean
): PageStatus => {
  if (activeValue === false) return 'Ended'
  if (activeValue === true) return 'Active'

  const normalized = statusValue?.trim().toLowerCase()
  if (
    normalized === 'ended' ||
    normalized === 'inactive' ||
    normalized === 'deactivated' ||
    normalized === 'closed'
  ) {
    return 'Ended'
  }
  return 'Active'
}

const toPublicUrl = (value: string | undefined, fallback: string) => {
  if (!value) return fallback
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }
  return `/u/${value}`
}

const toPageSummary = (value: unknown): PageSummary | null => {
  const record = asRecord(value)
  if (!record) return null

  const id =
    toStringValue(record.id) ??
    toStringValue(record.uid) ??
    toStringValue(record._id) ??
    toStringValue(record.slug)

  if (!id) return null

  const categoryRecord = asRecord(record.category)
  const eventCategoryRecord = asRecord(record.EventCategory)
  const settingsRecord = asRecord(record.settings)
  const visibilityValue =
    toStringValue(record.visibility) ??
    toStringValue(record.privacy) ??
    toStringValue(settingsRecord?.privacy) ??
    toStringValue(record.accessType)
  const statusValue = toStringValue(record.status)
  const isActiveValue =
    toBooleanValue(record.isActive) ??
    toBooleanValue(record.active) ??
    toBooleanValue(record.enabled)
  const status = toStatusLabel(statusValue, isActiveValue)
  const linkValue =
    toStringValue(record.link) ??
    toStringValue(record.url) ??
    toStringValue(record.pageUrl) ??
    toStringValue(record.pageLink) ??
    toStringValue(record.slug)

  return {
    id,
    title:
      toStringValue(record.title) ??
      toStringValue(record.pageTitle) ??
      toStringValue(record.name) ??
      'Untitled Gift Page',
    category:
      toStringValue(record.category) ??
      toStringValue(eventCategoryRecord?.name) ??
      toStringValue(categoryRecord?.name) ??
      toStringValue(categoryRecord?.title) ??
      'Uncategorized',
    visibility: toVisibilityLabel(visibilityValue),
    createdOn: formatCreatedOn(
      toStringValue(record.createdAt) ??
        toStringValue(record.created_on) ??
        toStringValue(record.createdDate)
    ),
    totalGifts:
      toNumberValue(record.totalGifts) ??
      toNumberValue(record.giftsCount) ??
      toNumberValue(record.giftsReceivedCount) ??
      0,
    totalWishes:
      toNumberValue(record.totalWishes) ??
      toNumberValue(record.wishesCount) ??
      toNumberValue(record.wishCount) ??
      0,
    views:
      toNumberValue(record.views) ??
      toNumberValue(record.pageViews) ??
      toNumberValue(record.viewsCount) ??
      0,
    status,
    image:
      toStringValue(record.image) ??
      toStringValue(record.coverImageUrl) ??
      toStringValue(record.coverImage) ??
      toStringValue(record.thumbnail) ??
      toStringValue(asRecord((record.media as unknown[])?.[0])?.url) ??
      '/assets/images/place-holder-image.jpg',
    isActive: status === 'Active',
    publicUrl: toPublicUrl(linkValue, `/u/${id}`),
  }
}

const collectArrayCandidates = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data

  const record = asRecord(data)
  if (!record) return []

  const candidates = [
    record.pages,
    record.items,
    record.results,
    record.docs,
    record.rows,
    record.data,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate
  }

  return []
}

export const extractPagesList = (data: unknown): PageSummary[] => {
  const candidates = collectArrayCandidates(data)
  return candidates
    .map(toPageSummary)
    .filter((item): item is PageSummary => item !== null)
}

export const extractPagesListData = (data: unknown): PagesListData => {
  const record = asRecord(data)
  const pages = extractPagesList(data)

  return {
    pages,
    total: toNumberValue(record?.total) ?? pages.length,
    limit: toNumberValue(record?.limit) ?? pages.length,
    offset: toNumberValue(record?.offset) ?? 0,
    hasMore: toBooleanValue(record?.hasMore) ?? false,
  }
}

export const extractPageDetails = (data: unknown): PageDetails | null => {
  const record = asRecord(data)
  if (!record) return null

  const candidate =
    record.page ?? record.item ?? record.data ?? record.result ?? record
  return toPageSummary(candidate)
}
