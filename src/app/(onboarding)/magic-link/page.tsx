'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type VerificationState = 'loading' | 'success' | 'error' | 'no-token'

const MagicLinkVerifyContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationState, setVerificationState] =
    useState<VerificationState>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const verifyToken = async () => {
      // Get token from query params
      const token = searchParams.get('token')

      // If no token, redirect to home immediately
      if (!token) {
        router.push('/')
        return
      }

      try {
        // Simulate API call to verify token
        console.log('Verifying token:', token)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate token validation (you would replace this with actual API call)
        // For demo: tokens starting with 'valid' are valid, others are invalid
        const isValidToken = token.startsWith('valid')

        if (isValidToken) {
          // Redirect to dashboard immediately
          console.log('Redirecting to dashboard')
          router.push('/dashboard')
        } else {
          setVerificationState('error')
          setErrorMessage('This magic link is invalid or has expired')
        }
      } catch (error: any) {
        console.error('Verification error:', error)
        setVerificationState('error')
        setErrorMessage('Something went wrong. Please try again.')
      }
    }

    verifyToken()
  }, [searchParams, router])

  const renderLoading = () => (
    <motion.div
      key='loading'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col gap-6 items-center w-full max-w-[450px] mx-auto'
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className='w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full'
      />

      <div className='flex flex-col items-center text-center'>
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          Verifying
        </h2>
        <p className='text-grey-600 sm:text-xl sm:leading-[140%]'>
          Please wait while we verify...
        </p>
      </div>
    </motion.div>
  )

  const renderError = () => (
    <motion.div
      key='error'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col gap-6 items-center w-full max-w-[450px] mx-auto'
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className='w-[110px] h-[110px]'
      >
        <svg
          viewBox='0 0 110 110'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle cx='55' cy='55' r='55' fill='#EF4444' opacity='0.1' />
          <circle cx='55' cy='55' r='40' fill='#EF4444' />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            d='M40 40L70 70M70 40L40 70'
            stroke='white'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='flex flex-col items-center text-center'
      >
        <h2 className='text-[32px] sm:text-[40px] leading-[130%] tracking-[0%] font-semibold text-blackish mb-2'>
          Verification Failed
        </h2>
        <p className='text-grey-600 sm:text-xl sm:leading-[140%] mb-4'>
          {errorMessage}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='w-full'
        >
          <Link href='/'>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className='w-full py-3.5 border border-primary-500 bg-linear-to-r from-primary-400 to-primary-600 text-white font-medium rounded-xl duration-200 hover:from-primary-500 hover:to-primary-700 transition-colors'
            >
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )

  const renderCurrentState = () => {
    switch (verificationState) {
      case 'loading':
        return renderLoading()
      case 'error':
        return renderError()
      default:
        return renderLoading()
    }
  }

  return (
    <div className='px-6'>
      <div className='relative z-10 flex flex-col w-full max-w-[549px] mx-auto min-h-[calc(100vh-100px)] justify-center'>
        <div className='flex-1 flex items-center justify-center px-6 py-12'>
          <div className='w-full max-w-[549px]'>
            {/* Logo */}
            <div className='mb-12'>
              <Link href='/' className='hidden lg:inline-block mb-8 mx-auto'>
                <div className='w-[146px] h-[60px] flex items-center justify-center mx-auto'>
                  <Image
                    src='/assets/images/logo/logo.svg'
                    alt='Giftseon'
                    className='w-full h-full'
                    width={200}
                    height={80}
                  />
                </div>
              </Link>
            </div>

            <AnimatePresence mode='wait'>
              {renderCurrentState()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

const MagicLinkVerifyPage = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <MagicLinkVerifyContent />
    </Suspense>
  )
}

export default MagicLinkVerifyPage
