'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useQuery } from '@tanstack/react-query'
import { verifyTransactionByReference } from '@/api/services/payment'
import { consumePaymentReturnPath } from '@/lib/payments/paystackReturn'

type UiStatus =
  | 'verifying'
  | 'success'
  | 'failed'
  | 'canceled'
  | 'pending'
  | 'invalid'
  | 'error'

type VerifyResult = {
  uiStatus: Exclude<UiStatus, 'verifying'>
  message?: string
}

type RedirectHint = 'success' | 'cancel' | 'unknown'

const POLL_INTERVAL_MS = 2500

const isSafeInternalPath = (value: string | null) => {
  if (!value) return false
  return value.startsWith('/') && !value.startsWith('//')
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const getByPath = (source: unknown, path: string[]): unknown => {
  let current: unknown = source
  for (const key of path) {
    if (!isRecord(current) || !(key in current)) return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

const pickString = (source: unknown, paths: string[][]): string | undefined => {
  for (const path of paths) {
    const value = getByPath(source, path)
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

const pickBoolean = (
  source: unknown,
  paths: string[][]
): boolean | undefined => {
  for (const path of paths) {
    const value = getByPath(source, path)
    if (typeof value === 'boolean') return value
  }
  return undefined
}

const normalizeFromPayload = (
  payload: unknown,
  redirectHint: RedirectHint
): VerifyResult => {
  const statusValue =
    pickString(payload, [
      ['data', 'status'],
      ['status'],
      ['data', 'transactionStatus'],
      ['data', 'paymentStatus'],
      ['data', 'gateway_response'],
    ])?.toLowerCase() ?? ''

  const apiMessage = pickString(payload, [
    ['message'],
    ['data', 'message'],
    ['data', 'gateway_response'],
  ])

  const paid = pickBoolean(payload, [
    ['data', 'paid'],
    ['data', 'data', 'paid'],
    ['paid'],
    ['success'],
    ['data', 'success'],
  ])

  if (
    paid === true ||
    /success|successful|completed|complete|paid/i.test(statusValue)
  ) {
    return { uiStatus: 'success', message: apiMessage }
  }

  if (/fail|failed|error|declined|rejected/i.test(statusValue)) {
    return { uiStatus: 'failed', message: apiMessage }
  }

  if (/cancel|cancelled|abandon/i.test(statusValue)) {
    return { uiStatus: 'canceled', message: apiMessage }
  }

  if (/pending|processing|initiated|queued|verifying/i.test(statusValue)) {
    return { uiStatus: 'pending', message: apiMessage }
  }

  return {
    uiStatus: redirectHint === 'cancel' ? 'canceled' : 'invalid',
    message: apiMessage,
  }
}

type VerifyErrorShape = {
  status?: number
  response?: { status?: number }
}

const getStatusCode = (err: unknown): number | undefined => {
  if (!isRecord(err)) return undefined
  const e = err as VerifyErrorShape
  return e.status ?? e.response?.status
}

const verifyWithFallback = async (
  reference: string,
  redirectHint: RedirectHint
): Promise<VerifyResult> => {
  try {
    const verifyResp = await verifyTransactionByReference(reference)
    return normalizeFromPayload(verifyResp, redirectHint)
  } catch (err) {
    const code = getStatusCode(err)

    if (code === 404) {
      return {
        uiStatus: 'invalid',
        message: 'This payment reference is invalid or does not exist.',
      }
    }

    if (code === 400) {
      return {
        uiStatus: 'invalid',
        message: 'This payment reference is invalid.',
      }
    }

    return {
      uiStatus: 'error',
      message:
        'We couldn’t verify your payment at the moment. Please try again shortly.',
    }
  }
}

const getRedirectHint = (searchParams: URLSearchParams): RedirectHint => {
  const value =
    (
      searchParams.get('status') ||
      searchParams.get('payment_status') ||
      searchParams.get('result')
    )?.toLowerCase() ?? ''

  if (!value) return 'unknown'
  if (/cancel|cancelled|abandon/.test(value)) return 'cancel'
  if (/success|successful|completed|paid/.test(value)) return 'success'
  return 'unknown'
}

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
    redirectHint === 'cancel'
      ? 'canceled'
      : redirectHint === 'success'
      ? 'pending'
      : 'invalid'

  const verifyQuery = useQuery({
    queryKey: ['paystack-payment-verify', reference, redirectHint],
    queryFn: () => verifyWithFallback(reference as string, redirectHint),
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

  const titleByStatus: Record<UiStatus, string> = {
    verifying: 'Verifying Payment',
    success: 'Payment Successful',
    failed: 'Payment Failed',
    canceled: 'Payment Canceled',
    pending: 'Payment Pending',
    invalid: 'Invalid Payment Reference',
    error: 'Unable to Verify Payment',
  }

  const descriptionByStatus: Record<UiStatus, string> = {
    verifying:
      'Please wait while we confirm your transaction status with our payment provider.',
    success:
      'Your payment has been confirmed. You can continue to complete your flow.',
    failed: 'We could not confirm a successful payment for this transaction.',
    canceled: 'No charge was completed. You can retry whenever you are ready.',
    pending:
      'Your transaction is still processing. We are checking again automatically.',
    invalid:
      'This payment reference is missing, invalid, or does not exist for this payment attempt.',
    error:
      'We couldn’t verify your payment at the moment. Please try again shortly.',
  }

  const lottieByStatus: Record<UiStatus, string> = {
    verifying: '/assets/lottie/activate-lottie.lottie',
    success: '/assets/lottie/success_with_very_early_fireworks.lottie',
    failed: '/assets/lottie/cancelled-lottie.lottie',
    canceled: '/assets/lottie/cancelled-lottie.lottie',
    pending: '/assets/lottie/pending-lottie.lottie',
    invalid: '/assets/lottie/cancelled-lottie.lottie',
    error: '/assets/lottie/cancelled-lottie.lottie',
  }

  const primaryLabel =
    queryUiStatus === 'success'
      ? 'Continue'
      : queryUiStatus === 'failed' || queryUiStatus === 'invalid'
      ? 'Try Again'
      : 'Return'

  const description =
    verifyQuery.data?.message?.trim() || descriptionByStatus[queryUiStatus]

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
              src={lottieByStatus[queryUiStatus]}
              autoplay
              loop={queryUiStatus === 'success'}
            />
          )}
        </div>

        <h1 className='mt-2 text-[34px] font-bold leading-10 text-blackish sm:text-[46px] sm:leading-[54px]'>
          {titleByStatus[queryUiStatus]}
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
