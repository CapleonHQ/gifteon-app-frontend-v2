'use client'

import TransactionPinOtpField from './TransactionPinOtpField'

type SetPinRequiredModalProps = {
  isOpen: boolean
  pin: string
  confirmPin: string
  onPinChange: (value: string) => void
  onConfirmPinChange: (value: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
  errorMessage?: string
}

const SetPinRequiredModal = ({
  isOpen,
  pin,
  confirmPin,
  onPinChange,
  onConfirmPinChange,
  onSubmit,
  isSubmitting = false,
  errorMessage = '',
}: SetPinRequiredModalProps) => {
  const isValidPin = pin.length === 4
  const isValidConfirmPin = confirmPin.length === 4
  const hasPinMismatch = isValidPin && isValidConfirmPin && pin !== confirmPin
  const canSubmit =
    isValidPin && isValidConfirmPin && !hasPinMismatch && !isSubmitting
  const inlineErrorMessage = hasPinMismatch
    ? 'Transaction PINs do not match.'
    : errorMessage

  const header = (
    <div className='text-center mt-3 lg:mt-0'>
      <h3 className='text-2xl font-semibold text-blackish'>
        Set Your Transaction PIN
      </h3>
      <p className='text-sm text-grey-600 mt-1'>
        Create a 4-digit transaction PIN to authorize sensitive actions on your
        account.
      </p>
    </div>
  )

  const body = (
    <div className='space-y-4'>
      <TransactionPinOtpField
        label='New Transaction PIN'
        value={pin}
        onChange={onPinChange}
      />

      <TransactionPinOtpField
        label='Confirm Transaction PIN'
        value={confirmPin}
        onChange={onConfirmPinChange}
      />

      {inlineErrorMessage ? (
        <p className='text-xs text-error-500'>{inlineErrorMessage}</p>
      ) : null}
    </div>
  )

  const footer = (
    <button
      type='button'
      onClick={onSubmit}
      disabled={!canSubmit}
      className='w-full py-3 rounded-[12px] bg-linear-to-b from-primary-400 from-[17.5%] to-primary-600 border border-primary-500 enabled:hover:from-primary-600 enabled:hover:to-primary-600 text-white font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {isSubmitting ? 'Setting PIN...' : 'Set PIN'}
    </button>
  )

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-60'>
      <div className='absolute inset-0 bg-black/45 backdrop-blur-md' />
      <div className='relative h-full w-full flex items-center justify-center px-4'>
        <div className='w-full max-w-[420px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852]'>
          <div className='px-6 sm:px-10 pt-10 pb-4'>{header}</div>
          <div className='px-6 sm:px-10 pb-8'>{body}</div>
          <div className='px-6 sm:px-10 pb-8'>{footer}</div>
        </div>
      </div>
    </div>
  )
}

export default SetPinRequiredModal
