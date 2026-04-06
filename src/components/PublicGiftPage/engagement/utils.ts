import type {
  PublicPageApiActivity,
  PublicPageApiData,
} from '@/api/services/publicPages'
import { formatRelativeTimeOrDate } from '@/lib/utils/dateTime'
import type { PublicActivityItem, GiftOption } from './types'

export const DEFAULT_GIFT_IMAGE = '/assets/images/place-holder-image.jpg'

export const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

export const readString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const readNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const normalized = Number(value.replace(/[^0-9.-]/g, ''))
    if (Number.isFinite(normalized)) return normalized
  }
  return null
}

export const pickString = (
  record: Record<string, unknown>,
  keys: string[]
): string | null => {
  for (const key of keys) {
    const value = readString(record[key])
    if (value) return value
  }
  return null
}

export const pickNumber = (
  record: Record<string, unknown>,
  keys: string[]
): number | null => {
  for (const key of keys) {
    const value = readNumber(record[key])
    if (value !== null) return value
  }
  return null
}

export const toRelativeTime = (value: string | null): string => {
  if (!value) return 'Recently'
  return formatRelativeTimeOrDate(value, 30)
}

export const getDisplayName = (
  fullName: string | null | undefined,
  anonymous: boolean,
  fallback?: string | null
) => {
  if (anonymous) return 'Anonymous'
  const safeName = readString(fullName)
  if (safeName) return safeName
  const safeFallback = readString(fallback)
  if (safeFallback) return safeFallback
  return 'Anonymous'
}

export const toInitials = (value: string) => {
  return value
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export const formatCurrency = (amount: number, currency: string) => {
  if (!Number.isFinite(amount)) return '--'
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency || 'NGN'} ${amount.toLocaleString('en-US')}`
  }
}

export const resolveRecipientName = (page: PublicPageApiData, pageTitle: string) => {
  const settingsName = readString(page.settings?.receiverName)
  if (settingsName) return settingsName

  const nameFromTitle = pageTitle
    .replace(/it's\s+/i, '')
    .replace(/my\s+/i, '')
    .replace(/birthday!?/i, '')
    .trim()

  return nameFromTitle || 'your friend'
}

const parseGiftRecord = (value: unknown, index: number): GiftOption | null => {
  const record = asRecord(value)
  if (!record) return null

  const nestedImageRecord = asRecord(record.image)
  const title =
    pickString(record, ['title', 'name', 'itemName', 'giftName']) ||
    `Gift ${index + 1}`
  const subtitle =
    pickString(record, ['description', 'subtitle', 'url', 'link']) ||
    'Pick this gift to support the celebration.'
  const imageUrl =
    pickString(record, ['imageUrl', 'coverImageUrl', 'thumbnail', 'url']) ||
    pickString(nestedImageRecord || {}, ['url']) ||
    DEFAULT_GIFT_IMAGE

  const quantity = Math.max(1, pickNumber(record, ['quantity', 'totalQuantity']) || 1)
  const fulfilled = Math.max(
    0,
    pickNumber(record, [
      'fulfilled',
      'fulfilledCount',
      'purchasedQuantity',
      'quantityGifted',
      'quantityClaimed',
    ]) || 0
  )
  const price = Math.max(
    0,
    pickNumber(record, ['unitPrice', 'price', 'amount', 'cost']) || 0
  )
  const id =
    pickString(record, ['id', 'itemId', 'uid', 'slug']) || `gift-option-${index}`
  const sourceValue = readString(record.source)?.toLowerCase()
  const kind: GiftOption['kind'] =
    sourceValue === 'store' ? 'store' : 'wishlist'

  return {
    id,
    title,
    subtitle,
    imageUrl,
    price,
    quantity,
    fulfilled,
    kind,
  }
}

export const resolveGiftOptions = (page: PublicPageApiData): GiftOption[] => {
  const wishListItems = Array.isArray(page.settings?.wishListItems)
    ? page.settings.wishListItems
    : []
  const storeItems = Array.isArray(page.settings?.storeItems)
    ? page.settings.storeItems
    : []

  const mapped = [
    ...wishListItems.map((item) => ({
      ...(asRecord(item) || {}),
      source: 'wishlist',
    })),
    ...storeItems.map((item) => ({
      ...(asRecord(item) || {}),
      source: 'store',
    })),
  ]
    .map((item, index) => parseGiftRecord(item, index))
    .filter((item): item is GiftOption => Boolean(item))

  const amount =
    readNumber(page.settings?.targetAmount) ??
    readNumber(page.settings?.amount) ??
    readNumber(page.settings?.minimumAmount) ??
    0

  const cashGiftItem: GiftOption | null = page.settings?.acceptCashGift
    ? (() => {
    const raisedAmount = Math.max(0, readNumber(page.settings?.amount) ?? 0)
    const targetAmount = Math.max(
      0,
      readNumber(page.settings?.targetAmount) ?? raisedAmount
    )
      return {
        id: 'cash-gift',
        title: 'Cash Gift',
        subtitle: 'Send cash directly to the celebrant',
        imageUrl: '',
        price: Math.max(0, amount),
        quantity: 1,
        fulfilled: 0,
        kind: 'cash',
        raisedAmount,
        targetAmount,
      }
    })()
    : null

  if (cashGiftItem) {
    return [cashGiftItem, ...mapped]
  }

  return mapped
}

export const mapActivities = (
  items: PublicPageApiActivity[]
): PublicActivityItem[] => {
  return items.map((item, index) => {
    const name =
      readString(item.title) ||
      readString(item.action) ||
      readString(item.description) ||
      readString(item.message) ||
      readString(item.label) ||
      'Activity update'
    const createdAt =
      readString(item.createdAt) ||
      readString(item.timestamp) ||
      readString(item.date)

    return {
      id: readString(item.id) || readString(item.uid) || `activity-${index}`,
      label: name,
      time: toRelativeTime(createdAt),
    }
  })
}
