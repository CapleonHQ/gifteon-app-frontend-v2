'use client'

import type {
  ClipboardEvent,
  KeyboardEvent,
  MutableRefObject,
  SyntheticEvent,
} from 'react'
import { motion } from 'framer-motion'
import OtpInputs from '../../components/OtpInputs'

type RegisterVerificationStepProps = {
  maskedEmail: string
  otp: string[]
  inputRefs: MutableRefObject<(HTMLInputElement | null)[]>
  isLoading: boolean
  canResend: boolean
  countdown: number
  isResending: boolean
  onOtpChange: (index: number, value: string) => void
  onOtpKeyDown: (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => void
  onOtpPaste: (event: ClipboardEvent<HTMLInputElement>) => void
  onOtpSubmit: (event: SyntheticEvent) => void
  onResend: () => void
  onChangeEmail: () => void
}

const RegisterVerificationStep = ({
  maskedEmail,
  otp,
  inputRefs,
  isLoading,
  canResend,
  countdown,
  isResending,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onOtpSubmit,
  onResend,
  onChangeEmail,
}: RegisterVerificationStepProps) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div
      key='verification'
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ duration: 0.3 }}
      className='flex flex-col gap-4 sm:gap-5 lg:gap-7 items-center w-full'
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='mb-2 flex flex-col items-center text-center w-full max-w-[450px] mx-auto'
      >
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          Email Verification
        </h2>
        <p className='text-grey-600 sm:text-xl leading-[140%] mb-2'>
          Almost there 🎉 <br /> Just click the verification link we sent to{' '}
          {maskedEmail} to verify your email address or enter the OTP code below
        </p>

        <button
          onClick={onChangeEmail}
          className='text-primary-400 hover:text-primary-600 transition-colors duration-200 underline'
        >
          Change email
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='flex flex-col items-center space-y-6 w-full max-w-[450px] mx-auto'
      >
        <OtpInputs
          otp={otp}
          inputRefs={inputRefs}
          onChange={onOtpChange}
          onKeyDown={onOtpKeyDown}
          onPaste={onOtpPaste}
        />

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={(event) => {
            event.preventDefault()
            onOtpSubmit(event)
          }}
          disabled={isLoading || !otp.every((digit) => digit !== '')}
          className='w-full py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl duration-200 hover:from-primary-500 hover:to-primary-700 disabled:from-primary-400/50 disabled:to-primary-600/50 disabled:border-none disabled:cursor-not-allowed transition-colors'
        >
          {isLoading ? (
            <div className='flex items-center justify-center space-x-2'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span>Verifying...</span>
            </div>
          ) : (
            'Verify Email Address'
          )}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className='text-center'
      >
        <div className='flex items-center justify-center gap-1'>
          <p className='text-grey-600 sm:text-xl'>Didn&apos;t get the OTP?</p>
          {canResend ? (
            <button
              onClick={onResend}
              disabled={isResending}
              className='text-primary-400 font-medium hover:text-primary-600 transition-colors duration-200 underline disabled:opacity-50 disabled:cursor-not-allowed sm:text-xl'
            >
              {isResending ? (
                <div className='flex items-center justify-center space-x-2'>
                  <div className='w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                  <span>Sending...</span>
                </div>
              ) : (
                'Resend OTP'
              )}
            </button>
          ) : (
            <div className='flex items-center justify-center space-x-2 text-grey-600 sm:text-xl'>
              <span>You can resend in</span>
              <span className='font-semibold text-primary-500'>
                {countdown}s
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RegisterVerificationStep
