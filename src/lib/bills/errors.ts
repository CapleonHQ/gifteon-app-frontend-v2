import { toApiError } from '@/api/errorHelpers'
import type { NormalizedApiError } from '@/types/Common'

export type BillsErrorKind =
  | 'insufficient_balance'
  | 'expired_link'
  | 'invalid_recipient'
  | 'not_claimable'
  | 'validation'
  | 'unauthorized'
  | 'network'
  | 'unknown'

export interface BillsUiError {
  kind: BillsErrorKind
  message: string
  apiError: NormalizedApiError
}

const contains = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term))

export const mapBillsErrorToUi = (error: unknown): BillsUiError => {
  const apiError = toApiError(error)
  const rawMessage = apiError.message.toLowerCase()

  if (apiError.code === 'UNAUTHORIZED') {
    return { kind: 'unauthorized', message: apiError.message, apiError }
  }

  if (apiError.code === 'NETWORK_ERROR' || apiError.code === 'TIMEOUT') {
    return { kind: 'network', message: apiError.message, apiError }
  }

  if (
    contains(rawMessage, ['insufficient', 'not enough balance', 'low balance'])
  ) {
    return {
      kind: 'insufficient_balance',
      message: 'Insufficient wallet balance for this bill request.',
      apiError,
    }
  }

  if (contains(rawMessage, ['expired link', 'link expired', 'expired token'])) {
    return {
      kind: 'expired_link',
      message: 'This payment link has expired.',
      apiError,
    }
  }

  if (contains(rawMessage, ['recipient', 'wrong recipient', 'invalid recipient'])) {
    return {
      kind: 'invalid_recipient',
      message: 'Recipient details are invalid for this bill.',
      apiError,
    }
  }

  if (contains(rawMessage, ['claim', 'not claimable', 'cannot claim'])) {
    return {
      kind: 'not_claimable',
      message: 'This gift bill cannot be claimed in its current state.',
      apiError,
    }
  }

  if (apiError.code === 'VALIDATION_ERROR' || apiError.code === 'BAD_REQUEST') {
    return {
      kind: 'validation',
      message: apiError.message,
      apiError,
    }
  }

  return { kind: 'unknown', message: apiError.message, apiError }
}

