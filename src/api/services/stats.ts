import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  GiftTypeDistributionData,
  StatsOverviewData,
  VisitSharesChartData,
  VisitSharesQueryParams,
} from '@/types/Stats'

export const getStatsOverview = async (): Promise<ApiResponse<StatsOverviewData>> => {
  const resp: AxiosResponse<ApiResponse<StatsOverviewData>> =
    await apiService.appPrivate.get(
    '/stats/overview'
  )
  return resp.data
}

export const getStatsVisitsSharesChart = async (
  params: VisitSharesQueryParams
): Promise<ApiResponse<VisitSharesChartData>> => {
  const resp: AxiosResponse<ApiResponse<VisitSharesChartData>> =
    await apiService.appPrivate.get('/stats/visits-shares-chart', { params })
  return resp.data
}

export const getStatsGiftTypeDistribution = async (): Promise<
  ApiResponse<GiftTypeDistributionData>
> => {
  const resp: AxiosResponse<ApiResponse<GiftTypeDistributionData>> =
    await apiService.appPrivate.get('/stats/gift-type-distribution')
  return resp.data
}
