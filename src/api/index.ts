import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URLS, API_DEFAULT_TIMEOUT_MS, API_KEY } from './config'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './token'
import { normalizeApiError } from './error'
import { logout } from './auth'
import { refreshToken as refreshTokenRequest } from './services/auth'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthLogout?: boolean
    skipAuthRefresh?: boolean
  }
}

const hasAuthHeader = (config?: InternalAxiosRequestConfig): boolean => {
  const header =
    config?.headers?.Authorization ?? config?.headers?.authorization ?? ''
  return typeof header === 'string' && header.startsWith('Bearer ')
}

let refreshPromise: Promise<void> | null = null

const shouldSkipRefresh = (config?: InternalAxiosRequestConfig): boolean => {
  return Boolean(config?.skipAuthRefresh)
}

const isRefreshEndpoint = (url?: string): boolean => {
  if (!url) return false
  try {
    const path = url.startsWith('http') ? new URL(url).pathname : url
    return path.includes('/refresh-token')
  } catch {
    return url.includes('/refresh-token')
  }
}

const refreshTokens = async (): Promise<void> => {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('Missing refresh token')
    }

    const resp = await refreshTokenRequest(refreshToken)
    const accessToken = resp.data?.accessToken ?? ''
    const newRefreshToken = resp.data?.refreshToken ?? ''

    if (accessToken) {
      setAccessToken(accessToken)
    } else {
      throw new Error('Missing access token in refresh response')
    }
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken)
    }
  })()

  try {
    await refreshPromise
  } finally {
    refreshPromise = null
  }
}

interface CreateClientOptions {
  withAuth?: boolean
}

const createClient = (
  baseURL: string,
  options: CreateClientOptions = {}
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: API_DEFAULT_TIMEOUT_MS,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
    },
  })

  if (options.withAuth) {
    instance.interceptors.request.use((config) => {
      const token = getAccessToken()
      if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const normalized = normalizeApiError(error)
      const isUnauthorized = normalized.code === 'UNAUTHORIZED'
      const canRefresh =
        isUnauthorized &&
        !shouldSkipRefresh(error?.config) &&
        !isRefreshEndpoint(error?.config?.url) &&
        hasAuthHeader(error?.config)

      if (canRefresh) {
        try {
          await refreshTokens()
          const retryConfig = error.config as InternalAxiosRequestConfig
          retryConfig.headers = retryConfig.headers ?? {}
          retryConfig.headers.Authorization = `Bearer ${getAccessToken()}`
          return instance.request(retryConfig)
        } catch {
          // fall through to logout below
        }
      }

      const shouldLogout =
        isUnauthorized &&
        !error?.config?.skipAuthLogout &&
        hasAuthHeader(error?.config)

      if (shouldLogout) {
        logout({ redirectTo: '/login' })
      }
      return Promise.reject(normalized)
    }
  )

  return instance
}

const apiService = {
  authPublic: createClient(API_BASE_URLS.auth),
  authPrivate: createClient(API_BASE_URLS.auth, { withAuth: true }),
  appPublic: createClient(API_BASE_URLS.app),
  appPrivate: createClient(API_BASE_URLS.app, { withAuth: true }),
}

export default apiService
