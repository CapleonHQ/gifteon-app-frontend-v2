export interface InitializePaymentRequestBody {
  email: string
  totalAmount: number
  currency: string
  giftPageId: string
  orders: Array<{
    type: string
    itemId?: string
    quantity?: number
    amount: number
  }>
  userId?: string
  fullName?: string
}

export interface ValidateWalletBalanceRequestBody {
  amount: number
}
