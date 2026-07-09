import type {
  PublicPageApiActivity,
  PublicPageApiData,
  PublicPageApiWishListItem,
} from '@/types/PublicPages'
import { formatRelativeTimeOrDate } from '@/lib/utils/dateTime'
import { formatCurrency } from '@/lib/utils/currency'
import { readNumber, readString } from '@/lib/utils/parsers'
import type { PublicActivityItem, GiftOption } from './types'

export const DEFAULT_GIFT_IMAGE = '/assets/images/place-holder-image.jpg'

export interface CurrencyFee {
  /** Flat fee in currency units added to every transaction */
  flat: number;
  /** Percentage of amount as a decimal, e.g. 0.005 = 0.5% */
  percent: number;
  /** Maximum total fee regardless of amount */
  cap: number;
}

const CURRENCY_WITHDRAWAL_FEES: Record<string, CurrencyFee> = {
  NGN: { flat: 50, percent: 0.005, cap: 1_500 }, // ₦50 + 0.5%, max ₦1,500
  USD: { flat: 1.5, percent: 0.008, cap: 50 }, // $1.50 + 0.8%, max $50
  GBP: { flat: 1.0, percent: 0.008, cap: 40 }, // £1.00 + 0.8%, max £40
  EUR: { flat: 1.0, percent: 0.008, cap: 40 }, // €1.00 + 0.8%, max €40
  GHS: { flat: 2, percent: 0.0075, cap: 100 }, // GH₵2 + 0.75%, max GH₵100
  KES: { flat: 25, percent: 0.005, cap: 2_000 }, // KSh25 + 0.5%, max KSh2,000
  ZAR: { flat: 3, percent: 0.005, cap: 500 }, // R3 + 0.5%, max R500
  XOF: { flat: 200, percent: 0.0075, cap: 10_000 }, // CFA200 + 0.75%, max CFA10,000
  XAF: { flat: 200, percent: 0.0075, cap: 10_000 }, // CFA200 + 0.75%, max CFA10,000
};

export const calculateFee = (amount: number, currency: string = 'NGN'): number => {
  const fee =
    CURRENCY_WITHDRAWAL_FEES[currency] ?? CURRENCY_WITHDRAWAL_FEES['NGN'];
  const computed = fee.flat + amount * fee.percent;
  return Math.min(computed, fee.cap);
};


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
    claimed: Math.max(0, Number(item.quantityGifted)),
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
      const coveredAmount = Math.max(
        0,
        readNumber(page.settings?.amount) ?? 0
      )
      const targetAmount = Math.max(
        0,
        readNumber(page.settings?.targetAmount) ?? 0
      )
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
    const sanitized = message.replace(/[{}]+/g, '').replace(/\s+/g, ' ').trim()

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
