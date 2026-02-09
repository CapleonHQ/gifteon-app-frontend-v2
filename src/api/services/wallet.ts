import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  TopupRequestBody,
  WalletTransactionsParams,
  WithdrawRequestBody,
} from '@/types/Wallet'

export const getWalletDetails = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/wallet'
  )
  return resp.data
}

export const getWalletTransactions = async (
  params?: WalletTransactionsParams
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/wallet/transactions',
    { params }
  )
  return resp.data
}

export const getWalletOverview = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/wallet/overview'
  )
  return resp.data
}

export const withdrawFromWallet = async (
  data: WithdrawRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/wallet/withdraw',
    data
  )
  return resp.data
}

export const topupWalletLocals = async (
  data: TopupRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/wallet/topup/locals',
    data
  )
  return resp.data
}

export const topupWalletInternational = async (
  data: TopupRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/wallet/topup/international',
    data
  )
  return resp.data
}

export const verifyWalletTopupLocals = async (
  reference: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/wallet/topup/locals/verify/${reference}`
  )
  return resp.data
}
