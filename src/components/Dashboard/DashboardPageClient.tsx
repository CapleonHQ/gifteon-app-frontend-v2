'use client'

import { useMemo, useState } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import RecentGiftsSection from './RecentGiftsSection'
import KycBanner from './KycBanner'
import ClaimGiftModal from '@/components/Gifts/ClaimGiftModal'
import MarkAsDeliveredModal from '@/components/Gifts/MarkAsDeliveredModal'
import { useSuccessModal } from '@/context/SuccessModalContext'
import DashboardStatsSection from './DashboardStatsSection'
import type { GiftItem } from '@/types/Gifts/index'
import { useStatsOverview } from '@/hooks/tanstack/stats'
import type { DashboardRecentGift } from '@/types/Stats'
import { formatCurrency } from '@/lib/utils/currency'

const FALLBACK_GIFT_IMAGE = '/assets/images/place-holder-image.jpg'

const formatGiftDate = (value?: string) => {
  if (!value) return '-'
  const parsed = parseISO(value)
  if (!isValid(parsed)) return value
  return format(parsed, 'dd MMM, yyyy')
}

const normalizeGiftStatus = (
  value?: string
): 'Delivered' | 'Fulfilled' | 'Shipped' | 'Not fulfilled' => {
  const normalized = (value || '').toLowerCase()
  if (normalized === 'delivered') return 'Delivered'
  if (normalized === 'fulfilled') return 'Fulfilled'
  if (normalized === 'shipped') return 'Shipped'
  return 'Not fulfilled'
}

const mapRecentGiftItem = (
  item: DashboardRecentGift,
  index: number,
  currency: string
): GiftItem => {
  const type = item.type || item.giftType || 'Gift'
  const amount =
    typeof item.amount === 'number'
      ? formatCurrency(item.amount, { currency, maximumFractionDigits: 0 })
      : item.amount || item.worth || '₦0'
  const status = normalizeGiftStatus(item.status)
  const safeType = type.toLowerCase()

  return {
    id: String(item.id ?? index),
    name: item.name || item.giftName || item.title || 'Gift',
    type,
    date: formatGiftDate(item.date || item.createdAt),
    worth: amount,
    status,
    image: item.image || item.imageUrl || FALLBACK_GIFT_IMAGE,
    fromName: item.fromName || item.senderName || 'Someone',
    actionType:
      status === 'Shipped'
        ? 'deliver'
        : status === 'Fulfilled'
          ? safeType.includes('cash')
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

const DashboardPageClient = () => {
  const { openSuccess } = useSuccessModal()
  const statsOverview = useStatsOverview()
  const [claimItem, setClaimItem] = useState<GiftItem | null>(null)
  const [deliverItem, setDeliverItem] = useState<GiftItem | null>(null)
  const overviewData = statsOverview.data?.data
  const currency = overviewData?.overview?.currency || 'NGN'
  const recentGifts = useMemo(
    () =>
      (overviewData?.recentGifts ?? []).map((item, index) =>
        mapRecentGiftItem(item, index, currency)
      ),
    [currency, overviewData?.recentGifts]
  )
  const isLoadingRecentGifts = statsOverview.isLoading && recentGifts.length === 0
  const hasRecentGiftsError =
    (statsOverview.isError || statsOverview.isRefetchError) &&
    recentGifts.length === 0

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

  const handleGiftAction = (item: GiftItem) => {
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
        <DashboardStatsSection />

        <RecentGiftsSection
          items={recentGifts}
          onAction={handleGiftAction}
          isLoading={isLoadingRecentGifts}
          hasError={hasRecentGiftsError}
          isRetrying={hasRecentGiftsError && statsOverview.isFetching}
          onRetry={() => statsOverview.refetch()}
        />
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
