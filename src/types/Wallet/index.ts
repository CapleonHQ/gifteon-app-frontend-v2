import { PaginationParams } from '@/types/Common'
import { ApiResponse } from '@/types/Common'

export interface WalletTransactionsParams extends PaginationParams {
  type?: string
  status?: string
  source?: string
  startDate?: string
  endDate?: string
}

export interface WithdrawRequestBody {
  amount: number
}

export interface TopupRequestBody {
  amount: number
}

export interface WalletTopupInitialization {
  authorizationUrl: string
  accessCode: string
  reference: string
}

export interface WalletTopupLocalsResponse
  extends ApiResponse<WalletTopupInitialization> {
  meta: Record<string, unknown>
}

export interface WalletDetails {
  balance: number
  totalReceived: number
  totalWithdrawn: number
  currency: string
  isLocked: boolean
}

export interface WalletTransactionApiItem {
  id: string
  walletId: string
  userId: string
  type: string
  amount: string
  currency: string
  source: string
  status: string
  reference: string
  description: string
  metadata: Record<string, unknown> | null
  balanceBefore: string
  balanceAfter: string
  createdAt: string
  updatedAt: string
}

export interface WalletTransactionsPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface WalletTransactionsApiData {
  transactions: WalletTransactionApiItem[]
  pagination: WalletTransactionsPagination
}

export type WalletTransactionType = string
export type WalletTransactionStatus = string

export type WalletTransaction = {
  id: string
  date: string
  description: string
  type: WalletTransactionType
  amount: number
  status: WalletTransactionStatus
}

export type WalletTransactionsData = {
  transactions: WalletTransaction[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
