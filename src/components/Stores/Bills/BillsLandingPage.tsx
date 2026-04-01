'use client'

import { useCallback, useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import SuccessModal from '@/components/common/SuccessModal'
import { useProfile } from '@/hooks/tanstack/account'
import {
  useBuyAirtime,
  useBuyData,
  useElectricityDiscos,
  usePayElectricityBill,
  useSendGiftBillSingle,
  useSubscribeCableTv,
  useVerifyCableIuc,
  useVerifyElectricityMeter,
} from '@/hooks/tanstack/bills'
import { BILLS_TABS, BillsTabKey } from './constants'
import BillsBuilderSection from './components/BillsBuilderSection'
import BillsReviewModal from './components/BillsReviewModal'
import BillsPinModal from './components/BillsPinModal'
import BillsSummaryActions from './components/BillsSummaryActions'
import { BillsFlowProvider } from './context/BillsFlowContext'
import { useBillsPlanCatalog } from './hooks/useBillsPlanCatalog'
import {
  CardValidationIssue,
  createRecipientCard,
  parseAmount,
  RecipientCard,
  toIsoDateTime,
  toYyyyMmDd,
} from './models'

const TAB_META: Record<BillsTabKey, { title: string; description: string }> = {
  airtime: {
    title: 'Buy Airtime',
    description: 'Top up numbers or send airtime gifts in one builder.',
  },
  data: {
    title: 'Buy Data',
    description:
      'Select data plans and configure each recipient independently.',
  },
  electricity: {
    title: 'Pay Electricity Bill',
    description:
      'Pay instantly or configure scheduled and recurring bill actions.',
  },
  cable_tv: {
    title: 'Subscribe Cable TV',
    description:
      'Handle one or many subscriptions with independent timing rules.',
  },
}

const extractVerifiedCustomerName = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null
  const root = payload as Record<string, unknown>
  const data =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : null
  if (!data) return null
  const candidate = data.customer_name
  if (typeof candidate !== 'string') return null
  const normalized = candidate.trim()
  return normalized.length > 0 ? normalized : null
}

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
  const [pin, setPin] = useState(['', '', '', ''])
  const [pinError, setPinError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const [verifyErrorByCard, setVerifyErrorByCard] = useState<
    Record<string, string>
  >({})
  const [verifiedNameByCard, setVerifiedNameByCard] = useState<
    Record<string, string>
  >({})
  const recipientRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const topFeedbackRef = useRef<HTMLDivElement | null>(null)
  const pinRefs = useRef<Array<HTMLInputElement | null>>([])

  const profileQuery = useProfile()
  const ownTag = (profileQuery.data?.data?.giftseonTag || '')
    .replace(/^@+/, '')
    .toLowerCase()

  const electricityDiscosQuery = useElectricityDiscos()

  const buyAirtimeMutation = useBuyAirtime()
  const buyDataMutation = useBuyData()
  const verifyElectricityMutation = useVerifyElectricityMeter()
  const payElectricityMutation = usePayElectricityBill()
  const verifyCableMutation = useVerifyCableIuc()
  const subscribeCableMutation = useSubscribeCableTv()
  const sendGiftSingleMutation = useSendGiftBillSingle()
  const plansCatalog = useBillsPlanCatalog()

  const electricityAmountLimitsByProvider = useMemo(() => {
    const limits = new Map<string, { min: number; max: number }>()
    for (const plan of electricityDiscosQuery.data?.data?.plans ?? []) {
      const key = plan.plan_code
      const min =
        typeof plan.min_amount === 'number' ? plan.min_amount : Number.NaN
      const max =
        typeof plan.max_amount === 'number' ? plan.max_amount : Number.NaN
      if (Number.isNaN(min) || Number.isNaN(max)) continue
      limits.set(key, { min, max })
    }
    return limits
  }, [electricityDiscosQuery.data])

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

  const applyQuickRecipient = (value: string) => {
    const firstCard = activeCards[0]
    if (!firstCard) return
    updateCard(firstCard.id, (card) => ({
      ...card,
      identifierValue: value,
      sendAsGift: value.startsWith('@') ? true : card.sendAsGift,
      ...(activeTab === 'electricity' || activeTab === 'cable_tv'
        ? { recipientVerified: false }
        : {}),
    }))
    if (activeTab === 'electricity' || activeTab === 'cable_tv') {
      setVerifyErrorByCard((prev) => ({ ...prev, [firstCard.id]: '' }))
      setVerifiedNameByCard((prev) => ({ ...prev, [firstCard.id]: '' }))
    }
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
        const limits = electricityAmountLimitsByProvider.get(card.provider)
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
        if (!card.notifySms && !card.notifyEmail) {
          return {
            field: 'notifyMethod',
            message: 'Choose at least one notification method (SMS or Email).',
          }
        }
        if (card.notifySms && !card.notificationPhone.trim()) {
          return {
            field: 'notificationPhone',
            message: 'Notification phone is required for SMS.',
          }
        }
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
      electricityAmountLimitsByProvider,
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
    verifyElectricityMutation.isPending ||
    payElectricityMutation.isPending ||
    verifyCableMutation.isPending ||
    subscribeCableMutation.isPending ||
    sendGiftSingleMutation.isPending ||
    isSubmitting

  const handleVerifyCard = async (card: RecipientCard) => {
    setFeedback(null)
    try {
      if (
        activeTab === 'electricity' &&
        (!card.sendAsGift || !card.identifierValue.trim().startsWith('@'))
      ) {
        setVerifyErrorByCard((prev) => ({ ...prev, [card.id]: '' }))
        const resp = await verifyElectricityMutation.mutateAsync({
          meterNumber: card.identifierValue.trim(),
          meterType: card.meterType,
          plan: card.provider,
        })
        const customerName =
          extractVerifiedCustomerName(resp) || 'Meter verified successfully'
        updateCard(card.id, (current) => ({ ...current, recipientVerified: true }))
        setVerifiedNameByCard((prev) => ({ ...prev, [card.id]: customerName }))
      }

      if (
        activeTab === 'cable_tv' &&
        (!card.sendAsGift || !card.identifierValue.trim().startsWith('@'))
      ) {
        setVerifyErrorByCard((prev) => ({ ...prev, [card.id]: '' }))
        const resp = await verifyCableMutation.mutateAsync({
          provider: card.provider,
          iucNumber: card.identifierValue.trim(),
        })
        const customerName =
          extractVerifiedCustomerName(resp) || 'IUC verified successfully'
        updateCard(card.id, (current) => ({ ...current, recipientVerified: true }))
        setVerifiedNameByCard((prev) => ({ ...prev, [card.id]: customerName }))
      }
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String(
              (error as { message?: unknown }).message || 'Verification failed.'
            )
          : 'Verification failed.'
      if (activeTab === 'electricity' || activeTab === 'cable_tv') {
        updateCard(card.id, (current) => ({ ...current, recipientVerified: false }))
        setVerifyErrorByCard((prev) => ({ ...prev, [card.id]: message }))
        setVerifiedNameByCard((prev) => ({ ...prev, [card.id]: '' }))
        return
      }
      setFeedback({ tone: 'error', text: message })
      scrollToTopFeedback()
    }
  }

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
        card.notifySms && card.notificationPhone.trim()
          ? card.notificationPhone.trim()
          : activeTab === 'airtime' || activeTab === 'data'
          ? isTag
            ? undefined
            : identifier
          : undefined,
      recipientEmail: card.notifyEmail
        ? card.notificationEmail.trim() || undefined
        : undefined,
      recipientName: card.isAnonymous
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
      notifySms:
        card.sendAsGift && !card.isAnonymous ? card.notifySms : undefined,
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

  const isPinComplete = pin.every((digit) => digit.length === 1)

  const handlePinChange = (index: number, value: string) => {
    const next = [...pin]
    next[index] = value.replace(/[^0-9]/g, '').slice(0, 1)
    setPin(next)
    if (pinError) setPinError('')
    if (value && pinRefs.current[index + 1]) {
      pinRefs.current[index + 1]?.focus()
    }
  }

  const handlePinKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !pin[index] && pinRefs.current[index - 1]) {
      pinRefs.current[index - 1]?.focus()
    }
  }

  const handlePinPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!pasted) return
    const next = pasted.split('').slice(0, 4)
    setPin([next[0] || '', next[1] || '', next[2] || '', next[3] || ''])
    if (pinError) setPinError('')
    const targetIndex = Math.min(pasted.length, 4) - 1
    pinRefs.current[targetIndex]?.focus()
  }

  const handleRunPayment = async () => {
    setPinError('')
    if (!isPinComplete) {
      setPinError('Enter your 4-digit transaction PIN.')
      return
    }
    const pinValue = pin.join('')

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
      setPin(['', '', '', ''])
      setCardsByTab((prev) => ({
        ...prev,
        [activeTab]: [createRecipientCard()],
      }))
      setVerifyErrorByCard({})
      setVerifiedNameByCard({})
      setShowValidationErrors(false)
      setIsSuccessOpen(true)
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String(
              (error as { message?: unknown }).message || 'Transaction failed.'
            )
          : 'Transaction failed.'
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

  const flowContextValue = {
    activeTab,
    activeCards,
    cardErrors,
    showValidationErrors,
    recipientRefs,
    verifyErrorByCard,
    verifiedNameByCard,
    isActionBusy,
    isVerifyingElectricity: verifyElectricityMutation.isPending,
    isVerifyingCable: verifyCableMutation.isPending,
    totalAmount,
    isReviewOpen,
    isPinOpen,
    pin,
    pinError,
    isSubmitting,
    isPinComplete,
    pinRefs,
    onUpdateCard: updateCard,
    onRemoveRecipientCard: removeRecipientCard,
    onAddRecipientCard: addRecipientCard,
    onEnsureDataPlans: plansCatalog.ensureDataPlans,
    onEnsureCablePackages: plansCatalog.ensureCablePackages,
    getDataPlanOptions: plansCatalog.getDataPlanOptions,
    getCablePackageOptions: plansCatalog.getCablePackageOptions,
    getDataPlanAmount: plansCatalog.getDataPlanAmount,
    getCablePlanAmount: plansCatalog.getCablePlanAmount,
    getDataPlanLabel: plansCatalog.getDataPlanLabel,
    getCablePackageLabel: plansCatalog.getCablePackageLabel,
    onSetVerifyError: (cardId: string, message: string) =>
      setVerifyErrorByCard((prev) => ({ ...prev, [cardId]: message })),
    onSetVerifiedName: (cardId: string, name: string) =>
      setVerifiedNameByCard((prev) => ({ ...prev, [cardId]: name })),
    onHandleVerifyCard: handleVerifyCard,
    onApplyQuickRecipient: applyQuickRecipient,
    onOpenReview: openReview,
    onCloseReview: () => setIsReviewOpen(false),
    onOpenPinFromReview: openPinStepFromReview,
    onClosePinToReview: () => {
      setIsPinOpen(false)
      setIsReviewOpen(true)
      setPin(['', '', '', ''])
      setPinError('')
    },
    onPinChange: handlePinChange,
    onPinKeyDown: handlePinKeyDown,
    onPinPaste: handlePinPaste,
    onRunPayment: handleRunPayment,
  }

  return (
    <BillsFlowProvider value={flowContextValue}>
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
          <BillsBuilderSection />
          <BillsSummaryActions />
        </div>
      </div>

      <BillsReviewModal />

      <BillsPinModal />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title='Payment successful'
        message='Your bills transaction has been processed successfully.'
      />
      </div>
    </BillsFlowProvider>
  )
}

export default BillsLandingPage
