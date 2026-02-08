'use client'

import { useMemo, useState } from 'react'
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
import ClaimGiftModal from '@/components/Gifts/ClaimGiftModal'
import MarkAsDeliveredModal from '@/components/Gifts/MarkAsDeliveredModal'
import { useSuccessModal } from '@/context/SuccessModalContext'

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

const emptySummaryCards: SummaryCardItem[] = [
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
    actionType: 'claim_gift',
    image: '/assets/images/place-holder-image.jpg',
    fromName: 'Suleiman Agunde',
  },
  {
    id: '3',
    name: 'Flight Ticket',
    type: 'Custom Gift',
    date: '24 Oct, 2025',
    worth: '₦12,100',
    status: 'Fulfilled',
    actionLabel: 'Claim gift',
    actionType: 'claim_gift',
    image: '/assets/images/place-holder-image.jpg',
    fromName: 'Suleiman Agunde',
  },
  {
    id: '4',
    name: 'Men suits',
    type: 'Item',
    date: '24 Oct, 2025',
    worth: '₦92,000',
    status: 'Shipped',
    actionLabel: 'Mark as delivered',
    actionType: 'deliver',
    image: '/assets/images/place-holder-image.jpg',
  },
  {
    id: '5',
    name: 'Cash',
    type: 'Cash',
    date: '24 Oct, 2025',
    worth: '₦32,000',
    status: 'Fulfilled',
    actionLabel: 'Claim gift',
    actionType: 'claim_cash',
    image: '/assets/images/place-holder-image.jpg',
    fromName: 'Suleiman Agunde',
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
  const isEmptyState = recentGifts.length === 0
  const summaryItems = isEmptyState ? emptySummaryCards : summaryCards
  const { openSuccess } = useSuccessModal()
  const [claimItem, setClaimItem] = useState<RecentGiftItem | null>(null)
  const [deliverItem, setDeliverItem] = useState<RecentGiftItem | null>(null)

  const isCashClaim =
    (claimItem?.actionType || '') === 'claim_cash' ||
    (claimItem?.type || '').toLowerCase().includes('cash') ||
    (claimItem?.name || '').toLowerCase().includes('cash')

  const claimModalSteps = useMemo(() => {
    if (!claimItem) return []
    if (isCashClaim) {
      return [
        'Gift will be marked as Claimed',
        'Funds will be added to your wallet',
        'A thank you message will be sent to Suleiman',
      ]
    }
    return [
      'Gift will be marked as Claimed',
      'Attached gift will be downloaded to your device',
      'A thank you message will be sent to Suleiman',
    ]
  }, [claimItem, isCashClaim])

  const handleGiftAction = (item: RecentGiftItem) => {
    if (item.actionType === 'deliver') {
      setDeliverItem(item)
      return
    }
    if (item.actionType === 'claim_cash' || item.actionType === 'claim_gift') {
      setClaimItem(item)
    }
  }

  return (
    <>
      <KycBanner
        message='You have been sent a huge amount of money. Please update your KYC to access it.'
        actionLabel='Update KYC'
        actionHref='/profile'
      />
      <div className='w-full flex flex-col gap-8 lg:gap-7 px-4 lg:px-0 mb-5 lg:mb-0'>
        <SummaryCards items={summaryItems} />

        <div className='grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,346px)] gap-4 mt-2 lg:mt-0'>
          <VisitSharesCard
            range={visitRange}
            onRangeChange={setVisitRange}
            isEmpty={isEmptyState}
          />
          <GiftTypeDistributionCard isEmpty={isEmptyState} />
        </div>

        <RecentGiftsSection items={recentGifts} onAction={handleGiftAction} />
      </div>

      <ClaimGiftModal
        isOpen={Boolean(claimItem)}
        onClose={() => setClaimItem(null)}
        onConfirm={() => {
          openSuccess({
            title: 'Success!',
            message: isCashClaim
              ? `This cash has been deposited into your wallet, you have a total of ${
                  claimItem?.worth || '₦0'
                } in your wallet.`
              : 'This gift has been downloaded into your device.',
          })
          setClaimItem(null)
        }}
        giftName={claimItem?.name || 'Gift'}
        fromName={claimItem?.fromName || 'Suleiman Agunde'}
        typeLabel={claimItem?.type || 'Gift'}
        amountLabel={isCashClaim ? 'Amount' : 'Worth'}
        amountValue={claimItem?.worth || '₦0'}
        nextSteps={claimModalSteps}
      />

      <MarkAsDeliveredModal
        isOpen={Boolean(deliverItem)}
        onClose={() => setDeliverItem(null)}
        onConfirm={() => {
          openSuccess({
            title: 'Success!',
            message: 'This Item has been marked as Delivered.',
          })
          setDeliverItem(null)
        }}
        itemName={deliverItem?.name || 'Item'}
        itemImage={
          deliverItem?.image || '/assets/images/place-holder-image.jpg'
        }
      />

      <button
        type='button'
        onClick={() => console.log('button clicked')}
        className='fixed bottom-6 right-6 w-[94px] h-[84px] rounded-[70px] border-2 border-[#B8B8EA0D] shadow-[0px_16px_24px_-4px_#10192814] overflow-hidden flex items-center justify-center bg-white'
        aria-label='AI assistant'
      >
        <div className='w-[80px] h-[70px]'>
          <img
            src='/assets/images/gifs/ai-animation.gif'
            alt='AI assistant'
            className='w-full h-full object-contain rounded-[12px]'
          />
        </div>
      </button>
    </>
  )
}

export default DashboardPageClient
