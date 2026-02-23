export type GiftPageItem = {
  id: string
  title: string
  category: string
  visibility: 'Public' | 'Shareable' | 'Private'
  createdOn: string
  totalGifts: number
  totalWishes: number
  views: number
  status: 'Active' | 'Deactivated' | 'Ended'
  image: string
}

export const visibilityStyles = {
  Public: 'bg-success-50 text-success-500',
  Shareable: 'bg-warning-50 text-warning-600',
  Private: 'bg-grey-50 text-grey-700',
}

export const statusStyles = {
  Active: 'bg-success-50 text-success-500',
  Deactivated: 'bg-error-50 text-error-600',
  Ended: 'bg-grey-50 text-grey-700',
}

export const activityStatusStyles = {
  Unclaimed: 'bg-information-50 text-information-500',
  Shipped: 'bg-information-50 text-information-500',
  Claimed: 'bg-success-50 text-success-500',
  Pending: 'bg-warning-50 text-warning-500',
  Used: 'bg-grey-50 text-grey-500',
} as const

export type ActivityStatus = keyof typeof activityStatusStyles

export type GiftActivityItem = {
  id: string
  gift: string
  type: string
  sender: string
  status: ActivityStatus
  worth: string
}
