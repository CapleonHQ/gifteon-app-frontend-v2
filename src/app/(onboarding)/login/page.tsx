'use client'

import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import OnboardingLogo from '../components/OnboardingLogo'
import LoginFormStep from './components/LoginFormStep'
import LoginSuccessStep from './components/LoginSuccessStep'
import LoginVerificationStep from './components/LoginVerificationStep'

type LoginStep = 'login' | 'verification' | 'success'

const LoginPage = () => {
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
      console.log('Logging in with email:', email)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCurrentStep('verification')
    } catch (error: any) {
      console.log(error)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    console.log(`Login with ${provider}`)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
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
        console.log('Verifying OTP:', otp.join(''))
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setCurrentStep('success')
      }
    } catch (error: any) {
      console.log(error)
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (canResend) {
      setIsResending(true)
      console.log('Resending verification code to:', email)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCountdown(59)
      setCanResend(false)
      setIsResending(false)
    }
  }

  const handleBackToLogin = () => {
    setCurrentStep('login')
    setOtp(['', '', '', '', '', ''])
    setError('')
  }

  const handleProceedToDashboard = () => {
    console.log('Proceeding to dashboard')
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
            onOtpChange={handleOtpChange}
            onOtpKeyDown={handleOtpKeyDown}
            onOtpPaste={handleOtpPaste}
            onOtpSubmit={handleOtpSubmit}
            onResend={handleResend}
            onChangeEmail={handleBackToLogin}
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
