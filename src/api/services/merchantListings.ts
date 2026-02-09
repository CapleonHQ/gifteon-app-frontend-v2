import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  BulkCreateListingsRequestBody,
  CreateListingRequestBody,
  ListingsQueryParams,
  UpdateListingRequestBody,
  UpdateListingsStateRequestBody,
} from '@/types/Listings'

export const getMerchantListings = async (
  params?: ListingsQueryParams
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/merchant/listings',
    { params }
  )
  return resp.data
}

export const getMerchantListingDetails = async (
  id: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/merchant/listings/${id}`
  )
  return resp.data
}

export const updateMerchantListing = async (
  id: string,
  data: UpdateListingRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.put(
    `/merchant/listings/${id}`,
    data
  )
  return resp.data
}

export const createMerchantListing = async (
  data: CreateListingRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/merchant/listings',
    data
  )
  return resp.data
}

export const bulkCreateMerchantListings = async (
  data: BulkCreateListingsRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    '/merchant/listings/bulk',
    data
  )
  return resp.data
}

export const updateMerchantListingsState = async (
  data: UpdateListingsStateRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.patch(
    '/merchant/listings/state',
    data
  )
  return resp.data
}
