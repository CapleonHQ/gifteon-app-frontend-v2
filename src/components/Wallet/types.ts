import type {
  WalletTransactionStatus,
  WalletTransactionType,
} from '@/types/Wallet'
export type { WalletTransaction, WalletTransactionsData } from '@/types/Wallet'

const capitalize = (value: string): string => {
  if (!value) return 'Unknown'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const transactionTypeStyles: Record<string, string> = {
  credit: 'bg-success-50 text-success-500',
  debit: 'bg-error-50 text-error-500',
}

export const transactionStatusStyles: Record<string, string> = {
  success: 'bg-success-50 text-success-500',
  pending: 'bg-warning-50 text-warning-600',
  failed: 'bg-error-50 text-error-500',
}

export const getTransactionTypeStyle = (type: WalletTransactionType): string =>
  transactionTypeStyles[type] ?? 'bg-grey-50 text-grey-700'

export const getTransactionStatusStyle = (
  status: WalletTransactionStatus
): string => transactionStatusStyles[status] ?? 'bg-grey-50 text-grey-700'

export const getTransactionTypeLabel = (type: WalletTransactionType): string =>
  capitalize(type)

export const getTransactionStatusLabel = (
  status: WalletTransactionStatus
): string => capitalize(status)
