import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { ConnectBankRequestBody } from '@/types/Banks'

export const connectBank = async (
  data: ConnectBankRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/connected-banks/connect',
    data
  )
  return resp.data
}

export const listConnectedBanks = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/connected-banks/'
  )
  return resp.data
}

export const setDefaultConnectedBank = async (
  bankId: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    `/connected-banks/${bankId}/set-default`
  )
  return resp.data
}

export const disconnectBank = async (bankId: string): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.delete(
    `/connected-banks/${bankId}/disconnect`
  )
  return resp.data
}
