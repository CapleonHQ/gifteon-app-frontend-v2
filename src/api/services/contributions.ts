import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  ContributionsListData,
  PageContributionsApiData,
  PageContributionsQueryParams,
} from '@/types/Contributions'

export const getPageContributions = async (
  pageId: string,
  params?: PageContributionsQueryParams
): Promise<ApiResponse<PageContributionsApiData>> => {
  const resp: AxiosResponse<ApiResponse<PageContributionsApiData>> =
    await apiService.appPrivate.get(`/pages/${pageId}/contributions`, {
      params,
    })
  return resp.data
}

export const getContributions = async (): Promise<
  ApiResponse<ContributionsListData>
> => {
  const resp: AxiosResponse<ApiResponse<ContributionsListData>> =
    await apiService.appPrivate.get('/contributions')
  return resp.data
}

export const getPageContributionsSummary = async (
  pageId: string
): Promise<ApiResponse<unknown>> => {
  const resp: AxiosResponse<ApiResponse<unknown>> =
    await apiService.appPrivate.get(`/pages/${pageId}/contributions/summary`)
  return resp.data
}
