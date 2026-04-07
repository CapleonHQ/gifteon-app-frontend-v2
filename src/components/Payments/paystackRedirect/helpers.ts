import { verifyTransactionByReference } from '@/api/services/payment'
import type { ApiResponse } from '@/types/Common'
import type {
  RedirectHint,
  VerifiedStatus,
  VerifyErrorShape,
  VerifyResult,
} from './types'

export const isSafeInternalPath = (value: string | null) => {
  if (!value) return false
  return value.startsWith('/') && !value.startsWith('//')
}

export const resolveStatusFromHint = (
  redirectHint: RedirectHint
): VerifiedStatus => {
  if (redirectHint === 'cancel') return 'canceled'
  if (redirectHint === 'success') return 'pending'
  return 'invalid'
}

export const getRedirectHint = (
  searchParams: URLSearchParams
): RedirectHint => {
  const value =
    (
      searchParams.get('status') ||
      searchParams.get('payment_status') ||
      searchParams.get('result')
    )?.toLowerCase() ?? ''

  if (!value) return 'unknown'
  if (/cancel|cancelled|abandon/.test(value)) return 'cancel'
  if (/success|successful|completed|paid/.test(value)) return 'success'
  return 'unknown'
}

const resolveStatusFromApi = (
  response: ApiResponse<Record<string, never> | null>,
  redirectHint: RedirectHint
): VerifyResult => {
  const statusValue = response.status?.toLowerCase()

  if (statusValue === 'success') {
    return { uiStatus: 'success', message: response.message }
  }

  if (statusValue === 'failed') {
    return { uiStatus: 'failed', message: response.message }
  }

  if (statusValue === 'pending') {
    return { uiStatus: 'pending', message: response.message }
  }

  if (statusValue === 'canceled' || statusValue === 'cancelled') {
    return { uiStatus: 'canceled', message: response.message }
  }

  return {
    uiStatus: resolveStatusFromHint(redirectHint),
    message: response.message,
  }
}

const getStatusCode = (err: unknown): number | undefined => {
  if (!err || typeof err !== 'object' || Array.isArray(err)) return undefined
  const e = err as VerifyErrorShape
  return e.status ?? e.response?.status
}

export const verifyTransaction = async (
  reference: string,
  redirectHint: RedirectHint
): Promise<VerifyResult> => {
  try {
    const response = await verifyTransactionByReference(reference)
    return resolveStatusFromApi(response, redirectHint)
  } catch (err) {
    const code = getStatusCode(err)

    if (code === 404) {
      return {
        uiStatus: 'invalid',
        message: 'This payment reference is invalid or does not exist.',
      }
    }

    if (code === 400) {
      return {
        uiStatus: 'invalid',
        message: 'This payment reference is invalid.',
      }
    }

    return {
      uiStatus: 'error',
      message:
        'We couldn’t verify your payment at the moment. Please try again shortly.',
    }
  }
}
