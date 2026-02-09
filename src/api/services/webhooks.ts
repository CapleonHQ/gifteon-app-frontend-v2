import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'

export const stripeWebhook = async (data: unknown): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPublic.post(
    '/webhooks/stripe',
    data
  )
  return resp.data
}

export const paystackWebhook = async (data: unknown): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPublic.post(
    '/webhooks/paystack',
    data
  )
  return resp.data
}
