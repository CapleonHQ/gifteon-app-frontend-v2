import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  LoginRequestBody,
  RegisterRequestBody,
  ResendVerificationRequestBody,
  VerifyOtpRequestBody,
} from '@/types/Auth'

export const registerUser = async (
  data: RegisterRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.authPublic.post(
    '/auth/register',
    data
  )
  return resp.data
}

export const verifyOtp = async (
  data: VerifyOtpRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.authPublic.post(
    '/auth/verify-otp',
    data
  )
  return resp.data
}

export const resendVerification = async (
  data: ResendVerificationRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.authPublic.post(
    '/auth/resend-verification',
    data
  )
  return resp.data
}

export const loginUser = async (
  data: LoginRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.authPublic.post(
    '/auth/login',
    data
  )
  return resp.data
}

export const googleOauth = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.authPublic.get(
    '/auth/google'
  )
  return resp.data
}
