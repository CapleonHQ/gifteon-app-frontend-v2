import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  CheckoutPaymentRequestBody,
  CheckoutPaymentResponseData,
  InitializePaymentRequestBody,
  ValidateWalletBalanceRequestBody,
} from '@/types/Payment'

type GenericPaymentData = Record<string, unknown>
export type VerifyTransactionResponseData = Record<string, never>

export const initializePayment = async (
  data: InitializePaymentRequestBody
): Promise<ApiResponse<GenericPaymentData>> => {
  const resp: AxiosResponse<ApiResponse<GenericPaymentData>> =
    await apiService.appPrivate.post('/payment/initialize', data)
  return resp.data
}

export const validateWalletBalance = async (
  data: ValidateWalletBalanceRequestBody
): Promise<ApiResponse<GenericPaymentData>> => {
  const resp: AxiosResponse<ApiResponse<GenericPaymentData>> =
    await apiService.appPrivate.post('/payment/check-wallet-balance', data)
  return resp.data
}

export const payWithWallet = async (
  data: InitializePaymentRequestBody
): Promise<ApiResponse<GenericPaymentData>> => {
  const resp: AxiosResponse<ApiResponse<GenericPaymentData>> =
    await apiService.appPublic.post('/payment/pay-with-wallet', data)
  return resp.data
}

export const getTransactionByReference = async (
  reference: string
): Promise<ApiResponse<GenericPaymentData>> => {
  const resp: AxiosResponse<ApiResponse<GenericPaymentData>> =
    await apiService.appPublic.get(`/payment/transaction/${reference}`)
  return resp.data
}

export const verifyTransactionByReference = async (
  reference: string
): Promise<ApiResponse<VerifyTransactionResponseData | null>> => {
  const resp: AxiosResponse<ApiResponse<VerifyTransactionResponseData | null>> =
    await apiService.appPublic.get(`/payment/verify/${reference}`)
  return resp.data
}

export const checkoutPayment = async (
  data: CheckoutPaymentRequestBody,
  authenticated: boolean
): Promise<ApiResponse<CheckoutPaymentResponseData>> => {
  const client = authenticated ? apiService.appPrivate : apiService.appPublic
  const resp: AxiosResponse<ApiResponse<CheckoutPaymentResponseData>> =
    await client.post('/payment/checkout', data)
  return resp.data
}
