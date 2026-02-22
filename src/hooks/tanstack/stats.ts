import { useQuery } from '@tanstack/react-query'
import {
  getStatsOverview,
  getStatsVisitsSharesChart,
} from '@/api/services/stats'
import type { ApiResponse } from '@/types/Common'
import type { StatsOverviewData } from '@/types/Stats'
import type { VisitSharesQueryParams } from '@/types/Stats'

export const useStatsOverview = () => {
  return useQuery<ApiResponse<StatsOverviewData>>({
    queryKey: ['stats', 'overview'],
    queryFn: getStatsOverview,
  })
}

export const useVisitSharesChart = (params: VisitSharesQueryParams) => {
  return useQuery({
    queryKey: ['stats', 'visits-shares-chart', params],
    queryFn: () => getStatsVisitsSharesChart(params),
  })
}
