import { toApiError } from '@/api/errorHelpers'
import type { NormalizedApiError } from '@/types/Common'

export type ContactsErrorKind =
  | 'duplicate'
  | 'google_not_connected'
  | 'google_token_expired'
  | 'validation'
  | 'unauthorized'
  | 'network'
  | 'unknown'

export interface ContactsUiError {
  kind: ContactsErrorKind
  message: string
  apiError: NormalizedApiError
}

const contains = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term))

export const mapContactsErrorToUi = (error: unknown): ContactsUiError => {
  const apiError = toApiError(error)
  const rawMessage = apiError.message.toLowerCase()

  if (apiError.code === 'UNAUTHORIZED') {
    return { kind: 'unauthorized', message: apiError.message, apiError }
  }

  if (apiError.code === 'NETWORK_ERROR' || apiError.code === 'TIMEOUT') {
    return { kind: 'network', message: apiError.message, apiError }
  }

  if (
    contains(rawMessage, [
      'already exists',
      'duplicate',
      'phone already',
      'email already',
    ])
  ) {
    return {
      kind: 'duplicate',
      message: 'A contact with this phone or email already exists.',
      apiError,
    }
  }

  if (
    contains(rawMessage, [
      'google not connected',
      'not connected to google',
      'google account not connected',
    ])
  ) {
    return {
      kind: 'google_not_connected',
      message: 'Connect Google Contacts to continue this action.',
      apiError,
    }
  }

  if (contains(rawMessage, ['google token expired', 'token expired', 'reauthorize'])) {
    return {
      kind: 'google_token_expired',
      message: 'Google connection expired. Reconnect and try again.',
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

