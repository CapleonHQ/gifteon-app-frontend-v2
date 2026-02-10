'use client'

import type { ClipboardEvent, KeyboardEvent, MutableRefObject } from 'react'
import { motion } from 'framer-motion'

type OtpInputsProps = {
  otp: string[]
  inputRefs: MutableRefObject<(HTMLInputElement | null)[]>
  onChange: (index: number, value: string) => void
  onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => void
}

const OtpInputs = ({
  otp,
  inputRefs,
  onChange,
  onKeyDown,
  onPaste,
}: OtpInputsProps) => {
  return (
    <div className='flex space-x-2 sm:space-x-3'>
      {otp.map((digit, index) => (
        <motion.input
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          placeholder=''
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          onPaste={index === 0 ? onPaste : undefined}
          className='w-12 h-14 sm:w-16 sm:h-16 text-center text-lg sm:text-xl font-medium border border-grey-50 rounded-[8px] focus:border-primary-500 focus:outline-none transition-all duration-200 text-blackish bg-[#F2F2F326]'
        />
      ))}
    </div>
  )
}

export default OtpInputs
