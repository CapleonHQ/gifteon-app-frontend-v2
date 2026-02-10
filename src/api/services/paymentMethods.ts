import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'

export const getPaymentMethods = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/payment-methods'
  )
  return resp.data
}

export const removePaymentMethod = async (
  id: string
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.delete(
    `/payment-methods/${id}`
  )
  return resp.data
}

export const setDefaultPaymentMethod = async (
  id: string
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.put(
    `/payment-methods/${id}/set-default`
  )
  return resp.data
}
