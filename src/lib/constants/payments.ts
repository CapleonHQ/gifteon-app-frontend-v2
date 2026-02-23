const DEFAULT_MIN_WALLET_TOPUP_AMOUNT = 2000

const parsePositiveInt = (value: string | undefined) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return Math.floor(parsed)
}

export const MIN_WALLET_TOPUP_AMOUNT =
  parsePositiveInt(process.env.NEXT_PUBLIC_MIN_WALLET_TOPUP_AMOUNT) ??
  DEFAULT_MIN_WALLET_TOPUP_AMOUNT

