import { useQuery } from '@tanstack/react-query'
import { getContributions } from '@/api/services/contributions'
import { ApiResponse } from '@/types/Common'
import { ContributionsListData } from '@/types/Contributions'

export const useContributions = () => {
  return useQuery<ApiResponse<ContributionsListData>>({
    queryKey: ['contributions'],
    queryFn: getContributions,
  })
}
