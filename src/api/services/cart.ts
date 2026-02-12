import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import {
  AddToCartRequestBody,
  CheckoutRequestBody,
  UpdateCartItemRequestBody,
} from '@/types/Cart'

export const addToCart = async (
  data: AddToCartRequestBody
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPublic.post(
    '/store/cart/add',
    data
  )
  return resp.data
}

export const checkoutCart = async (
  data: CheckoutRequestBody
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPublic.post(
    '/store/cart/checkout',
    data
  )
  return resp.data
}

export const getCartItems = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPublic.get(
    '/store/cart'
  )
  return resp.data
}

export const updateCartItem = async (
  data: UpdateCartItemRequestBody
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPublic.patch(
    '/store/cart/update',
    data
  )
  return resp.data
}

export const removeCartItem = async (id: string): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPublic.delete(
    `/store/cart/remove/${id}`
  )
  return resp.data
}

export const clearCart = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPublic.delete(
    '/store/cart/clear'
  )
  return resp.data
}
