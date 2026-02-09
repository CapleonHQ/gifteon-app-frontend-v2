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

const isBrowser = (): boolean => typeof document !== 'undefined'

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
    expires:
      typeof options.maxAgeSeconds === 'number'
        ? options.maxAgeSeconds / (60 * 60 * 24)
        : undefined,
  })
}

export const getAccessToken = (): string => {
  if (!isBrowser()) return ''
  return Cookies.get(ACCESS_TOKEN_COOKIE) ?? ''
}

export const clearAccessToken = (options: CookieOptions = {}): void => {
  if (!isBrowser()) return
  Cookies.remove(ACCESS_TOKEN_COOKIE, {
    path: options.path ?? '/',
    domain: options.domain,
  })
}

export const ACCESS_TOKEN_COOKIE_NAME = ACCESS_TOKEN_COOKIE
