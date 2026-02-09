import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { CreateCouponRequestBody, UpdateCouponRequestBody } from '@/types/Coupons'

export const getMerchantCouponDetails = async (
  listingId: string,
  couponId: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/merchant/listings/${listingId}/coupon/${couponId}`
  )
  return resp.data
}

export const updateMerchantCoupon = async (
  listingId: string,
  couponId: string,
  data: UpdateCouponRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.patch(
    `/merchant/listings/${listingId}/coupon/${couponId}`,
    data
  )
  return resp.data
}

export const getMerchantCoupons = async (
  listingId: string
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    `/merchant/listings/${listingId}/coupons`
  )
  return resp.data
}

export const createMerchantCoupon = async (
  listingId: string,
  data: CreateCouponRequestBody
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.post(
    `/merchant/listings/${listingId}/coupon`,
    data
  )
  return resp.data
}
