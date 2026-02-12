'use client'

import CheckmarkStyledIcon from '@/assets/icons/CheckmarkStyledIcon'
import PaymentIcon from '@/assets/icons/PaymentIcon'
import HelpCircle from '@/assets/icons/HelpCircle'
import DeliveryTracking from '@/assets/icons/DeliveryTracking'
import type { ComponentType } from 'react'
import type { GiftActivityItem } from '../GiftsPage/types'

export type GiftActivityAction = {
  id: 'claim' | 'refund' | 'help' | 'delivered' | 'track'
  label: string
  icon: ComponentType<{ className?: string }>
  tone: 'primary' | 'secondary' | 'ghost'
}

export const getGiftActivityActions = (
  status: GiftActivityItem['status']
): GiftActivityAction[] => {
  switch (status) {
    case 'Unclaimed':
      return [
        {
          id: 'claim',
          label: 'Claim gift',
          icon: CheckmarkStyledIcon,
          tone: 'primary',
        },
        {
          id: 'refund',
          label: 'Request refund',
          icon: PaymentIcon,
          tone: 'secondary',
        },
        { id: 'help', label: 'Get help', icon: HelpCircle, tone: 'ghost' },
      ]
    case 'Shipped':
      return [
        {
          id: 'delivered',
          label: 'Mark as delivered',
          icon: CheckmarkStyledIcon,
          tone: 'primary',
        },
        {
          id: 'track',
          label: 'Track item',
          icon: DeliveryTracking,
          tone: 'secondary',
        },
        { id: 'help', label: 'Get help', icon: HelpCircle, tone: 'ghost' },
      ]
    case 'Pending':
    case 'Claimed':
    case 'Used':
    default:
      return [{ id: 'help', label: 'Get help', icon: HelpCircle, tone: 'ghost' }]
  }
}
