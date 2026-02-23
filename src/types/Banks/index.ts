export interface ConnectBankRequestBody {
  bankName: string
  accountNumber: string
  accountName: string
  bankCode: string
  isDefault?: boolean
}

export interface ConnectedBank {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  bankCode: string
  userId: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ConnectedBanksData {
  banks: ConnectedBank[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface AvailableBank {
  id: string
  name: string
  code: string
  slug: string
  country: string
  currency: string
  type: string
  supportsTransfer: boolean
}

export interface AvailableBanksData {
  banks: AvailableBank[]
  total: number
}
