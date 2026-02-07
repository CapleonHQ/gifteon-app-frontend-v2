'use client'

import { useState } from 'react'
import WalletIcon from '@/assets/icons/WalletIcon'
import GiftIcon from '@/assets/icons/GiftIcon'
import CashIcon from '@/assets/icons/CashIcon'
import SummaryCards from './SummaryCards'
import VisitSharesCard from './VisitSharesCard'
import GiftTypeDistributionCard from './GiftTypeDistributionCard'
import RecentGiftsSection from './RecentGiftsSection'
import KycBanner from './KycBanner'
import type { RecentGiftItem, SummaryCardItem } from './types'
import NotificationCircleIcon from '@/assets/icons/NotificationCircleIcon'
import ViewIcon from '@/assets/icons/ViewIcon'

const summaryCards: SummaryCardItem[] = [
  {
    id: 'claimable',
    title: 'Claimable balance',
    value: '₦74,600',
    meta: 'Updated today',
    icon: (
      <span className='w-4 h-4 text-[#FF8D28]'>
        <CashIcon />
      </span>
    ),
    actionLabel: 'Claim',
  },
  {
    id: 'active',
    title: 'Active pages',
    value: '4',
    meta: '2 public, 1 private',
    icon: (
      <span className='w-4 h-4 text-[#34C759]'>
        <NotificationCircleIcon />
      </span>
    ),
  },
  {
    id: 'pending',
    title: 'Pending gifts',
    value: '15',
    meta: 'Updated today',
    icon: (
      <span className='w-4 h-4 text-[#00C3D0]'>
        <GiftIcon />
      </span>
    ),
  },
  {
    id: 'views',
    title: 'Page views',
    value: '117',
    meta: '+12% from yesterday',
    icon: (
      <span className='w-4 h-4 text-[#CB1A14]'>
        <ViewIcon />
      </span>
    ),
  },
]

const recentGifts: RecentGiftItem[] = [
  {
    id: '1',
    name: 'Comfy Couch',
    type: 'Item',
    date: '24 Oct, 2025',
    worth: '₦258,600',
    status: 'Delivered',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '2',
    name: 'Keyholder',
    type: 'Item',
    date: '24 Oct, 2025',
    worth: '₦2,400',
    status: 'Fulfilled',
    actionLabel: 'Claim gift',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '3',
    name: 'Flight Ticket',
    type: 'Custom',
    date: '24 Oct, 2025',
    worth: '₦12,100',
    status: 'Fulfilled',
    actionLabel: 'Claim gift',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '4',
    name: 'Men suits',
    type: 'Item',
    date: '24 Oct, 2025',
    worth: '₦92,000',
    status: 'Shipped',
    actionLabel: 'Mark as delivered',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '5',
    name: 'Cash',
    type: 'Custom',
    date: '24 Oct, 2025',
    worth: '₦32,000',
    status: 'Fulfilled',
    actionLabel: 'Claim gift',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '6',
    name: 'Comfy Couch',
    type: 'Item',
    date: '24 Oct, 2025',
    worth: '₦258,600',
    status: 'Not fulfilled',
    image: '/assets/images/place-holder-image.jpg',
  },
]

const DashboardPageClient = () => {
  const [visitRange, setVisitRange] = useState('last-7-days')

  return (
    <>
      <KycBanner
        message='You have been sent a huge amount of money. Please update your KYC to access it.'
        actionLabel='Update KYC'
        actionHref='/profile'
      />
      <div className='w-full flex flex-col gap-8 lg:gap-7 px-4 lg:px-0 mb-5 lg:mb-0'>
        <SummaryCards items={summaryCards} />

        <div className='grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,346px)] gap-4 mt-2 lg:mt-0'>
          <VisitSharesCard range={visitRange} onRangeChange={setVisitRange} />
          <GiftTypeDistributionCard />
        </div>

        <RecentGiftsSection items={recentGifts} />
      </div>
    </>
  )
}

export default DashboardPageClient
