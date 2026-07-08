import posthog from 'posthog-js'
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  hasAcceptedCookieConsent,
} from '@/lib/consent/cookieConsent'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_TOKEN
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

let hasInitializedPostHog = false

const initPostHog = () => {
  if (typeof window === 'undefined') return
  if (!posthogKey) return
  if (!hasAcceptedCookieConsent()) return
  if (hasInitializedPostHog) return

  posthog.init(posthogKey, {
    api_host: posthogHost,
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
  })
  hasInitializedPostHog = true
}

if (typeof window !== 'undefined') {
  initPostHog()

  window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, (event: Event) => {
    const customEvent = event as CustomEvent<{ value?: string }>
    if (customEvent.detail?.value === 'accepted') {
      initPostHog()
    }
  })
}
