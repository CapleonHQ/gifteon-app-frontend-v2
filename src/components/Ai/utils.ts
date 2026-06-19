import type { AiCreditPack, ExchangeRateData } from '@/types/Ai'

export const packName = (pack: AiCreditPack): string =>
  pack.label.replace(/\s*\(.*\)\s*/, '').trim() || pack.label

export const extractWalletAmount = (
  data: ExchangeRateData | undefined,
  priceUsd: number,
  walletCurrency: string
): number | null => {
  if (walletCurrency === 'USD') return priceUsd
  if (!data) return null
  if (typeof data.converted === 'number' && Number.isFinite(data.converted)) {
    return data.converted
  }
  if (typeof data.rate === 'number' && Number.isFinite(data.rate)) {
    return data.rate * priceUsd
  }
  return null
}
