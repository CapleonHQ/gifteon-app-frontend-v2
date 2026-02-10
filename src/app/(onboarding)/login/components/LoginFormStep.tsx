'use client'

import type { ChangeEvent, SyntheticEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import FormErrorAlert from '../../components/FormErrorAlert'
import SocialAuthButtons from '../../components/SocialAuthButtons'

type LoginFormStepProps = {
  email: string
  emailError: string
  error: string
  isLoading: boolean
  isValidEmail: boolean
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  onLogin: (event: SyntheticEvent) => void
  onDismissError: () => void
  onSocialLogin: (provider: 'google' | 'apple') => void
}

const LoginFormStep = ({
  email,
  emailError,
  error,
  isLoading,
  isValidEmail,
  onEmailChange,
  onLogin,
  onDismissError,
  onSocialLogin,
}: LoginFormStepProps) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
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
            <FormErrorAlert
              title='Login Failed'
              message={error}
              onDismiss={onDismissError}
            />
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
            onChange={onEmailChange}
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
          onClick={(event) => {
            event.preventDefault()
            onLogin(event)
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
        <SocialAuthButtons onSelect={onSocialLogin} />

        <p className='text-center text-grey-600 sm:text-xl font-medium mb-6'>
          Don&apos;t have an account?{' '}
          <Link
            href='/register'
            className='text-primary-400 font-semibold hover:text-primary-600 transition-colors duration-200 underline'
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default LoginFormStep
