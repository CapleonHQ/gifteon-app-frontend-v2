export interface ApiResponse<T> {
  status?: string
  success?: boolean
  message: string
  data?: T
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'BAD_REQUEST'
  | 'UNKNOWN'

export type FieldErrors = Record<string, string[]>

export interface NormalizedApiError {
  ok: false
  code: ApiErrorCode
  message: string
  status?: number
  details?: string
  fieldErrors?: FieldErrors
  requestId?: string
  endpoint?: string
  method?: string
  raw?: unknown
}
