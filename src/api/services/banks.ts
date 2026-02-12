import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  ConnectBankRequestBody,
  ConnectedBank,
  ConnectedBanksData,
} from '@/types/Banks'

export const connectBank = async (
  data: ConnectBankRequestBody
): Promise<ApiResponse<ConnectedBank>> => {
  const resp: AxiosResponse<ApiResponse<ConnectedBank>> =
    await apiService.appPrivate.post('/connected-banks/connect', data)
  return resp.data
}

export const listConnectedBanks = async (): Promise<
  ApiResponse<ConnectedBanksData>
> => {
  const resp: AxiosResponse<ApiResponse<ConnectedBanksData>> =
    await apiService.appPrivate.get('/connected-banks/')
  return resp.data
}

export const setDefaultConnectedBank = async (
  bankId: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post(`/connected-banks/${bankId}/set-default`)
  return resp.data
}

export const disconnectBank = async (
  bankId: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.delete(`/connected-banks/${bankId}/disconnect`)
  return resp.data
}
