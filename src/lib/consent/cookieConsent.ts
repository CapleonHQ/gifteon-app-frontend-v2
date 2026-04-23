export type CookieConsentValue = 'accepted' | 'rejected'

export const COOKIE_CONSENT_COOKIE_NAME = 'giftseon_cookie_consent'
export const COOKIE_CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
export const COOKIE_CONSENT_UPDATED_EVENT = 'giftseon:cookie-consent-updated'

export const readCookieConsent = (): CookieConsentValue | null => {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split(';')
  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim()
    if (!cookie.startsWith(`${COOKIE_CONSENT_COOKIE_NAME}=`)) continue
    const value = cookie.slice(COOKIE_CONSENT_COOKIE_NAME.length + 1)
    if (value === 'accepted' || value === 'rejected') return value
  }
  return null
}

export const hasAcceptedCookieConsent = () =>
  readCookieConsent() === 'accepted'

export const persistCookieConsent = (value: CookieConsentValue) => {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_CONSENT_COOKIE_MAX_AGE}; SameSite=Lax`
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: { value } })
    )
  }
}
