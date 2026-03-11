'use client'

import { useEffect, useState } from 'react'
import AlertIcon from '@/assets/icons/AlertIcon'
import CloseIcon from '@/assets/icons/CloseIcon'
import { useAuth } from '@/context/AuthContext'

const OfflineBanner = () => {
  const { connectivityBanner, connectivityBannerSession } = useAuth()
  const [dismissedSession, setDismissedSession] = useState<number | null>(null)

  useEffect(() => {
    if (connectivityBanner !== 'online') return

    const timeout = window.setTimeout(() => {
      setDismissedSession(connectivityBannerSession)
    }, 2500)

    return () => window.clearTimeout(timeout)
  }, [connectivityBanner, connectivityBannerSession])

  if (!connectivityBanner || dismissedSession === connectivityBannerSession) {
    return null
  }

  const isOffline = connectivityBanner === 'offline'

  return (
    <div className='fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-[360px] lg:bottom-6 lg:left-6'>
      <div
        className={`flex items-start gap-3 rounded-[12px] px-4 py-3 shadow-[0px_10px_18px_-2px_#10192812] ${
          isOffline
            ? 'border border-warning-100 bg-warning-50 text-warning-800'
            : 'border border-success-100 bg-success-50 text-success-800'
        }`}
      >
        <span
          className={`mt-0.5 h-4 w-4 shrink-0 ${
            isOffline ? 'text-warning-600' : 'text-success-600'
          }`}
        >
          <AlertIcon />
        </span>
        <div className='flex flex-1 flex-col gap-0.5'>
          <p
            className={`text-sm font-medium leading-[20px] ${
              isOffline ? 'text-warning-900' : 'text-success-900'
            }`}
          >
            {isOffline ? "You're offline" : 'Back online'}
          </p>
          <p
            className={`text-xs leading-[18px] ${
              isOffline ? 'text-warning-700' : 'text-success-700'
            }`}
          >
            {isOffline
              ? 'You can keep using the app, but actions that need internet may not work until your connection is back.'
              : 'Your connection has been restored and online actions are available again.'}
          </p>
        </div>
        {isOffline ? (
          <button
            type='button'
            onClick={() => setDismissedSession(connectivityBannerSession)}
            aria-label='Dismiss offline banner'
            className='mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-warning-700 transition-colors hover:bg-warning-100 hover:text-warning-900'
          >
            <span className='h-3.5 w-3.5'>
              <CloseIcon />
            </span>
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default OfflineBanner
