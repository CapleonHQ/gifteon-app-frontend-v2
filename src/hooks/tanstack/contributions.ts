import { useQuery } from '@tanstack/react-query'
import { getContributions } from '@/api/services/contributions'
import { ApiResponse } from '@/types/Common'
import { PageContribution } from '@/types/Contributions'

export const useContributions = () => {
  return useQuery<ApiResponse<PageContribution[]>>({
    queryKey: ['contributions'],
    queryFn: getContributions,
  })
}
