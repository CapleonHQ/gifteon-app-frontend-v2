'use client'

import {
  createContext,
  useContext,
  type ClipboardEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import type { BillsTabKey } from '../constants'
import type {
  CardValidationIssue,
  RecipientCard,
} from '../models'

export type BillsFlowContextValue = {
  activeTab: BillsTabKey
  activeCards: RecipientCard[]
  cardErrors: Array<CardValidationIssue | null>
  showValidationErrors: boolean
  recipientRefs: RefObject<Record<string, HTMLDivElement | null>>
  verifyErrorByCard: Record<string, string>
  verifiedNameByCard: Record<string, string>
  isActionBusy: boolean
  isVerifyingElectricity: boolean
  isVerifyingCable: boolean
  totalAmount: number
  isReviewOpen: boolean
  isPinOpen: boolean
  pin: string[]
  pinError: string
  isSubmitting: boolean
  isPinComplete: boolean
  pinRefs: RefObject<Array<HTMLInputElement | null>>
  onUpdateCard: (cardId: string, updater: (card: RecipientCard) => RecipientCard) => void
  onRemoveRecipientCard: (cardId: string) => void
  onAddRecipientCard: () => void
  onEnsureDataPlans: (network: string) => Promise<void>
  onEnsureCablePackages: (provider: string) => Promise<void>
  getDataPlanOptions: (network: string) => Array<{ value: string; label: string }>
  getCablePackageOptions: (provider: string) => Array<{ value: string; label: string }>
  getDataPlanAmount: (network: string, code: string) => number | undefined
  getCablePlanAmount: (provider: string, code: string) => number | undefined
  getDataPlanLabel: (network: string, code: string) => string
  getCablePackageLabel: (provider: string, code: string) => string
  onSetVerifyError: (cardId: string, message: string) => void
  onSetVerifiedName: (cardId: string, name: string) => void
  onHandleVerifyCard: (card: RecipientCard) => Promise<void>
  onApplyQuickRecipient: (value: string) => void
  onOpenReview: () => void
  onCloseReview: () => void
  onOpenPinFromReview: () => void
  onClosePinToReview: () => void
  onPinChange: (index: number, value: string) => void
  onPinKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void
  onPinPaste: (event: ClipboardEvent<HTMLInputElement>) => void
  onRunPayment: () => Promise<void>
}

const BillsFlowContext = createContext<BillsFlowContextValue | null>(null)

export const BillsFlowProvider = BillsFlowContext.Provider

export const useBillsFlow = () => {
  const context = useContext(BillsFlowContext)
  if (!context) {
    throw new Error('useBillsFlow must be used within BillsFlowProvider')
  }
  return context
}
