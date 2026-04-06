import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import CloseIcon from '@/assets/icons/CloseIcon'
import ResponsiveModal from '@/components/common/ResponsiveModal'
import ShakeOnError from '@/components/common/ShakeOnError'

type CheckoutPinModalProps = {
  isOpen: boolean
  pinError: string
  isSubmitting: boolean
  onClose: () => void
  onConfirm: (pin: string) => Promise<void>
  onClearError: () => void
}

export default function CheckoutPinModal({
  isOpen,
  pinError,
  isSubmitting,
  onClose,
  onConfirm,
  onClearError,
}: CheckoutPinModalProps) {
  const [pin, setPin] = useState(['', '', '', ''])
  const pinRefs = useRef<Array<HTMLInputElement | null>>([])
  const isPinComplete = pin.every((digit) => digit.length === 1)

  useEffect(() => {
    if (!isOpen) return

    requestAnimationFrame(() => {
      const firstEmptyIndex = pinRefs.current.findIndex((input) => !input?.value)
      const focusIndex =
        firstEmptyIndex === -1 ? pinRefs.current.length - 1 : firstEmptyIndex
      pinRefs.current[Math.max(focusIndex, 0)]?.focus()
    })
  }, [isOpen])

  const handlePinChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(0, 1)
    const next = [...pin]
    next[index] = digit
    setPin(next)
    if (pinError) onClearError()
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
    if (pinError) onClearError()
    pinRefs.current[Math.min(pasted.length, 4) - 1]?.focus()
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      desktopMaxWidthClass='max-w-[420px]'
      mobileTopOffsetClass='top-0'
      zIndex='z-[80] lg:z-[60]'
      header={
        <div className='relative text-center'>
          <button
            type='button'
            onClick={onClose}
            className='absolute right-0 -top-1 flex h-8 w-8 items-center justify-center rounded-full hover:bg-grey-50'
            aria-label='Close'
          >
            <span className='h-4 w-4 text-grey-600'>
              <CloseIcon />
            </span>
          </button>
          <h3 className='text-xl font-medium text-blackish'>Enter PIN</h3>
          <p className='mt-1 text-sm text-grey-600'>
            Provide your transaction PIN to pay with wallet.
          </p>
        </div>
      }
      body={
        <div className='space-y-4'>
          <div className='flex items-center justify-center gap-3'>
            {pin.map((value, index) => (
              <input
                key={`checkout-pin-${index}`}
                ref={(el) => {
                  pinRefs.current[index] = el
                }}
                type='password'
                inputMode='numeric'
                maxLength={1}
                value={value}
                onChange={(event) => handlePinChange(index, event.target.value)}
                onKeyDown={(event) => handlePinKeyDown(index, event)}
                onPaste={handlePinPaste}
                className={`h-12 w-12 rounded-[8px] border text-center text-lg font-medium text-blackish outline-none ${
                  pinError
                    ? 'border-error-400 focus:ring-1 focus:ring-error-200'
                    : 'border-grey-100 focus:ring-1 focus:ring-primary-300'
                }`}
              />
            ))}
          </div>
          <ShakeOnError active={Boolean(pinError)}>
            {pinError ? <p className='text-center text-xs text-error-400'>{pinError}</p> : null}
          </ShakeOnError>
        </div>
      }
      footer={
        <div className='grid grid-cols-2 gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='inline-flex h-12 items-center justify-center rounded-[14px] border border-grey-200 bg-grey-50 px-4 text-sm font-medium text-grey-800 hover:bg-grey-100 transition-colors duration-300'
          >
            Go Back
          </button>
          <button
            type='button'
            onClick={() => void onConfirm(pin.join(''))}
            disabled={!isPinComplete || isSubmitting}
            className='inline-flex h-12 items-center justify-center rounded-[14px] bg-linear-to-b from-primary-400 to-primary-600 px-4 text-sm font-medium text-white enabled:hover:from-primary-500 enabled:hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300'
          >
            {isSubmitting ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      }
    />
  )
}
