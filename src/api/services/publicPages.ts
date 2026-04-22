import { AxiosResponse } from 'axios'
import apiService from '../'
import { getAccessToken } from '../token'
import { ApiResponse } from '@/types/Common'
import type {
  CreateCommentRequestBody,
  PageCommentsData,
  PageCommentsQueryParams,
} from '@/types/Comments'
import type {
  PublicPageActivitiesData,
  PublicPageApiData,
  PublicPagesListApiData,
  PublicPagesQueryParams,
} from '@/types/PublicPages'

export const getPublicPageBySlug = async (
  slug: string
): Promise<ApiResponse<PublicPageApiData>> => {
  const resp: AxiosResponse<ApiResponse<PublicPageApiData>> =
    await apiService.appPublic.get(`/pages/${slug}`)
  return resp.data
}

export const getPublicPages = async (
  params?: PublicPagesQueryParams
): Promise<ApiResponse<PublicPagesListApiData>> => {
  const resp: AxiosResponse<ApiResponse<PublicPagesListApiData>> =
    await apiService.appPublic.get('/pages/public', { params })
  return resp.data
}

export const getPublicPageComments = async (
  pageId: string,
  params?: PageCommentsQueryParams
): Promise<ApiResponse<PageCommentsData>> => {
  const resp: AxiosResponse<ApiResponse<PageCommentsData>> =
    await apiService.appPublic.get(`/pages/${pageId}/comments`, { params })
  return resp.data
}

export const createPublicPageComment = async (
  pageId: string,
  data: CreateCommentRequestBody
): Promise<ApiResponse<object>> => {
  const token = getAccessToken()
  const resp: AxiosResponse<ApiResponse<object>> =
    await apiService.appPublic.post(
      `/pages/${pageId}/comments`,
      data,
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined
    )
  return resp.data
}

export type { CreateCommentRequestBody }

export const getPublicPageActivities = async (
  pageId: string,
  params?: { limit?: number; offset?: number }
): Promise<ApiResponse<PublicPageActivitiesData>> => {
  const resp: AxiosResponse<ApiResponse<PublicPageActivitiesData>> =
    await apiService.appPublic.get(`/pages/${pageId}/activities`, { params })
  return resp.data
}
