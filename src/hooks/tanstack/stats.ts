import { useQuery } from '@tanstack/react-query'
import {
  getStatsGiftTypeDistribution,
  getStatsOverview,
  getStatsVisitsSharesChart,
} from '@/api/services/stats'
import type { VisitSharesQueryParams } from '@/types/Stats'

export const useStatsOverview = () => {
  return useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: getStatsOverview,
  })
}

export const useGiftTypeDistribution = () => {
  return useQuery({
    queryKey: ['stats', 'gift-type-distribution'],
    queryFn: getStatsGiftTypeDistribution,
  })
}

export const useVisitSharesChart = (params: VisitSharesQueryParams) => {
  return useQuery({
    queryKey: ['stats', 'visits-shares-chart', params],
    queryFn: () => getStatsVisitsSharesChart(params),
  })
}
