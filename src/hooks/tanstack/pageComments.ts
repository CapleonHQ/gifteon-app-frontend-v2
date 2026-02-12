import { useQuery } from '@tanstack/react-query'
import { getComments } from '@/api/services/comments'
import { ApiResponse } from '@/types/Common'
import { PageCommentsData } from '@/types/Comments'
import { WishItem } from '@/types/Gifts/giftDetails'
import { mapCommentsToWishes } from '@/lib/comments/transformers'

type PageCommentsResponse = Omit<ApiResponse<PageCommentsData>, 'data'> & {
  data: WishItem[]
}

export const usePageComments = (pageId: string) => {
  return useQuery({
    queryKey: ['page-details', pageId, 'comments'],
    queryFn: () => getComments(pageId),
    enabled: pageId.length > 0,
    select: (response): PageCommentsResponse => ({
      ...response,
      data: mapCommentsToWishes(response.data),
    }),
  })
}
