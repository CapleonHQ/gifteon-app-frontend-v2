import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  CreateListingCategoryRequestBody,
  ListingCategoriesQueryParams,
} from '@/types/Categories'

export const createListingCategory = async (
  data: CreateListingCategoryRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/listing/categories',
    data
  )
  return resp.data
}

export const getListingCategories = async (
  params?: ListingCategoriesQueryParams
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/listing/categories',
    { params }
  )
  return resp.data
}

export const getListingCategoryProducts = async (
  id: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/listing/categories/${id}/products`
  )
  return resp.data
}
