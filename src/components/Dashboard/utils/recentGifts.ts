import type { GiftItem } from '@/types/Gifts/'
import type { DashboardRecentGift } from '@/types/Stats'
import { formatCurrency } from '@/lib/utils/currency'

const RECENT_GIFT_STATUS_LABELS: Record<
  DashboardRecentGift['status'],
  GiftItem['status']
> = {
  success: 'Fulfilled',
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
      status === 'Shipped'
        ? 'deliver'
        : status === 'Fulfilled'
        ? isCashGift
          ? 'claim_cash'
          : 'claim_gift'
        : undefined,
    actionLabel:
      status === 'Shipped'
        ? 'Mark as delivered'
        : status === 'Fulfilled'
        ? 'Claim gift'
        : undefined,
  }
}
