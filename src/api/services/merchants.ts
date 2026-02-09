import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  CreateMerchantRequestBody,
  UpdateMerchantRequestBody,
} from '@/types/Merchants'

export const createMerchant = async (
  data: CreateMerchantRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/merchants/register',
    data
  )
  return resp.data
}

export const getMerchantProfile = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/merchants/profile'
  )
  return resp.data
}

export const updateMerchant = async (
  id: string,
  data: UpdateMerchantRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.put(
    `/merchants/${id}`,
    data
  )
  return resp.data
}

export const getMerchantSettlements = async (
  id: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/merchants/${id}/settlements`
  )
  return resp.data
}
