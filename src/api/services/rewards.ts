import { AxiosResponse } from 'axios'
import apiService from '../'
import type { ApiResponse } from '@/types/Common'
import { generateIdempotencyKey } from '@/lib/utils/idempotency'
import type {
  RewardsBalance,
  RewardsHistoryItem,
  RedeemRequestBody,
  RedeemResult,
  ReferralsData,
  RewardsPagination,
} from '@/types/Rewards'

export type RewardsHistoryResponse = ApiResponse<RewardsHistoryItem[]> & {
  meta: { pagination: RewardsPagination }
}

export const getRewardsBalance = async (): Promise<
  ApiResponse<RewardsBalance>
> => {
  const resp: AxiosResponse<ApiResponse<RewardsBalance>> =
    await apiService.appPrivate.get('/rewards/balance')
  return resp.data
}

export const getRewardsHistory = async (params: {
  page: number
  limit: number
}): Promise<RewardsHistoryResponse> => {
  const resp: AxiosResponse<RewardsHistoryResponse> =
    await apiService.appPrivate.get('/rewards/history', { params })
  return resp.data
}

export const redeemRewards = async (
  body: RedeemRequestBody,
): Promise<ApiResponse<RedeemResult>> => {
  const idempotencyKey = generateIdempotencyKey()
  const resp: AxiosResponse<ApiResponse<RedeemResult>> =
    await apiService.appPrivate.post('/rewards/redeem', body, {
      headers: { 'idempotency-key': idempotencyKey },
    })
  return resp.data
}

export const getReferralsHistory = async (): Promise<
  ApiResponse<ReferralsData>
> => {
  const resp: AxiosResponse<ApiResponse<ReferralsData>> =
    await apiService.appPrivate.get('/referrals/history')
  return resp.data
}
