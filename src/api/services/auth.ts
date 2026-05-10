import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  LoginRequestBody,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequestBody,
  RegisterResponse,
  RequestResetPasswordOtpRequestBody,
  ResendVerificationRequestBody,
  ResetPasswordRequestBody,
  ResendVerificationResponse,
  VerifyOtpRequestBody,
  VerifyOtpResponse,
} from '@/types/Auth'

export const registerUser = async (
  data: RegisterRequestBody
): Promise<RegisterResponse> => {
  const resp: AxiosResponse<RegisterResponse> =
    await apiService.authPublic.post('/auth/register', data, {
      skipAuthLogout: true,
      skipAuthRefresh: true,
    })
  return resp.data
}

export const verifyOtp = async (
  data: VerifyOtpRequestBody
): Promise<VerifyOtpResponse> => {
  const resp: AxiosResponse<VerifyOtpResponse> =
    await apiService.authPublic.post('/auth/verify-otp', data, {
      skipAuthLogout: true,
      skipAuthRefresh: true,
    })
  return resp.data
}

export const verifyMagicLink = async (
  token: string
): Promise<VerifyOtpResponse> => {
  const resp: AxiosResponse<VerifyOtpResponse> =
    await apiService.authPublic.post(
      '/auth/verify-magic',
      { token },
      { skipAuthLogout: true, skipAuthRefresh: true }
    )
  return resp.data
}

export const resendVerification = async (
  data: ResendVerificationRequestBody
): Promise<ResendVerificationResponse> => {
  const resp: AxiosResponse<ResendVerificationResponse> =
    await apiService.authPublic.post('/auth/resend-verification', data, {
      skipAuthLogout: true,
      skipAuthRefresh: true,
    })
  return resp.data
}

export const loginUser = async (
  data: LoginRequestBody
): Promise<LoginResponse> => {
  const resp: AxiosResponse<LoginResponse> = await apiService.authPublic.post(
    '/auth/login',
    data,
    {
      skipAuthLogout: true,
      skipAuthRefresh: true,
    }
  )
  return resp.data
}

export const requestResetPasswordOtp = async (
  data: RequestResetPasswordOtpRequestBody
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.authPublic.post('/auth/forgot-password', data, {
      skipAuthLogout: true,
      skipAuthRefresh: true,
    })
  return resp.data
}

export const resetPassword = async (
  data: ResetPasswordRequestBody
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.authPublic.post('/auth/reset-password', data, {
      skipAuthLogout: true,
      skipAuthRefresh: true,
    })
  return resp.data
}

export const googleOauth = async (): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.authPublic.get('/auth/google', {
      skipAuthLogout: true,
      skipAuthRefresh: true,
    })
  return resp.data
}

export const refreshToken = async (
  refreshTokenValue: string
): Promise<RefreshTokenResponse> => {
  const resp: AxiosResponse<RefreshTokenResponse> =
    await apiService.authPublic.post(
      '/auth/refresh-token',
      { refreshToken: refreshTokenValue },
      { skipAuthLogout: true, skipAuthRefresh: true }
    )
  return resp.data
}
