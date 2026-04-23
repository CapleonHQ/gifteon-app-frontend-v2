import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  ClaimGiftsRequestBody,
  CreatePageData,
  PageDetailsApiData,
  PageShareProvider,
  PagesListApiData,
  PagesQueryParams,
} from '@/types/Pages'
import { generateIdempotencyKey } from '@/lib/utils/idempotency'

export const createPageCategory = async (
  data: FormData
): Promise<ApiResponse<object>> => {
  const resp: AxiosResponse<ApiResponse<object>> =
    await apiService.appPrivate.post('/page/categories/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  return resp.data
}

export const getPageCategories = async (): Promise<ApiResponse<object[]>> => {
  const resp: AxiosResponse<ApiResponse<object[]>> =
    await apiService.appPrivate.get('/page/categories')
  return resp.data
}

export const getPages = async (
  params?: PagesQueryParams
): Promise<ApiResponse<PagesListApiData>> => {
  const resp: AxiosResponse<ApiResponse<PagesListApiData>> =
    await apiService.appPrivate.get('/pages', { params })
  return resp.data
}

export const getPageById = async (
  id: string
): Promise<ApiResponse<PageDetailsApiData>> => {
  const resp: AxiosResponse<ApiResponse<PageDetailsApiData>> =
    await apiService.appPrivate.get(`/pages/uid/${id}`)
  return resp.data
}

export const createPage = async (
  data: FormData
): Promise<ApiResponse<CreatePageData>> => {
  const resp: AxiosResponse<ApiResponse<CreatePageData>> =
    await apiService.appPrivate.post('/pages/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  return resp.data
}

export const archivePage = async (
  ids: string[]
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.appPrivate.post('/pages/archive', { ids })
  return resp.data
}

export const unarchivePage = async (
  ids: string[]
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.appPrivate.post('/pages/unarchive', { ids })
  return resp.data
}

export const recordPageShare = async (
  slug: string,
  provider: PageShareProvider
): Promise<ApiResponse<object>> => {
  const resp: AxiosResponse<ApiResponse<object>> =
    await apiService.appPrivate.post(`/pages/${slug}/share`, { provider })
  return resp.data
}

export const claimCashGifts = async (
  idempotencyKey = generateIdempotencyKey()
): Promise<ApiResponse<object>> => {
  const resp: AxiosResponse<ApiResponse<object>> =
    await apiService.appPrivate.post('/pages/claim/cash-gifts', undefined, {
      headers: { 'idempotency-key': idempotencyKey },
    })
  return resp.data
}

export const claimGifts = async (
  data: ClaimGiftsRequestBody,
  idempotencyKey = generateIdempotencyKey()
): Promise<ApiResponse<object>> => {
  const resp: AxiosResponse<ApiResponse<object>> =
    await apiService.appPrivate.post('/pages/claim', data, {
      headers: { 'idempotency-key': idempotencyKey },
    })
  return resp.data
}
