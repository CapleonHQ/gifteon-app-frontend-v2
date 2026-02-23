import { useInfiniteQuery } from '@tanstack/react-query'
import { getComments } from '@/api/services/comments'
import { ApiResponse } from '@/types/Common'
import { PageCommentsData } from '@/types/Comments'
import { mapCommentsToWishes } from '@/lib/comments/transformers'

const DEFAULT_COMMENTS_LIMIT = 20

const toSortParam = (sort: string): 'asc' | 'desc' =>
  sort === 'oldest' ? 'asc' : 'desc'

export const usePageComments = (
  pageId: string,
  sort = 'most-recent',
  limit = DEFAULT_COMMENTS_LIMIT
) => {
  return useInfiniteQuery<ApiResponse<PageCommentsData>>({
    queryKey: ['page-details', pageId, 'comments', sort, limit],
    queryFn: ({ pageParam }) =>
      getComments(pageId, {
        limit,
        offset: pageParam as number,
        sort: toSortParam(sort),
      }),
    enabled: pageId.length > 0,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const page = lastPage.data
      if (!page?.hasMore) return undefined
      return (page.offset ?? 0) + (page.limit ?? limit)
    },
  })
}

export const flattenWishPages = (
  pages: Array<ApiResponse<PageCommentsData>> | undefined
) => {
  if (!pages) return []
  return pages.flatMap((page) => mapCommentsToWishes(page.data))
}
