'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import OnboardingLogo from '../components/OnboardingLogo'
import FormErrorAlert from '../components/FormErrorAlert'
import OtpInputs from '../components/OtpInputs'
import { requestResetPasswordOtp, resetPassword } from '@/api/services'
import { toApiError } from '@/api/errorHelpers'
import { STRONG_PASSWORD_REGEX } from '@/lib/utils/security'

const OTP_RESEND_WINDOW_SECONDS = 60
const STRONG_PASSWORD_MESSAGE =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'

type ResetPasswordStep = 'request' | 'verify' | 'success'

const ResetPasswordPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') ?? ''
  const [step, setStep] = useState<ResetPasswordStep>('request')
  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isRequestingOtp, setIsRequestingOtp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [hasRequestedOtp, setHasRequestedOtp] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (otpCountdown <= 0) return
    const timer = window.setTimeout(() => {
      setOtpCountdown((current) => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [otpCountdown])

  useEffect(() => {
    if (step === 'verify') {
      inputRefs.current[0]?.focus()
    }
  }, [step])

  const loginHref = useMemo(() => {
    if (!email) return '/login'
    return `/login?email=${encodeURIComponent(email)}`
  }, [email])

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const clearApiError = () => {
    if (apiError) setApiError('')
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setEmail(value)
    clearApiError()
    if (emailError) {
      setEmailError(validateEmail(value) ? '' : 'Please enter a valid email address.')
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (otpError) setOtpError('')
    clearApiError()
    const nextOtp = [...otp]
    nextOtp[index] = value.replace(/\D/g, '')
    setOtp(nextOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (otpError) setOtpError('')
    clearApiError()
    const pastedData = event.clipboardData.getData('text').replace(/\D/g, '')
    if (pastedData.length === 6) {
      const nextOtp = pastedData.split('').slice(0, 6)
      setOtp(nextOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (otpError) setOtpError('')
    clearApiError()
    const { key } = event
    if (key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const nextOtp = [...otp]
        nextOtp[index - 1] = ''
        setOtp(nextOtp)
        inputRefs.current[index - 1]?.focus()
      } else {
        const nextOtp = [...otp]
        nextOtp[index] = ''
        setOtp(nextOtp)
      }
    } else if (key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setNewPassword(value)
    clearApiError()
    setNewPasswordError(
      value && !STRONG_PASSWORD_REGEX.test(value) ? STRONG_PASSWORD_MESSAGE : ''
    )
    setConfirmPasswordError(
      confirmPassword &&
        value &&
        confirmPassword.length >= value.length &&
        confirmPassword !== value
        ? 'Passwords do not match.'
        : ''
    )
  }

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setConfirmPassword(value)
    clearApiError()
    if (!value || !newPassword || value.length < newPassword.length) {
      setConfirmPasswordError('')
      return
    }
    setConfirmPasswordError(value !== newPassword ? 'Passwords do not match.' : '')
  }

  const handleDismissError = () => {
    setApiError('')
  }

  const handleRequestOtp = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (otpCountdown > 0 || isRequestingOtp) return
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }

    try {
      setIsRequestingOtp(true)
      setApiError('')
      setEmailError('')
      await requestResetPasswordOtp({ email, purpose: 'reset-password' })
      setHasRequestedOtp(true)
      setOtp(['', '', '', '', '', ''])
      setOtpError('')
      setOtpCountdown(OTP_RESEND_WINDOW_SECONDS)
      setStep('verify')
    } catch (error: unknown) {
      setApiError(
        toApiError(error).message || 'Unable to request an OTP right now.'
      )
    } finally {
      setIsRequestingOtp(false)
    }
  }

  const handleResetPassword = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (!hasRequestedOtp) {
      setApiError('Request an OTP to continue.')
      return
    }
    if (!otp.every((digit) => digit !== '')) {
      setOtpError('Enter the 6-digit OTP sent to your email.')
      return
    }
    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      setNewPasswordError(STRONG_PASSWORD_MESSAGE)
      return
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm your new password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.')
      return
    }

    try {
      setIsSubmitting(true)
      setApiError('')
      await resetPassword({ email, newPassword, otp: otp.join('') })
      setStep('success')
    } catch (error: unknown) {
      setApiError(
        toApiError(error).message || 'Unable to reset password right now.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangeEmail = () => {
    setStep('request')
    setOtp(['', '', '', '', '', ''])
    setOtpError('')
    setApiError('')
  }

  const handleContinueToLogin = () => {
    router.push('/login')
  }

  const otpButtonLabel =
    otpCountdown > 0
      ? `Request OTP again in ${otpCountdown}s`
      : hasRequestedOtp
      ? 'Request OTP Again'
      : 'Request OTP'

  const renderRequestStep = () => (
    <form className='space-y-5' onSubmit={handleRequestOtp}>
      <div className='flex flex-col gap-1'>
        <label
          htmlFor='email'
          className='text-sm font-medium leading-[145%] text-grey-900'
        >
          Email Address
        </label>
        <input
          id='email'
          name='email'
          type='email'
          autoComplete='email'
          value={email}
          onChange={handleEmailChange}
          placeholder='Enter your email address'
          className={`w-full text-sm px-3 py-3.5 border rounded-[12px] outline-none focus:ring-1 transition-all duration-200 text-blackish placeholder-grey-400 ${
            emailError
              ? 'border-error-500 focus:ring-error-500 focus:border-transparent'
              : 'border-grey-50 focus:ring-primary-500 focus:border-transparent'
          }`}
        />
        {emailError ? (
          <p className='text-error-500 text-xs mt-1'>{emailError}</p>
        ) : null}
      </div>

      <button
        type='submit'
        disabled={isRequestingOtp}
        className='w-full py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl transition-colors hover:from-primary-500 hover:to-primary-700 disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isRequestingOtp ? (
          <span className='inline-flex items-center justify-center gap-2'>
            <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
            <span>Sending OTP...</span>
          </span>
        ) : (
          'Request OTP'
        )}
      </button>
    </form>
  )

  const renderVerifyStep = () => (
    <form className='space-y-5' onSubmit={handleResetPassword}>
      <div className='flex flex-col gap-1'>
        <label className='text-sm font-medium leading-[145%] text-grey-900'>
          OTP
        </label>
        <OtpInputs
          otp={otp}
          inputRefs={inputRefs}
          onChange={handleOtpChange}
          onKeyDown={handleOtpKeyDown}
          onPaste={handleOtpPaste}
        />
        {otpError ? <p className='text-error-500 text-xs mt-1'>{otpError}</p> : null}
      </div>

      <div className='flex flex-col gap-1'>
        <label
          htmlFor='newPassword'
          className='text-sm font-medium leading-[145%] text-grey-900'
        >
          New Password
        </label>
        <input
          id='newPassword'
          name='newPassword'
          type='password'
          autoComplete='new-password'
          value={newPassword}
          onChange={handleNewPasswordChange}
          placeholder='Create your new password'
          className={`w-full text-sm px-3 py-3.5 border rounded-[12px] outline-none focus:ring-1 transition-all duration-200 text-blackish placeholder-grey-400 ${
            newPasswordError
              ? 'border-error-500 focus:ring-error-500 focus:border-transparent'
              : 'border-grey-50 focus:ring-primary-500 focus:border-transparent'
          }`}
        />
        {newPasswordError ? (
          <p className='text-error-500 text-xs mt-1'>{newPasswordError}</p>
        ) : null}
      </div>

      <div className='flex flex-col gap-1'>
        <label
          htmlFor='confirmPassword'
          className='text-sm font-medium leading-[145%] text-grey-900'
        >
          Confirm Password
        </label>
        <input
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          autoComplete='new-password'
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder='Confirm your new password'
          className={`w-full text-sm px-3 py-3.5 border rounded-[12px] outline-none focus:ring-1 transition-all duration-200 text-blackish placeholder-grey-400 ${
            confirmPasswordError
              ? 'border-error-500 focus:ring-error-500 focus:border-transparent'
              : 'border-grey-50 focus:ring-primary-500 focus:border-transparent'
          }`}
        />
        {confirmPasswordError ? (
          <p className='text-error-500 text-xs mt-1'>{confirmPasswordError}</p>
        ) : null}
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='w-full py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl transition-colors hover:from-primary-500 hover:to-primary-700 disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isSubmitting ? (
          <span className='inline-flex items-center justify-center gap-2'>
            <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
            <span>Resetting Password...</span>
          </span>
        ) : (
          'Reset Password'
        )}
      </button>

      <div className='space-y-3 text-center'>
        <button
          type='button'
          onClick={handleChangeEmail}
          className='text-sm font-medium text-primary-500 underline underline-offset-2 transition-colors hover:text-primary-600'
        >
          Change email
        </button>

        <button
          type='button'
          onClick={handleRequestOtp}
          disabled={isRequestingOtp || otpCountdown > 0}
          className='block w-full text-sm font-medium text-primary-500 underline underline-offset-2 disabled:opacity-50'
        >
          {isRequestingOtp ? (
            <span className='inline-flex items-center justify-center gap-2'>
              <span className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
              <span>Sending OTP...</span>
            </span>
          ) : (
            otpButtonLabel
          )}
        </button>
      </div>
    </form>
  )

  const renderSuccessStep = () => (
    <div className='space-y-4'>
      <button
        type='button'
        onClick={handleContinueToLogin}
        className='w-full py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl transition-colors hover:from-primary-500 hover:to-primary-700'
      >
        Continue to Login
      </button>
    </div>
  )

  const title =
    step === 'success'
      ? 'Password Reset'
      : step === 'request'
      ? 'Reset Your Password'
      : 'Enter Your Code'

  const description =
    step === 'success'
      ? 'Your password has been updated successfully.'
      : step === 'request'
      ? 'Enter your email address and we’ll send you a one-time code.'
      : `We sent a 6-digit code to ${email}.`

  return (
    <div className='px-6'>
      <div className='relative z-10 flex flex-col w-full max-w-[549px] mx-auto min-h-[calc(100vh-100px)] justify-center'>
        <div className='flex-1 flex items-center justify-center px-6 py-12'>
          <div className='w-full max-w-[549px]'>
            <div className='mb-12'>
              <OnboardingLogo linkClassName='hidden lg:inline-block mb-8 mx-auto' />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex flex-col gap-5 items-center w-full'
            >
              <div className='mb-2 flex flex-col items-center text-center'>
                <h2 className='text-[32px] sm:text-[40px] leading-[130%] font-semibold text-blackish mb-2'>
                  {title}
                </h2>
                <p className='text-grey-600 sm:text-xl sm:leading-[140%]'>
                  {description}
                </p>
              </div>

              <div className='space-y-6 w-full max-w-[450px] mx-auto'>
                <AnimatePresence>
                  {apiError ? (
                    <FormErrorAlert
                      title='Reset Password Failed'
                      message={apiError}
                      onDismiss={handleDismissError}
                    />
                  ) : null}
                </AnimatePresence>

                {step === 'request'
                  ? renderRequestStep()
                  : step === 'verify'
                  ? renderVerifyStep()
                  : renderSuccessStep()}
              </div>

              {step !== 'success' ? (
                <div className='flex flex-col gap-7 w-full max-w-[450px] mx-auto'>
                  <p className='text-center text-grey-600 sm:text-xl font-medium mb-6'>
                    Remembered your password?{' '}
                    <Link
                      href={loginHref}
                      className='text-primary-400 font-semibold hover:text-primary-600 transition-colors duration-200 underline'
                    >
                      Back to login
                    </Link>
                  </p>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
