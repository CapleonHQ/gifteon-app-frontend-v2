import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  CreatePageData,
  PageDetailsApiData,
  PagesListApiData,
  PagesQueryParams,
} from '@/types/Pages'

export const createPageCategory = async (
  data: FormData
): Promise<ApiResponse<object>> => {
  const resp: AxiosResponse<ApiResponse<object>> =
    await apiService.appPrivate.post('/page/categories/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
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

export const getPageBySlug = async (
  slug: string
): Promise<ApiResponse<object>> => {
  const resp: AxiosResponse<ApiResponse<object>> =
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

export const archivePage = async (
  id: string
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.appPrivate.post(`/pages/${id}/archive`)
  return resp.data
}

export const unarchivePage = async (
  id: string
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.appPrivate.post(`/pages/${id}/unarchive`)
  return resp.data
}
