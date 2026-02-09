import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'

export const getPageContributions = async (
  pageId: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/pages/${pageId}/contributions`
  )
  return resp.data
}

export const getPageContributionsSummary = async (
  pageId: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/pages/${pageId}/contributions/summary`
  )
  return resp.data
}
