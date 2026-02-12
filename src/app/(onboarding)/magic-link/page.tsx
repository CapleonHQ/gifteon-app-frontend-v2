'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import OnboardingLogo from '../components/OnboardingLogo'
import MagicLinkError from './components/MagicLinkError'
import MagicLinkLoading from './components/MagicLinkLoading'
import { verifyMagicLink } from '@/api/services/auth'
import { setAccessToken, setRefreshToken } from '@/api/token'
import { toApiError } from '@/api/errorHelpers'
import { useAuth } from '@/context/AuthContext'

type VerificationState = 'loading' | 'success' | 'error' | 'no-token'

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
        if (resp.accessToken) {
          setAccessToken(resp.accessToken)
        }
        if (resp.refreshToken) {
          setRefreshToken(resp.refreshToken)
        }
        await refreshUser()
        router.push('/dashboard')
      } catch (error: any) {
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
  }, [searchParams, router])

  const renderCurrentState = () => {
    switch (verificationState) {
      case 'loading':
        return <MagicLinkLoading />
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
    <Suspense fallback={<>Loading...</>}>
      <MagicLinkVerifyContent />
    </Suspense>
  )
}

export default MagicLinkVerifyPage
