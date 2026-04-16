import type {
  PublicPageApiActivity,
  PublicPageApiData,
  PublicPageApiWishListItem,
} from '@/types/PublicPages'
import { formatRelativeTimeOrDate } from '@/lib/utils/dateTime'
import { formatCurrency } from '@/lib/utils/currency'
import {
  readNumber,
  readString,
} from '@/lib/utils/parsers'
import type { PublicActivityItem, GiftOption } from './types'

export const DEFAULT_GIFT_IMAGE = '/assets/images/place-holder-image.jpg'

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

export const resolveRecipientName = (page: PublicPageApiData) => {
  return page.owner.firstName || page.owner.lastName
}

const mapGiftItem = (
  item: PublicPageApiWishListItem,
  kind: GiftOption['kind']
): GiftOption => {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.description,
    imageUrl: item.imageUrl,
    price: Math.max(0, Number(item.unitPrice)),
    quantity: Math.max(1, Number(item.quantity)),
    claimed: Math.max(0, Number(item.quantityClaimed)),
    kind,
  }
}

export const resolveGiftOptions = (page: PublicPageApiData): GiftOption[] => {
  const wishListItems = page.settings?.wishListItems ?? []
  const storeItems = page.settings?.storeItems ?? []

  const mapped = [
    ...wishListItems.map((item) => mapGiftItem(item, 'wishlist')),
    ...storeItems.map((item) => mapGiftItem(item, 'store')),
  ]

  const amount = Math.max(0, readNumber(page.settings?.targetAmount) ?? 0)

  const cashGiftItem: GiftOption | null = page.settings?.acceptCashGift
    ? (() => {
        const coveredAmount = Math.max(0, readNumber(page.settings?.amount) ?? 0)
        const targetAmount = Math.max(0, readNumber(page.settings?.targetAmount) ?? 0)
        const minimumAmount = Math.max(
          0,
          readNumber(page.settings?.minimumAmount) ?? 0
        )
      return {
        id: 'cash-gift',
        title: 'Cash Gift',
        subtitle: 'Send cash directly to the celebrant',
        imageUrl: '',
          price: Math.max(0, amount),
          quantity: 1,
          claimed: 0,
        kind: 'cash',
        coveredAmount,
        targetAmount,
        minimumAmount,
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
  const formatActivityMessage = (message: string) => {
    const sanitized = message
      .replace(/[{}]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    return sanitized.replace(
      /\b([A-Z]{3})\s*([0-9][0-9,]*(?:\.[0-9]+)?)\b/g,
      (_fullMatch, currencyCode: string, rawAmount: string) => {
        const numeric = Number(rawAmount.replace(/,/g, ''))
        if (!Number.isFinite(numeric)) return `${currencyCode} ${rawAmount}`
        const hasDecimals = rawAmount.includes('.') && numeric % 1 !== 0
        return formatCurrency(numeric, {
          currency: currencyCode,
          maximumFractionDigits: hasDecimals ? 2 : 0,
        })
      }
    )
  }

  return items.map((item, index) => {
    return {
      id: item.id || `activity-${index}`,
      label: formatActivityMessage(item.message),
      time: toRelativeTime(item.createdAt),
    }
  })
}
