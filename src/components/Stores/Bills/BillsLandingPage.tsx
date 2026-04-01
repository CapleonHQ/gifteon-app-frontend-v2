'use client'

import { useCallback, useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import DatePickerField from '@/components/Gifts/CreateNewGiftPage/Components/DatePickerField'
import TimePickerField from '@/components/Gifts/CreateNewGiftPage/Components/TimePickerField'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import ShakeOnError from '@/components/common/ShakeOnError'
import SuccessModal from '@/components/common/SuccessModal'
import { useProfile } from '@/hooks/tanstack/account'
import {
  useGiftBillBeneficiaries,
  useAirtimeNetworks,
  useBuyAirtime,
  useBuyData,
  useCableProviders,
  useDataNetworks,
  useElectricityDiscos,
  usePayElectricityBill,
  useSendGiftBillSingle,
  useSubscribeCableTv,
  useVerifyCableIuc,
  useVerifyElectricityMeter,
} from '@/hooks/tanstack/bills'
import {
  getCableProviderPackages as fetchCableProviderPackages,
  getDataNetworkPlans as fetchDataNetworkPlans,
} from '@/api/services/bills'
import { BILLS_TABS, BillsTabKey, METER_TYPES } from './constants'
import {
  mapAirtimeNetworkOptions,
  mapCablePackageOptions,
  mapCableProviderOptions,
  mapDataNetworkOptions,
  mapDataPlanOptions,
  mapElectricityDiscoOptions,
  SelectOption,
} from './utils'
import { GiftBillFrequency } from '@/types/Bills'

type TimingMode = 'instant' | 'scheduled' | 'recurring'
type RecurringEndType = 'never' | 'date'
type CardFieldKey =
  | 'network'
  | 'provider'
  | 'planCode'
  | 'identifierValue'
  | 'amount'
  | 'notifyMethod'
  | 'notificationPhone'
  | 'notificationEmail'
  | 'scheduledDateTime'
  | 'recurringEndDate'
type CardValidationIssue = {
  field: CardFieldKey
  message: string
}

type RecipientCard = {
  id: string
  network: string
  provider: string
  planCode: string
  meterType: 'prepaid' | 'postpaid'
  identifierValue: string
  amount: string
  sendAsGift: boolean
  isAnonymous: boolean
  notifySms: boolean
  notifyEmail: boolean
  notificationPhone: string
  notificationEmail: string
  recipientName: string
  senderNote: string
  timingMode: TimingMode
  scheduledDate?: Date
  scheduledTime: string
  recurringFrequency: Exclude<GiftBillFrequency, 'custom'>
  recurringEndType: RecurringEndType
  recurringEndDate?: Date
  recipientVerified: boolean
  selfTagError?: string
}

const EMPTY = '__none'

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

const QUICK_AMOUNTS: Record<BillsTabKey, number[]> = {
  airtime: [500, 1000, 2000, 5000],
  data: [1000, 1500, 2000, 5000],
  electricity: [2000, 5000, 10000, 20000],
  cable_tv: [2500, 3500, 5000, 10000],
}

const formatAmountDigits = (value: string) => {
  if (!value) return ''
  const numeric = value.replace(/\D/g, '')
  if (!numeric) return ''
  return Number(numeric).toLocaleString('en-US')
}

const parseAmount = (value: string) => Number(value.replace(/\D/g, '') || '0')

const toYyyyMmDd = (value?: Date) => {
  if (!value) return undefined
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toIsoDateTime = (date?: Date, time?: string) => {
  if (!date) return undefined
  const [hourRaw, minuteRaw] = (time || '09:00').split(':')
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)
  if (Number.isNaN(hour) || Number.isNaN(minute)) return undefined
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
    0,
    0
  ).toISOString()
}

const genId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const createRecipientCard = (): RecipientCard => ({
  id: genId(),
  network: '',
  provider: '',
  planCode: '',
  meterType: 'prepaid',
  identifierValue: '',
  amount: '',
  sendAsGift: false,
  isAnonymous: false,
  notifySms: false,
  notifyEmail: false,
  notificationPhone: '',
  notificationEmail: '',
  recipientName: '',
  senderNote: '',
  timingMode: 'instant',
  scheduledDate: undefined,
  scheduledTime: '',
  recurringFrequency: 'monthly',
  recurringEndType: 'never',
  recurringEndDate: undefined,
  recipientVerified: false,
  selfTagError: undefined,
})

const formatTimingSummary = (card: RecipientCard) => {
  if (card.timingMode === 'instant') return ''
  if (card.timingMode === 'scheduled') {
    if (!card.scheduledDate) return 'Scheduled'
    const date = card.scheduledDate.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    return `Scheduled: ${date}${
      card.scheduledTime ? `, ${card.scheduledTime}` : ''
    }`
  }
  const nextText =
    card.recurringEndType === 'date' && card.recurringEndDate
      ? ` • Ends ${card.recurringEndDate.toLocaleDateString('en-NG', {
          day: 'numeric',
          month: 'short',
        })}`
      : ' • No end date'
  return `${card.recurringFrequency[0].toUpperCase()}${card.recurringFrequency.slice(
    1
  )}${nextText}`
}

const extractRecentBeneficiaries = (payload: unknown): string[] => {
  const root =
    payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : {}
  const data =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : root

  const rawList = [
    data.beneficiaries,
    data.items,
    data.results,
    data.data,
  ].find((value) => Array.isArray(value)) as unknown[] | undefined

  if (!rawList || rawList.length === 0) return []

  const names = rawList
    .map((item) => {
      if (!item || typeof item !== 'object') return ''
      const record = item as Record<string, unknown>
      return String(
        record.nickname ||
          record.name ||
          record.recipientName ||
          record.recipient ||
          ''
      ).trim()
    })
    .filter(Boolean)

  return Array.from(new Set(names)).slice(0, 6)
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
    tone: 'success' | 'error'
    text: string
  } | null>(null)

  const [dataPlansByNetwork, setDataPlansByNetwork] = useState<
    Record<string, SelectOption[]>
  >({})
  const [dataPlanAmountByNetwork, setDataPlanAmountByNetwork] = useState<
    Record<string, Record<string, number>>
  >({})
  const [cablePackagesByProvider, setCablePackagesByProvider] = useState<
    Record<string, SelectOption[]>
  >({})
  const [cablePlanAmountByProvider, setCablePlanAmountByProvider] = useState<
    Record<string, Record<string, number>>
  >({})

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

  const airtimeNetworksQuery = useAirtimeNetworks()
  const dataNetworksQuery = useDataNetworks()
  const electricityDiscosQuery = useElectricityDiscos()
  const cableProvidersQuery = useCableProviders()
  const beneficiariesQuery = useGiftBillBeneficiaries({ page: 1, limit: 6 })

  const buyAirtimeMutation = useBuyAirtime()
  const buyDataMutation = useBuyData()
  const verifyElectricityMutation = useVerifyElectricityMeter()
  const payElectricityMutation = usePayElectricityBill()
  const verifyCableMutation = useVerifyCableIuc()
  const subscribeCableMutation = useSubscribeCableTv()
  const sendGiftSingleMutation = useSendGiftBillSingle()

  const airtimeOptions = useMemo(
    () => mapAirtimeNetworkOptions(airtimeNetworksQuery.data),
    [airtimeNetworksQuery.data]
  )
  const dataNetworkOptions = useMemo(
    () => mapDataNetworkOptions(dataNetworksQuery.data),
    [dataNetworksQuery.data]
  )
  const electricityOptions = useMemo(
    () => mapElectricityDiscoOptions(electricityDiscosQuery.data),
    [electricityDiscosQuery.data]
  )
  const cableProviderOptions = useMemo(
    () => mapCableProviderOptions(cableProvidersQuery.data),
    [cableProvidersQuery.data]
  )
  const recentBeneficiaries = useMemo(
    () => extractRecentBeneficiaries(beneficiariesQuery.data),
    [beneficiariesQuery.data]
  )
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

  const ensureDataPlans = async (network: string) => {
    if (!network || dataPlansByNetwork[network]) return
    try {
      const resp = await fetchDataNetworkPlans(network)
      const plans = resp.data?.plans ?? []
      const amountMap: Record<string, number> = {}
      for (const plan of plans) {
        amountMap[plan.plan_code] = plan.amount
      }
      setDataPlansByNetwork((prev) => ({
        ...prev,
        [network]: mapDataPlanOptions(resp),
      }))
      setDataPlanAmountByNetwork((prev) => ({
        ...prev,
        [network]: amountMap,
      }))
    } catch {
      setDataPlansByNetwork((prev) => ({ ...prev, [network]: [] }))
      setDataPlanAmountByNetwork((prev) => ({ ...prev, [network]: {} }))
    }
  }

  const ensureCablePackages = async (provider: string) => {
    if (!provider || cablePackagesByProvider[provider]) return
    try {
      const resp = await fetchCableProviderPackages(provider)
      const plans = resp.data?.plans ?? []
      const amountMap: Record<string, number> = {}
      for (const plan of plans) {
        const code = plan.plan_code
        const numericAmount =
          typeof plan.amount === 'number'
            ? plan.amount
            : Number(String(plan.amount || '').replace(/[^\d.]/g, ''))
        if (!Number.isNaN(numericAmount) && numericAmount > 0) {
          amountMap[code] = numericAmount
        }
      }
      setCablePackagesByProvider((prev) => ({
        ...prev,
        [provider]: mapCablePackageOptions(resp),
      }))
      setCablePlanAmountByProvider((prev) => ({
        ...prev,
        [provider]: amountMap,
      }))
    } catch {
      setCablePackagesByProvider((prev) => ({ ...prev, [provider]: [] }))
      setCablePlanAmountByProvider((prev) => ({ ...prev, [provider]: {} }))
    }
  }

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
        const planAmount = dataPlanAmountByNetwork[card.network]?.[card.planCode]
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
        const planAmount = cablePlanAmountByProvider[card.provider]?.[card.planCode]
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
      cablePlanAmountByProvider,
      dataPlanAmountByNetwork,
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
      setIsSuccessOpen(true)
      setFeedback({
        tone: 'success',
        text: 'Bills transaction completed successfully.',
      })
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
  const getOptionLabel = (options: SelectOption[], value: string) =>
    options.find((option) => option.value === value)?.label || value
  const getDataPlanLabel = (network: string, code: string) =>
    dataPlansByNetwork[network]?.find((option) => option.value === code)?.label ||
    code
  const getCablePackageLabel = (provider: string, code: string) =>
    cablePackagesByProvider[provider]?.find((option) => option.value === code)
      ?.label || code

  const getReviewDetails = (card: RecipientCard) => {
    if (activeTab === 'airtime') {
      return [
        { label: 'Service', value: 'Airtime' },
        {
          label: 'Network',
          value: card.network
            ? getOptionLabel(airtimeOptions, card.network)
            : 'Not selected',
        },
        { label: 'Recipient', value: card.identifierValue || 'Not provided' },
      ]
    }
    if (activeTab === 'data') {
      return [
        { label: 'Service', value: 'Data' },
        {
          label: 'Network',
          value: card.network
            ? getOptionLabel(dataNetworkOptions, card.network)
            : 'Not selected',
        },
        {
          label: 'Plan',
          value:
            card.network && card.planCode
              ? getDataPlanLabel(card.network, card.planCode)
              : 'Not selected',
        },
        { label: 'Recipient', value: card.identifierValue || 'Not provided' },
      ]
    }
    if (activeTab === 'electricity') {
      return [
        { label: 'Service', value: 'Electricity' },
        {
          label: 'Disco',
          value: card.provider
            ? getOptionLabel(electricityOptions, card.provider)
            : 'Not selected',
        },
        { label: 'Meter type', value: card.meterType },
        { label: 'Meter number', value: card.identifierValue || 'Not provided' },
      ]
    }
    return [
      { label: 'Service', value: 'Cable TV' },
      {
        label: 'Provider',
        value: card.provider
          ? getOptionLabel(cableProviderOptions, card.provider)
          : 'Not selected',
      },
      {
        label: 'Package',
        value:
          card.provider && card.planCode
            ? getCablePackageLabel(card.provider, card.planCode)
            : 'Not selected',
      },
      { label: 'IUC number', value: card.identifierValue || 'Not provided' },
    ]
  }

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
            className={`rounded-lg px-3 py-2 text-sm ${
              feedback.tone === 'success'
                ? 'bg-success-50 text-success-700'
                : 'bg-error-50 text-error-700'
            }`}
          >
            {feedback.text}
          </div>
        ) : null}

        <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4'>
          <section className='space-y-4'>
            <div className='rounded-xl border border-grey-100 bg-white p-4 lg:p-5 space-y-4'>
              {activeCards.map((card, index) => {
                const cardError = cardErrors[index]
                const visibleCardError = showValidationErrors ? cardError : null
                const isTag =
                  card.sendAsGift && card.identifierValue.trim().startsWith('@')
                const planOptions =
                  activeTab === 'data'
                    ? dataPlansByNetwork[card.network] || []
                    : activeTab === 'cable_tv'
                    ? cablePackagesByProvider[card.provider] || []
                    : []

                return (
                  <div
                    key={card.id}
                    ref={(node) => {
                      recipientRefs.current[card.id] = node
                    }}
                    className='rounded-xl border border-grey-100 bg-white p-4 space-y-3'
                  >
                    {activeCards.length > 1 && (
                      <div className='flex items-center justify-between gap-3 min-h-8'>
                        <p className='text-sm font-semibold text-grey-900'>
                          Recipient {index + 1}
                        </p>

                        <button
                          type='button'
                          onClick={() => removeRecipientCard(card.id)}
                          className='h-8 w-8 rounded-lg border border-grey-200 text-grey-600 hover:bg-grey-50 flex items-center justify-center'
                          aria-label='Remove recipient'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    )}
                    {activeTab === 'airtime' || activeTab === 'data' ? (
                      <div className='space-y-1.5'>
                        <p className='text-xs font-medium text-grey-700'>
                          Network
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {(activeTab === 'airtime'
                            ? airtimeOptions
                            : dataNetworkOptions
                          ).map((option) => (
                            <button
                              key={option.value}
                              type='button'
                              onClick={() => {
                                updateCard(card.id, (current) => ({
                                  ...current,
                                  network: option.value,
                                  ...(activeTab === 'data'
                                    ? { planCode: '', amount: '' }
                                    : {}),
                                }))
                                if (activeTab === 'data') {
                                  void ensureDataPlans(option.value)
                                }
                              }}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                card.network === option.value
                                  ? 'border-primary-500 text-primary-700'
                                  : 'border-grey-200 text-grey-700 hover:border-primary-200 hover:text-primary-600'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {visibleCardError?.field === 'network' ? (
                          <ShakeOnError active={true}>
                            <p className='text-xs text-error-600'>
                              {visibleCardError.message}
                            </p>
                          </ShakeOnError>
                        ) : null}
                      </div>
                    ) : null}
                    {activeTab === 'electricity' ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div className='space-y-1.5'>
                          <p className='text-xs font-medium text-grey-700'>
                            Disco
                          </p>
                          <Select
                            value={card.provider || EMPTY}
                            onValueChange={(value) => {
                              updateCard(card.id, (current) => ({
                                ...current,
                                provider: value === EMPTY ? '' : value,
                                recipientVerified: false,
                              }))
                              setVerifyErrorByCard((prev) => ({
                                ...prev,
                                [card.id]: '',
                              }))
                              setVerifiedNameByCard((prev) => ({
                                ...prev,
                                [card.id]: '',
                              }))
                            }}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select disco' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={EMPTY}>
                                Select disco
                              </SelectItem>
                              {electricityOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {visibleCardError?.field === 'provider' ? (
                            <ShakeOnError active={true}>
                              <p className='text-xs text-error-600'>
                                {visibleCardError.message}
                              </p>
                            </ShakeOnError>
                          ) : null}
                        </div>

                        <div className='space-y-1.5'>
                          <p className='text-xs font-medium text-grey-700'>
                            Meter Type
                          </p>
                          <Select
                            value={card.meterType}
                            onValueChange={(value: 'prepaid' | 'postpaid') => {
                              updateCard(card.id, (current) => ({
                                ...current,
                                meterType: value,
                                recipientVerified: false,
                              }))
                              setVerifyErrorByCard((prev) => ({
                                ...prev,
                                [card.id]: '',
                              }))
                              setVerifiedNameByCard((prev) => ({
                                ...prev,
                                [card.id]: '',
                              }))
                            }}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select meter type' />
                            </SelectTrigger>
                            <SelectContent>
                              {METER_TYPES.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : null}
                    {activeTab === 'cable_tv' ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div className='space-y-1.5'>
                          <p className='text-xs font-medium text-grey-700'>
                            Provider
                          </p>
                          <Select
                            value={card.provider || EMPTY}
                            onValueChange={(value) => {
                              const next = value === EMPTY ? '' : value
                              updateCard(card.id, (current) => ({
                                ...current,
                                provider: next,
                                planCode: '',
                                recipientVerified: false,
                              }))
                              setVerifyErrorByCard((prev) => ({
                                ...prev,
                                [card.id]: '',
                              }))
                              setVerifiedNameByCard((prev) => ({
                                ...prev,
                                [card.id]: '',
                              }))
                              if (next) {
                                void ensureCablePackages(next)
                              }
                            }}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select provider' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={EMPTY}>
                                Select provider
                              </SelectItem>
                              {cableProviderOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {visibleCardError?.field === 'provider' ? (
                            <ShakeOnError active={true}>
                              <p className='text-xs text-error-600'>
                                {visibleCardError.message}
                              </p>
                            </ShakeOnError>
                          ) : null}
                        </div>

                        <div className='space-y-1.5'>
                          <p className='text-xs font-medium text-grey-700'>
                            Package
                          </p>
                          <Select
                            value={card.planCode || EMPTY}
                            onValueChange={(value) => {
                              updateCard(card.id, (current) => ({
                                ...current,
                                planCode: value === EMPTY ? '' : value,
                                amount:
                                  value !== EMPTY &&
                                  cablePlanAmountByProvider[current.provider]?.[
                                    value
                                  ]
                                    ? String(
                                        cablePlanAmountByProvider[current.provider][
                                          value
                                        ]
                                      )
                                    : current.amount,
                                recipientVerified: false,
                              }))
                              setVerifyErrorByCard((prev) => ({
                                ...prev,
                                [card.id]: '',
                              }))
                              setVerifiedNameByCard((prev) => ({
                                ...prev,
                                [card.id]: '',
                              }))
                            }}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select package' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={EMPTY}>
                                Select package
                              </SelectItem>
                              {planOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {visibleCardError?.field === 'planCode' ? (
                            <ShakeOnError active={true}>
                              <p className='text-xs text-error-600'>
                                {visibleCardError.message}
                              </p>
                            </ShakeOnError>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                    {activeTab === 'data' ? (
                      <div className='space-y-1.5'>
                        <p className='text-xs font-medium text-grey-700'>
                          Plan
                        </p>
                        <Select
                          value={card.planCode || EMPTY}
                          onValueChange={(value) =>
                            updateCard(card.id, (current) => ({
                              ...current,
                              planCode: value === EMPTY ? '' : value,
                              amount:
                                value !== EMPTY &&
                                dataPlanAmountByNetwork[current.network]?.[value]
                                  ? String(dataPlanAmountByNetwork[current.network][value])
                                  : '',
                            }))
                          }
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select plan' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={EMPTY}>Select plan</SelectItem>
                            {planOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {visibleCardError?.field === 'planCode' ? (
                          <ShakeOnError active={true}>
                            <p className='text-xs text-error-600'>
                              {visibleCardError.message}
                            </p>
                          </ShakeOnError>
                        ) : null}
                      </div>
                    ) : null}
                    <div className='space-x-1.5 flex items-center'>
                      <p className='text-xs font-medium text-grey-700'>
                        Send as gift
                      </p>
                      <div className='flex items-center justify-between'>
                        <Switch
                          checked={card.sendAsGift}
                          onCheckedChange={(checked) => {
                            updateCard(card.id, (current) => ({
                              ...current,
                              sendAsGift: checked,
                              recipientVerified: false,
                            }))
                            setVerifyErrorByCard((prev) => ({
                              ...prev,
                              [card.id]: '',
                            }))
                            setVerifiedNameByCard((prev) => ({
                              ...prev,
                              [card.id]: '',
                            }))
                          }}
                          className='data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-grey-200'
                        />
                      </div>
                    </div>
                    <div className='space-y-1.5'>
                      <p className='text-xs font-medium text-grey-700'>
                        {activeTab === 'electricity'
                          ? card.sendAsGift
                            ? 'Meter Number or @Giftseon Tag'
                            : 'Meter Number'
                          : activeTab === 'cable_tv'
                          ? card.sendAsGift
                            ? 'IUC Number or @Giftseon Tag'
                            : 'IUC Number'
                          : card.sendAsGift
                          ? 'Phone Number or @Giftseon Tag'
                          : 'Phone Number'}
                      </p>
                      <input
                        type='text'
                        value={card.identifierValue}
                        onChange={(event) => {
                          updateCard(card.id, (current) => ({
                            ...current,
                            identifierValue: event.target.value,
                            selfTagError: undefined,
                            ...(activeTab === 'electricity' || activeTab === 'cable_tv'
                              ? { recipientVerified: false }
                              : {}),
                          }))
                          if (activeTab === 'electricity' || activeTab === 'cable_tv') {
                            setVerifyErrorByCard((prev) => ({
                              ...prev,
                              [card.id]: '',
                            }))
                            setVerifiedNameByCard((prev) => ({
                              ...prev,
                              [card.id]: '',
                            }))
                          }
                        }}
                        placeholder={
                          activeTab === 'electricity'
                            ? card.sendAsGift
                              ? 'Enter meter number or @giftseonTag'
                              : 'Enter meter number'
                            : activeTab === 'cable_tv'
                            ? card.sendAsGift
                              ? 'Enter IUC number or @giftseonTag'
                              : 'Enter IUC number'
                            : card.sendAsGift
                            ? 'Enter phone number or @giftseonTag'
                            : 'e.g. 08012345678'
                        }
                        className={`w-full px-3 py-3 border rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 ${
                          verifyErrorByCard[card.id] ||
                          visibleCardError?.field === 'identifierValue'
                            ? 'border-error-300'
                            : 'border-grey-50'
                        }`}
                      />
                      {verifyErrorByCard[card.id] ||
                      visibleCardError?.field === 'identifierValue' ? (
                        <ShakeOnError active={true}>
                          <p className='text-xs text-error-600 mt-1'>
                            {verifyErrorByCard[card.id] ||
                              visibleCardError?.message}
                          </p>
                        </ShakeOnError>
                      ) : null}
                      {(activeTab === 'electricity' || activeTab === 'cable_tv') && !isTag ? (
                        <div className='flex items-center justify-between gap-3 mt-2'>
                          {card.recipientVerified ? (
                            <span className='text-xs font-medium text-success-600'>
                              {verifiedNameByCard[card.id] || 'Verified'}
                            </span>
                          ) : (
                            <button
                              type='button'
                              onClick={() => void handleVerifyCard(card)}
                              disabled={
                                isActionBusy ||
                                !card.identifierValue.trim() ||
                                !card.provider
                              }
                              className='text-xs font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                              {activeTab === 'electricity'
                                ? verifyElectricityMutation.isPending
                                  ? 'Verifying...'
                                  : 'Verify meter'
                                : verifyCableMutation.isPending
                                ? 'Verifying...'
                                : 'Verify IUC'}
                            </button>
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className='space-y-1.5'>
                      <p className='text-xs font-medium text-grey-700'>
                        Amount
                      </p>
                      <input
                        type='text'
                        value={formatAmountDigits(card.amount)}
                        onChange={
                          activeTab === 'data' || activeTab === 'cable_tv'
                            ? undefined
                            : (event) =>
                                updateCard(card.id, (current) => ({
                                  ...current,
                                  amount: event.target.value.replace(/\D/g, ''),
                                }))
                        }
                        readOnly={activeTab === 'data' || activeTab === 'cable_tv'}
                        inputMode='numeric'
                        placeholder={activeTab === 'airtime' || activeTab === 'electricity' ? 'e.g. 1000' : '0'}
                        className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 read-only:bg-grey-50 read-only:text-grey-600'
                      />
                      {visibleCardError?.field === 'amount' ? (
                        <ShakeOnError active={true}>
                          <p className='text-xs text-error-600 mt-1'>
                            {visibleCardError.message}
                          </p>
                        </ShakeOnError>
                      ) : null}
                      {activeTab === 'airtime' || activeTab === 'electricity' ? (
                        <div className='flex flex-wrap gap-2'>
                          {QUICK_AMOUNTS[activeTab].map((quick) => (
                            <button
                              key={quick}
                              type='button'
                              onClick={() =>
                                updateCard(card.id, (current) => ({
                                  ...current,
                                  amount: String(quick),
                                }))
                              }
                              className='rounded-full border border-grey-200 bg-white px-2.5 py-1 text-xs font-medium text-grey-700 hover:border-primary-200 hover:text-primary-600 transition'
                            >
                              {quick.toLocaleString()}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {card.sendAsGift ? (
                      <div className='space-y-3 bg-white'>
                        <div className='flex items-center gap-2'>
                          <Checkbox
                            id={`anonymous-${card.id}`}
                            checked={card.isAnonymous}
                            onCheckedChange={(checked) =>
                              updateCard(card.id, (current) => ({
                                ...current,
                                isAnonymous: Boolean(checked),
                              }))
                            }
                            className='data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500 focus-visible:ring-primary-200/60'
                          />
                          <label
                            htmlFor={`anonymous-${card.id}`}
                            className='text-sm text-grey-700 cursor-pointer'
                          >
                            Send anonymously
                          </label>
                        </div>

                        {!card.isAnonymous && !isTag ? (
                          <>
                            <p className='text-xs text-grey-600'>
                              Notify recipient via
                            </p>
                            <div className='flex flex-wrap gap-4'>
                              <label className='inline-flex items-center gap-2 text-sm text-grey-700'>
                                <Checkbox
                                  checked={card.notifySms}
                                  onCheckedChange={(checked) =>
                                    updateCard(card.id, (current) => ({
                                      ...current,
                                      notifySms: Boolean(checked),
                                    }))
                                  }
                                  className='data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500 focus-visible:ring-primary-200/60'
                                />
                                SMS
                              </label>
                              <label className='inline-flex items-center gap-2 text-sm text-grey-700'>
                                <Checkbox
                                  checked={card.notifyEmail}
                                  onCheckedChange={(checked) =>
                                    updateCard(card.id, (current) => ({
                                      ...current,
                                      notifyEmail: Boolean(checked),
                                    }))
                                  }
                                  className='data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:border-primary-500 focus-visible:ring-primary-200/60'
                                />
                                Email
                              </label>
                            </div>
                            {visibleCardError?.field === 'notifyMethod' ? (
                              <ShakeOnError active={true}>
                                <p className='text-xs text-error-600 mt-1'>
                                  {visibleCardError.message}
                                </p>
                              </ShakeOnError>
                            ) : null}

                            {card.notifySms ? (
                              <div className='space-y-1.5'>
                                <p className='text-xs font-medium text-grey-700'>
                                  Notification Phone
                                </p>
                                <input
                                  type='text'
                                  value={card.notificationPhone}
                                  onChange={(event) =>
                                    updateCard(card.id, (current) => ({
                                      ...current,
                                      notificationPhone: event.target.value,
                                    }))
                                  }
                                  placeholder='e.g. 08012345678'
                                  className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
                                />
                                {visibleCardError?.field === 'notificationPhone' ? (
                                  <ShakeOnError active={true}>
                                    <p className='text-xs text-error-600 mt-1'>
                                      {visibleCardError.message}
                                    </p>
                                  </ShakeOnError>
                                ) : null}
                              </div>
                            ) : null}

                            {card.notifyEmail ? (
                              <div className='space-y-1.5'>
                                <p className='text-xs font-medium text-grey-700'>
                                  Notification Email
                                </p>
                                <input
                                  type='email'
                                  value={card.notificationEmail}
                                  onChange={(event) =>
                                    updateCard(card.id, (current) => ({
                                      ...current,
                                      notificationEmail: event.target.value,
                                    }))
                                  }
                                  placeholder='e.g. name@email.com'
                                  className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
                                />
                                {visibleCardError?.field === 'notificationEmail' ? (
                                  <ShakeOnError active={true}>
                                    <p className='text-xs text-error-600 mt-1'>
                                      {visibleCardError.message}
                                    </p>
                                  </ShakeOnError>
                                ) : null}
                              </div>
                            ) : null}
                          </>
                        ) : null}

                        {!card.isAnonymous ? (
                          <>
                            <div className='space-y-1.5'>
                              <p className='text-xs font-medium text-grey-700'>
                                Recipient Name (optional)
                              </p>
                              <input
                                type='text'
                                value={card.recipientName}
                                onChange={(event) =>
                                  updateCard(card.id, (current) => ({
                                    ...current,
                                    recipientName: event.target.value,
                                  }))
                                }
                                placeholder='e.g. Adeola'
                                className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300'
                              />
                            </div>

                            <div className='space-y-1.5'>
                              <p className='text-xs font-medium text-grey-700'>
                                Sender Note (optional)
                              </p>
                              <textarea
                                value={card.senderNote}
                                onChange={(event) =>
                                  updateCard(card.id, (current) => ({
                                    ...current,
                                    senderNote: event.target.value,
                                  }))
                                }
                                className='w-full min-h-[80px] px-3 py-3 border border-grey-50 rounded-xl text-sm text-grey-800 placeholder:text-grey-500 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 resize-none'
                                placeholder='Write a note...'
                              />
                            </div>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                    <div className='space-y-2 border-t border-grey-100 pt-3'>
                      <div className='flex items-center justify-between gap-3'>
                        <p className='text-xs font-medium text-grey-700'>
                          Timing
                        </p>
                        {card.timingMode === 'instant' ? (
                          <span className='text-xs text-grey-500'>Instant</span>
                        ) : (
                          <button
                            type='button'
                            onClick={() =>
                              updateCard(card.id, (current) => ({
                                ...current,
                                timingMode: 'instant',
                                scheduledDate: undefined,
                                scheduledTime: '',
                                recurringEndDate: undefined,
                              }))
                            }
                            className='text-xs font-medium text-primary-600 hover:text-primary-700'
                          >
                            Reset to instant
                          </button>
                        )}
                      </div>

                      {card.timingMode === 'instant' ? (
                        <div className='flex flex-wrap gap-2'>
                          <button
                            type='button'
                            onClick={() =>
                              updateCard(card.id, (current) => ({
                                ...current,
                                timingMode: 'scheduled',
                              }))
                            }
                            className='h-8 px-3 rounded-lg border border-grey-200 text-grey-700 text-xs font-medium hover:bg-grey-50'
                          >
                            Schedule
                          </button>
                          <button
                            type='button'
                            onClick={() =>
                              updateCard(card.id, (current) => ({
                                ...current,
                                timingMode: 'recurring',
                              }))
                            }
                            className='h-8 px-3 rounded-lg border border-grey-200 text-grey-700 text-xs font-medium hover:bg-grey-50'
                          >
                            Recurring
                          </button>
                        </div>
                      ) : (
                        <div className='flex flex-wrap gap-2'>
                          {card.timingMode === 'scheduled' ? (
                            <button
                              type='button'
                              onClick={() =>
                                updateCard(card.id, (current) => ({
                                  ...current,
                                  timingMode: 'recurring',
                                }))
                              }
                              className='h-8 px-3 rounded-lg border border-grey-200 text-grey-700 text-xs font-medium hover:bg-grey-50'
                            >
                              Switch to recurring
                            </button>
                          ) : (
                            <button
                              type='button'
                              onClick={() =>
                                updateCard(card.id, (current) => ({
                                  ...current,
                                  timingMode: 'scheduled',
                                }))
                              }
                              className='h-8 px-3 rounded-lg border border-grey-200 text-grey-700 text-xs font-medium hover:bg-grey-50'
                            >
                              Switch to schedule
                            </button>
                          )}
                        </div>
                      )}

                      {card.timingMode !== 'instant' ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                          <DatePickerField
                            label={
                              card.timingMode === 'recurring'
                                ? 'Start date'
                                : 'Date'
                            }
                            value={card.scheduledDate}
                            onChange={(value) =>
                              updateCard(card.id, (current) => ({
                                ...current,
                                scheduledDate: value,
                              }))
                            }
                            minDate={new Date()}
                          />
                          <TimePickerField
                            label='Time'
                            value={card.scheduledTime}
                            onChange={(value) =>
                              updateCard(card.id, (current) => ({
                                ...current,
                                scheduledTime: value,
                              }))
                            }
                          />
                        </div>
                      ) : null}
                      {visibleCardError?.field === 'scheduledDateTime' ? (
                        <ShakeOnError active={true}>
                          <p className='text-xs text-error-600 mt-1'>
                            {visibleCardError.message}
                          </p>
                        </ShakeOnError>
                      ) : null}

                      {card.timingMode === 'recurring' ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                          <div className='space-y-1.5'>
                            <p className='text-xs font-medium text-grey-700'>
                              Frequency
                            </p>
                            <Select
                              value={card.recurringFrequency}
                              onValueChange={(
                                value: 'daily' | 'weekly' | 'monthly'
                              ) =>
                                updateCard(card.id, (current) => ({
                                  ...current,
                                  recurringFrequency: value,
                                }))
                              }
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select frequency' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='daily'>Daily</SelectItem>
                                <SelectItem value='weekly'>Weekly</SelectItem>
                                <SelectItem value='monthly'>Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className='space-y-1.5'>
                            <p className='text-xs font-medium text-grey-700'>
                              End condition
                            </p>
                            <Select
                              value={card.recurringEndType}
                              onValueChange={(value: 'never' | 'date') =>
                                updateCard(card.id, (current) => ({
                                  ...current,
                                  recurringEndType: value,
                                }))
                              }
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select end condition' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='never'>Never</SelectItem>
                                <SelectItem value='date'>End date</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {card.recurringEndType === 'date' ? (
                            <div>
                              <DatePickerField
                                label='End date'
                                value={card.recurringEndDate}
                                onChange={(value) =>
                                  updateCard(card.id, (current) => ({
                                    ...current,
                                    recurringEndDate: value,
                                  }))
                                }
                                minDate={card.scheduledDate ?? new Date()}
                              />
                              {visibleCardError?.field === 'recurringEndDate' ? (
                                <ShakeOnError active={true}>
                                  <p className='text-xs text-error-600 mt-1'>
                                    {visibleCardError.message}
                                  </p>
                                </ShakeOnError>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      {card.timingMode !== 'instant' ? (
                        <p className='text-xs font-medium text-grey-700 bg-grey-100 rounded-lg px-2 py-1 inline-flex'>
                          {formatTimingSummary(card)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )
              })}

              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={addRecipientCard}
                  className='h-9 px-3 rounded-lg border border-grey-200 text-grey-700 bg-white hover:bg-grey-50 inline-flex items-center justify-center gap-2 text-sm font-medium'
                >
                  <Plus className='h-4 w-4' />
                  Add new recipient
                </button>
              </div>

              {recentBeneficiaries.length > 0 ? (
                <div className='space-y-2'>
                  <p className='text-xs font-medium text-grey-700'>
                    Quick actions
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {recentBeneficiaries.map((item) => (
                      <button
                        key={item}
                        type='button'
                        onClick={() =>
                          applyQuickRecipient(
                            item.startsWith('@') ? item : item
                          )
                        }
                        className='rounded-full border border-grey-200 bg-white px-3 py-1.5 text-xs text-grey-700 hover:border-primary-200 hover:text-primary-600'
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <aside className='hidden lg:block'>
            <div className='sticky top-20 space-y-3'>
              <div className='rounded-xl border border-grey-100 bg-white p-4'>
                <p className='text-xs text-grey-500'>Total</p>
                <p className='text-2xl font-semibold text-grey-900'>
                  ₦{totalAmount.toLocaleString()}
                </p>
                {activeCards.length > 1 ? (
                  <p className='text-sm text-grey-600 mt-1'>
                    {activeCards.length} recipients
                  </p>
                ) : null}
              </div>

              <button
                type='button'
                onClick={openReview}
                disabled={isActionBusy || activeCards.length === 0}
                className='w-full h-11 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isActionBusy ? 'Processing...' : 'Review & Pay'}
              </button>

              <div className='rounded-xl border border-grey-100 bg-white p-4'>
                <h3 className='text-sm font-semibold text-grey-900'>
                  Need Help?
                </h3>
                <p className='mt-2 text-sm text-grey-600'>
                  Add recipients as cards, configure each card, then confirm all
                  at once.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className='fixed lg:hidden bottom-0 left-0 right-0 z-20 border-t border-grey-100 bg-white px-4 py-3'>
        <div className='max-w-5xl mx-auto flex items-center justify-between gap-3'>
          <div>
            <p className='text-xs text-grey-500'>Total</p>
            <p className='text-base font-semibold text-grey-900'>
              ₦{totalAmount.toLocaleString()}
            </p>
            {activeCards.length > 1 ? (
              <p className='text-xs text-grey-600'>
                {activeCards.length} recipients
              </p>
            ) : null}
          </div>
          <button
            type='button'
            onClick={openReview}
            disabled={isActionBusy || activeCards.length === 0}
            className='h-11 px-5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Review & Pay
          </button>
        </div>
      </div>

      {isReviewOpen ? (
        <ResponsiveModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          desktopMaxWidthClass='max-w-2xl'
          header={
            <div className='relative'>
              <button
                type='button'
                onClick={() => setIsReviewOpen(false)}
                className='absolute -right-5 -top-5 w-9 h-9 rounded-full hidden lg:flex items-center justify-center hover:bg-grey-50'
                aria-label='Close'
              >
                <span className='text-grey-700'>
                  <X className='h-5 w-5' />
                </span>
              </button>
              <div className='text-center mt-4 lg:mt-0'>
                <h3 className='text-2xl font-medium text-blackish'>Review Payment</h3>
                <p className='text-sm text-grey-600 mt-1'>
                  Confirm recipients and total before payment
                </p>
              </div>
            </div>
          }
          body={
            <div className='space-y-3'>
              {activeCards.map((card, index) => (
                <div
                  key={card.id}
                  className='rounded-xl border border-grey-100 p-3 space-y-2'
                >
                  {activeCards.length > 1 ? (
                    <p className='text-sm font-semibold text-grey-900'>
                      Recipient {index + 1}
                    </p>
                  ) : null}

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
                    {getReviewDetails(card).map((item) => (
                      <div key={`${card.id}-${item.label}`}>
                        <p className='text-xs text-grey-500'>{item.label}</p>
                        <p className='text-grey-900 break-all'>{item.value}</p>
                      </div>
                    ))}
                    <div>
                      <p className='text-xs text-grey-500'>Amount</p>
                      <p className='text-grey-900'>
                        ₦{parseAmount(card.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2 text-xs'>
                    {card.sendAsGift ? (
                      <span className='rounded-full bg-grey-100 px-2 py-1 text-grey-700'>
                        Gift
                      </span>
                    ) : null}
                    {card.timingMode !== 'instant' ? (
                      <span className='rounded-full bg-grey-100 px-2 py-1 text-grey-700'>
                        {formatTimingSummary(card)}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          }
          footer={
            <div className='space-y-3'>
              <div className='flex items-center justify-between gap-3'>
                <p className='text-sm text-grey-600'>Total</p>
                <p className='text-lg font-semibold text-grey-900'>
                  ₦{totalAmount.toLocaleString()}
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setIsReviewOpen(false)}
                  className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={openPinStepFromReview}
                  className='flex-1 py-2.5 rounded-[10px] font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors'
                >
                  Continue
                </button>
              </div>
            </div>
          }
        />
      ) : null}

      {isPinOpen ? (
        <>
          <div className='fixed inset-0 z-60 hidden lg:flex items-center justify-center p-4'>
          <div
              className='absolute inset-0 bg-black/40 backdrop-blur-sm'
              onClick={() => {
                setIsPinOpen(false)
                setIsReviewOpen(true)
                setPin(['', '', '', ''])
                setPinError('')
              }}
            />
            <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
              <button
                type='button'
                onClick={() => {
                  setIsPinOpen(false)
                  setIsReviewOpen(true)
                  setPin(['', '', '', ''])
                  setPinError('')
                }}
                className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
                aria-label='Close'
              >
                <span className='text-grey-700'>
                  <X className='h-5 w-5' />
                </span>
              </button>
              <div className='flex flex-col items-center text-center gap-4'>
                <div>
                  <h3 className='text-xl font-medium text-blackish'>Confirmation</h3>
                  <p className='text-sm text-grey-600'>
                    Provide your account PIN to move forward
                  </p>
                </div>
                <div className='flex items-center justify-center gap-3'>
                  {pin.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        pinRefs.current[index] = el
                      }}
                      value={value}
                      onChange={(event) => handlePinChange(index, event.target.value)}
                      onKeyDown={(event) => handlePinKeyDown(index, event)}
                      onPaste={handlePinPaste}
                      className={`w-12 h-12 border rounded-[8px] text-center text-lg font-medium text-blackish focus:outline-none ${
                        pinError
                          ? 'border-error-400 focus:ring-1 focus:ring-error-200'
                          : 'border-grey-100 focus:ring-1 focus:ring-primary-300'
                      }`}
                      type='password'
                      inputMode='numeric'
                      maxLength={1}
                    />
                  ))}
                </div>

                <div className='flex items-center gap-3 w-full'>
                  <button
                    type='button'
                    onClick={() => {
                      setIsPinOpen(false)
                      setIsReviewOpen(true)
                      setPin(['', '', '', ''])
                      setPinError('')
                    }}
                    className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
                  >
                    Go Back
                  </button>
                  <button
                    type='button'
                    onClick={() => void handleRunPayment()}
                    disabled={!isPinComplete || isSubmitting}
                    className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
                      isPinComplete && !isSubmitting
                        ? 'bg-primary-500 hover:bg-primary-600'
                        : 'bg-primary-200 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm'}
                  </button>
                </div>

                <ShakeOnError
                  active={Boolean(pinError)}
                  className='w-full'
                >
                  {pinError ? (
                    <p className='text-xs text-error-500'>{pinError}</p>
                  ) : null}
                </ShakeOnError>
              </div>
            </div>
          </div>

          <div className='fixed inset-0 z-70 lg:hidden flex items-center justify-center px-4'>
            <div
              className='absolute inset-0 bg-black/40 backdrop-blur-sm'
              onClick={() => {
                setIsPinOpen(false)
                setIsReviewOpen(true)
              }}
            />
            <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
              <button
                type='button'
                onClick={() => {
                  setIsPinOpen(false)
                  setIsReviewOpen(true)
                }}
                className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
                aria-label='Close'
              >
                <span className='text-grey-700'>
                  <X className='h-5 w-5' />
                </span>
              </button>
              <div className='flex flex-col items-center text-center gap-4'>
                <div>
                  <h3 className='text-xl font-medium text-blackish'>Confirmation</h3>
                  <p className='text-sm text-grey-600'>
                    Provide your account PIN to move forward
                  </p>
                </div>
                <div className='flex items-center justify-center gap-3'>
                  {pin.map((value, index) => (
                    <input
                      key={`mobile-pin-${index}`}
                      ref={(el) => {
                        pinRefs.current[index] = el
                      }}
                      value={value}
                      onChange={(event) => handlePinChange(index, event.target.value)}
                      onKeyDown={(event) => handlePinKeyDown(index, event)}
                      onPaste={handlePinPaste}
                      className={`w-12 h-12 border rounded-[8px] text-center text-lg font-medium text-blackish focus:outline-none ${
                        pinError
                          ? 'border-error-400 focus:ring-1 focus:ring-error-200'
                          : 'border-grey-100 focus:ring-1 focus:ring-primary-300'
                      }`}
                      type='password'
                      inputMode='numeric'
                      maxLength={1}
                    />
                  ))}
                </div>
                <div className='flex items-center gap-3 w-full'>
                  <button
                    type='button'
                    onClick={() => {
                      setIsPinOpen(false)
                      setIsReviewOpen(true)
                    }}
                    className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
                  >
                    Go Back
                  </button>
                  <button
                    type='button'
                    disabled={!isPinComplete || isSubmitting}
                    onClick={() => void handleRunPayment()}
                    className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
                      isPinComplete && !isSubmitting
                        ? 'bg-primary-500 hover:bg-primary-600'
                        : 'bg-primary-200 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm'}
                  </button>
                </div>
                <ShakeOnError
                  active={Boolean(pinError)}
                  className='w-full'
                >
                  {pinError ? (
                    <p className='text-xs text-error-500'>{pinError}</p>
                  ) : null}
                </ShakeOnError>
              </div>
            </div>
          </div>
        </>
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
