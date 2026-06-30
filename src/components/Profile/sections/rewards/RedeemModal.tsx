'use client'

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import { X, ChevronLeft } from 'lucide-react'
import ShakeOnError from '@/components/common/ShakeOnError'
import { useRedeemRewards } from '@/hooks/tanstack/rewards'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { toApiError } from '@/api/errorHelpers'
import { formatAmountDigits } from '@/lib/utils/currency'

type RedeemModalProps = {
  isOpen: boolean
  onClose: () => void
  redeemableCoins: number
}

const RedeemModal = ({ isOpen, onClose, redeemableCoins }: RedeemModalProps) => {
  const { openSuccess } = useSuccessModal()
  const redeemMutation = useRedeemRewards()

  const [step, setStep] = useState<1 | 2>(1)
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [pin, setPin] = useState(['', '', '', ''])
  const [pinError, setPinError] = useState('')
  const [apiError, setApiError] = useState('')

  const pinRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setAmount('')
      setAmountError('')
      setPin(['', '', '', ''])
      setPinError('')
      setApiError('')
    }
  }, [isOpen])

  useEffect(() => {
    if (step === 2 && isOpen) {
      requestAnimationFrame(() => {
        pinRefs.current[0]?.focus()
      })
    }
  }, [step, isOpen])

  const handleClose = () => {
    onClose()
  }

  const handleContinue = () => {
    const parsed = parseInt(amount, 10)
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setAmountError('Please enter a valid amount.')
      return
    }
    if (parsed > redeemableCoins) {
      setAmountError(`You can redeem at most ${redeemableCoins} coins.`)
      return
    }
    setAmountError('')
    setStep(2)
  }

  const handlePinChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(0, 1)
    const next = [...pin]
    next[index] = digit
    setPin(next)
    if (pinError) setPinError('')
    if (apiError) setApiError('')
    if (digit && pinRefs.current[index + 1]) {
      pinRefs.current[index + 1]?.focus()
    }
  }

  const handlePinKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !pin[index] && pinRefs.current[index - 1]) {
      pinRefs.current[index - 1]?.focus()
    }
  }

  const handlePinPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!pasted) return
    const next = pasted.split('').slice(0, 4)
    setPin([next[0] || '', next[1] || '', next[2] || '', next[3] || ''])
    if (pinError) setPinError('')
    const targetIndex = Math.min(pasted.length, 4) - 1
    pinRefs.current[targetIndex]?.focus()
  }

  const isPinComplete = pin.every((d) => d.length === 1)

  const handleConfirm = async () => {
    if (!isPinComplete) return
    const parsed = parseInt(amount, 10)
    setApiError('')
    try {
      const result = await redeemMutation.mutateAsync({ amount: parsed, pin: pin.join('') })
      handleClose()
      openSuccess({
        message: `${result.data?.amountRedeemed ?? parsed} coins redeemed! Your wallet has been credited.`,
      })
    } catch (error: unknown) {
      const err = toApiError(error)
      setApiError(err.message || 'Something went wrong. Please try again.')
      setPinError('Incorrect PIN. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={handleClose}
      />
      <div className='relative w-full max-w-[480px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
        <button
          type='button'
          onClick={handleClose}
          className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
          aria-label='Close'
        >
          <span className='text-grey-700'>
            <X className='h-5 w-5' />
          </span>
        </button>

        {step === 1 && (
          <div className='flex flex-col gap-5'>
            <div>
              <h3 className='text-xl font-medium text-blackish'>Redeem Coins</h3>
              <p className='text-sm text-grey-600 mt-1'>
                You have{' '}
                <span className='font-semibold text-grey-900'>{redeemableCoins}</span>{' '}
                redeemable coins available.
              </p>
            </div>

            {apiError && (
              <div className='rounded-xl bg-error-50 border border-error-100 px-4 py-3 text-sm text-error-600'>
                {apiError}
              </div>
            )}

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-medium text-grey-700' htmlFor='redeem-amount'>
                Amount to redeem
              </label>
              <input
                id='redeem-amount'
                type='text'
                inputMode='numeric'
                value={formatAmountDigits(amount)}
                onChange={(e) => {
                  setAmount(e.target.value.replace(/\D/g, ''))
                  if (amountError) setAmountError('')
                }}
                placeholder={`Max ${redeemableCoins.toLocaleString('en-US')}`}
                className='w-full px-3 py-3 border border-grey-50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-300'
              />
              {amountError && (
                <p className='text-xs text-error-500'>{amountError}</p>
              )}
            </div>

            <button
              type='button'
              onClick={handleContinue}
              className='w-full py-3 rounded-[10px] bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors'
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className='flex flex-col items-center gap-5'>
            <div className='w-full'>
              <button
                type='button'
                onClick={() => {
                  setStep(1)
                  setPinError('')
                  setApiError('')
                }}
                className='flex items-center gap-1 text-sm text-grey-600 hover:text-grey-800 mb-3'
              >
                <ChevronLeft className='h-4 w-4' />
                Back
              </button>
              <h3 className='text-xl font-medium text-blackish text-center'>Confirm PIN</h3>
              <p className='text-sm text-grey-600 text-center mt-1'>
                Enter your 4-digit PIN to complete the redemption
              </p>
            </div>

            {apiError && (
              <div className='w-full rounded-xl bg-error-50 border border-error-100 px-4 py-3 text-sm text-error-600'>
                {apiError}
              </div>
            )}

            <ShakeOnError active={Boolean(pinError)} className='w-full'>
              <div className='flex items-center justify-center gap-3'>
                {pin.map((value, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      pinRefs.current[index] = el
                    }}
                    value={value}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    onPaste={handlePinPaste}
                    className={`w-12 h-12 border rounded-xl text-center text-xl font-bold focus:outline-none ${
                      pinError
                        ? 'border-error-400 focus:ring-1 focus:ring-error-200'
                        : 'border-grey-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-300'
                    }`}
                    type='password'
                    inputMode='numeric'
                    maxLength={1}
                  />
                ))}
              </div>
              {pinError && (
                <p className='text-xs text-error-500 text-center mt-2'>{pinError}</p>
              )}
            </ShakeOnError>

            <div className='flex items-center gap-3 w-full'>
              <button
                type='button'
                onClick={() => {
                  setStep(1)
                  setPinError('')
                  setApiError('')
                }}
                className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
              >
                Go Back
              </button>
              <button
                type='button'
                onClick={() => void handleConfirm()}
                disabled={!isPinComplete || redeemMutation.isPending}
                className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
                  isPinComplete && !redeemMutation.isPending
                    ? 'bg-primary-500 hover:bg-primary-600'
                    : 'bg-primary-200 cursor-not-allowed'
                }`}
              >
                {redeemMutation.isPending ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RedeemModal
