'use client'

import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactElement,
} from 'react'

type TransactionPinOtpFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

const DIGIT_COUNT = 4

const toDigits = (value: string) => {
  const digits = value.split('').slice(0, DIGIT_COUNT)
  return Array.from({ length: DIGIT_COUNT }, (_, index) => digits[index] || '')
}

const TransactionPinOtpField = ({
  label,
  value,
  onChange,
}: TransactionPinOtpFieldProps): ReactElement => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const digits = toDigits(value)

  const updateDigit = (index: number, nextValue: string) => {
    const sanitized = nextValue.replace(/\D/g, '').slice(0, 1)
    const nextDigits = [...digits]
    nextDigits[index] = sanitized
    onChange(nextDigits.join(''))

    if (sanitized && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace' && !digits[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, DIGIT_COUNT)

    if (!pasted) return

    const nextDigits = toDigits(pasted)
    onChange(nextDigits.join(''))
    const targetIndex = Math.min(pasted.length, DIGIT_COUNT) - 1
    inputRefs.current[targetIndex]?.focus()
  }

  return (
    <div className='space-y-2'>
      <label className='text-sm leading-[145%] font-medium text-grey-900'>
        {label}
      </label>
      <div className='flex items-center justify-center gap-2 sm:gap-3'>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            type='password'
            inputMode='numeric'
            autoComplete='one-time-code'
            value={digit}
            maxLength={1}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={index === 0 ? handlePaste : undefined}
            className='w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-medium border border-grey-100 rounded-[10px] focus:border-primary-500 focus:outline-none transition-colors bg-grey-50/40 text-blackish'
          />
        ))}
      </div>
    </div>
  )
}

export default TransactionPinOtpField
