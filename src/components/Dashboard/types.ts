import type { ReactNode } from 'react'

export type SummaryCardItem = {
  id: string
  title: string
  value: string
  meta: string
  icon: ReactNode
  actionLabel?: string
}

export type RecentGiftItem = {
  id: string
  name: string
  type: string
  date: string
  worth: string
  status: 'Delivered' | 'Fulfilled' | 'Shipped' | 'Not fulfilled'
  actionLabel?: string
  image: string
}

export const giftStatusStyles = {
  Delivered: 'bg-success-50 text-success-500',
  Fulfilled: 'bg-success-50 text-success-500',
  Shipped: 'bg-information-50 text-information-500',
  'Not fulfilled': 'bg-error-50 text-error-500',
}
