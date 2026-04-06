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

export type CheckoutWhoIsFor = 'for_me' | 'someone_else'

export type CheckoutWishlistItemSource = 'custom' | 'store'

export interface CheckoutPaymentUserDetails {
  email: string
  fullName: string
}

export interface CheckoutPaymentRecipientDetails {
  email: string
  fullName: string
  address?: string
  phoneNumber?: string
}

export interface CheckoutPaymentWishListItem {
  itemId: string
  quantity: number
  source: CheckoutWishlistItemSource
}

export interface CheckoutPaymentRequestBody {
  pageId?: string
  userDetails?: CheckoutPaymentUserDetails
  whoIsFor?: CheckoutWhoIsFor
  recipientDetails?: CheckoutPaymentRecipientDetails
  wishListItems?: CheckoutPaymentWishListItem[]
  cashGiftAmount?: number
  payWithWallet?: boolean
  pin?: string
}

export interface CheckoutPaymentExternalProviderData {
  authorizationUrl: string
  accessCode?: string
  reference: string
}

export interface CheckoutPaymentImmediateSuccessData {
  success: boolean
  reference?: string
  message: string
}

export type CheckoutPaymentResponseData =
  | CheckoutPaymentExternalProviderData
  | CheckoutPaymentImmediateSuccessData
