import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import ShakeOnError from '@/components/common/ShakeOnError'
import { formatCurrency } from '@/lib/utils/currency'
import type { GuestDetails } from './types'

type PaymentBreakdownItem = {
  id: string
  title: string
  quantityLabel: string
  amount: number
}

type PaymentStepContentProps = {
  selectedCount: number
  breakdownItems: PaymentBreakdownItem[]
  currency: string
  total: number
  serviceCharge: number
  isAuthenticated: boolean
  isSubmitting: boolean
  guestDetails: GuestDetails
  guestErrors: { fullName?: string; email?: string }
  paymentError: string
  cashAmountInputs: Record<string, string>
  onChangeGuestDetails: (field: keyof GuestDetails, value: string) => void
  onExternalPay: () => void
  onWalletPay: () => void
  onRequestWalletSignIn?: (payload: {
    step: 'payment'
    cashAmountInputs: Record<string, string>
  }) => void
  onGoBack: () => void
}

export default function PaymentStepContent({
  selectedCount,
  breakdownItems,
  currency,
  total,
  serviceCharge,
  isAuthenticated,
  isSubmitting,
  guestDetails,
  guestErrors,
  paymentError,
  cashAmountInputs,
  onChangeGuestDetails,
  onExternalPay,
  onWalletPay,
  onRequestWalletSignIn,
  onGoBack,
}: PaymentStepContentProps) {
  const [showPaymentBreakdown, setShowPaymentBreakdown] = useState(false)

  return (
    <>
      <div className='rounded-[10px] border border-grey-100 bg-white p-3'>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-sm text-grey-700'>
            Paying for {selectedCount} {selectedCount === 1 ? 'item' : 'items'}
          </p>
          <p className='text-base font-semibold text-grey-900'>
            {formatCurrency(total, {
              currency,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <button
          type='button'
          onClick={() => setShowPaymentBreakdown((prev) => !prev)}
          className='mt-2 inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700'
        >
          {showPaymentBreakdown ? 'Hide breakdown' : 'Show breakdown'}
          <ChevronDown
            className={`size-3 transition-transform ${
              showPaymentBreakdown ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showPaymentBreakdown ? (
          <div className='mt-3 space-y-2 border-t border-grey-100 pt-3'>
            {breakdownItems.map((item) => (
              <div
                key={`payment-breakdown-${item.id}`}
                className='flex items-center justify-between gap-2'
              >
                <p className='truncate text-xs text-grey-700'>
                  {item.title}
                  {item.quantityLabel}
                </p>
                <p className='text-xs font-medium text-grey-900'>
                  {formatCurrency(item.amount, {
                    currency,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            ))}
            <div className='flex items-center justify-between gap-2 pt-2 border-t border-grey-100'>
              <p className='text-xs text-grey-700'>Service charge</p>
              <p className='text-xs font-medium text-grey-900'>
                {formatCurrency(serviceCharge, {
                  currency,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {paymentError ? (
        <ShakeOnError active={true}>
          <div className='rounded-[8px] border border-error-100 bg-error-50/70 px-3 py-2'>
            <p className='text-xs text-error-400'>{paymentError}</p>
          </div>
        </ShakeOnError>
      ) : null}

      {!isAuthenticated ? (
        <div className='rounded-[10px] border border-grey-100 p-3 space-y-3'>
          <p className='text-sm font-medium text-grey-900'>Your details</p>
          <div>
            <label className='text-xs text-grey-600'>Full name</label>
            <input
              type='text'
              value={guestDetails.fullName}
              onChange={(event) =>
                onChangeGuestDetails('fullName', event.target.value)
              }
              className={`mt-1 h-11 w-full rounded-[10px] border px-3 text-sm text-grey-900 outline-none ${
                guestErrors.fullName
                  ? 'border-error-300'
                  : 'border-grey-100 focus:border-primary-300'
              }`}
              placeholder='Enter full name'
            />
            {guestErrors.fullName ? (
              <ShakeOnError active={true}>
                <p className='mt-1 text-xs text-error-300'>
                  {guestErrors.fullName}
                </p>
              </ShakeOnError>
            ) : null}
          </div>
          <div>
            <label className='text-xs text-grey-600'>Email address</label>
            <input
              type='email'
              value={guestDetails.email}
              onChange={(event) =>
                onChangeGuestDetails('email', event.target.value)
              }
              className={`mt-1 h-11 w-full rounded-[10px] border px-3 text-sm text-grey-900 outline-none ${
                guestErrors.email
                  ? 'border-error-300'
                  : 'border-grey-100 focus:border-primary-300'
              }`}
              placeholder='Enter email address'
            />
            {guestErrors.email ? (
              <ShakeOnError active={true}>
                <p className='mt-1 text-xs text-error-300'>
                  {guestErrors.email}
                </p>
              </ShakeOnError>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className='rounded-[10px] border border-grey-100 p-3 space-y-2'>
        {isAuthenticated ? (
          <p className='text-sm font-medium text-grey-900'>
            Choose payment method
          </p>
        ) : null}
        <button
          type='button'
          onClick={onExternalPay}
          disabled={isSubmitting || selectedCount === 0}
          className='w-full rounded-[10px] border border-grey-200 bg-grey-50 px-3 py-3 text-center transition-colors enabled:hover:bg-grey-100 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <p className='text-sm font-medium text-grey-900'>
            {isSubmitting ? 'Processing...' : 'Pay with Card or Bank Transfer'}
          </p>
        </button>
        {isAuthenticated ? (
          <button
            type='button'
            onClick={onWalletPay}
            disabled={isSubmitting || selectedCount === 0}
            className='w-full rounded-[10px] border border-primary-500 bg-linear-to-b from-primary-400 to-primary-600 px-3 py-3 text-white transition-colors enabled:hover:from-primary-500 enabled:hover:to-primary-700 disabled:opacity-55 disabled:cursor-not-allowed'
          >
            <p className='text-sm font-medium inline-flex w-full items-center justify-center gap-2'>
              <Image
                src='/assets/images/logo/icon-color-white.svg'
                alt='Giftseon'
                width={16}
                height={16}
                className='h-4 w-4'
              />
              Pay with Giftseon
            </p>
          </button>
        ) : (
          <>
            <p className='text-center text-xs text-grey-500 py-1'>OR</p>
            <button
              type='button'
              onClick={() => {
                onRequestWalletSignIn?.({
                  step: 'payment',
                  cashAmountInputs,
                })
              }}
              className='w-full rounded-[10px] border border-primary-500 bg-linear-to-b from-primary-400 to-primary-600 px-3 py-3 text-white transition-colors hover:from-primary-500 hover:to-primary-700'
            >
              <p className='text-sm font-medium inline-flex w-full items-center justify-center gap-2'>
                <Image
                  src='/assets/images/logo/icon-color-white.svg'
                  alt='Giftseon'
                  width={16}
                  height={16}
                  className='h-4 w-4'
                />
                Sign in to pay with Giftseon
              </p>
            </button>
          </>
        )}
      </div>

      <div className='text-center'>
        <button
          type='button'
          onClick={onGoBack}
          className='inline-flex items-center justify-center text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors duration-300'
        >
          Go back
        </button>
      </div>
    </>
  )
}
