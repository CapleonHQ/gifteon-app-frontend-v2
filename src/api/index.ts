import axios, { AxiosInstance } from 'axios'
import { API_BASE_URLS, API_DEFAULT_TIMEOUT_MS, API_KEY } from './config'
import { getAccessToken } from './token'

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

  return instance
}

const apiService = {
  authPublic: createClient(API_BASE_URLS.auth),
  authPrivate: createClient(API_BASE_URLS.auth, { withAuth: true }),
  appPublic: createClient(API_BASE_URLS.app),
  appPrivate: createClient(API_BASE_URLS.app, { withAuth: true }),
}

export default apiService
