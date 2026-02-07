export type WalletTransactionType = 'Credit' | 'Debit'
export type WalletTransactionStatus = 'Completed' | 'Pending'

export type WalletTransaction = {
  id: string
  date: string
  description: string
  type: WalletTransactionType
  amount: number
  status: WalletTransactionStatus
}

export const transactionTypeStyles: Record<WalletTransactionType, string> = {
  Credit: 'bg-success-50 text-success-500',
  Debit: 'bg-grey-50 text-grey-500',
}

export const transactionStatusStyles: Record<WalletTransactionStatus, string> =
  {
    Completed: 'bg-success-50 text-success-500',
    Pending: 'bg-warning-50 text-warning-600',
  }
