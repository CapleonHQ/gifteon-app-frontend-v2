'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getProfile } from '@/api/services'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/api/token'
import { refreshToken as refreshTokenRequest } from '@/api/services/auth'
import { AUTH_LOGOUT_EVENT } from '@/api/auth'
import { toApiError } from '@/api/errorHelpers'
import type { UserProfile } from '@/types/Account'

const STORAGE_KEY = 'giftseon:auth:v1'
const CACHE_TTL_MS = 15 * 60 * 1000

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

type AuthCache = {
  version: 1
  user: UserProfile
  lastVerifiedAt: number
}

type AuthContextValue = {
  status: AuthStatus
  user: UserProfile | null
  lastVerifiedAt: number | null
  isOffline: boolean
  connectivityBanner: 'offline' | 'online' | null
  connectivityBannerSession: number
  refreshUser: () => Promise<void>
  clearUser: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readCache = (): AuthCache | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthCache
    if (parsed.version !== 1 || !parsed.user || !parsed.lastVerifiedAt) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

const writeCache = (user: UserProfile, lastVerifiedAt: number) => {
  if (typeof window === 'undefined') return
  const payload: AuthCache = {
    version: 1,
    user,
    lastVerifiedAt,
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const clearCache = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

const isCacheFresh = (lastVerifiedAt: number) => {
  return Date.now() - lastVerifiedAt < CACHE_TTL_MS
}

const isConnectivityError = (code: string) => {
  return code === 'NETWORK_ERROR' || code === 'TIMEOUT'
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('checking')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [lastVerifiedAt, setLastVerifiedAt] = useState<number | null>(null)
  const [isOffline, setIsOffline] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.navigator.onLine
  })
  const [connectivityBanner, setConnectivityBanner] = useState<
    'offline' | 'online' | null
  >(() => {
    if (typeof window === 'undefined') return null
    return window.navigator.onLine ? null : 'offline'
  })
  const [connectivityBannerSession, setConnectivityBannerSession] = useState(() => {
    if (typeof window === 'undefined') return 0
    return window.navigator.onLine ? 0 : 1
  })
  const inFlightRef = useRef(false)
  const userRef = useRef<UserProfile | null>(null)

  const markOffline = useCallback(() => {
    setIsOffline((prev) => {
      if (!prev) {
        setConnectivityBanner('offline')
        setConnectivityBannerSession((session) => session + 1)
      }
      return true
    })
  }, [])

  useEffect(() => {
    userRef.current = user
  }, [user])

  const clearUser = useCallback(() => {
    setUser(null)
    setLastVerifiedAt(null)
    clearCache()
    setStatus('unauthenticated')
  }, [])

  const refreshUser = useCallback(async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true

    try {
      const accessToken = getAccessToken()
      const refreshToken = getRefreshToken()

      if (!accessToken && !refreshToken) {
        clearUser()
        return
      }

      if (!accessToken && refreshToken) {
        const resp = await refreshTokenRequest(refreshToken)
        const newAccessToken = resp.data?.accessToken
        const newRefreshToken = resp.data?.refreshToken

        if (newAccessToken) {
          setAccessToken(newAccessToken)
        } else {
          clearUser()
          return
        }

        if (newRefreshToken) {
          setRefreshToken(newRefreshToken)
        }
      }

      const profile = await getProfile()
      if (profile.data) {
        const now = Date.now()
        setIsOffline(false)
        setUser(profile.data)
        setLastVerifiedAt(now)
        writeCache(profile.data, now)
        setStatus('authenticated')
      } else {
        clearUser()
      }
    } catch (error) {
      const apiError = toApiError(error)
      const browserOffline =
        typeof window !== 'undefined' && !window.navigator.onLine

      if (browserOffline) {
        markOffline()
        if (userRef.current) {
          setStatus('authenticated')
          return
        }
        return
      }

      if (isConnectivityError(apiError.code)) {
        if (userRef.current) {
          setStatus('authenticated')
          return
        }
        return
      }

      if (apiError.code === 'UNAUTHORIZED') {
        clearUser()
        return
      }
      clearUser()
    } finally {
      inFlightRef.current = false
    }
  }, [clearUser, markOffline])

  useEffect(() => {
    const cache = readCache()
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (!accessToken && !refreshToken) {
      clearUser()
      return
    }

    if (cache) {
      setUser(cache.user)
      setLastVerifiedAt(cache.lastVerifiedAt)
      setStatus('authenticated')
      if (isCacheFresh(cache.lastVerifiedAt) || !navigator.onLine) {
        return
      }
    }

    if (!navigator.onLine) {
      markOffline()
      return
    }

    refreshUser()
  }, [refreshUser, clearUser, markOffline])

  useEffect(() => {
    const handleLogout = () => {
      clearUser()
    }

    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout)
  }, [clearUser])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.hidden || !navigator.onLine) return
      if (lastVerifiedAt && isCacheFresh(lastVerifiedAt)) return
      refreshUser()
    }, CACHE_TTL_MS)

    return () => window.clearInterval(interval)
  }, [lastVerifiedAt, refreshUser])

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline((prev) => {
        if (prev) {
          setConnectivityBanner('online')
          setConnectivityBannerSession((session) => session + 1)
        }
        return false
      })
      if (!lastVerifiedAt || !isCacheFresh(lastVerifiedAt)) {
        refreshUser()
      }
    }

    const handleOffline = () => {
      markOffline()
    }

    const handleVisibility = () => {
      if (
        !document.hidden &&
        navigator.onLine &&
        (!lastVerifiedAt || !isCacheFresh(lastVerifiedAt))
      ) {
        refreshUser()
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [lastVerifiedAt, refreshUser, markOffline])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      lastVerifiedAt,
      isOffline,
      connectivityBanner,
      connectivityBannerSession,
      refreshUser,
      clearUser,
    }),
    [
      status,
      user,
      lastVerifiedAt,
      isOffline,
      connectivityBanner,
      connectivityBannerSession,
      refreshUser,
      clearUser,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
