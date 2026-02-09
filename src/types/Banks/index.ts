export interface ConnectBankRequestBody {
  bankName: string
  accountNumber: string
  accountName: string
  bankCode: string
  isDefault?: boolean
}
