import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import ShakeOnError from '@/components/common/ShakeOnError'

type BillsPinModalProps = {
  isOpen: boolean
  pinError: string
  isSubmitting: boolean
  onCloseToReview: () => void
  onConfirm: (pin: string) => Promise<void>
  onClearError: () => void
}

const BillsPinModal = ({
  isOpen,
  pinError,
  isSubmitting,
  onCloseToReview,
  onConfirm,
  onClearError,
}: BillsPinModalProps) => {
  const [pin, setPin] = useState(['', '', '', ''])
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const pinRefs = useRef<Array<HTMLInputElement | null>>([])
  const isPinComplete = pin.every((digit) => digit.length === 1)

  useEffect(() => {
    const updateViewport = () => {
      setIsMobileViewport(window.innerWidth < 1024)
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    requestAnimationFrame(() => {
      const firstEmptyIndex = pinRefs.current.findIndex((input) => !input?.value)
      const focusIndex =
        firstEmptyIndex === -1 ? pinRefs.current.length - 1 : firstEmptyIndex
      pinRefs.current[focusIndex]?.focus()
    })
  }, [isOpen, isMobileViewport])

  const handlePinChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(0, 1)
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
    const targetIndex = Math.min(pasted.length, 4) - 1
    pinRefs.current[targetIndex]?.focus()
  }

  const handleClose = () => {
    setPin(['', '', '', ''])
    onCloseToReview()
  }

  if (!isOpen) return null

  return (
    <>
      {!isMobileViewport ? (
        <div className='fixed inset-0 z-60 flex items-center justify-center p-4'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={handleClose}
          />
          <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
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
            <div className='flex flex-col items-center text-center gap-4'>
              <div>
                <h3 className='text-xl font-medium text-blackish'>Confirmation</h3>
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

              <div className='flex items-center gap-3 w-full'>
                <button
                  type='button'
                  onClick={handleClose}
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

              <ShakeOnError active={Boolean(pinError)} className='w-full'>
                {pinError ? <p className='text-xs text-error-500'>{pinError}</p> : null}
              </ShakeOnError>
            </div>
          </div>
        </div>
      ) : (
        <div className='fixed inset-0 z-70 flex items-center justify-center px-4'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={handleClose}
          />
          <div className='relative w-full max-w-[520px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
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
            <div className='flex flex-col items-center text-center gap-4'>
              <div>
                <h3 className='text-xl font-medium text-blackish'>Confirmation</h3>
                <p className='text-sm text-grey-600'>
                  Provide your account PIN to move forward
                </p>
              </div>
              <div className='flex items-center justify-center gap-3'>
                {pin.map((value, index) => (
                  <input
                    key={`mobile-pin-${index}`}
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
              <div className='flex items-center gap-3 w-full'>
                <button
                  type='button'
                  onClick={handleClose}
                  className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
                >
                  Go Back
                </button>
                <button
                  type='button'
                  disabled={!isPinComplete || isSubmitting}
                  onClick={() => void onConfirm(pin.join(''))}
                  className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
                    isPinComplete && !isSubmitting
                      ? 'bg-primary-500 hover:bg-primary-600'
                      : 'bg-primary-200 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
              <ShakeOnError active={Boolean(pinError)} className='w-full'>
                {pinError ? <p className='text-xs text-error-500'>{pinError}</p> : null}
              </ShakeOnError>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BillsPinModal
