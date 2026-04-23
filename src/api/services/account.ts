import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  ChangeTagRequestBody,
  ChangePinRequestBody,
  VerifyTagRequestBody,
  VerifyTagResponseData,
  SetPinRequestBody,
  UpdateProfilePayload,
  UserProfile,
} from '@/types/Account'

export const getProfile = async (): Promise<ApiResponse<UserProfile>> => {
  const resp: AxiosResponse<ApiResponse<UserProfile>> =
    await apiService.appPrivate.get('/account')
  return resp.data
}

export const updateProfile = async (
  data: UpdateProfilePayload
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post('/account/update', data)
  return resp.data
}

export const setPin = async (
  data: SetPinRequestBody
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.appPrivate.post('/account/set-pin', data)
  return resp.data
}

export const changePin = async (
  data: ChangePinRequestBody
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.appPrivate.post('/account/change-pin', data)
  return resp.data
}

export const verifyTag = async (
  data: VerifyTagRequestBody
): Promise<ApiResponse<VerifyTagResponseData>> => {
  const resp: AxiosResponse<ApiResponse<VerifyTagResponseData>> =
    await apiService.appPrivate.post('/account/verify-tag', data)
  return resp.data
}

export const changeTag = async (
  data: ChangeTagRequestBody
): Promise<ApiResponse<null>> => {
  const resp: AxiosResponse<ApiResponse<null>> =
    await apiService.appPrivate.post('/account/change-tag', data)
  return resp.data
}
