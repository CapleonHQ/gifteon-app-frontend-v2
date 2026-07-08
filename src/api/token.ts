import Cookies from 'js-cookie'

export type SameSite = 'lax' | 'strict' | 'none'

export interface CookieOptions {
  maxAgeSeconds?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: SameSite
}

const ACCESS_TOKEN_COOKIE = 'giftseon_access_token'
const REFRESH_TOKEN_COOKIE = 'giftseon_refresh_token'
const AUTH_TOKEN_ISSUED_AT_KEY = 'giftseon_auth_token_issued_at'

const isBrowser = (): boolean => typeof document !== 'undefined'
const MS_PER_DAY = 24 * 60 * 60 * 1000

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split('.')
  if (parts.length < 2) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const decoded = atob(normalized)
    const parsed = JSON.parse(decoded) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      return null
    return parsed as Record<string, unknown>
  } catch {
    return null
  }
}

const inferTokenMaxAgeSeconds = (token: string): number | null => {
  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const exp = payload.exp

  if (typeof exp !== 'number' || !Number.isFinite(exp)) return null

  const remainingMs = exp * 1000 - Date.now()
  if (remainingMs <= 0) return null

  return Math.floor(remainingMs / 1000)
}

const resolveCookieExpires = (
  token: string,
  maxAgeSeconds?: number
): number | undefined => {
  const resolvedMaxAgeSeconds =
    typeof maxAgeSeconds === 'number'
      ? maxAgeSeconds
      : inferTokenMaxAgeSeconds(token)

  if (typeof resolvedMaxAgeSeconds !== 'number') return undefined
  return resolvedMaxAgeSeconds / (MS_PER_DAY / 1000)
}

export const setAccessToken = (
  token: string,
  options: CookieOptions = {}
): void => {
  if (!isBrowser()) return
  Cookies.set(ACCESS_TOKEN_COOKIE, token, {
    sameSite: options.sameSite ?? 'lax',
    secure:
      options.secure ??
      (typeof window !== 'undefined' && window.location.protocol === 'https:'),
    path: options.path ?? '/',
    domain: options.domain,
    expires: resolveCookieExpires(token, options.maxAgeSeconds),
  })
}

export const setRefreshToken = (
  token: string,
  options: CookieOptions = {}
): void => {
  if (!isBrowser()) return
  Cookies.set(REFRESH_TOKEN_COOKIE, token, {
    sameSite: options.sameSite ?? 'lax',
    secure:
      options.secure ??
      (typeof window !== 'undefined' && window.location.protocol === 'https:'),
    path: options.path ?? '/',
    domain: options.domain,
    expires: resolveCookieExpires(token, options.maxAgeSeconds),
  })
}

export const getAccessToken = (): string => {
  if (!isBrowser()) return ''
  return Cookies.get(ACCESS_TOKEN_COOKIE) ?? ''
}

export const getRefreshToken = (): string => {
  if (!isBrowser()) return ''
  return Cookies.get(REFRESH_TOKEN_COOKIE) ?? ''
}

export const clearAccessToken = (options: CookieOptions = {}): void => {
  if (!isBrowser()) return
  Cookies.remove(ACCESS_TOKEN_COOKIE, {
    path: options.path ?? '/',
    domain: options.domain,
  })
}

export const clearRefreshToken = (options: CookieOptions = {}): void => {
  if (!isBrowser()) return
  Cookies.remove(REFRESH_TOKEN_COOKIE, {
    path: options.path ?? '/',
    domain: options.domain,
  })
}

export const setAuthTokenIssuedAt = (value: string): void => {
  if (!isBrowser()) return
  window.localStorage.setItem(AUTH_TOKEN_ISSUED_AT_KEY, value)
}

export const getAuthTokenIssuedAt = (): string => {
  if (!isBrowser()) return ''
  return window.localStorage.getItem(AUTH_TOKEN_ISSUED_AT_KEY) ?? ''
}

export const clearAuthTokenIssuedAt = (): void => {
  if (!isBrowser()) return
  window.localStorage.removeItem(AUTH_TOKEN_ISSUED_AT_KEY)
}

export const ACCESS_TOKEN_COOKIE_NAME = ACCESS_TOKEN_COOKIE
export const REFRESH_TOKEN_COOKIE_NAME = REFRESH_TOKEN_COOKIE

export const isAuthenticated = (): boolean => {
  return Boolean(getAccessToken())
}
