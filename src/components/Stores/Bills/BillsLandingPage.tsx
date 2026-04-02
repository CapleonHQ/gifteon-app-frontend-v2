'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { toApiError } from '@/api/errorHelpers'
import SuccessModal from '@/components/common/SuccessModal'
import { useProfile } from '@/hooks/tanstack/account'
import {
  useBuyAirtime,
  useBuyData,
  usePayElectricityBill,
  useSendGiftBillSingle,
  useSubscribeCableTv,
} from '@/hooks/tanstack/bills'
import { BILLS_TABS, BillsTabKey } from './constants'
import BillsBuilderSection from './components/BillsBuilderSection'
import BillsReviewModal from './components/BillsReviewModal'
import BillsPinModal from './components/BillsPinModal'
import BillsSummaryActions from './components/BillsSummaryActions'
import { useBillsPlanCatalog } from './hooks/useBillsPlanCatalog'
import {
  CardValidationIssue,
  createRecipientCard,
  parseAmount,
  RecipientCard,
  toIsoDateTime,
  toYyyyMmDd,
} from './models'
import { TAB_META } from './config'

const BillsLandingPage = () => {
  const [activeTab, setActiveTab] = useState<BillsTabKey>('airtime')
  const [cardsByTab, setCardsByTab] = useState<
    Record<BillsTabKey, RecipientCard[]>
  >({
    airtime: [createRecipientCard()],
    data: [createRecipientCard()],
    electricity: [createRecipientCard()],
    cable_tv: [createRecipientCard()],
  })
  const [feedback, setFeedback] = useState<{
    tone: 'error'
    text: string
  } | null>(null)

  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isPinOpen, setIsPinOpen] = useState(false)
  const [pinError, setPinError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const recipientRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const topFeedbackRef = useRef<HTMLDivElement | null>(null)

  const profileQuery = useProfile()
  const ownTag = (profileQuery.data?.data?.giftseonTag || '')
    .replace(/^@+/, '')
    .toLowerCase()

  const buyAirtimeMutation = useBuyAirtime()
  const buyDataMutation = useBuyData()
  const payElectricityMutation = usePayElectricityBill()
  const subscribeCableMutation = useSubscribeCableTv()
  const sendGiftSingleMutation = useSendGiftBillSingle()
  const plansCatalog = useBillsPlanCatalog()

  const activeCards = cardsByTab[activeTab]

  const updateCard = (
    cardId: string,
    updater: (card: RecipientCard) => RecipientCard
  ) => {
    setCardsByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((card) =>
        card.id === cardId ? updater(card) : card
      ),
    }))
  }

  const addRecipientCard = () => {
    setCardsByTab((prev) => ({
      ...prev,
      [activeTab]: (() => {
        const currentCards = prev[activeTab]
        const lastCard = currentCards[currentCards.length - 1]
        const nextCard = createRecipientCard()
        if (lastCard?.senderNote.trim()) {
          nextCard.senderNote = lastCard.senderNote
        }
        return [...currentCards, nextCard]
      })(),
    }))
  }

  const removeRecipientCard = (cardId: string) => {
    setCardsByTab((prev) => {
      const list = prev[activeTab]
      if (list.length <= 1) return prev
      return {
        ...prev,
        [activeTab]: list.filter((item) => item.id !== cardId),
      }
    })
  }

  const scrollToTopFeedback = useCallback(() => {
    requestAnimationFrame(() => {
      topFeedbackRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [])

  const validateCard = useCallback(
    (card: RecipientCard): CardValidationIssue | null => {
      const amountValue = parseAmount(card.amount)
      if (amountValue <= 0)
        return { field: 'amount', message: 'Amount is required.' }

      const identifier = card.identifierValue.trim()
      if (!identifier) {
        return {
          field: 'identifierValue',
          message:
            activeTab === 'electricity'
              ? card.sendAsGift
                ? 'Enter meter number or @Giftseon tag.'
                : 'Meter number is required.'
              : activeTab === 'cable_tv'
              ? card.sendAsGift
                ? 'Enter IUC number or @Giftseon tag.'
                : 'IUC number is required.'
              : card.sendAsGift
              ? 'Enter phone number or @Giftseon tag.'
              : 'Phone number is required.',
        }
      }
      const isTag = card.sendAsGift && identifier.startsWith('@')

      if (activeTab === 'airtime' && !card.network) {
        return { field: 'network', message: 'Select network.' }
      }
      if (activeTab === 'data' && !card.network) {
        return { field: 'network', message: 'Select network.' }
      }
      if (activeTab === 'data' && !card.planCode) {
        return { field: 'planCode', message: 'Select data plan.' }
      }
      if (activeTab === 'data' && card.network && card.planCode) {
        const planAmount = plansCatalog.getDataPlanAmount(
          card.network,
          card.planCode
        )
        if (planAmount && amountValue !== planAmount) {
          return {
            field: 'amount',
            message: `Amount must match selected data plan: ₦${planAmount.toLocaleString()}.`,
          }
        }
      }
      if (activeTab === 'electricity' && !card.provider) {
        return { field: 'provider', message: 'Select disco.' }
      }
      if (activeTab === 'cable_tv' && !card.provider) {
        return { field: 'provider', message: 'Select cable provider.' }
      }
      if (activeTab === 'cable_tv' && !card.planCode) {
        return { field: 'planCode', message: 'Select cable package.' }
      }

      if (activeTab === 'electricity' && !isTag && !card.recipientVerified) {
        return {
          field: 'identifierValue',
          message: 'Verify meter number before continuing.',
        }
      }
      if (activeTab === 'cable_tv' && !isTag && !card.recipientVerified) {
        return {
          field: 'identifierValue',
          message: 'Verify IUC number before continuing.',
        }
      }

      if (activeTab === 'electricity' && card.provider) {
        const limits = plansCatalog.getElectricityAmountLimits(card.provider)
        if (limits) {
          if (amountValue < limits.min) {
            return {
              field: 'amount',
              message: `Minimum amount for this disco is ₦${limits.min.toLocaleString()}.`,
            }
          }
          if (amountValue > limits.max) {
            return {
              field: 'amount',
              message: `Maximum amount for this disco is ₦${limits.max.toLocaleString()}.`,
            }
          }
        }
      }

      if (activeTab === 'cable_tv' && card.provider && card.planCode) {
        const planAmount = plansCatalog.getCablePlanAmount(
          card.provider,
          card.planCode
        )
        if (planAmount && amountValue !== planAmount) {
          return {
            field: 'amount',
            message: `Amount must match selected package: ₦${planAmount.toLocaleString()}.`,
          }
        }
      }

      if (identifier.startsWith('@') && !card.sendAsGift) {
        return {
          field: 'identifierValue',
          message: 'Giftseon tag can only be used when sending as gift.',
        }
      }

      const normalizedTag = identifier.replace(/^@+/, '').toLowerCase()
      if (isTag && ownTag && normalizedTag === ownTag) {
        return {
          field: 'identifierValue',
          message: "You can't send a gift to yourself 🙂",
        }
      }

      if (card.sendAsGift && !card.isAnonymous && !isTag) {
        if (card.notifyEmail && !card.notificationEmail.trim()) {
          return {
            field: 'notificationEmail',
            message: 'Notification email is required for Email.',
          }
        }
      }

      if (card.timingMode === 'scheduled') {
        if (!card.scheduledDate || !card.scheduledTime) {
          return {
            field: 'scheduledDateTime',
            message: 'Date and time are required for scheduled payment.',
          }
        }
      }

      if (card.timingMode === 'recurring') {
        if (!card.scheduledDate || !card.scheduledTime) {
          return {
            field: 'scheduledDateTime',
            message: 'Start date and time are required for recurring payment.',
          }
        }
        if (card.recurringEndType === 'date' && !card.recurringEndDate) {
          return {
            field: 'recurringEndDate',
            message: 'Select recurring end date.',
          }
        }
      }

      return null
    },
    [
      activeTab,
      ownTag,
      plansCatalog,
    ]
  )

  const cardErrors = useMemo(
    () => activeCards.map((card) => validateCard(card)),
    [activeCards, validateCard]
  )

  const totalAmount = activeCards.reduce(
    (sum, card) => sum + parseAmount(card.amount),
    0
  )
  const isActionBusy =
    buyAirtimeMutation.isPending ||
    buyDataMutation.isPending ||
    payElectricityMutation.isPending ||
    subscribeCableMutation.isPending ||
    sendGiftSingleMutation.isPending ||
    isSubmitting

  const submitCard = async (
    card: RecipientCard,
    totalRecipients: number,
    pin: string
  ) => {
    const identifier = card.identifierValue.trim()
    const isTag = card.sendAsGift && identifier.startsWith('@')
    const amount = parseAmount(card.amount)

    const shouldUseGiftEndpoint =
      card.sendAsGift || card.timingMode !== 'instant' || totalRecipients > 1

    if (!shouldUseGiftEndpoint) {
      if (activeTab === 'airtime') {
        await buyAirtimeMutation.mutateAsync({
          network: card.network,
          phoneNumber: identifier,
          amount,
          pin,
        })
        return
      }

      if (activeTab === 'data') {
        await buyDataMutation.mutateAsync({
          network: card.network,
          phoneNumber: identifier,
          amount,
          planCode: card.planCode,
          pin,
        })
        return
      }

      if (activeTab === 'electricity') {
        await payElectricityMutation.mutateAsync({
          provider: card.provider,
          meterNumber: identifier,
          meterType: card.meterType,
          amount,
          pin,
        })
        return
      }

      await subscribeCableMutation.mutateAsync({
        provider: card.provider,
        iucNumber: identifier,
        packageCode: card.planCode,
        amount,
        pin,
      })
      return
    }

    await sendGiftSingleMutation.mutateAsync({
      recipientTag: isTag ? identifier.replace(/^@+/, '') : undefined,
      recipientPhone:
        activeTab === 'airtime' || activeTab === 'data'
          ? isTag
            ? undefined
            : identifier
          : undefined,
      recipientEmail: card.notifyEmail
        ? card.notificationEmail.trim() || undefined
        : undefined,
      recipientName: card.isAnonymous || isTag
        ? undefined
        : card.recipientName.trim() || undefined,
      bill: {
        billType: activeTab,
        provider:
          activeTab === 'airtime' || activeTab === 'data'
            ? card.network
            : card.provider,
        amount,
        recipient: isTag ? undefined : identifier,
        planCode:
          activeTab === 'data' || activeTab === 'cable_tv'
            ? card.planCode || undefined
            : undefined,
        meterType: activeTab === 'electricity' ? card.meterType : undefined,
      },
      isAnonymous: card.isAnonymous,
      senderNote: card.isAnonymous ? undefined : card.senderNote.trim() || undefined,
      notifySms: undefined,
      notifyEmail:
        card.sendAsGift && !card.isAnonymous ? card.notifyEmail : undefined,
      scheduledAt:
        card.timingMode === 'instant'
          ? undefined
          : toIsoDateTime(card.scheduledDate, card.scheduledTime),
      isRecurring: card.timingMode === 'recurring',
      recurringConfig:
        card.timingMode === 'recurring'
          ? {
              frequency: card.recurringFrequency,
              endDate:
                card.recurringEndType === 'date'
                  ? toYyyyMmDd(card.recurringEndDate)
                  : undefined,
            }
          : undefined,
      pin,
    })
  }

  const handleRunPayment = async (pinValue: string) => {
    setPinError('')
    if (pinValue.length !== 4) {
      setPinError('Enter your 4-digit transaction PIN.')
      return
    }

    const firstError = cardErrors.find(Boolean)
    if (firstError) {
      setPinError(firstError.message)
      return
    }

    setIsSubmitting(true)
    setFeedback(null)

    try {
      for (const card of activeCards) {
        await submitCard(card, activeCards.length, pinValue)
      }

      setIsPinOpen(false)
      setIsReviewOpen(false)
      setCardsByTab((prev) => ({
        ...prev,
        [activeTab]: [createRecipientCard()],
      }))
      setShowValidationErrors(false)
      setIsSuccessOpen(true)
    } catch (error) {
      const message = toApiError(error).message || 'Transaction failed.'
      const normalizedMessage = message.toLowerCase()
      const isPinRelatedApiError = normalizedMessage.includes('pin')

      if (isPinRelatedApiError) {
        setPinError(message)
        return
      }

      setPinError('')
      setIsPinOpen(false)
      setFeedback({ tone: 'error', text: message })
      scrollToTopFeedback()
    } finally {
      setIsSubmitting(false)
    }
  }

  const openReview = () => {
    setShowValidationErrors(true)
    setFeedback(null)
    const firstErrorIndex = cardErrors.findIndex(Boolean)
    const firstError = firstErrorIndex >= 0 ? cardErrors[firstErrorIndex] : null
    if (firstError) {
      const targetCard = activeCards[firstErrorIndex]
      const targetNode = targetCard
        ? recipientRefs.current[targetCard.id]
        : null
      targetNode?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setIsReviewOpen(true)
  }

  const openPinStepFromReview = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsPinOpen(true)
      return
    }
    setIsReviewOpen(false)
    setIsPinOpen(true)
  }

  const meta = TAB_META[activeTab]

  return (
      <div className='w-full bg-white lg:rounded-[20px] mt-4 lg:mt-0 flex-1 h-full pb-24 lg:pb-0'>
      <div className='flex flex-col gap-4 lg:gap-5 h-full px-4 lg:px-6 py-4 lg:py-6'>
        <div className='space-y-1'>
          <h1 className='text-lg lg:text-2xl font-semibold text-grey-900'>
            {meta.title}
          </h1>
          <p className='text-sm lg:text-base text-grey-600'>
            {meta.description}
          </p>
        </div>

        <div className='rounded-xl border border-grey-100 bg-white p-1 grid grid-cols-2 md:grid-cols-4 gap-1'>
          {BILLS_TABS.map((tab) => (
            <button
              key={tab.key}
              type='button'
              onClick={() => {
                setActiveTab(tab.key)
                setFeedback(null)
                setShowValidationErrors(false)
              }}
              className={`h-10 rounded-xl text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-grey-700 hover:bg-grey-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {feedback ? (
          <div
            ref={topFeedbackRef}
            className='rounded-lg px-3 py-2 text-sm bg-error-50 text-error-700'
          >
            {feedback.text}
          </div>
        ) : null}

        <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4'>
          <BillsBuilderSection
            activeTab={activeTab}
            activeCards={activeCards}
            cardErrors={cardErrors}
            showValidationErrors={showValidationErrors}
            recipientRefs={recipientRefs}
            isActionBusy={isActionBusy}
            onUpdateCard={updateCard}
            onRemoveRecipientCard={removeRecipientCard}
            onAddRecipientCard={addRecipientCard}
          />
          <BillsSummaryActions
            totalAmount={totalAmount}
            recipientsCount={activeCards.length}
            isActionBusy={isActionBusy}
            onReview={openReview}
          />
        </div>
      </div>

      <BillsReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onContinue={openPinStepFromReview}
        activeTab={activeTab}
        cards={activeCards}
        totalAmount={totalAmount}
        getDataPlanLabel={plansCatalog.getDataPlanLabel}
        getCablePackageLabel={plansCatalog.getCablePackageLabel}
      />

      {isPinOpen ? (
        <BillsPinModal
          isOpen={isPinOpen}
          pinError={pinError}
          isSubmitting={isSubmitting}
          onCloseToReview={() => {
            setIsPinOpen(false)
            setIsReviewOpen(true)
            setPinError('')
          }}
          onConfirm={handleRunPayment}
          onClearError={() => setPinError('')}
        />
      ) : null}

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title='Payment successful'
        message='Your bills transaction has been processed successfully.'
      />
      </div>
  )
}

export default BillsLandingPage
