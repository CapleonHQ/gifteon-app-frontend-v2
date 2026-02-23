import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  ConnectBankRequestBody,
  ConnectedBank,
  ConnectedBanksData,
  VerifyBankAccountData,
  VerifyBankAccountRequestBody,
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
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.appPrivate.post(`/connected-banks/${bankId}/set-default`)
  return resp.data
}

export const disconnectBank = async (
  bankId: string
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.appPrivate.delete(`/connected-banks/${bankId}/disconnect`)
  return resp.data
}

export const verifyBankAccount = async (
  data: VerifyBankAccountRequestBody
): Promise<ApiResponse<VerifyBankAccountData>> => {
  const resp: AxiosResponse<ApiResponse<VerifyBankAccountData>> =
    await apiService.appPrivate.post('/payment/misc/verify-bank-account', data)
  return resp.data
}
