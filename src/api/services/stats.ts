import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'

export const getStatsOverview = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/stats/overview'
  )
  return resp.data
}

export const getStatsVisitsSharesChart = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/stats/visits-shares-chart'
  )
  return resp.data
}

export const getStatsGiftTypeDistribution = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/stats/gift-type-distribution'
  )
  return resp.data
}
