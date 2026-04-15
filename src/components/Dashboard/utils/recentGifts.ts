import type { GiftItem } from '@/types/Gifts/'
import type { DashboardRecentGift } from '@/types/Stats'
import { formatCurrency } from '@/lib/utils/currency'

const RECENT_GIFT_STATUS_LABELS: Record<
  DashboardRecentGift['status'],
  GiftItem['status']
> = {
  pending: 'Not fulfilled',
  success: 'Fulfilled',
  claimed: 'Claimed',
  failed: 'Not fulfilled',
  refunded: 'Not fulfilled',
  surplus: 'Not fulfilled',
  delivered: 'Delivered',
  fulfilled: 'Fulfilled',
  shipped: 'Shipped',
}

const toGiftDate = (createdAt: string): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(createdAt))

export const mapDashboardRecentGiftItem = (
  item: DashboardRecentGift,
  currency: string
): GiftItem => {
  const status = RECENT_GIFT_STATUS_LABELS[item.status]
  const isCashGift = item.type.toLowerCase() === 'cash'
  const image = item.imageUrl === 'none' ? undefined : item.imageUrl

  return {
    id: item.id,
    name: isCashGift ? 'Cash Gift' : item.giftName,
    type: item.type,
    date: toGiftDate(item.createdAt),
    image,
    worth: formatCurrency(Number(item.amount), {
      currency,
      maximumFractionDigits: 0,
    }),
    status,
    fromName: item.sender,
    actionType:
      item.status === 'shipped'
        ? 'deliver'
        : item.status === 'success'
        ? isCashGift
          ? 'claim_cash'
          : 'claim_gift'
        : undefined,
    actionLabel:
      item.status === 'shipped'
        ? 'Mark as delivered'
        : item.status === 'success'
        ? 'Claim gift'
        : undefined,
  }
}
