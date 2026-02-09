import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { CreateTemplateRequestBody } from '@/types/Templates'

export const createTemplate = async (
  data: CreateTemplateRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/templates/create',
    data
  )
  return resp.data
}
