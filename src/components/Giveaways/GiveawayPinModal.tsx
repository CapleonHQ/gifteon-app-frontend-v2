'use client'

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { X } from 'lucide-react'
import ShakeOnError from '@/components/common/ShakeOnError'

type GiveawayPinModalProps = {
  isOpen: boolean
  title?: string
  description?: ReactNode
  confirmLabel?: string
  submittingLabel?: string
  pinError?: string
  actionError?: string
  isSubmitting: boolean
  onConfirm: (pin: string) => void | Promise<void>
  onClose: () => void
  onClearError?: () => void
}

const GiveawayPinModal = ({
  isOpen,
  title = 'Confirmation',
  description = 'Enter your transaction PIN to continue.',
  confirmLabel = 'Confirm',
  submittingLabel = 'Processing...',
  pinError,
  actionError,
  isSubmitting,
  onConfirm,
  onClose,
  onClearError,
}: GiveawayPinModalProps) => {
  const [pin, setPin] = useState(['', '', '', ''])
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const isComplete = pin.every((digit) => digit.length === 1)

  useEffect(() => {
    if (!isOpen) return
    requestAnimationFrame(() => {
      setPin(['', '', '', ''])
      refs.current[0]?.focus()
    })
  }, [isOpen])

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    if (!digit) return
    onClearError?.()
    setPin((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== 'Backspace') return
    event.preventDefault()
    onClearError?.()
    setPin((prev) => {
      const next = [...prev]
      if (next[index]) {
        next[index] = ''
      } else if (index > 0) {
        next[index - 1] = ''
        refs.current[index - 1]?.focus()
      }
      return next
    })
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4)
    if (!pasted) return
    onClearError?.()
    const digits = pasted.split('')
    setPin([digits[0] || '', digits[1] || '', digits[2] || '', digits[3] || ''])
    refs.current[Math.min(pasted.length, 4) - 1]?.focus()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-60 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative w-full max-w-[420px] rounded-[20px] bg-white shadow-[0px_24px_60px_-20px_#10192852] px-6 py-8'>
        <button
          type='button'
          onClick={onClose}
          className='absolute right-5 top-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-grey-50'
          aria-label='Close'
        >
          <X className='h-5 w-5 text-grey-700' />
        </button>

        <div className='flex flex-col items-center text-center gap-4'>
          <div>
            <h3 className='text-xl font-medium text-blackish'>{title}</h3>
            <div className='mt-1 text-sm text-grey-600'>{description}</div>
          </div>

          {actionError ? (
            <div className='w-full rounded-lg px-3 py-2.5 text-sm bg-error-50 text-error-700 text-left'>
              {actionError}
            </div>
          ) : null}

          <div className='flex items-center justify-center gap-3'>
            {pin.map((value, index) => (
              <input
                key={index}
                ref={(el) => {
                  refs.current[index] = el
                }}
                value={value}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                type='password'
                inputMode='numeric'
                maxLength={1}
                className={`w-12 h-12 border rounded-[10px] text-center text-lg font-medium text-blackish focus:outline-none focus:ring-1 ${
                  pinError
                    ? 'border-error-400 focus:ring-error-200'
                    : 'border-grey-100 focus:ring-primary-300'
                }`}
              />
            ))}
          </div>

          <ShakeOnError active={Boolean(pinError)} className='w-full'>
            {pinError ? (
              <p className='text-xs text-error-500'>{pinError}</p>
            ) : null}
          </ShakeOnError>

          <div className='flex items-center gap-3 w-full'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-2.5 rounded-[10px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'
            >
              Go Back
            </button>
            <button
              type='button'
              onClick={() => void onConfirm(pin.join(''))}
              disabled={!isComplete || isSubmitting}
              className={`flex-1 py-2.5 rounded-[10px] font-medium text-white transition-colors ${
                isComplete && !isSubmitting
                  ? 'bg-primary-500 hover:bg-primary-600'
                  : 'bg-primary-200 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? submittingLabel : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiveawayPinModal
