import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  ChangePinRequestBody,
  SetPinRequestBody,
  UpdateProfileRequestBody,
} from '@/types/Account'

export const getProfile = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/account'
  )
  return resp.data
}

export const updateProfile = async (
  data: UpdateProfileRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/account/update',
    data
  )
  return resp.data
}

export const setPin = async (data: SetPinRequestBody): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/account/set-pin',
    data
  )
  return resp.data
}

export const changePin = async (
  data: ChangePinRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/account/change-pin',
    data
  )
  return resp.data
}
