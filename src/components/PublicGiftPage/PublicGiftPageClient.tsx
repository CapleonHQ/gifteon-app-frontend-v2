'use client'

import { useMemo, useState } from 'react'
import { Share2 } from 'lucide-react'
import {
  getTemplateRegistryItem,
  renderRenderTemplate,
} from '@/lib/config/templates/registry'
import type { RenderTemplateProps } from '@/lib/config/templates/types'
import { usePublicPageBySlug } from '@/hooks/tanstack/publicPage'
import ShareGiftPageModal from '@/components/Gifts/GiftDetails/ShareGiftPageModal'
import {
  normalizePublicPageData,
} from './pageMapper'
import {
  PublicGiftPageErrorView,
  PublicGiftPageLoadingView,
} from './PublicGiftPageStates'
import CommentComposer from './engagement/CommentComposer'
import GiftListSection from './engagement/GiftListSection'
import SuccessModal from './engagement/SuccessModal'
import {
  readString,
  resolveGiftOptions,
  resolveRecipientName,
} from './engagement/utils'
import PublicGiftPageEngagementSection from './PublicGiftPageEngagementSection'
import PublicPageAttributionBadge from './PublicPageAttributionBadge'

type PublicGiftPageClientProps = {
  slug: string
}

export default function PublicGiftPageClient({
  slug,
}: PublicGiftPageClientProps) {
  const pageQuery = usePublicPageBySlug(slug)

  const pageData = pageQuery.data?.data

  const normalizedPage = useMemo(
    () => normalizePublicPageData(pageData),
    [pageData]
  )
  const receiverName = useMemo(() => {
    return pageData ? resolveRecipientName(pageData, normalizedPage?.title || '') : ''
  }, [normalizedPage?.title, pageData])
  const currency = readString(pageData?.settings?.currency)?.toUpperCase() || 'NGN'
  const giftOptions = useMemo(
    () => (pageData ? resolveGiftOptions(pageData) : []),
    [pageData]
  )
  const resolvedTemplateId = normalizedPage?.templateId
  const resolvedTemplateLayout = useMemo(() => {
    return getTemplateRegistryItem(resolvedTemplateId).layout
  }, [resolvedTemplateId])
  const isTemplate4 = resolvedTemplateLayout === 'spotlightGrid'
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [giftQuantities, setGiftQuantities] = useState<Record<string, number>>(
    {}
  )
  const [selectedGiftIds, setSelectedGiftIds] = useState<Record<string, boolean>>(
    {}
  )

  const selectedGiftItems = useMemo(
    () => giftOptions.filter((item) => selectedGiftIds[item.id]),
    [giftOptions, selectedGiftIds]
  )

  if (pageQuery.isLoading) {
    return <PublicGiftPageLoadingView />
  }

  if (pageQuery.isError || !pageData || !normalizedPage) {
    return <PublicGiftPageErrorView />
  }

  const safeTemplateId = resolvedTemplateId ?? getTemplateRegistryItem().id

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

  const shareButton = (
    <div
      className={`${
        isTemplate4 ? 'px-5 sm:px-8 lg:px-12' : 'px-5 sm:px-8 lg:px-15'
      }`}
    >
      <div className='flex items-center justify-end gap-2'>
        <button
          type='button'
          onClick={() => setIsShareModalOpen(true)}
          className='inline-flex items-center justify-center gap-2 rounded-[10px] border border-grey-200 bg-white px-3 py-2 text-sm font-medium text-grey-700 transition-colors hover:bg-grey-50'
        >
          <Share2 className='h-4 w-4' />
          Share
        </button>
      </div>
    </div>
  )

  const renderProps: RenderTemplateProps = {
    data: {
      ...normalizedPage,
      templateId: safeTemplateId,
    },
    engagementSection: isTemplate4 ? (
      <PublicGiftPageEngagementSection page={pageData} variant='spotlightGrid' />
    ) : null,
    mobileShareAction: isTemplate4 ? shareButton : null,
  }

  return (
    <main className='min-h-screen md:bg-primary-50 md:px-4 md:py-8 lg:py-15'>
      <div className='mx-auto max-w-[924px] border border-white bg-white flex flex-col gap-4 lg:gap-7'>
        {renderRenderTemplate(
          safeTemplateId,
          renderProps
        )}
        {isTemplate4 ? <div className='hidden md:block'>{shareButton}</div> : shareButton}
        {isTemplate4 ? null : (
          <PublicGiftPageEngagementSection page={pageData} />
        )}
        <div
          className={`${
            isTemplate4 ? 'px-5 pb-8 sm:px-8 lg:px-12 lg:pb-14' : 'px-5 pb-8 sm:px-8 lg:px-15 lg:pb-14'
          }`}
        >
          <CommentComposer
            receiverName={receiverName}
            pageId={pageData.id}
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
        </div>
      </div>

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
        pageTitle={normalizedPage.title}
        pageUrl={pageData.slug ? `/u/${pageData.slug}` : ''}
        trackShareSlug={pageData.slug}
      />
      <PublicPageAttributionBadge />
    </main>
  )
}
