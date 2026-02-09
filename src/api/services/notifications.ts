import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { NotificationSettingsRequestBody } from '@/types/Notifications'

export const initializeNotificationSettings = async (
  data: NotificationSettingsRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/notifications/settings/initialize',
    data
  )
  return resp.data
}

export const getNotificationSettings = async (
  id: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/notifications/settings/${id}`
  )
  return resp.data
}

export const updateNotificationSettings = async (
  id: string,
  data: NotificationSettingsRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.patch(
    `/notifications/settings/${id}`,
    data
  )
  return resp.data
}
