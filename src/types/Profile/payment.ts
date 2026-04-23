export type PaymentMethod = {
  id: string
  bank: string
  account: string
  accountName?: string
  accountNumber?: string
  bankCode?: string
  isDefault: boolean
}
