'use client'

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import { useRouter } from 'next/navigation'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackLeftIcon from '@/assets/icons/BackLeftIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ShakeOnError from '@/components/common/ShakeOnError'
import { useSuccessModal } from '@/context/SuccessModalContext'
import { useWithdrawFromWallet } from '@/hooks/tanstack/wallet'
import { toApiError } from '@/api/errorHelpers'
import { CURRENCY_WITHDRAWAL_LIMITS } from '@/lib/constants/payments'
import { formatCurrency } from '@/lib/utils/currency'
import { maskAccountNumber } from './utils'

const formatAmount = (value: string) => {
  if (!value) return ''
  const numeric = value.replace(/\D/g, '')
  if (!numeric) return ''
  return Number(numeric).toLocaleString('en-US')
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  helper,
  formatAsAmount = false,
  isError = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  helper?: string
  formatAsAmount?: boolean
  isError?: boolean
}) => (
  <div>
    <label className='text-sm font-medium mb-2 block'>{label}</label>
    <input
      type={formatAsAmount ? 'text' : type}
      value={formatAsAmount ? formatAmount(value) : value}
      onChange={(event) => {
        if (formatAsAmount) {
          onChange(event.target.value.replace(/\D/g, ''))
          return
        }
        onChange(event.target.value)
      }}
      inputMode={formatAsAmount ? 'numeric' : undefined}
      placeholder={placeholder}
      className={`w-full px-3 py-3.5 border rounded-lg outline-hidden focus:outline-hidden text-sm text-blackish font-medium ${
        isError
          ? 'border-error-400 focus:border-error-400'
          : 'border-grey-50 focus:border-primary-500'
      }`}
    />
    {helper && <p className='text-xs text-grey-500 mt-1'>{helper}</p>}
  </div>
)

type WalletWithdrawModalProps = {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  currency: string
  bankAccounts: Array<{
    id: string
    label: string
    bankName: string
    accountNumber: string
    accountName: string
  }>
  defaultBankId?: string
  isLoadingBanks: boolean
}

const WITHDRAWAL_ERROR_MESSAGE =
  'Unable to initiate withdrawal. Please try again.'

const WalletWithdrawModal = ({
  isOpen,
  onClose,
  availableBalance,
  currency,
  bankAccounts,
  defaultBankId,
  isLoadingBanks,
}: WalletWithdrawModalProps) => {
  const router = useRouter()
  const { openSuccess } = useSuccessModal()
  const withdrawMutation = useWithdrawFromWallet()
  const [step, setStep] = useState<'form' | 'pin'>('form')
  const [amountInput, setAmountInput] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [pin, setPin] = useState(['', '', '', ''])
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const pinRefs = useRef<Array<HTMLInputElement | null>>([])

  const amountValue = Number(amountInput)
  const withdrawalLimits =
    CURRENCY_WITHDRAWAL_LIMITS[currency] ?? CURRENCY_WITHDRAWAL_LIMITS.USD
  // Processing fee is temporarily disabled.
  const fee = 0
  const receiveAmount = Math.max(amountValue - fee, 0)
  const isBelowMinimum = amountValue > 0 && amountValue < withdrawalLimits.min
  const isAboveMaximum = amountValue > withdrawalLimits.max
  const isInsufficient = amountValue > availableBalance
  const insufficientBalanceMessage = isInsufficient
    ? `You have less than ${formatCurrency(amountValue, {
        currency,
        maximumFractionDigits: 0,
      })} in your account`
    : undefined
  const hasConnectedBanks = bankAccounts.length > 0
  const effectiveSelectedBank =
    selectedBank || defaultBankId || bankAccounts[0]?.id || ''
  const selectedBankDetails = bankAccounts.find(
    (bank) => bank.id === effectiveSelectedBank
  )
  const isContinueDisabled =
    amountValue <= 0 ||
    !effectiveSelectedBank ||
    !hasConnectedBanks ||
    isInsufficient ||
    isBelowMinimum ||
    isAboveMaximum
  const isPinComplete = pin.every((digit) => digit.length === 1)
  const errorMessage = withdrawMutation.isError
    ? toApiError(withdrawMutation.error).message || WITHDRAWAL_ERROR_MESSAGE
    : undefined
  const withdrawalApiError = withdrawMutation.isError
    ? toApiError(withdrawMutation.error)
    : null
  const showKycCta = Boolean(
    withdrawalApiError &&
      (withdrawalApiError.code === 'FORBIDDEN' ||
        withdrawalApiError.message
          .toLowerCase()
          .includes('verify your identity') ||
        withdrawalApiError.message.toLowerCase().includes('kyc') ||
        withdrawalApiError.message.toLowerCase().includes('nin') ||
        withdrawalApiError.message.toLowerCase().includes('bvn'))
  )
  const isPinError = errorMessage?.toLowerCase().includes('pin') ?? false
  const pinErrorMessage = isPinError ? errorMessage : undefined
  const formErrorMessage = isPinError ? undefined : errorMessage

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return

    const syncPinUiByViewport = () => {
      const isMobileViewport = window.innerWidth < 1024

      if (isMobileViewport && step === 'pin' && !isPinModalOpen) {
        setIsPinModalOpen(true)
      }

      if (!isMobileViewport && isPinModalOpen) {
        setIsPinModalOpen(false)
        setStep('pin')
      }
    }

    syncPinUiByViewport()
    window.addEventListener('resize', syncPinUiByViewport)
    return () => window.removeEventListener('resize', syncPinUiByViewport)
  }, [isOpen, isPinModalOpen, step])

  const handleClose = () => {
    onClose()
    setStep('form')
    setAmountInput('')
    setSelectedBank('')
    setPin(['', '', '', ''])
    setIsPinModalOpen(false)
    withdrawMutation.reset()
  }

  const handlePinChange = (index: number, value: string) => {
    const next = [...pin]
    next[index] = value.replace(/[^0-9]/g, '').slice(0, 1)
    setPin(next)
    withdrawMutation.reset()
    if (value && pinRefs.current[index + 1]) {
      pinRefs.current[index + 1]?.focus()
    }
  }

  const handlePinKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === 'Backspace' &&
      !pin[index] &&
      pinRefs.current[index - 1]
    ) {
      pinRefs.current[index - 1]?.focus()
    }
  }

  const handlePinPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4)
    if (!pasted) return
    const next = pasted.split('').slice(0, 4)
    setPin([next[0] || '', next[1] || '', next[2] || '', next[3] || ''])
    withdrawMutation.reset()
    const targetIndex = Math.min(pasted.length, 4) - 1
    pinRefs.current[targetIndex]?.focus()
  }

  const openPinStep = () => {
    withdrawMutation.reset()
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsPinModalOpen(true)
      return
    }
    setStep('pin')
  }

  const handleWithdrawSubmit = async () => {
    if (!isPinComplete || withdrawMutation.isPending) return
    try {
      const response = await withdrawMutation.mutateAsync({
        amount: amountValue,
        bankId: effectiveSelectedBank,
        pin: pin.join(''),
      })
      openSuccess({
        message:
          response.data?.message ||
          response.message ||
          'Withdrawal initiated successfully.',
      })
      handleClose()
    } catch (error: unknown) {
      const apiErrorMessage = toApiError(error).message?.toLowerCase() ?? ''
      setPin(['', '', '', ''])
      pinRefs.current[0]?.focus()
      const shouldReturnToForm = !apiErrorMessage.includes('pin')
      if (shouldReturnToForm) {
        setStep('form')
        setIsPinModalOpen(false)
      }
    }
  }

  const headerTitle = step === 'pin' ? 'Confirmation' : 'Withdraw Funds'
  const headerSubtitle =
    step === 'pin'
      ? 'Provide your account PIN to move forward'
      : `Available balance: ${formatCurrency(availableBalance, {
          currency,
          maximumFractionDigits: 0,
        })}`

  const renderActions = () => {
    if (step === 'pin') {
      return (
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => {
              setStep('form')
            }}
            className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
          >
            Go Back
          </button>
          <button
            type='button'
            disabled={!isPinComplete || withdrawMutation.isPending}
            onClick={handleWithdrawSubmit}
            className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
              isPinComplete && !withdrawMutation.isPending
                ? 'bg-primary-500 hover:bg-primary-600'
                : 'bg-primary-200 cursor-not-allowed'
            }`}
          >
            {withdrawMutation.isPending ? 'Processing...' : 'Confirm Withdrawal'}
          </button>
        </div>
      )
    }

    return (
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={handleClose}
          className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
        >
          Cancel
        </button>
        <button
          type='button'
          disabled={isContinueDisabled}
          onClick={openPinStep}
          className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
            isContinueDisabled
              ? 'bg-primary-200 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
        >
          Continue
        </button>
      </div>
    )
  }

  const stepContent = (showActions = true) => {
    if (step === 'pin') {
      if (!showActions) return null
      return (
        <div className='space-y-4'>
          <div className='flex items-center justify-center gap-3'>
            {pin.map((value, index) => (
              <input
                key={index}
                ref={(el) => {
                  pinRefs.current[index] = el
                }}
                value={value}
                onChange={(event) => handlePinChange(index, event.target.value)}
                onKeyDown={(event) => handlePinKeyDown(index, event)}
                onPaste={handlePinPaste}
                className={`w-12 h-12 border rounded-[8px] text-center text-lg font-medium text-blackish focus:outline-none focus:ring-0 ${
                  pinErrorMessage
                    ? 'border-error-400 focus:border-error-400'
                    : 'border-grey-100 focus:border-primary-300'
                }`}
                type='password'
                inputMode='numeric'
                maxLength={1}
              />
            ))}
          </div>
          <ShakeOnError active={Boolean(pinErrorMessage)}>
            {pinErrorMessage ? (
              <p className='text-xs text-error-500 text-center'>
                {pinErrorMessage}
              </p>
            ) : null}
          </ShakeOnError>
          {showActions ? renderActions() : null}
        </div>
      )
    }

    return (
      <div className='space-y-4'>
        <InputField
          label='Amount to Withdraw'
          value={amountInput}
          onChange={(value) => {
            setAmountInput(value)
            withdrawMutation.reset()
          }}
          placeholder='0.00'
          formatAsAmount
          isError={isInsufficient || isBelowMinimum || isAboveMaximum}
          helper={
            isBelowMinimum
              ? `Minimum withdrawal amount is ${
                  withdrawalLimits.label
                }${withdrawalLimits.min.toLocaleString('en-US')}`
              : isAboveMaximum
              ? `Maximum withdrawal amount is ${
                  withdrawalLimits.label
                }${withdrawalLimits.max.toLocaleString('en-US')}`
              : undefined
          }
        />
        <ShakeOnError active={Boolean(insufficientBalanceMessage)}>
          {insufficientBalanceMessage ? (
            <p className='text-xs text-error-500 -mt-2'>
              {insufficientBalanceMessage}
            </p>
          ) : null}
        </ShakeOnError>
        <div className='space-y-2'>
          <label className='text-xs text-grey-700'>Select Bank Account</label>
          <Select
            value={effectiveSelectedBank}
            onValueChange={(value) => {
              setSelectedBank(value)
              withdrawMutation.reset()
            }}
            disabled={isLoadingBanks || !hasConnectedBanks}
          >
            <SelectTrigger className='w-full border-grey-100 rounded-[10px] text-sm text-blackish font-medium h-[44px]! shadow-none! bg-white'>
              <SelectValue
                placeholder={
                  isLoadingBanks
                    ? 'Loading bank accounts...'
                    : hasConnectedBanks
                    ? 'Select an option'
                    : 'No bank accounts available'
                }
              />
            </SelectTrigger>
            <SelectContent className='rounded-[12px] border-grey-50'>
              {bankAccounts.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  {bank.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedBankDetails ? (
          <div className='bg-[#F7FAFF] border border-grey-50 rounded-[10px] p-3 text-xs text-grey-600 space-y-2'>
            <div className='flex items-center justify-between gap-3'>
              <span>Bank:</span>
              <span className='font-medium text-grey-900 text-right'>
                {selectedBankDetails.bankName}
              </span>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span>Account number:</span>
              <span className='font-medium text-grey-900 text-right'>
                {maskAccountNumber(selectedBankDetails.accountNumber)}
              </span>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span>Account name:</span>
              <span className='font-medium text-grey-900 text-right'>
                {selectedBankDetails.accountName}
              </span>
            </div>
          </div>
        ) : null}
        {amountValue > 0 && (
          <div className='bg-[#F7FAFF] border border-grey-50 rounded-[10px] p-3 text-xs text-grey-600 space-y-2'>
            <div className='flex items-center justify-between'>
              <span>Withdrawal amount:</span>
              <span className='font-medium text-grey-800'>
                {formatCurrency(amountValue, {
                  currency,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Processing fee:</span>
              <span className='font-medium text-grey-800'>
                -
                {formatCurrency(fee, {
                  currency,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>You will receive:</span>
              <span className='font-medium text-grey-900'>
                {formatCurrency(receiveAmount, {
                  currency,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
        )}
        {formErrorMessage ? (
          <div className='space-y-2'>
            <p className='text-xs text-error-500'>{formErrorMessage}</p>
            {showKycCta ? (
              <button
                type='button'
                onClick={() => {
                  onClose()
                  withdrawMutation.reset()
                  router.push('/profile?modal=kyc&source=wallet')
                }}
                className='text-xs font-medium text-primary-500 underline underline-offset-2'
              >
                Complete verification
              </button>
            ) : null}
          </div>
        ) : null}
        {showActions ? renderActions() : null}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 ${isPinModalOpen ? 'z-60' : 'z-30'} lg:z-50`}
    >
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm hidden lg:block'
        onClick={handleClose}
      />

      <div className='hidden lg:flex items-center justify-center h-full px-4'>
        <div className='relative w-full max-w-[500px] max-h-[90vh] overflow-hidden rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] flex flex-col gap-3'>
          <div className='px-6 sm:px-10 pt-12 pb-3 bg-white sticky top-0 z-10 text-center'>
            <button
              type='button'
              onClick={handleClose}
              className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
              aria-label='Close'
            >
              <span className='text-grey-700 w-6 h-6'>
                <CloseIcon />
              </span>
            </button>
            <h3 className='text-2xl font-medium text-blackish'>
              {headerTitle}
            </h3>
            {headerSubtitle ? (
              <p className='text-sm text-grey-600 max-w-[356px] mx-auto mt-1'>
                {headerSubtitle}
              </p>
            ) : null}
          </div>
          <div className='px-6 sm:px-10 pb-12 overflow-y-auto flex-1 min-h-0'>
            {stepContent()}
          </div>
        </div>
      </div>

      <div className='lg:hidden fixed inset-x-0 bottom-0 top-[72.5px] bg-white'>
        <div className='flex flex-col h-full'>
          <div className='pt-8 pb-4 px-4'>
            <div className='flex flex-col gap-3'>
              <button
                type='button'
                onClick={handleClose}
                className='w-6 h-6'
                aria-label='Go back'
              >
                <span className='text-blackish hover:text-black/70 flex'>
                  <BackLeftIcon />
                </span>
              </button>
              <div className='flex flex-col items-center justify-center gap-1'>
                <span className='text-2xl font-medium text-blackish'>
                  {headerTitle}
                </span>
                {headerSubtitle ? (
                  <p className='text-sm text-grey-600 text-center'>
                    {headerSubtitle}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto px-4 pb-4'>
            {stepContent(false)}
          </div>
          <div className='px-4 py-3 shadow-[0px_-10px_18px_5px_#4040401A] bg-white'>
            {renderActions()}
          </div>
        </div>
      </div>

      {isPinModalOpen && (
        <div className='fixed inset-0 z-70 lg:hidden flex items-center justify-center px-4'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => {
              setIsPinModalOpen(false)
              setStep('form')
            }}
          />
          <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
            <button
              type='button'
              onClick={() => {
                setIsPinModalOpen(false)
                setStep('form')
              }}
              className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
              aria-label='Close'
            >
              <span className='text-grey-700 w-6 h-6'>
                <CloseIcon />
              </span>
            </button>
            <div className='flex flex-col items-center text-center gap-4'>
              <div>
                <h3 className='text-xl font-medium text-blackish'>
                  Confirmation
                </h3>
                <p className='text-sm text-grey-600'>
                  Provide your account PIN to move forward
                </p>
              </div>
              <div className='flex items-center justify-center gap-3'>
                {pin.map((value, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      pinRefs.current[index] = el
                    }}
                    value={value}
                    onChange={(event) =>
                      handlePinChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handlePinKeyDown(index, event)}
                    onPaste={handlePinPaste}
                    className={`w-12 h-12 border rounded-[8px] text-center text-lg font-medium text-blackish focus:outline-none ${
                      pinErrorMessage
                        ? 'border-error-400 focus:ring-1 focus:ring-error-200'
                        : 'border-grey-100 focus:ring-1 focus:ring-primary-300'
                    }`}
                    type='password'
                    inputMode='numeric'
                    maxLength={1}
                  />
                ))}
              </div>
              <div className='flex items-center gap-3 w-full'>
                <button
                  type='button'
                  onClick={() => {
                    setIsPinModalOpen(false)
                    setStep('form')
                  }}
                  className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
                >
                  Go Back
                </button>
                <button
                  type='button'
                  disabled={!isPinComplete || withdrawMutation.isPending}
                  onClick={handleWithdrawSubmit}
                  className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
                    isPinComplete && !withdrawMutation.isPending
                      ? 'bg-primary-500 hover:bg-primary-600'
                      : 'bg-primary-200 cursor-not-allowed'
                  }`}
                >
                  {withdrawMutation.isPending ? 'Processing...' : 'Confirm'}
                </button>
              </div>
              <ShakeOnError
                active={Boolean(pinErrorMessage)}
                className='w-full'
              >
                {pinErrorMessage ? (
                  <p className='text-xs text-error-500'>{pinErrorMessage}</p>
                ) : null}
              </ShakeOnError>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletWithdrawModal
