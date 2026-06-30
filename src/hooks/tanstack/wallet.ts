import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  cancelWalletWithdrawal,
  getWalletDetails,
  getWalletTransactions,
  getWalletWithdrawals,
  lookupTransferRecipient,
  topupWalletLocals,
  transferToWallet,
  withdrawFromWallet,
} from '@/api/services/wallet'
import type {
  TransferRecipientLookupData,
  TransferRequestBody,
  TransferResultData,
  WalletDetails,
  WalletTopupInitialization,
  WalletWithdrawalData,
  WalletWithdrawalsData,
  WalletWithdrawalsParams,
  WalletTransactionsData,
  WalletTransactionsParams,
  WithdrawRequestBody,
} from '@/types/Wallet'
import type { ApiResponse } from '@/types/Common'
import {
  mapWalletTransactionsData,
  mapWalletWithdrawalsData,
} from '@/lib/wallet/transformers'

type WalletTransactionsResponse = Omit<
  ApiResponse<WalletTransactionsData>,
  'data'
> & {
  data: WalletTransactionsData
}

type WalletWithdrawalsResponse = Omit<
  ApiResponse<WalletWithdrawalsData>,
  'data'
> & {
  data: WalletWithdrawalsData
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

export const useWalletWithdrawals = (params?: WalletWithdrawalsParams) => {
  return useQuery({
    queryKey: ['wallet', 'withdrawals', params],
    queryFn: () => getWalletWithdrawals(params),
    select: (response): WalletWithdrawalsResponse => ({
      ...response,
      data: mapWalletWithdrawalsData(response.data),
    }),
  })
}

export const useTopupWalletLocals = () => {
  return useMutation({
    mutationFn: async (amount: number): Promise<WalletTopupInitialization> => {
      const response = await topupWalletLocals({ amount })
      const data = response.data
      if (!data?.authorizationUrl) {
        throw new Error('Top-up initialization failed')
      }
      return data
    },
  })
}

export const useWithdrawFromWallet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      data: WithdrawRequestBody
    ): Promise<ApiResponse<WalletWithdrawalData>> => withdrawFromWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'details'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] })
    },
  })
}

export const useLookupTransferRecipient = () => {
  return useMutation({
    mutationFn: (
      tag: string
    ): Promise<ApiResponse<TransferRecipientLookupData>> =>
      lookupTransferRecipient(tag),
  })
}

export const useTransferToWallet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      data: TransferRequestBody
    ): Promise<ApiResponse<TransferResultData>> => transferToWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'details'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] })
    },
  })
}

export const useCancelWalletWithdrawal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (withdrawalId: string): Promise<ApiResponse<WalletWithdrawalData>> =>
      cancelWalletWithdrawal(withdrawalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'details'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] })
    },
  })
}

export type { WalletDetails }
