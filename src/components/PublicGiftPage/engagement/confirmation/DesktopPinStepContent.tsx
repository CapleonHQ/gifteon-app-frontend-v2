import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import ShakeOnError from '@/components/common/ShakeOnError'

type DesktopPinStepContentProps = {
  isActive: boolean
  pinError: string
  isSubmitting: boolean
  onBack: () => void
  onConfirm: (pin: string) => Promise<void>
  onClearError: () => void
}

export default function DesktopPinStepContent({
  isActive,
  pinError,
  isSubmitting,
  onBack,
  onConfirm,
  onClearError,
}: DesktopPinStepContentProps) {
  const [pin, setPin] = useState(['', '', '', ''])
  const pinRefs = useRef<Array<HTMLInputElement | null>>([])
  const isPinComplete = pin.every((digit) => digit.length === 1)

  useEffect(() => {
    if (!isActive) return
    requestAnimationFrame(() => {
      const firstEmptyIndex = pinRefs.current.findIndex(
        (input) => !input?.value
      )
      const focusIndex =
        firstEmptyIndex === -1 ? pinRefs.current.length - 1 : firstEmptyIndex
      pinRefs.current[Math.max(focusIndex, 0)]?.focus()
    })
  }, [isActive])

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
    event.preventDefault()
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4)
    if (!pasted) return
    const next = pasted.split('').slice(0, 4)
    setPin([next[0] || '', next[1] || '', next[2] || '', next[3] || ''])
    if (pinError) onClearError()
    pinRefs.current[Math.min(pasted.length, 4) - 1]?.focus()
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-center gap-3 pt-0.5'>
        {pin.map((value, index) => (
          <input
            key={`desktop-checkout-pin-${index}`}
            ref={(el) => {
              pinRefs.current[index] = el
            }}
            value={value}
            onChange={(event) => handlePinChange(index, event.target.value)}
            onKeyDown={(event) => handlePinKeyDown(index, event)}
            onPaste={handlePinPaste}
            className={`w-12 h-12 border rounded-[8px] text-center text-lg font-medium text-blackish focus:outline-none ${
              pinError
                ? 'border-error-400 focus:ring-1 focus:ring-error-200'
                : 'border-grey-100 focus:ring-1 focus:ring-primary-300'
            }`}
            type='password'
            inputMode='numeric'
            maxLength={1}
          />
        ))}
      </div>

      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={onBack}
          className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
        >
          Go Back
        </button>
        <button
          type='button'
          onClick={() => void onConfirm(pin.join(''))}
          disabled={!isPinComplete || isSubmitting}
          className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
            isPinComplete && !isSubmitting
              ? 'bg-primary-500 hover:bg-primary-600'
              : 'bg-primary-200 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Confirm'}
        </button>
      </div>

      <ShakeOnError active={Boolean(pinError)}>
        {pinError ? (
          <p className='text-xs text-error-500 text-center'>{pinError}</p>
        ) : null}
      </ShakeOnError>
    </div>
  )
}
