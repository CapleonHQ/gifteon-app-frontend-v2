'use client'

import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import OnboardingLogo from '../components/OnboardingLogo'
import LoginFormStep from './components/LoginFormStep'
import LoginVerificationStep from './components/LoginVerificationStep'
import { loginUser, verifyOtp } from '@/api/services'
import {
  clearAuthTokenIssuedAt,
  setAccessToken,
  setAuthTokenIssuedAt,
  setRefreshToken,
} from '@/api/token'
import { toApiError } from '@/api/errorHelpers'
import { useAuth } from '@/context/AuthContext'
import { analytics } from '@/lib/analytics/events'

type LoginStep = 'email' | 'password' | 'verification'

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const [currentStep, setCurrentStep] = useState<LoginStep>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(59)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const resolvePostLoginPath = () => {
    const requestedNextPath = searchParams.get('next')
    if (!requestedNextPath) return '/dashboard'
    if (!requestedNextPath.startsWith('/')) return '/dashboard'
    if (requestedNextPath.startsWith('//')) return '/dashboard'
    if (requestedNextPath.startsWith('/login')) return '/dashboard'
    return requestedNextPath
  }

  const requestedNextPath = searchParams.get('next')
  const registerHref = requestedNextPath
    ? `/register?next=${encodeURIComponent(requestedNextPath)}`
    : '/register'
  const resetPasswordHref = email
    ? `/reset-password?email=${encodeURIComponent(email)}`
    : '/reset-password'

  useEffect(() => {
    if (currentStep === 'verification' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (currentStep === 'verification' && countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, currentStep])

  useEffect(() => {
    if (currentStep === 'verification') {
      inputRefs.current[0]?.focus()
    }
  }, [currentStep])

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const maskEmail = (value: string) => {
    const [local, domain] = value.split('@')
    const maskedLocal = local.charAt(0) + '***' + local.charAt(local.length - 1)
    return `${maskedLocal}@${domain}`
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setEmail(value)
    if (error) setError('')
    if (emailError) setEmailError('')
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    }
  }

  const completeAuthenticatedLogin = async (
    accessToken?: string,
    refreshToken?: string,
    tokenIssuedAt?: string
  ) => {
    if (accessToken) {
      setAccessToken(accessToken)
    }
    if (refreshToken) {
      setRefreshToken(refreshToken)
    }
    if (tokenIssuedAt) {
      setAuthTokenIssuedAt(tokenIssuedAt)
    } else {
      clearAuthTokenIssuedAt()
    }
    await refreshUser()
    analytics.trackAuthLoginSucceeded()
    router.push(resolvePostLoginPath())
  }

  const handleContinue = (event: SyntheticEvent) => {
    event.preventDefault()
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    setCurrentStep('password')
    setError('')
  }

  const handlePasswordLogin = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!validateEmail(email)) {
      setCurrentStep('email')
      setEmailError('Please enter a valid email address')
      return
    }
    if (!password) {
      setPasswordError('Enter your password to continue.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      analytics.trackAuthLoginSubmitted({ method: 'email' })
      const resp = await loginUser({ email, password })
      const accessToken = resp.data?.accessToken
      const refreshToken = resp.data?.refreshToken
      const tokenIssuedAt = resp.data?.tokenIssuedAt
      if (!accessToken) {
        throw new Error(resp.message || 'Login failed. Please try again.')
      }
      await completeAuthenticatedLogin(accessToken, refreshToken, tokenIssuedAt)
    } catch (error: unknown) {
      const apiError = toApiError(error)
      analytics.trackAuthLoginFailed({
        stage: 'request',
        error_message: apiError.message,
      })
      setError(apiError.message)
      if (apiError.fieldErrors?.email?.length) {
        setEmailError(apiError.fieldErrors.email[0])
      }
      if (apiError.fieldErrors?.password?.length) {
        setPasswordError(apiError.fieldErrors.password[0])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestMagicLink = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!validateEmail(email)) {
      setCurrentStep('email')
      setEmailError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      analytics.trackAuthLoginSubmitted({ method: 'email' })
      await loginUser({ email })
      setOtp(['', '', '', '', '', ''])
      setCountdown(59)
      setCanResend(false)
      setCurrentStep('verification')
    } catch (error: unknown) {
      const apiError = toApiError(error)
      analytics.trackAuthLoginFailed({
        stage: 'request',
        error_message: apiError.message,
      })
      setError(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (error) setError('')
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (error) setError('')
    const pastedData = event.clipboardData.getData('text').replace(/\D/g, '')
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('').slice(0, 6)
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (error) setError('')
    const { key } = event
    if (key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    } else if (key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!otp.every((digit) => digit !== '')) return

    try {
      setIsLoading(true)
      analytics.trackAuthLoginOtpSubmitted()
      const resp = await verifyOtp({ email, otp: otp.join('') })
      await completeAuthenticatedLogin(
        resp.accessToken,
        resp.refreshToken,
        resp.tokenIssuedAt
      )
    } catch (error: unknown) {
      const apiError = toApiError(error)
      analytics.trackAuthLoginFailed({
        stage: 'otp',
        error_message: apiError.message,
      })
      setError(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setIsResending(true)
    try {
      analytics.trackAuthLoginSubmitted({ method: 'email' })
      await loginUser({ email })
      setCountdown(59)
      setCanResend(false)
    } catch (error: unknown) {
      const apiError = toApiError(error)
      analytics.trackAuthLoginFailed({
        stage: 'resend',
        error_message: apiError.message,
      })
      setError(apiError.message)
    } finally {
      setIsResending(false)
    }
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    setPasswordError('')
    if (error) setError('')
  }

  const handleBackToEmail = () => {
    setCurrentStep('email')
    setPassword('')
    setPasswordError('')
    setError('')
  }

  const handleChangeEmailFromOtp = () => {
    setCurrentStep('email')
    setOtp(['', '', '', '', '', ''])
    setError('')
  }

  const handleDismissError = () => {
    setError('')
  }

  const maskedEmail = email ? maskEmail(email) : ''
  const isValidEmail = Boolean(email) && validateEmail(email)

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'email':
      case 'password':
        return (
          <LoginFormStep
            email={email}
            password={password}
            emailError={emailError}
            passwordError={passwordError}
            error={error}
            isLoading={isLoading}
            isValidEmail={isValidEmail}
            isPasswordStep={currentStep === 'password'}
            registerHref={registerHref}
            resetPasswordHref={resetPasswordHref}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onContinue={handleContinue}
            onPasswordLogin={handlePasswordLogin}
            onRequestMagicLink={handleRequestMagicLink}
            onBackToEmail={handleBackToEmail}
            onDismissError={handleDismissError}
          />
        )
      case 'verification':
        return (
          <LoginVerificationStep
            maskedEmail={maskedEmail}
            otp={otp}
            inputRefs={inputRefs}
            isLoading={isLoading}
            canResend={canResend}
            countdown={countdown}
            isResending={isResending}
            error={error}
            onOtpChange={handleOtpChange}
            onOtpKeyDown={handleOtpKeyDown}
            onOtpPaste={handleOtpPaste}
            onOtpSubmit={handleOtpSubmit}
            onResend={handleResend}
            onChangeEmail={handleChangeEmailFromOtp}
            onDismissError={handleDismissError}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='px-6'>
      <div className='relative z-10 flex flex-col w-full max-w-[549px] mx-auto min-h-[calc(100vh-100px)] justify-center'>
        <div className='flex-1 flex items-center justify-center px-6 py-12'>
          <div className='w-full max-w-[549px]'>
            <div className='mb-12'>
              <OnboardingLogo linkClassName='hidden lg:inline-block mb-8 mx-auto' />
            </div>
            <AnimatePresence mode='wait'>{renderCurrentStep()}</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
