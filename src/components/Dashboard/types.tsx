import { GiftIcon } from '@/assets/icons'
import CashIcon from '@/assets/icons/CashIcon'
import NotificationCircleIcon from '@/assets/icons/NotificationCircleIcon'
import ViewIcon from '@/assets/icons/ViewIcon'
import type { SummaryCardItem } from '@/types/Stats'

export const giftStatusStyles = {
  Delivered: 'bg-success-50 text-success-500',
  Fulfilled: 'bg-success-50 text-success-500',
  Claimed: 'bg-secondary-50 text-secondary-700',
  Shipped: 'bg-information-50 text-information-500',
  'Not fulfilled': 'bg-error-50 text-error-500',
}

export const emptySummaryCards: SummaryCardItem[] = [
  {
    id: 'claimable',
    title: 'Claimable balance',
    value: '0',
    meta: 'Updated today',
    icon: (
      <span className='w-4 h-4 text-[#FF8D28]'>
        <CashIcon />
      </span>
    ),
  },
  {
    id: 'active',
    title: 'Active pages',
    value: '0',
    meta: 'No pages yet',
    icon: (
      <span className='w-4 h-4 text-[#34C759]'>
        <NotificationCircleIcon />
      </span>
    ),
  },
  {
    id: 'pending',
    title: 'Pending gifts',
    value: '0',
    meta: 'No gifts yet',
    icon: (
      <span className='w-4 h-4 text-[#00C3D0]'>
        <GiftIcon />
      </span>
    ),
  },
  {
    id: 'views',
    title: 'Page views',
    value: '0',
    meta: 'No visitors yet!',
    icon: (
      <span className='w-4 h-4 text-[#CB1A14]'>
        <ViewIcon />
      </span>
    ),
  },
]
