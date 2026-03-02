import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  CreateCommentRequestBody,
  PageCommentsData,
  PageCommentsQueryParams,
} from '@/types/Comments'

export const createComment = async (
  pageId: string,
  data: CreateCommentRequestBody
): Promise<ApiResponse<object>> => {
  const resp: AxiosResponse<ApiResponse<object>> =
    await apiService.appPrivate.post(`/pages/${pageId}/comments`, data)
  return resp.data
}

export const getComments = async (
  pageId: string,
  params?: PageCommentsQueryParams
): Promise<ApiResponse<PageCommentsData>> => {
  const resp: AxiosResponse<ApiResponse<PageCommentsData>> =
    await apiService.appPrivate.get(`/pages/${pageId}/comments`, { params })
  return resp.data
}

export const deleteComment = async (
  commentId: string
): Promise<ApiResponse<object>> => {
  const resp: AxiosResponse<ApiResponse<object>> =
    await apiService.appPrivate.delete(`/pages/comments/${commentId}`)
  return resp.data
}
