import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'

export const getPaymentMethods = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/payment-methods'
  )
  return resp.data
}

export const removePaymentMethod = async (
  id: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.delete(
    `/payment-methods/${id}`
  )
  return resp.data
}

export const setDefaultPaymentMethod = async (
  id: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.put(
    `/payment-methods/${id}/set-default`
  )
  return resp.data
}
