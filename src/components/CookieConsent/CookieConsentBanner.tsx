'use client'

import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import {
  persistCookieConsent,
  readCookieConsent,
  type CookieConsentValue,
} from '@/lib/consent/cookieConsent'

type CookieConsentSnapshot = CookieConsentValue | 'unset' | 'loading'

export default function CookieConsentBanner() {
  const subscribe = () => () => {}

  const getSnapshot = (): CookieConsentSnapshot =>
    readCookieConsent() ?? 'unset'
  const getServerSnapshot = (): CookieConsentSnapshot => 'loading'

  const consentSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const [localConsent, setLocalConsent] = useState<CookieConsentValue | null>(
    null
  )
  const effectiveConsent = localConsent ?? consentSnapshot

  if (effectiveConsent === 'loading' || effectiveConsent !== 'unset')
    return null

  const handleSelect = (value: CookieConsentValue) => {
    setLocalConsent(value)
    persistCookieConsent(value)
  }

  return (
    <aside className='fixed inset-x-0 bottom-4 z-120 px-4 sm:bottom-6 sm:px-6'>
      <div className='mx-auto w-full max-w-[1060px] rounded-2xl border border-grey-100 bg-white px-4 py-3 shadow-[0px_16px_44px_-24px_#10192845] sm:px-5 sm:py-3.5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4'>
          <div>
            <p className='text-sm font-semibold leading-5 text-blackish sm:text-[15px]'>
              Your privacy matters
            </p>
            <p className='mt-0.5 text-xs leading-5 text-grey-700 sm:text-sm'>
              We use cookies to improve site performance and personalize your
              experience. You can accept all cookies or reject non-essential
              cookies.
            </p>
            <p className='mt-0.5 text-xs leading-5 text-grey-700 sm:text-sm'>
              Read more in our{' '}
              <Link
                href='/legal/privacy-policy'
                className='font-medium text-primary-600 underline-offset-2 hover:underline'
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3'>
            <button
              type='button'
              onClick={() => handleSelect('rejected')}
              className='inline-flex h-10 min-w-[180px] items-center justify-center whitespace-nowrap rounded-xl border border-grey-200 bg-grey-50 px-4 text-sm font-medium text-grey-800 shadow-[inset_0_1px_0_#FFFFFF] transition-all hover:border-grey-300 hover:bg-grey-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200'
            >
              Reject non-essential
            </button>
            <button
              type='button'
              onClick={() => handleSelect('accepted')}
              className='inline-flex h-10 min-w-[180px] items-center justify-center whitespace-nowrap rounded-xl bg-linear-to-b from-primary-400 to-primary-600 px-4 text-sm font-semibold text-white shadow-[0px_10px_22px_-12px_#2A2EBF] transition-all hover:from-primary-500 hover:to-primary-700 hover:shadow-[0px_14px_28px_-14px_#2A2EBF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200'
            >
              Accept all cookies
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
