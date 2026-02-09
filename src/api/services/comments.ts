import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { CreateCommentRequestBody } from '@/types/Comments'

export const createComment = async (
  pageId: string,
  data: CreateCommentRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    `/pages/${pageId}/comments`,
    data
  )
  return resp.data
}

export const getComments = async (pageId: string): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/pages/${pageId}/comments`
  )
  return resp.data
}

export const deleteComment = async (
  commentId: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.delete(
    `/pages/comments/${commentId}`
  )
  return resp.data
}
