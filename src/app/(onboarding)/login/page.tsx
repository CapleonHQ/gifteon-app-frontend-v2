'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@')
    const maskedLocal = local.charAt(0) + '***' + local.charAt(local.length - 1)
    return `${maskedLocal}@${domain}`
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    if (error) setError('')

    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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

  const handleSocialLogin = (provider: string) => {
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

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '')

    if (pastedData.length === 6) {
      const newOtp = pastedData.split('').slice(0, 6)
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    const { key } = e

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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

  const isValidEmail = email && validateEmail(email)

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  const renderLogin = () => (
    <motion.div
      key='login'
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
        className='mb-2 flex flex-col items-center'
      >
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          Welcome Back
        </h2>
        <p className='text-grey-600 sm:text-xl sm:leading-[100%]'>
          Login to your account to continue
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='space-y-6 w-full max-w-[450px] mx-auto'
      >
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='flex items-start space-x-3 p-4 bg-error-50 border-l-4 border-error-500 rounded-r-lg overflow-hidden'
            >
              <AlertCircle className='w-5 h-5 text-error-500 shrink-0 mt-0.5' />
              <div className='flex-1'>
                <p className='text-error-800 text-sm font-medium'>
                  Login Failed
                </p>
                <p className='text-error-700 text-sm mt-1'>{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className='text-error-400 hover:text-error-600 transition-colors'
              >
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='email'
            className='text-sm font-medium leading-[145%] text-grey-900'
          >
            Enter Email Address
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={handleEmailChange}
            placeholder='Enter your email address'
            className={`w-full text-sm px-3 py-3.5 border rounded-[12px] outline-none focus:ring-1 transition-all duration-200 text-blackish placeholder-grey-400 ${
              emailError
                ? 'border-error-500 focus:ring-error-500 focus:border-transparent'
                : 'border-grey-50 focus:ring-primary-500 focus:border-transparent'
            }`}
            required
          />
          <AnimatePresence>
            {emailError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='text-error-500 text-xs mt-1 overflow-hidden'
              >
                {emailError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: isValidEmail && !isLoading ? 1.01 : 1 }}
          whileTap={{ scale: isValidEmail && !isLoading ? 0.99 : 1 }}
          onClick={(e) => {
            e.preventDefault()
            handleLogin(e as any)
          }}
          disabled={isLoading || !isValidEmail}
          className='w-full py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl duration-200 hover:from-primary-500 hover:to-primary-700 disabled:from-primary-400/50 disabled:to-primary-600/50 disabled:border-none disabled:cursor-not-allowed transition-colors'
        >
          {isLoading ? (
            <div className='flex items-center justify-center space-x-2'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span>Logging in...</span>
            </div>
          ) : (
            'Log In'
          )}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='flex items-center justify-center w-full'
      >
        <span className='text-grey-600'>OR</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className='flex flex-col gap-7 w-full max-w-[450px] mx-auto'
      >
        <div className='flex flex-col gap-4 w-full'>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type='button'
            onClick={() => handleSocialLogin('google')}
            className='w-full py-3.5 px-[18.5px] border border-grey-200 rounded-[12px] flex items-center justify-center space-x-2 hover:bg-grey-50 transition-all duration-200'
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24'>
              <path
                fill='#4285F4'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='#34A853'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#FBBC05'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='#EA4335'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
            <span className='font-medium text-grey-800'>
              Continue with Google
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type='button'
            onClick={() => handleSocialLogin('apple')}
            className='w-full py-3.5 px-[18.5px] border border-grey-200 rounded-[12px] flex items-center justify-center space-x-2 hover:bg-grey-50 transition-all duration-200'
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
            </svg>
            <span className='font-medium text-grey-800'>
              Continue with Apple
            </span>
          </motion.button>
        </div>

        <p className='text-center text-grey-600 sm:text-xl font-medium mb-6'>
          Don&apos;t have an account?{' '}
          <Link
            href='/auth/register'
            className='text-primary-400 font-semibold hover:text-primary-600 transition-colors duration-200 underline'
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )

  const renderVerification = () => (
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
          Almost there 🎉 <br /> Just click the verification link we sent to
          {maskEmail(email)} to verify your email address or enter the OTP code
          below
        </p>

        <button
          onClick={handleBackToLogin}
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
              placeholder='-'
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              className='w-12 h-14 sm:w-16 sm:h-16 text-center text-lg sm:text-xl font-medium border border-grey-50 rounded-[8px] focus:border-primary-500 focus:outline-none transition-all duration-200 text-blackish bg-[#F2F2F326]'
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={(e) => {
            e.preventDefault()
            handleOtpSubmit(e as any)
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
              onClick={handleResend}
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

  const renderSuccess = () => (
    <motion.div
      key='success'
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ duration: 0.3 }}
      className='flex flex-col gap-4 sm:gap-5 lg:gap-7 items-center w-full'
    >
      <div className='w-[110px] h-[110px]'>
        <Image
          src='/assets/images/success-confetti.svg'
          alt='Success'
          width={150}
          height={150}
          className='w-full h-full'
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='mb-2 flex flex-col items-center text-center'
      >
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          Verification Successful
        </h2>
        <p className='text-grey-600 sm:text-xl sm:leading-[100%]'>
          Your email address has been verified successfully
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleProceedToDashboard}
        className='w-full max-w-[450px] py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl duration-200 hover:from-primary-500 hover:to-primary-700 transition-colors'
      >
        Go to Dashboard
      </motion.button>
    </motion.div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return renderLogin()
      case 'verification':
        return renderVerification()
      case 'success':
        return renderSuccess()
      default:
        return renderLogin()
    }
  }

  return (
    <div className='px-6'>
      <div className='relative z-10 flex flex-col w-full max-w-[549px] mx-auto min-h-[calc(100vh-100px)] justify-center'>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href='/' className='hidden lg:inline-block mb-8 mx-auto'>
            <div className='w-[146px] h-[60px] flex items-center justify-center'>
              <Image
                src='/assets/images/logo/logo.svg'
                alt='Giftseon'
                className='w-full h-full'
                width={200}
                height={80}
              />
            </div>
          </Link>
        </motion.div>

        <AnimatePresence mode='wait'>{renderCurrentStep()}</AnimatePresence>
      </div>
    </div>
  )
}

export default LoginPage
