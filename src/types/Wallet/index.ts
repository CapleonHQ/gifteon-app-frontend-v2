import { PaginationParams } from '@/types/Common'

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
