import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPublicPageComment,
  getPublicPageActivities,
  getPublicPageBySlug,
  getPublicPageComments,
  type CreateCommentRequestBody,
  type PublicPageActivitiesData,
} from '@/api/services/publicPages'
import type { ApiResponse } from '@/types/Common'
import type { PageCommentsData } from '@/types/Comments'

const DEFAULT_PUBLIC_COMMENTS_LIMIT = 4
const DEFAULT_PUBLIC_ACTIVITIES_LIMIT = 8

const toSortParam = (sort: 'most-recent' | 'oldest'): 'ASC' | 'DESC' =>
  sort === 'oldest' ? 'ASC' : 'DESC'

export const usePublicPageBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['public-page', slug],
    queryFn: () => getPublicPageBySlug(slug),
    enabled: slug.length > 0,
  })
}

export const usePublicPageComments = (
  pageId: string,
  sort: 'most-recent' | 'oldest' = 'most-recent',
  limit = DEFAULT_PUBLIC_COMMENTS_LIMIT
) => {
  return useInfiniteQuery<ApiResponse<PageCommentsData>>({
    queryKey: ['public-page', pageId, 'comments', sort, limit],
    queryFn: ({ pageParam }) =>
      getPublicPageComments(pageId, {
        limit,
        offset: pageParam as number,
        sortBy: toSortParam(sort),
      }),
    enabled: pageId.length > 0,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const data = lastPage.data
      if (!data?.hasMore) return undefined
      return (data.offset ?? 0) + (data.limit ?? limit)
    },
  })
}

export const usePublicPageActivities = (
  pageId: string,
  limit = DEFAULT_PUBLIC_ACTIVITIES_LIMIT
) => {
  return useInfiniteQuery<ApiResponse<PublicPageActivitiesData>>({
    queryKey: ['public-page', pageId, 'activities', limit],
    queryFn: ({ pageParam }) =>
      getPublicPageActivities(pageId, {
        limit,
        offset: pageParam as number,
      }),
    enabled: pageId.length > 0,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pageData = lastPage.data
      if (pageData?.hasMore !== true) return undefined
      return (pageData.offset ?? 0) + (pageData.limit ?? limit)
    },
  })
}

export const useCreatePublicPageComment = (pageId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCommentRequestBody) =>
      createPublicPageComment(pageId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['public-page', pageId, 'comments'],
      })
    },
  })
}
