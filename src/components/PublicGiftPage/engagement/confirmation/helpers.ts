import { formatCurrency } from '@/lib/utils/currency'
import type { GiftOption } from '../types'

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const getDefaultCashAmount = (item: GiftOption) => {
  const defaultAmount = Math.max(
    0,
    item.minimumAmount ?? item.targetAmount ?? item.price ?? 0
  )
  return defaultAmount > 0 ? String(defaultAmount) : ''
}

export const formatAmountDigits = (value: string) => {
  const numeric = value.replace(/\D/g, '')
  if (!numeric) return ''
  return Number(numeric).toLocaleString('en-US')
}

export const resolveCashAmount = (
  item: GiftOption,
  cashAmountInputs: Record<string, string>
) => {
  const raw = (cashAmountInputs[item.id] ?? getDefaultCashAmount(item)).trim()
  const numeric = raw.replace(/\D/g, '')
  const parsed = Number(numeric)
  if (Number.isFinite(parsed) && parsed > 0) return parsed
  return Math.max(0, item.targetAmount ?? item.price)
}

export const getCashAmountError = (
  item: GiftOption,
  value: string,
  currency: string
) => {
  const minimum = Math.max(0, item.minimumAmount ?? 0)
  const raw = value.trim().replace(/\D/g, '')
  if (!raw) return 'Enter an amount.'

  const amount = Number(raw)
  if (!Number.isFinite(amount) || amount <= 0) return 'Enter a valid amount.'
  if (amount < minimum) {
    return `Amount cannot be below ${formatCurrency(minimum, {
      currency,
      maximumFractionDigits: 0,
    })}.`
  }

  return ''
}

export const getItemAmount = (
  item: GiftOption,
  quantity: number,
  cashAmount: number
) => {
  if (item.kind === 'cash') return Math.max(0, cashAmount)
  return Math.max(0, item.price * quantity)
}
