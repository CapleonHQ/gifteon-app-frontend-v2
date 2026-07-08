'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useQuery } from '@tanstack/react-query'
import { consumePaymentReturnPath } from '@/lib/payments/paystackReturn'
import {
  DESCRIPTION_BY_STATUS,
  LOTTIE_BY_STATUS,
  POLL_INTERVAL_MS,
  TITLE_BY_STATUS,
} from './paystackRedirect/constants'
import {
  getRedirectHint,
  isSafeInternalPath,
  resolveStatusFromHint,
  verifyTransaction,
} from './paystackRedirect/helpers'
import type { UiStatus } from './paystackRedirect/types'

const PaystackRedirectResult = () => {
  const searchParams = useSearchParams()

  const reference =
    searchParams.get('reference') ||
    searchParams.get('trxref') ||
    searchParams.get('transaction_id')

  const redirectHint = getRedirectHint(searchParams)

  const returnPath = useMemo(() => {
    const candidate = searchParams.get('return_to') || searchParams.get('next')
    if (isSafeInternalPath(candidate)) return candidate as string
    return consumePaymentReturnPath(reference)
  }, [reference, searchParams])

  const missingReferenceStatus: Exclude<UiStatus, 'verifying'> =
    resolveStatusFromHint(redirectHint)

  const verifyQuery = useQuery({
    queryKey: ['paystack-payment-verify', reference, redirectHint],
    queryFn: () => verifyTransaction(reference as string, redirectHint),
    enabled: Boolean(reference),
    retry: false,
    refetchInterval: (query) => {
      const state = query.state.data?.uiStatus
      return state === 'pending' ? POLL_INTERVAL_MS : false
    },
    refetchIntervalInBackground: false,
  })

  const queryUiStatus: UiStatus = reference
    ? verifyQuery.isPending
      ? 'verifying'
      : verifyQuery.data?.uiStatus ?? 'invalid'
    : missingReferenceStatus

  const primaryLabel =
    queryUiStatus === 'success'
      ? 'Continue'
      : queryUiStatus === 'failed' || queryUiStatus === 'invalid'
      ? 'Try Again'
      : 'Return'

  const description =
    verifyQuery.data?.message?.trim() || DESCRIPTION_BY_STATUS[queryUiStatus]

  return (
    <main className='bg-base-bg px-4 py-10 sm:px-6 lg:px-10'>
      <section className='mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-[900px] flex-col items-center justify-center rounded-[20px] border border-grey-100 bg-white/80 p-6 text-center shadow-[0px_20px_40px_-24px_#1019282E] backdrop-blur-[2px] sm:p-10'>
        <div className='h-[170px] w-[170px] sm:h-[220px] sm:w-[220px]'>
          {queryUiStatus === 'verifying' ? (
            <div className='flex h-full w-full flex-col items-center justify-center gap-5'>
              <span className='inline-flex h-24 w-24 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500 sm:h-28 sm:w-28' />
            </div>
          ) : (
            <DotLottieReact
              src={LOTTIE_BY_STATUS[queryUiStatus]}
              autoplay
              loop={queryUiStatus === 'success'}
            />
          )}
        </div>

        <h1 className='mt-2 text-[34px] font-bold leading-10 text-blackish sm:text-[46px] sm:leading-[54px]'>
          {TITLE_BY_STATUS[queryUiStatus]}
        </h1>

        <p className='mt-3 max-w-[52ch] text-base leading-7 text-grey-700 sm:text-lg'>
          {description}
        </p>

        {reference && queryUiStatus !== 'verifying' ? (
          <p className='mt-3 rounded-full bg-secondary-50 px-4 py-2 text-sm text-grey-700'>
            Reference:{' '}
            <span className='font-semibold text-blackish'>{reference}</span>
          </p>
        ) : null}

        {queryUiStatus !== 'verifying' ? (
          <div className='mt-8 flex w-full max-w-[440px] flex-col gap-3 sm:flex-row sm:justify-center'>
            <Link
              href={returnPath}
              className='inline-flex h-[54px] items-center justify-center rounded-[12px] border border-primary-500 bg-linear-to-b from-primary-400 from-17% to-primary-600 px-5 text-base font-medium text-white transition-colors duration-300 hover:from-primary-500 hover:to-primary-700 sm:w-[210px]'
            >
              {primaryLabel}
            </Link>

            {(queryUiStatus === 'pending' ||
              queryUiStatus === 'error' ||
              queryUiStatus === 'failed') &&
            reference ? (
              <button
                type='button'
                onClick={() => {
                  void verifyQuery.refetch()
                }}
                className='inline-flex h-[54px] items-center justify-center rounded-[12px] border border-primary-500 bg-primary-50/70 px-5 text-base font-medium text-primary-500 transition-colors duration-300 hover:bg-primary-50 sm:w-[210px]'
              >
                Verify Again
              </button>
            ) : (
              <Link
                href='/help-center'
                className='inline-flex h-[54px] items-center justify-center rounded-[12px] border border-primary-500 bg-primary-50/70 px-5 text-base font-medium text-primary-500 transition-colors duration-300 hover:bg-primary-50 sm:w-[210px]'
              >
                Need Help?
              </Link>
            )}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default PaystackRedirectResult
