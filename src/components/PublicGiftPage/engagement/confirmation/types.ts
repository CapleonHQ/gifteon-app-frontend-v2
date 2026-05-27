import type { GiftOption } from '../types'

export type CheckoutStep = 'checkout' | 'pin'

export type GuestDetails = {
  fullName: string
  email: string
}

export type GuestErrors = {
  fullName?: string
  email?: string
}

export type BaseStepProps = {
  selectedGiftItems: GiftOption[]
  giftQuantities: Record<string, number>
  currency: string
}
