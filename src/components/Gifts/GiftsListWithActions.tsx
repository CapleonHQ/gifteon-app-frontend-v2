'use client'

import { useState } from 'react'
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
        item={claimItem}
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
