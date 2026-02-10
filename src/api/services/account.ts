import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  ChangePinRequestBody,
  SetPinRequestBody,
  UpdateProfileRequestBody,
  UserProfile,
} from '@/types/Account'

export const getProfile = async (): Promise<ApiResponse<UserProfile>> => {
  const resp: AxiosResponse<ApiResponse<UserProfile>> =
    await apiService.appPrivate.get(
    '/account'
  )
  return resp.data
}

export const updateProfile = async (
  data: UpdateProfileRequestBody
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.post(
    '/account/update',
    data
  )
  return resp.data
}

export const setPin = async (data: SetPinRequestBody): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.post(
    '/account/set-pin',
    data
  )
  return resp.data
}

export const changePin = async (
  data: ChangePinRequestBody
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.post(
    '/account/change-pin',
    data
  )
  return resp.data
}
