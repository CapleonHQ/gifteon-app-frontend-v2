import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'

export const getPageActivities = async (
  pageId: string
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    `/pages/${pageId}/activities`
  )
  return resp.data
}

export const getRecentPageActivities = async (
  pageId: string
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    `/pages/${pageId}/activities/recent`
  )
  return resp.data
}
