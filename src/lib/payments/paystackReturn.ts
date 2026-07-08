const PAYMENT_RETURN_BY_REF_PREFIX = 'paystack:return:ref:'
const PAYMENT_RETURN_LAST_KEY = 'paystack:return:last'
const PAYMENT_RETURN_TTL_MS = 30 * 60 * 1000
const DEFAULT_PAYMENT_RETURN_PATH = '/dashboard'

type StoredReturnPath = {
  path: string
  createdAt: number
}

const isSafeInternalPath = (value: string | null) => {
  if (!value) return false
  return value.startsWith('/') && !value.startsWith('//')
}

const getCurrentInternalPath = () => {
  if (typeof window === 'undefined') return DEFAULT_PAYMENT_RETURN_PATH
  const { pathname, search, hash } = window.location
  return `${pathname}${search}${hash}`
}

const parseStoredValue = (value: string | null): StoredReturnPath | null => {
  if (!value) return null

  try {
    const parsed = JSON.parse(value) as StoredReturnPath
    if (
      typeof parsed?.path === 'string' &&
      typeof parsed?.createdAt === 'number'
    ) {
      return parsed
    }
  } catch {
    return null
  }

  return null
}

const isExpired = (entry: StoredReturnPath) => {
  return Date.now() - entry.createdAt > PAYMENT_RETURN_TTL_MS
}

const readEntry = (key: string): StoredReturnPath | null => {
  if (typeof window === 'undefined') return null
  return parseStoredValue(window.sessionStorage.getItem(key))
}

const removeEntry = (key: string) => {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(key)
}

const cleanupStaleReferenceEntries = () => {
  if (typeof window === 'undefined') return
  const keysToDelete: string[] = []
  for (let index = 0; index < window.sessionStorage.length; index += 1) {
    const key = window.sessionStorage.key(index)
    if (!key?.startsWith(PAYMENT_RETURN_BY_REF_PREFIX)) continue
    const entry = readEntry(key)
    if (!entry || isExpired(entry) || !isSafeInternalPath(entry.path)) {
      keysToDelete.push(key)
    }
  }

  for (const key of keysToDelete) {
    removeEntry(key)
  }
}

export const storePaymentReturnPath = (reference?: string | null) => {
  if (typeof window === 'undefined') return
  const path = getCurrentInternalPath()
  const payload = JSON.stringify({ path, createdAt: Date.now() })
  window.sessionStorage.setItem(PAYMENT_RETURN_LAST_KEY, payload)

  if (reference) {
    window.sessionStorage.setItem(
      `${PAYMENT_RETURN_BY_REF_PREFIX}${reference}`,
      payload
    )
  }
}

export const consumePaymentReturnPath = (reference?: string | null) => {
  if (typeof window === 'undefined') return DEFAULT_PAYMENT_RETURN_PATH
  cleanupStaleReferenceEntries()

  const referenceKey = reference
    ? `${PAYMENT_RETURN_BY_REF_PREFIX}${reference}`
    : null

  const byReference = referenceKey ? readEntry(referenceKey) : null
  if (referenceKey) removeEntry(referenceKey)

  if (
    byReference &&
    !isExpired(byReference) &&
    isSafeInternalPath(byReference.path)
  ) {
    return byReference.path
  }

  const last = readEntry(PAYMENT_RETURN_LAST_KEY)
  removeEntry(PAYMENT_RETURN_LAST_KEY)
  if (last && !isExpired(last) && isSafeInternalPath(last.path)) {
    return last.path
  }

  return DEFAULT_PAYMENT_RETURN_PATH
}
