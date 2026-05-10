'use client'

import type { ChangeEvent, SyntheticEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import FormErrorAlert from '../../components/FormErrorAlert'

type LoginFormStepProps = {
  email: string
  password: string
  emailError: string
  passwordError: string
  error: string
  isLoading: boolean
  isValidEmail: boolean
  isPasswordStep: boolean
  registerHref?: string
  resetPasswordHref?: string
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  onContinue: (event: SyntheticEvent) => void
  onPasswordLogin: (event: SyntheticEvent) => void
  onRequestMagicLink: (event: SyntheticEvent) => void
  onBackToEmail: () => void
  onDismissError: () => void
}

const LoginFormStep = ({
  email,
  password,
  emailError,
  passwordError,
  error,
  isLoading,
  isValidEmail,
  isPasswordStep,
  registerHref = '/register',
  resetPasswordHref = '/reset-password',
  onEmailChange,
  onPasswordChange,
  onContinue,
  onPasswordLogin,
  onRequestMagicLink,
  onBackToEmail,
  onDismissError,
}: LoginFormStepProps) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div
      key={isPasswordStep ? 'password' : 'email'}
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
        className='mb-2 flex flex-col items-center text-center'
      >
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          {isPasswordStep ? 'Sign In Securely' : 'Welcome Back'}
        </h2>
        <p className='text-grey-600 sm:text-xl sm:leading-[140%]'>
          {isPasswordStep
            ? 'Use your password or choose a magic link'
            : 'Enter your email address to continue'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='space-y-6 w-full max-w-[450px] mx-auto'
      >
        <AnimatePresence>
          {error ? (
            <FormErrorAlert
              title='Login Failed'
              message={error}
              onDismiss={onDismissError}
            />
          ) : null}
        </AnimatePresence>

        {isPasswordStep ? (
          <>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='text-xs font-medium uppercase tracking-[0.14em] text-grey-500'>
                  Signing in as
                </p>
                <p className='mt-1 truncate text-base font-semibold text-grey-900 sm:text-lg'>
                  {email}
                </p>
              </div>
              <button
                type='button'
                onClick={onBackToEmail}
                className='shrink-0 text-sm font-medium text-primary-500 underline underline-offset-2 transition-colors hover:text-primary-600'
              >
                Change
              </button>
            </div>

            <AnimatePresence>
              {emailError ? (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='text-error-500 text-xs -mt-3 overflow-hidden'
                >
                  {emailError}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className='flex flex-col gap-1'>
              <label
                htmlFor='password'
                className='text-sm font-medium leading-[145%] text-grey-900'
              >
                Password
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={onPasswordChange}
                placeholder='Enter your password'
                className={`w-full text-sm px-3 py-3.5 border rounded-[12px] outline-none focus:ring-1 transition-all duration-200 text-blackish placeholder-grey-400 ${
                  passwordError
                    ? 'border-error-500 focus:ring-error-500 focus:border-transparent'
                    : 'border-grey-50 focus:ring-primary-500 focus:border-transparent'
                }`}
                required
              />
              <AnimatePresence>
                {passwordError ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='text-error-500 text-xs mt-1 overflow-hidden'
                  >
                    {passwordError}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            <div className='flex justify-end'>
              <Link
                href={resetPasswordHref}
                className='text-sm font-medium text-primary-500 underline underline-offset-2 transition-colors hover:text-primary-600'
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: password && !isLoading ? 1.01 : 1 }}
              whileTap={{ scale: password && !isLoading ? 0.99 : 1 }}
              onClick={(event) => {
                event.preventDefault()
                onPasswordLogin(event)
              }}
              disabled={isLoading || !password}
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

            <button
              type='button'
              onClick={(event) => {
                event.preventDefault()
                onRequestMagicLink(event)
              }}
              disabled={isLoading}
              className='w-full py-3.5 rounded-xl border border-grey-200 bg-white text-grey-800 font-medium hover:border-primary-200 hover:bg-primary-50/40 transition-colors disabled:opacity-60'
            >
              Send Magic Link Instead
            </button>
          </>
        ) : (
          <>
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='email'
                className='text-sm font-medium leading-[145%] text-grey-900'
              >
                Email Address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                autoComplete='email'
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
                {emailError ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='text-error-500 text-xs mt-1 overflow-hidden'
                  >
                    {emailError}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: isValidEmail && !isLoading ? 1.01 : 1 }}
              whileTap={{ scale: isValidEmail && !isLoading ? 0.99 : 1 }}
              onClick={(event) => {
                event.preventDefault()
                onContinue(event)
              }}
              disabled={isLoading || !isValidEmail}
              className='w-full py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl duration-200 hover:from-primary-500 hover:to-primary-700 disabled:from-primary-400/50 disabled:to-primary-600/50 disabled:border-none disabled:cursor-not-allowed transition-colors'
            >
              Continue
            </motion.button>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className='flex flex-col gap-7 w-full max-w-[450px] mx-auto'
      >
        <p className='text-center text-grey-600 sm:text-xl font-medium mb-6'>
          Don&apos;t have an account?{' '}
          <Link
            href={registerHref}
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
