'use client'

import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import OnboardingLogo from '../components/OnboardingLogo'
import LoginFormStep from './components/LoginFormStep'
import LoginSuccessStep from './components/LoginSuccessStep'
import LoginVerificationStep from './components/LoginVerificationStep'
import { loginUser, verifyOtp } from '@/api/services'
import { setAccessToken, setRefreshToken } from '@/api/token'
import { toApiError } from '@/api/errorHelpers'
import { useAuth } from '@/context/AuthContext'
import { analytics } from '@/lib/analytics/events'

type LoginStep = 'login' | 'verification' | 'success'

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const [currentStep, setCurrentStep] = useState<LoginStep>('login')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
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

  // Countdown timer for resend
  useEffect(() => {
    if (currentStep === 'verification' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, currentStep])

  // Focus first OTP input when step changes to verification
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

    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleLogin = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      analytics.trackAuthLoginSubmitted({ method: 'email' })
      const resp = await loginUser({ email })
      if (resp.success) {
        setCurrentStep('verification')
      } else {
        analytics.trackAuthLoginFailed({
          stage: 'request',
          error_message: resp.message || 'Login failed. Please try again.',
        })
        setError(resp.message || 'Login failed. Please try again.')
      }
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    analytics.trackAuthLoginSubmitted({ method: provider })
    console.log(`Login with ${provider}`)
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
    try {
      if (otp.every((digit) => digit !== '')) {
        setIsLoading(true)
        analytics.trackAuthLoginOtpSubmitted()
        const resp = await verifyOtp({ email, otp: otp.join('') })
        if (resp.accessToken) {
          setAccessToken(resp.accessToken)
        }
        if (resp.refreshToken) {
          setRefreshToken(resp.refreshToken)
        }
        await refreshUser()
        analytics.trackAuthLoginSucceeded()
        router.push(resolvePostLoginPath())
      }
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
    if (canResend) {
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
  }

  const handleBackToLogin = () => {
    setCurrentStep('login')
    setOtp(['', '', '', '', '', ''])
    setError('')
  }

  const handleProceedToDashboard = () => {
    router.push(resolvePostLoginPath())
  }

  const isValidEmail = Boolean(email) && validateEmail(email)
  const maskedEmail = email ? maskEmail(email) : ''

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return (
          <LoginFormStep
            email={email}
            emailError={emailError}
            error={error}
            isLoading={isLoading}
            isValidEmail={isValidEmail}
            registerHref={registerHref}
            onEmailChange={handleEmailChange}
            onLogin={handleLogin}
            onDismissError={() => setError('')}
            onSocialLogin={handleSocialLogin}
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
            onChangeEmail={handleBackToLogin}
            onDismissError={() => setError('')}
          />
        )
      case 'success':
        return <LoginSuccessStep onProceed={handleProceedToDashboard} />
      default:
        return null
    }
  }

  return (
    <div className='px-6'>
      <div className='relative z-10 flex flex-col w-full max-w-[549px] mx-auto min-h-[calc(100vh-100px)] justify-center'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <OnboardingLogo linkClassName='hidden lg:inline-block mb-8 mx-auto' />
        </motion.div>

        <AnimatePresence mode='wait'>{renderCurrentStep()}</AnimatePresence>
      </div>
    </div>
  )
}

export default LoginPage
