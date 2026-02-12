import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { PaginationParams } from '@/types/Common'
import { UpdateOrderStatusRequestBody } from '@/types/Orders'

export const getMerchantOrdersOverview = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/merchant/orders/overview'
  )
  return resp.data
}

export const getMerchantOrders = async (
  params?: PaginationParams
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/merchant/orders',
    { params }
  )
  return resp.data
}

export const getMerchantOrderDetails = async (
  orderId: string
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    `/merchant/orders/${orderId}`
  )
  return resp.data
}

export const updateMerchantOrderStatus = async (
  orderId: string,
  data: UpdateOrderStatusRequestBody
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.put(
    `/merchant/orders/${orderId}/status`,
    data
  )
  return resp.data
}
