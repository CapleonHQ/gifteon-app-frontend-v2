'use client'

import {
  type PublicPageApiData,
} from '@/api/services/publicPages'
import { useMemo, useState } from 'react'
import { Share2 } from 'lucide-react'
import ShareGiftPageModal from '@/components/Gifts/GiftDetails/ShareGiftPageModal'
import CommentComposer from './engagement/CommentComposer'
import EngagementFeed from './engagement/EngagementFeed'
import EngagementTabs from './engagement/EngagementTabs'
import GiftListSection from './engagement/GiftListSection'
import SuccessModal from './engagement/SuccessModal'
import type { EngagementTab } from './engagement/types'
import {
  readString,
  resolveGiftOptions,
  resolveRecipientName,
} from './engagement/utils'

type PublicGiftPageEngagementSectionProps = {
  page: PublicPageApiData
  pageTitle: string
}

export default function PublicGiftPageEngagementSection({
  page,
  pageTitle,
}: PublicGiftPageEngagementSectionProps) {
  const [activeTab, setActiveTab] = useState<EngagementTab>('comments')
  const [commentsTotal, setCommentsTotal] = useState<number>(
    Array.isArray(page.comments) ? page.comments.length : 0
  )
  const [sortValue, setSortValue] = useState<'most-recent' | 'oldest'>(
    'most-recent'
  )
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const receiverName = useMemo(
    () => resolveRecipientName(page, pageTitle),
    [page, pageTitle]
  )
  const currency = readString(page.settings?.currency)?.toUpperCase() || 'NGN'
  const giftOptions = useMemo(() => resolveGiftOptions(page), [page])

  const [giftQuantities, setGiftQuantities] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {}
      for (const item of giftOptions) {
        initial[item.id] = 1
      }
      return initial
    }
  )
  const [selectedGiftIds, setSelectedGiftIds] = useState<
    Record<string, boolean>
  >({})

  const selectedGiftItems = useMemo(
    () => giftOptions.filter((item) => selectedGiftIds[item.id]),
    [giftOptions, selectedGiftIds]
  )
  const shareUrl = page.slug ? `/u/${page.slug}` : ''

  const handleSelectGift = (giftId: string, checked: boolean) => {
    setSelectedGiftIds((prev) => ({ ...prev, [giftId]: checked }))
  }

  const updateGiftQuantity = (giftId: string, direction: 'inc' | 'dec') => {
    setGiftQuantities((prev) => {
      const current = prev[giftId] ?? 1
      const next = direction === 'inc' ? current + 1 : Math.max(1, current - 1)
      return { ...prev, [giftId]: next }
    })
  }

  const handleTabChange = (tab: EngagementTab) => {
    setSortValue('most-recent')
    setActiveTab(tab)
  }

  return (
    <div className='w-full px-5 pb-8 sm:px-8 lg:px-15 lg:pb-14'>
      <div className='mb-4 flex items-center justify-end gap-2'>
        <button
          type='button'
          onClick={() => setIsShareModalOpen(true)}
          className='inline-flex items-center gap-2 rounded-[10px] border border-grey-200 bg-white px-3 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50 transition-colors'
        >
          <Share2 className='h-4 w-4' />
          Share
        </button>
      </div>

      <EngagementTabs
        activeTab={activeTab}
        commentsTotal={commentsTotal}
        sortValue={sortValue}
        onSortChange={setSortValue}
        onTabChange={handleTabChange}
      />

      <EngagementFeed
        activeTab={activeTab}
        pageId={page.id}
        sortValue={sortValue}
        initialActivities={page.activities}
        onCommentsTotalChange={setCommentsTotal}
      />

      <CommentComposer
        receiverName={receiverName}
        pageId={page.id}
        onCommentSent={() => setSuccessModalOpen(true)}
      />

      <GiftListSection
        receiverName={receiverName}
        currency={currency}
        gifts={giftOptions}
        selectedGiftIds={selectedGiftIds}
        giftQuantities={giftQuantities}
        onSelectGift={handleSelectGift}
        onChangeGiftQuantity={updateGiftQuantity}
        onSendCustomGift={() => setSuccessModalOpen(true)}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        receiverName={receiverName}
        selectedGiftItems={selectedGiftItems}
        giftQuantities={giftQuantities}
        currency={currency}
      />
      <ShareGiftPageModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pageTitle={pageTitle}
        pageUrl={shareUrl}
        trackShareSlug={page.slug}
      />
    </div>
  )
}
