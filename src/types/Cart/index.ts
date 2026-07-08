export interface AddToCartRequestBody {
  source: string
  itemId: string
  pageId: string
  quantity: number
  custom?: {
    unitPrice: number
    name: string
    image?: string
  }
}

export interface CheckoutRequestBody {
  giftPageId: string
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  notes?: string
  paymentMethod: string
}

export interface UpdateCartItemRequestBody {
  itemId: string
  quantity: number
}
