import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import { PaginationParams } from '@/types/Common'

export const getMerchantWalletOverview = async (): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/merchant/wallet/overview'
  )
  return resp.data
}

export const getMerchantWalletTransactions = async (
  params?: PaginationParams
): Promise<ApiResponse> => {
  const resp: AxiosResponse<ApiResponse> = await apiService.appPrivate.get(
    '/merchant/wallet/transactions',
    { params }
  )
  return resp.data
}
