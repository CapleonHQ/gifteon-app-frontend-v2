'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/api/services'
import { refreshToken as refreshTokenRequest } from '@/api/services/auth'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/api/token'
import { toApiError } from '@/api/errorHelpers'

const REFRESH_INTERVAL_MS = 10 * 60 * 1000

type AuthState = 'checking' | 'ready'

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [state, setState] = useState<AuthState>('checking')
  const inFlightRef = useRef(false)

  const ensureAuth = async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true

    try {
      const accessToken = getAccessToken()
      const refreshToken = getRefreshToken()

      if (!accessToken && !refreshToken) {
        router.replace('/login')
        return
      }

      if (!accessToken && refreshToken) {
        const resp = await refreshTokenRequest(refreshToken)
        const newAccessToken = resp.data?.accessToken
        const newRefreshToken = resp.data?.refreshToken

        if (newAccessToken) {
          setAccessToken(newAccessToken)
        } else {
          router.replace('/login')
          return
        }

        if (newRefreshToken) {
          setRefreshToken(newRefreshToken)
        }
      }

      await getProfile()
      setState('ready')
    } catch (error: unknown) {
      const apiError = toApiError(error)
      if (apiError.code === 'UNAUTHORIZED') {
        router.replace('/login')
        return
      }
      router.replace('/login')
    } finally {
      inFlightRef.current = false
    }
  }

  useEffect(() => {
    ensureAuth()
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      ensureAuth()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.hidden || !navigator.onLine) return
      ensureAuth()
    }, REFRESH_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [])

  if (state !== 'ready') {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-grey-50'>
        <div className='flex items-center gap-3 text-grey-600'>
          <div className='w-10 h-10 lg:w-14 lg:h-14 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard
