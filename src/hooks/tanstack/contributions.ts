import { useQuery } from '@tanstack/react-query'
import { getContributions } from '@/api/services/contributions'
import { ApiResponse } from '@/types/Common'
import {
  ContributionsListData,
  ContributionsQueryParams,
} from '@/types/Contributions'

export const useContributions = (params?: ContributionsQueryParams) => {
  return useQuery<ApiResponse<ContributionsListData>>({
    queryKey: ['contributions', params],
    queryFn: () => getContributions(params),
  })
}
