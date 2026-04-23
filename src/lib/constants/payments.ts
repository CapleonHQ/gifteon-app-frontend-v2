const DEFAULT_MIN_WALLET_TOPUP_AMOUNT = 2000

const parsePositiveInt = (value: string | undefined) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return Math.floor(parsed)
}

export const MIN_WALLET_TOPUP_AMOUNT =
  parsePositiveInt(process.env.NEXT_PUBLIC_MIN_WALLET_TOPUP_AMOUNT) ??
  DEFAULT_MIN_WALLET_TOPUP_AMOUNT

export type CurrencyLimit = {
  min: number
  max: number
  label: string
}

export const CURRENCY_WITHDRAWAL_LIMITS: Record<string, CurrencyLimit> = {
  NGN: { min: 1_000, max: 5_000_000, label: '₦' },
  USD: { min: 5, max: 50_000, label: '$' },
  GBP: { min: 5, max: 50_000, label: '£' },
  EUR: { min: 5, max: 50_000, label: '€' },
  GHS: { min: 50, max: 500_000, label: 'GH₵' },
  KES: { min: 500, max: 5_000_000, label: 'KSh' },
  ZAR: { min: 100, max: 1_000_000, label: 'R' },
  XOF: { min: 3_000, max: 30_000_000, label: 'CFA' },
  XAF: { min: 3_000, max: 30_000_000, label: 'CFA' },
}
