'use client'

import { useMemo, useState } from 'react'
import RecentGiftsTable from '@/components/Dashboard/RecentGiftsTable'
import RecentGiftsMobileList from '@/components/Dashboard/RecentGiftsMobileList'
import ClaimGiftModal from '@/components/Gifts/ClaimGiftModal'
import MarkAsDeliveredModal from '@/components/Gifts/MarkAsDeliveredModal'
import { useSuccessModal } from '@/context/SuccessModalContext'
import type { GiftItem } from '@/types/Gifts/'
import { analytics } from '@/lib/analytics/events'

type GiftsListWithActionsProps = {
  items: GiftItem[]
  source: 'dashboard' | 'contributions'
}

const GiftsListWithActions = ({
  items,
  source,
}: GiftsListWithActionsProps) => {
  const { openSuccess } = useSuccessModal()
  const [claimItem, setClaimItem] = useState<GiftItem | null>(null)
  const [deliverItem, setDeliverItem] = useState<GiftItem | null>(null)

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
    if (source === 'dashboard') {
      analytics.trackDashboardRecentGiftActionOpened({
        action_type: item.actionType || 'none',
        gift_id: item.id,
      })
    }
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
      <RecentGiftsTable items={items} onAction={handleGiftAction} />
      <RecentGiftsMobileList items={items} onAction={handleGiftAction} />

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
      />
    </>
  )
}

export default GiftsListWithActions
