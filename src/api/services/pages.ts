import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  CreatePageData,
  PageDetails,
  PagesListData,
  PagesQueryParams,
} from '@/types/Pages'

export const createPageCategory = async (
  data: FormData
): Promise<ApiResponse<unknown>> => {
  const resp: AxiosResponse<ApiResponse<unknown>> =
    await apiService.appPrivate.post('/page/categories/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  return resp.data
}

export const getPages = async (
  params?: PagesQueryParams
): Promise<ApiResponse<PagesListData | unknown>> => {
  const resp: AxiosResponse<ApiResponse<PagesListData | unknown>> =
    await apiService.appPrivate.get('/pages', { params })
  return resp.data
}

export const getPageById = async (
  id: string
): Promise<ApiResponse<PageDetails | unknown>> => {
  const resp: AxiosResponse<ApiResponse<PageDetails | unknown>> =
    await apiService.appPrivate.get(`/pages/uid/${id}`)
  return resp.data
}

export const getPageBySlug = async (
  slug: string
): Promise<ApiResponse<unknown>> => {
  const resp: AxiosResponse<ApiResponse<unknown>> =
    await apiService.appPrivate.get(`/pages/${slug}`)
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
