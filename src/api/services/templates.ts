import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { CreateTemplateRequestBody, TemplateListItem } from '@/types/Templates'

export const createTemplate = async (
  data: CreateTemplateRequestBody
): Promise<ApiResponse<object>> => {
  const resp: AxiosResponse<ApiResponse<object>> = await apiService.appPrivate.post(
    '/templates/create',
    data
  )
  return resp.data
}

export const getTemplates = async (): Promise<ApiResponse<TemplateListItem[]>> => {
  const resp: AxiosResponse<ApiResponse<TemplateListItem[]>> =
    await apiService.appPrivate.get('/templates')
  return resp.data
}
