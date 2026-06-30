'use client'

import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import OnboardingLogo from '../components/OnboardingLogo'
import RegisterFormStep from './components/RegisterFormStep'
import RegisterSuccessStep from './components/RegisterSuccessStep'
import RegisterVerificationStep from './components/RegisterVerificationStep'
import { registerUser, resendVerification, verifyOtp } from '@/api/services'
import { setAccessToken, setRefreshToken } from '@/api/token'
import { toApiError } from '@/api/errorHelpers'
import { useAuth } from '@/context/AuthContext'
import { analytics } from '@/lib/analytics/events'
import { STRONG_PASSWORD_REGEX } from '@/lib/utils/security'

type RegisterStep = 'register' | 'verification' | 'success'

type Gender = 'male' | 'female' | ''

const STRONG_PASSWORD_MESSAGE =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'

const RegisterPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const [currentStep, setCurrentStep] = useState<RegisterStep>('register')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [country, setCountry] = useState('NG')
  const [gender, setGender] = useState<Gender>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(59)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const resolvePostRegisterPath = () => {
    const requestedNextPath = searchParams.get('next')
    if (!requestedNextPath) return '/dashboard'
    if (!requestedNextPath.startsWith('/')) return '/dashboard'
    if (requestedNextPath.startsWith('//')) return '/dashboard'
    if (requestedNextPath.startsWith('/register')) return '/dashboard'
    return requestedNextPath
  }

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) setReferralCode(ref)
  }, [searchParams])

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

  const validatePassword = (value: string) => STRONG_PASSWORD_REGEX.test(value)

  const resolvePasswordError = (value: string) => {
    if (!value) return ''
    if (validatePassword(value)) return ''
    return STRONG_PASSWORD_MESSAGE
  }

  const resolveConfirmPasswordError = (
    passwordValue: string,
    confirmPasswordValue: string,
  ) => {
    if (!confirmPasswordValue) return ''
    if (!passwordValue) return ''
    if (confirmPasswordValue.length < passwordValue.length) return ''
    if (passwordValue === confirmPasswordValue) return ''
    return 'Passwords do not match.'
  }

  const handleRegister = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    if (!validatePassword(password)) {
      setPasswordError(STRONG_PASSWORD_MESSAGE)
      return
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      analytics.trackAuthRegisterSubmitted({
        method: 'email',
        country,
        has_referral_code: Boolean(referralCode.trim()),
      })
      await registerUser({
        firstName,
        lastName,
        email,
        password,
        referralCode: referralCode.trim() || undefined,
        gender: gender
          ? `${gender[0].toUpperCase()}${gender.slice(1)}`
          : undefined,
        country,
      })
      setCurrentStep('verification')
    } catch (error: unknown) {
      const apiError = toApiError(error)
      analytics.trackAuthRegisterFailed({
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
    event: React.KeyboardEvent<HTMLInputElement>,
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
        analytics.trackAuthRegisterOtpSubmitted()
        const resp = await verifyOtp({ email, otp: otp.join('') })
        if (resp.accessToken) {
          setAccessToken(resp.accessToken)
        }
        if (resp.refreshToken) {
          setRefreshToken(resp.refreshToken)
        }
        await refreshUser()
        analytics.trackAuthRegisterSucceeded()
        setCurrentStep('success')
      }
    } catch (error: unknown) {
      const apiError = toApiError(error)
      analytics.trackAuthRegisterFailed({
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
        await resendVerification({ email })
        setCountdown(59)
        setCanResend(false)
      } catch (error: unknown) {
        const apiError = toApiError(error)
        analytics.trackAuthRegisterFailed({
          stage: 'resend',
          error_message: apiError.message,
        })
        setError(apiError.message)
      } finally {
        setIsResending(false)
      }
    }
  }

  const handleBackToRegister = () => {
    setCurrentStep('register')
    setOtp(['', '', '', '', '', ''])
    setError('')
  }

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFirstName(event.target.value)
  }

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextPassword = event.target.value
    setPassword(nextPassword)
    setPasswordError(resolvePasswordError(nextPassword))
    setConfirmPasswordError(
      resolveConfirmPasswordError(nextPassword, confirmPassword),
    )
    if (error) setError('')
  }

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextConfirmPassword = event.target.value
    setConfirmPassword(nextConfirmPassword)
    setConfirmPasswordError(
      resolveConfirmPasswordError(password, nextConfirmPassword),
    )
    if (error) setError('')
  }

  const handleReferralCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setReferralCode(event.target.value)
  }

  const handleCountryChange = (value: string) => {
    setCountry(value)
  }

  const handleGenderChange = (value: 'male' | 'female') => {
    setGender(value)
  }

  const handleDismissError = () => {
    setError('')
  }

  const handleProceedToDashboard = () => {
    router.push(resolvePostRegisterPath())
  }

  const requestedNextPath = searchParams.get('next')
  const loginHref = requestedNextPath
    ? `/login?next=${encodeURIComponent(requestedNextPath)}`
    : '/login'

  const isValidEmail = Boolean(email) && validateEmail(email)
  const isValidPassword = validatePassword(password)
  const isFormValid =
    Boolean(firstName) &&
    Boolean(lastName) &&
    isValidEmail &&
    Boolean(gender) &&
    isValidPassword &&
    password === confirmPassword
  const maskedEmail = email ? maskEmail(email) : ''

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'register':
        return (
          <RegisterFormStep
            firstName={firstName}
            lastName={lastName}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            referralCode={referralCode}
            country={country}
            gender={gender}
            emailError={emailError}
            passwordError={passwordError}
            confirmPasswordError={confirmPasswordError}
            error={error}
            isLoading={isLoading}
            isFormValid={isFormValid}
            loginHref={loginHref}
            onFirstNameChange={handleFirstNameChange}
            onLastNameChange={handleLastNameChange}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onConfirmPasswordChange={handleConfirmPasswordChange}
            onReferralCodeChange={handleReferralCodeChange}
            onCountryChange={handleCountryChange}
            onGenderChange={handleGenderChange}
            onRegister={handleRegister}
            onDismissError={handleDismissError}
          />
        )
      case 'verification':
        return (
          <RegisterVerificationStep
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
            onChangeEmail={handleBackToRegister}
            onDismissError={handleDismissError}
          />
        )
      case 'success':
        return <RegisterSuccessStep onProceed={handleProceedToDashboard} />
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

export default RegisterPage
