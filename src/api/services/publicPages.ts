import { AxiosResponse } from 'axios'
import apiService from '../'
import { getAccessToken } from '../token'
import { ApiResponse } from '@/types/Common'
import type {
  CreateCommentRequestBody,
  PageCommentsData,
  PageCommentsQueryParams,
} from '@/types/Comments'
import type { PagesQueryParams } from '@/types/Pages'

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

export type PublicPageApiWishListItem = {
  id?: string | null
  type?: string | null
  title?: string | null
  imageUrl?: string | null
  itemId?: string | null
  quantity?: number | string | null
  unitPrice?: number | string | null
  quantityGifted?: number | string | null
  quantityClaimed?: number | string | null
  quantityClaimable?: number | string | null
  status?: string | null
  source?: string | null
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
  wishListItems?: PublicPageApiWishListItem[]
  storeItems?: Array<Record<string, unknown>>
}

export type PublicPageApiActivity = {
  id: string
  message: string
  createdAt: string
  updatedAt: string
}

export type PublicPageActivitiesData = {
  activities: PublicPageApiActivity[]
  total?: number
  limit?: number
  offset?: number
  hasMore?: boolean
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
  settings?: PublicPageApiSettings | null
  owner: {
    firstName: string
    lastName: string
    gender: 'male' | 'female'
  }
}

export type PublicPageListApiItem = {
  id: string
  title: string
  content: string
  slug: string
  coverImageUrl: string
  status: string
  createdAt: string
  updatedAt: string
  categoryName: string | null
  templateName: string | null
  totalGifts: number
  totalWishes: number
  totalViews: number
}

export type PublicPagesListApiData = {
  pages: PublicPageListApiItem[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export type PublicPagesQueryParams = Pick<
  PagesQueryParams,
  'limit' | 'offset' | 'startdate' | 'enddate' | 'visibility' | 'status' | 'category' | 's'
>

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
