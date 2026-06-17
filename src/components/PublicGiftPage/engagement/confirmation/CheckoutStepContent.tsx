import CashIcon from '@/assets/icons/CashIcon'
import ShakeOnError from '@/components/common/ShakeOnError'
import { formatCurrency } from '@/lib/utils/currency'
import GiftItemRow from '../GiftItemRow'
import type { GiftOption } from '../types'
import type { GuestDetails } from './types'
import { formatAmountDigits, getDefaultCashAmount } from './helpers'

type CheckoutStepContentProps = {
  selectedGiftItems: GiftOption[]
  giftQuantities: Record<string, number>
  currency: string
  cashAmountInputs: Record<string, string>
  cashAmountErrors: Record<string, string>
  onCashAmountChange: (item: GiftOption, raw: string) => void
  onChangeGiftQuantity: (giftId: string, direction: 'inc' | 'dec') => void
  giftsTotal: number
  serviceCharge: number
  isAuthenticated: boolean
  selectedMethod: 'card' | 'wallet' | null
  onSelectMethod: (method: 'card' | 'wallet') => void
  guestDetails: GuestDetails
  guestErrors: { fullName?: string; email?: string }
  onChangeGuestDetails: (field: keyof GuestDetails, value: string) => void
  paymentError: string
  onRequestWalletSignIn?: (payload: {
    step: 'checkout'
    cashAmountInputs: Record<string, string>
  }) => void
}

export default function CheckoutStepContent({
  selectedGiftItems,
  giftQuantities,
  currency,
  cashAmountInputs,
  cashAmountErrors,
  onCashAmountChange,
  onChangeGiftQuantity,
  giftsTotal,
  serviceCharge,
  isAuthenticated,
  selectedMethod,
  onSelectMethod,
  guestDetails,
  guestErrors,
  onChangeGuestDetails,
  paymentError,
  onRequestWalletSignIn,
}: CheckoutStepContentProps) {
  const cardTotal = giftsTotal + serviceCharge
  const walletTotal = giftsTotal

  return (
    <>
      {/* Gift items */}
      <div className='overflow-hidden rounded-[8px] border border-grey-50 shadow-[0px_1.5px_4px_-1px_#10192812] py-4 px-3 flex flex-col gap-4'>
        {selectedGiftItems.length > 0 ? (
          selectedGiftItems.map((item) =>
            item.kind === 'cash' ? (
              <div
                key={item.id}
                className='flex items-start gap-2 border-b border-grey-50 last:border-b-0 pb-4 last:pb-0'
              >
                <div className='flex gap-2 w-full'>
                  <span className='flex h-15 w-15 rounded-[4px] border border-primary-100 bg-primary-50 p-2 text-primary-700 items-center justify-center'>
                    <CashIcon />
                  </span>
                  <div className='min-w-0 h-full flex-1 flex flex-col justify-between gap-2'>
                    <div className='flex items-center justify-between gap-2'>
                      <p className='truncate text-sm leading-[120%] text-grey-600'>
                        {item.title}
                      </p>
                      <label className='shrink-0 text-xs text-grey-600 font-medium'>
                        Enter amount
                      </label>
                    </div>
                    <div
                      className={`mt-1 flex h-11 w-full items-center rounded-[10px] border px-3 ${
                        cashAmountErrors[item.id]
                          ? 'border-error-300'
                          : 'border-grey-100 focus-within:border-primary-300'
                      }`}
                    >
                      <span className='text-sm text-grey-500 mr-2'>₦</span>
                      <input
                        type='text'
                        inputMode='numeric'
                        value={formatAmountDigits(
                          cashAmountInputs[item.id] ?? getDefaultCashAmount(item)
                        )}
                        onChange={(event) =>
                          onCashAmountChange(item, event.target.value)
                        }
                        placeholder='0'
                        className='h-full w-full bg-transparent text-sm text-grey-900 outline-none'
                      />
                    </div>
                    {cashAmountErrors[item.id] ? (
                      <ShakeOnError active={true}>
                        <p className='mt-1 text-xs text-error-300'>
                          {cashAmountErrors[item.id]}
                        </p>
                      </ShakeOnError>
                    ) : (
                      <p className='mt-1 text-xs text-grey-500'>
                        Minimum:{' '}
                        {formatCurrency(Math.max(0, item.minimumAmount ?? 0), {
                          currency,
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <GiftItemRow
                key={item.id}
                item={item}
                currency={currency}
                quantity={giftQuantities[item.id] ?? item.quantity}
                showControls={true}
                maxQuantity={item.quantity}
                onDecrease={() => onChangeGiftQuantity(item.id, 'dec')}
                onIncrease={() => onChangeGiftQuantity(item.id, 'inc')}
              />
            )
          )
        ) : (
          <div className='px-4 py-6 text-center text-sm text-grey-500'>
            No gift items selected.
          </div>
        )}
      </div>

      {/* Payment method selection */}
      <div className='space-y-2'>
        <p className='text-sm font-medium text-grey-900'>
          {isAuthenticated ? 'How would you like to pay?' : 'Payment'}
        </p>

        {/* Card option */}
        <button
          type='button'
          onClick={() => onSelectMethod('card')}
          className={`w-full rounded-[12px] border p-3.5 text-left transition-all duration-200 ${
            selectedMethod === 'card'
              ? 'border-primary-400 bg-primary-50/40'
              : 'border-grey-200 bg-white hover:border-grey-300 hover:bg-grey-50/50'
          }`}
        >
          <div className='flex items-center gap-3'>
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                selectedMethod === 'card'
                  ? 'border-primary-500'
                  : 'border-grey-300'
              }`}
            >
              {selectedMethod === 'card' ? (
                <div className='h-2 w-2 rounded-full bg-primary-500' />
              ) : null}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium text-grey-900'>
                Card or Bank Transfer
              </p>
              <p className='mt-0.5 text-xs text-grey-500'>
                {formatCurrency(cardTotal, {
                  currency,
                  maximumFractionDigits: 0,
                })}{' '}
                · includes{' '}
                {formatCurrency(serviceCharge, {
                  currency,
                  maximumFractionDigits: 0,
                })}{' '}
                service fee
              </p>
            </div>
          </div>
        </button>

        {/* Wallet option — authenticated users */}
        {isAuthenticated ? (
          <button
            type='button'
            onClick={() => onSelectMethod('wallet')}
            className={`w-full rounded-[12px] border p-3.5 text-left transition-all duration-200 ${
              selectedMethod === 'wallet'
                ? 'border-primary-400 bg-primary-50/40'
                : 'border-grey-200 bg-white hover:border-grey-300 hover:bg-grey-50/50'
            }`}
          >
            <div className='flex items-center gap-3'>
              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                  selectedMethod === 'wallet'
                    ? 'border-primary-500'
                    : 'border-grey-300'
                }`}
              >
                {selectedMethod === 'wallet' ? (
                  <div className='h-2 w-2 rounded-full bg-primary-500' />
                ) : null}
              </div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <p className='text-sm font-medium text-grey-900'>
                    Giftseon Wallet
                  </p>
                  {serviceCharge > 0 ? (
                    <span className='inline-flex items-center rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-semibold text-secondary-700'>
                      Save{' '}
                      {formatCurrency(serviceCharge, {
                        currency,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  ) : null}
                </div>
                <p className='mt-0.5 text-xs text-grey-500'>
                  {formatCurrency(walletTotal, {
                    currency,
                    maximumFractionDigits: 0,
                  })}{' '}
                  · No service fee
                </p>
              </div>
            </div>
          </button>
        ) : null}

        {/* Sign-in prompt for guests */}
        {!isAuthenticated && onRequestWalletSignIn ? (
          <button
            type='button'
            onClick={() =>
              onRequestWalletSignIn({ step: 'checkout', cashAmountInputs })
            }
            className='w-full rounded-[12px] border border-dashed border-primary-300 p-3.5 text-left transition-colors duration-200 hover:bg-primary-50/30'
          >
            <div className='flex items-center gap-3'>
              <div className='flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-grey-200' />
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <p className='text-sm font-medium text-primary-600'>
                    Sign in to use Giftseon Wallet
                  </p>
                  {serviceCharge > 0 ? (
                    <span className='inline-flex items-center rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-semibold text-secondary-700'>
                      Save{' '}
                      {formatCurrency(serviceCharge, {
                        currency,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  ) : null}
                </div>
                <p className='mt-0.5 text-xs text-grey-500'>No service fee</p>
              </div>
            </div>
          </button>
        ) : null}
      </div>

      {/* Guest details — shown when not authenticated and card is selected */}
      {!isAuthenticated && selectedMethod === 'card' ? (
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

      {/* Payment error */}
      {paymentError ? (
        <ShakeOnError active={true}>
          <div className='rounded-[8px] border border-error-100 bg-error-50/70 px-3 py-2'>
            <p className='text-xs text-error-400'>{paymentError}</p>
          </div>
        </ShakeOnError>
      ) : null}
    </>
  )
}
