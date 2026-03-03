'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import OnboardingLogo from '../components/OnboardingLogo'
import MagicLinkError from './components/MagicLinkError'
import MagicLinkLoading from './components/MagicLinkLoading'
import RegisterSuccessStep from '../register/components/RegisterSuccessStep'
import { verifyMagicLink } from '@/api/services/auth'
import { setAccessToken, setRefreshToken } from '@/api/token'
import { toApiError } from '@/api/errorHelpers'
import { useAuth } from '@/context/AuthContext'

type VerificationState = 'loading' | 'success' | 'error'

const MagicLinkVerifyContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const [verificationState, setVerificationState] =
    useState<VerificationState>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token')

      if (!token) {
        router.push('/')
        return
      }

      try {
        const resp = await verifyMagicLink(token)
        const action = searchParams.get('action')?.toLowerCase()

        if (resp.accessToken) {
          setAccessToken(resp.accessToken)
        }
        if (resp.refreshToken) {
          setRefreshToken(resp.refreshToken)
        }
        await refreshUser()

        if (action === 'register') {
          setVerificationState('success')
        } else {
          router.push('/dashboard')
        }
      } catch (error: unknown) {
        const apiError = toApiError(error)
        setVerificationState('error')
        if (
          apiError.code === 'UNAUTHORIZED' ||
          apiError.code === 'NOT_FOUND' ||
          apiError.code === 'FORBIDDEN'
        ) {
          setErrorMessage('This magic link is invalid or has expired')
        } else {
          setErrorMessage(apiError.message)
        }
      }
    }

    verifyToken()
  }, [searchParams, router, refreshUser])

  const renderCurrentState = () => {
    switch (verificationState) {
      case 'loading':
        return <MagicLinkLoading />
      case 'success':
        return (
          <RegisterSuccessStep onProceed={() => router.push('/dashboard')} />
        )
      case 'error':
        return <MagicLinkError message={errorMessage} />
      default:
        return <MagicLinkLoading />
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
    <Suspense
      fallback={
        <main className='bg-base-bg px-4 py-10 sm:px-6 lg:px-10'>
          <section className='mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-[900px] flex-col items-center justify-center rounded-[20px] border border-grey-100 bg-white/80 p-6 text-center shadow-[0px_20px_40px_-24px_#1019282E] backdrop-blur-[2px] sm:p-10'>
            <span className='inline-flex h-24 w-24 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500 sm:h-28 sm:w-28' />
            <p className='mt-6 text-base leading-7 text-grey-700 sm:text-lg'>
              Loading...
            </p>
          </section>
        </main>
      }
    >
      <MagicLinkVerifyContent />
    </Suspense>
  )
}

export default MagicLinkVerifyPage
