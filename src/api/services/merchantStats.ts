import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'

export const getMerchantStatsOverview = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/merchant/stats/overview'
  )
  return resp.data
}

export const getMerchantSalesChart = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/merchant/stats/sales-chart'
  )
  return resp.data
}

export const getMerchantProductInsights = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/merchant/stats/product-insights'
  )
  return resp.data
}

export const getMerchantRecentOrders = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/merchant/stats/recent-orders'
  )
  return resp.data
}
