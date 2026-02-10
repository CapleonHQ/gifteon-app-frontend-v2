import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'

export const createPageCategory = async (
  data: FormData
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.post(
    '/page/categories/create',
    data,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return resp.data
}

export const getPages = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/pages'
  )
  return resp.data
}

export const getPageById = async (id: string): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    `/pages/uid/${id}`
  )
  return resp.data
}

export const getPageBySlug = async (slug: string): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    `/pages/${slug}`
  )
  return resp.data
}

export const createPage = async (data: FormData): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.post(
    '/pages/create',
    data,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return resp.data
}
