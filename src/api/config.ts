const normalizeBaseUrl = (value: string): string => {
  if (!value) return ''
  return value.endsWith('/') ? value.slice(0, -1) : value
}

const getEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    if (process.env.NODE_ENV !== 'production') {
      // Fail fast in dev so misconfigurations are obvious.
      throw new Error(`Missing required environment variable: ${name}`)
    }
  }
  return value ?? ''
}

const AUTH_BASE_URL = normalizeBaseUrl(
  getEnv('NEXT_PUBLIC_AUTH_API_BASE_URL')
)

const APP_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_APPLICATION_API_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_API_BASE_URL ??
    getEnv('NEXT_PUBLIC_APP_API_BASE_URL')
)

export const API_BASE_URLS = {
  auth: AUTH_BASE_URL,
  app: APP_BASE_URL,
}

export const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? ''

export const API_DEFAULT_TIMEOUT_MS = 20000
