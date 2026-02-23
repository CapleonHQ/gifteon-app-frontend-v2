import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  archivePage,
  getPageById,
  getPages,
  unarchivePage,
} from '@/api/services/pages'
import { ApiResponse } from '@/types/Common'
import {
  PageDetails,
  PageDetailsApiData,
  PagesListApiData,
  PagesListData,
  PagesQueryParams,
} from '@/types/Pages'
import { mapPageDetails, mapPagesListData } from '@/lib/pages/transformers'

type PagesResponse = Omit<ApiResponse<PagesListApiData>, 'data'> & {
  data: PagesListData
}

type PageDetailsResponse = Omit<ApiResponse<PageDetailsApiData>, 'data'> & {
  data: PageDetails | null
}

export const usePages = (params?: PagesQueryParams) => {
  return useQuery({
    queryKey: ['pages', params],
    queryFn: () => getPages(params),
    select: (response): PagesResponse => ({
      ...response,
      data: mapPagesListData(response.data),
    }),
  })
}

export const usePageById = (pageId: string) => {
  return useQuery({
    queryKey: ['pages', pageId],
    queryFn: () => getPageById(pageId),
    enabled: pageId.length > 0,
    select: (response): PageDetailsResponse => ({
      ...response,
      data: mapPageDetails(response.data),
    }),
  })
}

export const useArchivePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: archivePage,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pages'] }),
        queryClient.invalidateQueries({ queryKey: ['stats', 'overview'] }),
      ])
    },
  })
}

export const useUnarchivePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unarchivePage,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pages'] }),
        queryClient.invalidateQueries({ queryKey: ['stats', 'overview'] }),
      ])
    },
  })
}
