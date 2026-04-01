import { GiftBillFrequency } from '@/types/Bills'

export type TimingMode = 'instant' | 'scheduled' | 'recurring'
export type RecurringEndType = 'never' | 'date'
export type CardFieldKey =
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

export type CardValidationIssue = {
  field: CardFieldKey
  message: string
}

export type RecipientCard = {
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

const genId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export const createRecipientCard = (): RecipientCard => ({
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

export const formatAmountDigits = (value: string) => {
  if (!value) return ''
  const numeric = value.replace(/\D/g, '')
  if (!numeric) return ''
  return Number(numeric).toLocaleString('en-US')
}

export const parseAmount = (value: string) =>
  Number(value.replace(/\D/g, '') || '0')

export const toYyyyMmDd = (value?: Date) => {
  if (!value) return undefined
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const toIsoDateTime = (date?: Date, time?: string) => {
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

export const formatTimingSummary = (card: RecipientCard) => {
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
