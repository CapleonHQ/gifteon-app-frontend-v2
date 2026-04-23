import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { PaginationParams } from '@/types/Common'

export const getMerchantWalletOverview = async (): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/merchant/wallet/overview'
  )
  return resp.data
}

export const getMerchantWalletTransactions = async (
  params?: PaginationParams
): Promise<ApiResponse<any>> => {
  const resp: AxiosResponse<ApiResponse<any>> = await apiService.appPrivate.get(
    '/merchant/wallet/transactions',
    { params }
  )
  return resp.data
}
