import { useInfiniteQuery } from '@tanstack/react-query'
import { getPageContributions } from '@/api/services/contributions'
import { ApiResponse } from '@/types/Common'
import { PageContribution, PageContributionsApiData } from '@/types/Contributions'

const DEFAULT_CONTRIBUTIONS_LIMIT = 20

export const usePageContributions = (
  pageId: string,
  limit = DEFAULT_CONTRIBUTIONS_LIMIT
) => {
  return useInfiniteQuery<ApiResponse<PageContributionsApiData>>({
    queryKey: ['page-details', pageId, 'contributions', limit],
    queryFn: ({ pageParam }) =>
      getPageContributions(pageId, { limit, offset: pageParam as number }),
    enabled: pageId.length > 0,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const page = lastPage.data
      if (!page?.hasMore) return undefined
      return (page.offset ?? 0) + (page.limit ?? limit)
    },
  })
}

export const flattenContributionPages = (
  pages: Array<ApiResponse<PageContributionsApiData>> | undefined
): PageContribution[] => {
  if (!pages) return []
  return pages.flatMap((page) => page.data?.contributions ?? [])
}
