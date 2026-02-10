import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { CreateStoreRequestBody, UpdateStoreRequestBody } from '@/types/Stores'

export const createMerchantStore = async (
  data: CreateStoreRequestBody
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.post(
    '/merchant/stores/create',
    data
  )
  return resp.data
}

export const getMerchantStores = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/merchant/stores'
  )
  return resp.data
}

export const getMerchantStoreDetails = async (
  id: string
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    `/merchant/stores/${id}`
  )
  return resp.data
}

export const updateMerchantStore = async (
  id: string,
  data: UpdateStoreRequestBody
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.put(
    `/merchant/stores/${id}`,
    data
  )
  return resp.data
}
