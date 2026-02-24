import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import type {
  CreateCommentRequestBody,
  PageCommentsData,
  PageCommentsQueryParams,
} from '@/types/Comments'

export type PublicPageApiSocial = {
  provider?: string
  url?: string
}

export type PublicPageApiData = {
  id: string
  slug: string
  title: string
  content?: string | null
  coverImageUrl?: string | null
  templateId?: string | null
  template?: {
    id?: string
    name?: string
  } | null
  titleFont?: string | null
  titleColor?: string | null
  textAlignment?: 'left' | 'middle' | 'right' | string | null
  titleFormat?: string | null
  titleSize?: number | string | null
  buttonLabel?: string | null
  buttonTextColor?: string | null
  buttonBackgroundColor?: string | null
  contentFont?: string | null
  contentColor?: string | null
  contentSize?: number | string | null
  media?: Array<{
    id?: string
    url?: string
    mediaType?: string
    alt?: string | null
  }>
  comments?: Array<Record<string, unknown>>
  activities?: Array<Record<string, unknown>>
  settings?: {
    socials?: PublicPageApiSocial[]
    currency?: string | null
    receiverName?: string | null
  } | null
}

export const getPublicPageBySlug = async (
  slug: string
): Promise<ApiResponse<PublicPageApiData>> => {
  const resp: AxiosResponse<ApiResponse<PublicPageApiData>> =
    await apiService.appPublic.get(`/pages/${slug}`)
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
  const resp: AxiosResponse<ApiResponse<object>> = await apiService.appPublic.post(
    `/pages/${pageId}/comments`,
    data
  )
  return resp.data
}

export const getPublicPageActivities = async (
  pageId: string,
  params?: { limit?: number; offset?: number }
): Promise<ApiResponse<unknown>> => {
  const resp: AxiosResponse<ApiResponse<unknown>> = await apiService.appPublic.get(
    `/pages/${pageId}/activities`,
    { params }
  )
  return resp.data
}
