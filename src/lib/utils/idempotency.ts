export const generateIdempotencyKey = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `idem-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const idempotencyHeaders = () => ({
  headers: { 'idempotency-key': generateIdempotencyKey() },
})
