import { useMutation, useQuery } from '@tanstack/react-query'
import {
  getWalletDetails,
  getWalletTransactions,
  topupWalletLocals,
} from '@/api/services/wallet'
import type {
  WalletDetails,
  WalletTopupLocalsResponse,
  WalletTransactionsData,
  WalletTransactionsParams,
} from '@/types/Wallet'
import type { ApiResponse } from '@/types/Common'
import { mapWalletTransactionsData } from '@/lib/wallet/transformers'

type WalletTransactionsResponse = Omit<
  ApiResponse<WalletTransactionsData>,
  'data'
> & {
  data: WalletTransactionsData
}

export const useWalletDetails = () => {
  return useQuery({
    queryKey: ['wallet', 'details'],
    queryFn: getWalletDetails,
  })
}

export const useWalletTransactions = (params: WalletTransactionsParams) => {
  return useQuery({
    queryKey: ['wallet', 'transactions', params],
    queryFn: () => getWalletTransactions(params),
    select: (response): WalletTransactionsResponse => ({
      ...response,
      data: mapWalletTransactionsData(response.data),
    }),
  })
}

export const useTopupWalletLocals = () => {
  return useMutation({
    mutationFn: async (
      amount: number
    ): Promise<WalletTopupLocalsResponse['data']> => {
      const response = await topupWalletLocals({ amount })
      const data = response.data
      if (!data?.authorizationUrl) {
        throw new Error('Top-up initialization failed')
      }
      return data
    },
  })
}

export type { WalletDetails }
