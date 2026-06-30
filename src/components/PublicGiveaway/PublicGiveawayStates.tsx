'use client'

import Link from 'next/link'
import { CircleAlert, SearchX } from 'lucide-react'
import PageLoader from '@/components/common/PageLoader'

export const PublicGiveawayLoadingView = () => (
  <main className='min-h-screen bg-base-bg px-4'>
    <PageLoader
      message='Loading this giveaway...'
      subtext='Just a moment while we get everything ready.'
      minHeightClassName='min-h-screen'
    />
  </main>
)

type PublicGiveawayErrorStateProps = {
  variant: 'not-found' | 'error'
  onRetry: () => void
  isRetrying?: boolean
}

export const PublicGiveawayErrorState = ({
  variant,
  onRetry,
  isRetrying = false,
}: PublicGiveawayErrorStateProps) => {
  const isMissing = variant === 'not-found'
  const Icon = isMissing ? SearchX : CircleAlert

  return (
    <main className='min-h-screen bg-base-bg px-4'>
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-full max-w-[520px] text-center'>
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
              isMissing
                ? 'bg-grey-50 text-grey-500'
                : 'bg-warning-50 text-warning-600'
            }`}
          >
            <Icon className='h-6 w-6' />
          </div>
          <h1 className='mt-5 text-2xl font-semibold text-blackish'>
            {isMissing
              ? 'This giveaway can’t be found'
              : 'Something went wrong'}
          </h1>
          <p className='mt-2 text-sm lg:text-base text-grey-700'>
            {isMissing
              ? 'This link may be invalid, or the giveaway has been removed or is no longer available.'
              : 'We couldn’t load this giveaway right now. Please check your connection and try again.'}
          </p>

          <div className='mt-7 flex flex-col sm:flex-row items-center justify-center gap-3'>
            {isMissing ? null : (
              <button
                type='button'
                onClick={onRetry}
                disabled={isRetrying}
                className='w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-300'
              >
                {isRetrying ? 'Retrying...' : 'Try again'}
              </button>
            )}

            <Link
              href='/'
              className='w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-grey-200 bg-grey-50/70 text-grey-800 font-medium hover:bg-grey-100/70 transition-colors duration-300'
            >
              Discover Giftseon
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
