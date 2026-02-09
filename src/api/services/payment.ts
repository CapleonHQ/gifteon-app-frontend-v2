import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  InitializePaymentRequestBody,
  ValidateWalletBalanceRequestBody,
} from '@/types/Payment'

export const initializePayment = async (
  data: InitializePaymentRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/payment/initialize',
    data
  )
  return resp.data
}

export const validateWalletBalance = async (
  data: ValidateWalletBalanceRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/payment/check-wallet-balance',
    data
  )
  return resp.data
}

export const payWithWallet = async (
  data: InitializePaymentRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPublic.post(
    '/payment/pay-with-wallet',
    data
  )
  return resp.data
}

export const getTransactionByReference = async (
  reference: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPublic.get(
    `/payment/transaction/${reference}`
  )
  return resp.data
}

export const verifyTransactionByReference = async (
  reference: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPublic.get(
    `/payment/verify/${reference}`
  )
  return resp.data
}
