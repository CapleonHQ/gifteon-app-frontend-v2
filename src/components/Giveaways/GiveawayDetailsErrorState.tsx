'use client'

import { CircleAlert } from 'lucide-react'
import Link from 'next/link'

type GiveawayDetailsErrorStateProps = {
  title: string
  description: string
  onRetry: () => void
  isRetrying?: boolean
}

const GiveawayDetailsErrorState = ({
  title,
  description,
  onRetry,
  isRetrying = false,
}: GiveawayDetailsErrorStateProps) => {
  return (
    <div className='w-full min-h-[500px] lg:min-h-[700px] flex items-center justify-center px-4'>
      <div className='w-full max-w-[560px] bg-white p-6 lg:p-8 text-center'>
        <div className='mx-auto w-12 h-12 rounded-full bg-warning-50 text-warning-600 flex items-center justify-center text-xl font-semibold'>
          <CircleAlert />
        </div>
        <h2 className='mt-4 text-2xl font-semibold text-blackish'>{title}</h2>
        <p className='mt-2 text-sm lg:text-base text-grey-700'>{description}</p>

        <div className='mt-6 flex flex-col sm:flex-row items-center justify-center gap-3'>
          <button
            type='button'
            onClick={onRetry}
            disabled={isRetrying}
            className='w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-300'
          >
            {isRetrying ? 'Retrying...' : 'Try again'}
          </button>

          <Link
            href='/giveaways'
            className='w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-grey-200 text-grey-800 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors duration-300'
          >
            Back to giveaways
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GiveawayDetailsErrorState
