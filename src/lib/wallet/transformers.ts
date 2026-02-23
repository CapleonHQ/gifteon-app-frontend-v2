import type { WalletTransactionsApiData } from '@/types/Wallet'
import type {
  WalletTransaction,
  WalletTransactionsData,
} from '@/types/Wallet'

const toNumber = (value: string | number | undefined): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const toDisplayDate = (isoDate: string): string => {
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

const toUiTransaction = (
  item: WalletTransactionsApiData['transactions'][number]
): WalletTransaction => {
  return {
    id: item.id,
    date: toDisplayDate(item.createdAt),
    description: item.description || 'Wallet transaction',
    type: item.type.trim().toLowerCase(),
    amount: toNumber(item.amount),
    status: item.status.trim().toLowerCase(),
  }
}

const emptyWalletTransactionsData: WalletTransactionsData = {
  transactions: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
}

export const mapWalletTransactionsData = (
  data: WalletTransactionsApiData | undefined
): WalletTransactionsData => {
  if (!data) return emptyWalletTransactionsData

  return {
    transactions: data.transactions.map(toUiTransaction),
    pagination: {
      page: data.pagination.page,
      limit: data.pagination.limit,
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
    },
  }
}

export const parseWalletBalance = (
  value: string | number | undefined
): number => {
  return toNumber(value)
}
