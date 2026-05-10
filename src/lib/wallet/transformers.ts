import type { WalletTransactionsApiData } from '@/types/Wallet'
import type {
  WalletTransactionApiItem,
  WalletTransaction,
  WalletTransactionsData,
  WalletWithdrawal,
  WalletWithdrawalsApiData,
  WalletWithdrawalsData,
} from '@/types/Wallet'
import { formatCurrency } from '@/lib/utils/currency'

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
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsed)
}

const BILL_TRANSACTION_TYPE_LABELS: Record<string, string> = {
  airtime: 'Airtime payment',
  data: 'Data payment',
  electricity: 'Electricity bill payment',
  cable_tv: 'Cable TV subscription payment',
}

const toTransactionDescription = (item: WalletTransactionApiItem): string => {
  const description = item.description?.trim()
  if (description) return description

  if (item.source.trim().toLowerCase() === 'bill' && item.metadata?.type) {
    return BILL_TRANSACTION_TYPE_LABELS[item.metadata.type] ?? 'Bill payment'
  }

  return 'Wallet transaction'
}

const toUiTransaction = (
  item: WalletTransactionsApiData['transactions'][number]
): WalletTransaction => {
  return {
    id: item.id,
    date: toDisplayDate(item.createdAt),
    description: toTransactionDescription(item),
    type: item.type.trim().toLowerCase(),
    amount: toNumber(item.amount),
    displayAmount: formatCurrency(toNumber(item.amount), {
      currency: item.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    currency: item.currency,
    status: item.status.trim().toLowerCase(),
    reference: item.reference,
    userId: item.userId,
    source: item.source,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    metadata: item.metadata ?? null,
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

const toUiWithdrawal = (
  item: WalletWithdrawalsApiData['withdrawals'][number]
): WalletWithdrawal => {
  return {
    id: item.id,
    amount: toNumber(item.amount),
    currency: item.currency,
    bankName: item.bankName,
    accountNumber: item.accountNumber,
    accountName: item.accountName,
    reference: item.reference,
    status: item.status.trim().toLowerCase(),
    scheduledAt: item.scheduledAt,
    processedAt: item.processedAt,
    failedReason: item.failedReason,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    balanceAfter: toNumber(item.metadata?.balanceAfter),
    balanceBefore: toNumber(item.metadata?.balanceBefore),
  }
}

const emptyWalletWithdrawalsData: WalletWithdrawalsData = {
  withdrawals: [],
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

export const mapWalletWithdrawalsData = (
  data: WalletWithdrawalsApiData | undefined
): WalletWithdrawalsData => {
  if (!data) return emptyWalletWithdrawalsData

  return {
    withdrawals: data.withdrawals.map(toUiWithdrawal),
    pagination: {
      page: data.pagination.page,
      limit: data.pagination.limit,
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
    },
  }
}
