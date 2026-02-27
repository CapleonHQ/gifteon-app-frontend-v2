import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import type {
  CreateCommentRequestBody,
  PageCommentsData,
  PageCommentsQueryParams,
} from '@/types/Comments'

export type PublicPageApiSocial = {
  id?: string
  provider?: string
  url?: string
}

export type PublicPageApiMedia = {
  id?: string
  url?: string
  mediaType?: string
  alt?: string | null
}

export type PublicPageApiCategory = {
  id?: string
  name?: string
  avatar?: string | null
}

export type PublicPageApiTemplate = {
  id?: string
  name?: string
}

export type PublicPageApiSettings = {
  id?: string
  whoIsFor?: string | null
  hasMusic?: boolean
  allowCustomGifts?: boolean
  privacy?: 'public' | 'private' | 'shareable' | string
  acceptCashGift?: boolean
  currency?: string | null
  allowParticipation?: boolean
  receiverName?: string | null
  receiverEmail?: string | null
  receiverDeliveryAddress?: string | null
  receiverPhoneNumber?: string | null
  minimumAmount?: string | null
  maximumAmount?: string | null
  amount?: string | null
  targetAmount?: string | null
  hasStoreItems?: boolean
  deletedAt?: string | null
  socials?: PublicPageApiSocial[]
  customGifts?: Array<Record<string, unknown>>
  storeItems?: Array<Record<string, unknown>>
}

export type PublicPageApiData = {
  id: string
  status?: string
  active?: boolean
  views?: number
  userId?: string
  categoryId?: string
  slug: string
  title: string
  content?: string | null
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  coverImageUrl?: string | null
  templateId?: string | null
  template?: PublicPageApiTemplate | null
  category?: PublicPageApiCategory | null
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
  media?: PublicPageApiMedia[]
  comments?: Array<Record<string, unknown>>
  activities?: Array<Record<string, unknown>>
  settings?: PublicPageApiSettings | null
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

export type { CreateCommentRequestBody }

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
