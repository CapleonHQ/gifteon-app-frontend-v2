import { NormalizedApiError } from '@/types/Common'
import { normalizeApiError } from './error'

export const isApiError = (error: unknown): error is NormalizedApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as NormalizedApiError).ok === false &&
    typeof (error as NormalizedApiError).message === 'string'
  )
}

export const toApiError = (error: unknown): NormalizedApiError => {
  return isApiError(error) ? error : normalizeApiError(error)
}
