import { PaginationParams } from '@/types/Common'
import { ApiResponse } from '@/types/Common'

export interface WalletTransactionsParams extends PaginationParams {
  type?: string
  status?: string
  source?: string
  startDate?: string
  endDate?: string
}

export interface WalletWithdrawalsParams extends PaginationParams {
  status?: string
}

export interface WithdrawRequestBody {
  amount: number
  bankId: string
  pin: string
}

export interface TransferRecipientLookupData {
  userId: string
  fullName: string
  tag: string
  profilePicture: string | null
  walletCurrency: string
}

export interface TransferRequestBody {
  receiverTag: string
  amount: number
  pin: string
}

export interface TransferResultData {
  reference: string
  fee: number
  convertedAmount: number
  receiverCurrency: string
  senderCurrency: string
}

export interface WalletWithdrawalData {
  id: string
  reference: string
  amount: number
  currency: string
  bankName: string
  accountNumber: string
  accountName: string
  scheduledAt: string
  status: string
  message: string
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
  topupBalance: number
  receivedBalance: number
  withdrawableBalance: number
  totalReceived: number
  totalWithdrawn: number
  currency: string
  isLocked: boolean
  weeklyLimit: number
  weeklyWithdrawn: number
  availableWeeklyLimit: number
}

export interface WalletWithdrawalDeviceInfo {
  os: string
  device: string
  browser: string
  isMobile: boolean
}

export interface WalletWithdrawalApiItem {
  id: string
  userId: string
  walletId: string
  amount: string
  currency: string
  bankId: string
  bankName: string
  accountNumber: string
  accountName: string
  bankCode: string
  reference: string
  status: string
  scheduledAt: string
  processedAt: string | null
  kycLevelAtRequest: number
  ipAddress: string
  userAgent: string
  deviceInfo: WalletWithdrawalDeviceInfo
  walletTransactionId: string | null
  failedReason: string | null
  metadata: {
    balanceAfter?: number | string
    balanceBefore?: number | string
  } | null
  createdAt: string
  updatedAt: string
}

export interface WalletWithdrawalsApiData {
  withdrawals: WalletWithdrawalApiItem[]
  pagination: WalletTransactionsPagination
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
  description: string | null
  metadata: WalletTransactionMetadata | null
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
  displayAmount: string
  currency: string
  status: WalletTransactionStatus
  reference: string
  userId: string
  source: string
  createdAt: string
  updatedAt: string
  metadata: WalletTransactionMetadata | null
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

type WalletBillTransactionMetadataBase = {
  billTransactionId: string
}

export type WalletAirtimeTransactionMetadata =
  WalletBillTransactionMetadataBase & {
    type: 'airtime'
    network: string
    phoneNumber: string
  }

export type WalletDataTransactionMetadata = WalletBillTransactionMetadataBase & {
  type: 'data'
  network: string
  phoneNumber: string
  planCode: string
}

export type WalletElectricityTransactionMetadata =
  WalletBillTransactionMetadataBase & {
    type: 'electricity'
    provider: string
    meterNumber: string
    meterType: string
    token: string
    units: string
  }

export type WalletCableTvTransactionMetadata =
  WalletBillTransactionMetadataBase & {
    type: 'cable_tv'
    provider: string
    iucNumber: string
    packageCode: string
  }

export type WalletTransactionMetadata =
  | WalletAirtimeTransactionMetadata
  | WalletDataTransactionMetadata
  | WalletElectricityTransactionMetadata
  | WalletCableTvTransactionMetadata

export type WalletWithdrawalStatus = string

export type WalletWithdrawal = {
  id: string
  amount: number
  currency: string
  bankName: string
  accountNumber: string
  accountName: string
  reference: string
  status: WalletWithdrawalStatus
  scheduledAt: string
  processedAt: string | null
  failedReason: string | null
  createdAt: string
  updatedAt: string
  balanceAfter: number
  balanceBefore: number
}

export type WalletWithdrawalsData = {
  withdrawals: WalletWithdrawal[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
