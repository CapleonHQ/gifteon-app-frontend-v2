import axios from 'axios'
import { ApiErrorCode, NormalizedApiError } from '@/types/Common'

type ServiceKey =
  | 'auth'
  | 'account'
  | 'pages'
  | 'templates'
  | 'comments'
  | 'activities'
  | 'contributions'
  | 'notifications'
  | 'banks'
  | 'cart'
  | 'wallet'
  | 'payment'
  | 'paymentMethods'
  | 'stats'
  | 'webhooks'
  | 'merchantAuth'
  | 'merchantStats'
  | 'merchantListings'
  | 'merchants'
  | 'merchantOrders'
  | 'merchantWallet'
  | 'merchantCoupons'
  | 'merchantStores'
  | 'listingCategories'

const mapStatusToCode = (status?: number): NormalizedApiError['code'] => {
  if (!status) return 'UNKNOWN'
  if (status === 400) return 'BAD_REQUEST'
  if (status === 401) return 'UNAUTHORIZED'
  if (status === 403) return 'FORBIDDEN'
  if (status === 404) return 'NOT_FOUND'
  if (status === 422) return 'VALIDATION_ERROR'
  if (status === 429) return 'RATE_LIMITED'
  if (status >= 500) return 'SERVER_ERROR'
  return 'UNKNOWN'
}

const fallbackMessageFor = (code: ApiErrorCode): string => {
  switch (code) {
    case 'NETWORK_ERROR':
      return 'Network error. Check your connection.'
    case 'TIMEOUT':
      return 'Request timed out. Please try again.'
    case 'UNAUTHORIZED':
      return 'Session expired. Please sign in again.'
    case 'FORBIDDEN':
      return 'You do not have permission to perform this action.'
    case 'NOT_FOUND':
      return 'Requested resource not found.'
    case 'VALIDATION_ERROR':
      return 'Please correct the highlighted fields.'
    case 'RATE_LIMITED':
      return 'Too many requests. Please try again later.'
    case 'SERVER_ERROR':
      return 'Server error. Please try again later.'
    case 'BAD_REQUEST':
      return 'Invalid request. Please check your input.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

const SERVICE_PATHS: Array<[ServiceKey, RegExp]> = [
  ['auth', /^\/auth\//],
  ['account', /^\/account(\/|$)/],
  ['pages', /^\/pages(\/|$)/],
  ['templates', /^\/templates\//],
  ['comments', /^\/pages\/[^/]+\/comments|^\/pages\/comments\//],
  ['activities', /^\/pages\/[^/]+\/activities/],
  ['contributions', /^\/pages\/[^/]+\/contributions/],
  ['notifications', /^\/notifications\//],
  ['banks', /^\/connected-banks/],
  ['cart', /^\/store\/cart/],
  ['wallet', /^\/wallet/],
  ['payment', /^\/payment/],
  ['paymentMethods', /^\/payment-methods/],
  ['stats', /^\/stats/],
  ['webhooks', /^\/webhooks/],
  ['merchantAuth', /^\/merchant\/auth/],
  ['merchantStats', /^\/merchant\/stats/],
  ['merchantListings', /^\/merchant\/listings/],
  ['merchants', /^\/merchants/],
  ['merchantOrders', /^\/merchant\/orders/],
  ['merchantWallet', /^\/merchant\/wallet/],
  ['merchantCoupons', /^\/merchant\/listings\/[^/]+\/coupon|^\/merchant\/listings\/[^/]+\/coupons/],
  ['merchantStores', /^\/merchant\/stores/],
  ['listingCategories', /^\/listing\/categories/],
]

const SERVICE_DEFAULTS: Record<ServiceKey, string> = {
  auth: 'Authentication failed. Please try again.',
  account: 'Unable to load your account information.',
  pages: 'Unable to complete the page request.',
  templates: 'Unable to process template request.',
  comments: 'Unable to process comments.',
  activities: 'Unable to load activities.',
  contributions: 'Unable to load contributions.',
  notifications: 'Unable to update notification settings.',
  banks: 'Unable to process bank request.',
  cart: 'Unable to update your cart.',
  wallet: 'Unable to process wallet request.',
  payment: 'Payment failed. Please try again.',
  paymentMethods: 'Unable to update payment methods.',
  stats: 'Unable to load stats.',
  webhooks: 'Webhook processing failed.',
  merchantAuth: 'Merchant authentication failed.',
  merchantStats: 'Unable to load merchant stats.',
  merchantListings: 'Unable to process listing request.',
  merchants: 'Unable to process merchant request.',
  merchantOrders: 'Unable to process order request.',
  merchantWallet: 'Unable to process merchant wallet request.',
  merchantCoupons: 'Unable to process coupon request.',
  merchantStores: 'Unable to process store request.',
  listingCategories: 'Unable to process categories request.',
}

const SERVICE_STATUS_OVERRIDES: Partial<
  Record<ServiceKey, Partial<Record<ApiErrorCode, string>>>
> = {
  auth: {
    UNAUTHORIZED: 'Invalid email or password.',
    FORBIDDEN: 'Your account is not allowed to sign in.',
  },
  merchantAuth: {
    UNAUTHORIZED: 'Invalid email or password.',
    FORBIDDEN: 'Your merchant account is not allowed to sign in.',
  },
  payment: {
    BAD_REQUEST: 'Payment failed. Please try again.',
    FORBIDDEN: 'Payment not authorized.',
  },
  wallet: {
    BAD_REQUEST: 'Wallet operation failed.',
    FORBIDDEN: 'Wallet operation not authorized.',
  },
}

const resolveServiceKey = (url?: string): ServiceKey | undefined => {
  if (!url) return undefined
  let path: string
  try {
    path = url.startsWith('http') ? new URL(url).pathname : url
  } catch {
    path = url
  }
  for (const [key, regex] of SERVICE_PATHS) {
    if (regex.test(path)) return key
  }
  return undefined
}

const resolveServiceMessage = (
  serviceKey: ServiceKey | undefined,
  code: ApiErrorCode
): string | undefined => {
  if (!serviceKey) return undefined
  const overrides = SERVICE_STATUS_OVERRIDES[serviceKey]
  if (overrides?.[code]) return overrides[code]
  return SERVICE_DEFAULTS[serviceKey]
}

const parseFieldErrors = (data: any): NormalizedApiError['fieldErrors'] => {
  if (!data || typeof data !== 'object') return undefined
  const errors = data.errors ?? data.fieldErrors ?? data.data?.errors
  if (!errors || typeof errors !== 'object') return undefined
  const fieldErrors: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      fieldErrors[key] = value.map(String)
    } else if (typeof value === 'string') {
      fieldErrors[key] = [value]
    }
  }
  return Object.keys(fieldErrors).length ? fieldErrors : undefined
}

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data: any = error.response?.data

    const code = error.code === 'ECONNABORTED'
      ? 'TIMEOUT'
      : error.message?.toLowerCase().includes('network')
        ? 'NETWORK_ERROR'
        : mapStatusToCode(status)

    const serviceKey = resolveServiceKey(error.config?.url)
    const serviceMessage = resolveServiceMessage(serviceKey, code)

    const message =
      data?.message ||
      data?.error ||
      data?.statusMessage ||
      serviceMessage ||
      fallbackMessageFor(code)

    const requestId =
      error.response?.headers?.['x-request-id'] ||
      error.response?.headers?.['x-correlation-id']

    return {
      ok: false,
      code,
      message,
      status,
      details: data?.details,
      fieldErrors: parseFieldErrors(data),
      requestId,
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      raw: error,
    }
  }

  return {
    ok: false,
    code: 'UNKNOWN',
    message: fallbackMessageFor('UNKNOWN'),
    raw: error,
  }
}
