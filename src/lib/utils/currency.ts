export type CurrencyFormatOptions = {
  currency: string
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name'
}

const CURRENCY_LOCALE_MAP: Record<string, string> = {
  NGN: 'en-NG',
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'en-IE',
}

export const CURRENCY_SYMBOL_MAP: Record<string, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
}

export const formatAmountDigits = (value: string): string => {
  const numeric = value.replace(/\D/g, '')
  return numeric ? Number(numeric).toLocaleString('en-US') : ''
}

export const formatCurrency = (
  value: number,
  {
    currency,
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
    currencyDisplay,
  }: CurrencyFormatOptions
): string => {
  const normalizedValue = Number.isFinite(value) ? value : 0
  const normalizedCurrency = currency.toUpperCase()
  const resolvedLocale = locale || CURRENCY_LOCALE_MAP[normalizedCurrency] || 'en-US'
  const resolvedCurrencyDisplay =
    currencyDisplay || (normalizedCurrency === 'NGN' ? 'narrowSymbol' : 'symbol')

  try {
    return new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency: normalizedCurrency,
      currencyDisplay: resolvedCurrencyDisplay,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(normalizedValue)
  } catch {
    const symbol = CURRENCY_SYMBOL_MAP[normalizedCurrency] || `${normalizedCurrency} `
    return `${symbol}${normalizedValue.toLocaleString('en-US', {
      minimumFractionDigits,
      maximumFractionDigits,
    })}`
  }
}
