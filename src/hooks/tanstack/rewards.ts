'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getRewardsBalance,
  getRewardsHistory,
  redeemRewards,
  getReferralsHistory,
} from '@/api/services/rewards'
import type { RedeemRequestBody } from '@/types/Rewards'

export const useRewardsBalance = () => {
  return useQuery({
    queryKey: ['rewards', 'balance'],
    queryFn: getRewardsBalance,
  })
}

export const useRewardsHistory = (params: { page: number; limit: number }) => {
  return useQuery({
    queryKey: ['rewards', 'history', params],
    queryFn: () => getRewardsHistory(params),
  })
}

export const useRedeemRewards = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: RedeemRequestBody) => redeemRewards(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards', 'balance'] })
      queryClient.invalidateQueries({ queryKey: ['rewards', 'history'] })
    },
  })
}

export const useReferralsHistory = () => {
  return useQuery({
    queryKey: ['referrals', 'history'],
    queryFn: getReferralsHistory,
  })
}
