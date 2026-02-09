import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  MerchantLoginRequestBody,
  MerchantRegisterRequestBody,
  MerchantVerifyOtpRequestBody,
} from '@/types/MerchantAuth'

export const registerMerchant = async (
  data: MerchantRegisterRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPublic.post(
    '/merchant/auth/register',
    data
  )
  return resp.data
}

export const verifyMerchantOtp = async (
  data: MerchantVerifyOtpRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPublic.post(
    '/merchant/auth/verify-otp',
    data
  )
  return resp.data
}

export const loginMerchant = async (
  data: MerchantLoginRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPublic.post(
    '/merchant/auth/login',
    data
  )
  return resp.data
}

export const verifyMerchantEmail = async (
  token: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPublic.get(
    '/merchant/auth/verify',
    { params: { token } }
  )
  return resp.data
}
