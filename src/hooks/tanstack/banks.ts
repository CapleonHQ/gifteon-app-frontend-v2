import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  connectBank,
  disconnectBank,
  listConnectedBanks,
  setDefaultConnectedBank,
} from '@/api/services/banks'
import type { ApiResponse } from '@/types/Common'
import type { AvailableBanksData, ConnectBankRequestBody } from '@/types/Banks'

const listAvailableBanks = async (): Promise<ApiResponse<AvailableBanksData>> => {
  const response = await fetch('/api/banks')
  if (!response.ok) {
    throw new Error('Unable to load banks')
  }

  return (await response.json()) as ApiResponse<AvailableBanksData>
}

export const useConnectedBanks = () => {
  return useQuery({
    queryKey: ['connected-banks'],
    queryFn: listConnectedBanks,
  })
}

export const useAvailableBanks = (enabled = true) => {
  return useQuery({
    queryKey: ['available-banks'],
    queryFn: listAvailableBanks,
    enabled,
    staleTime: 1000 * 60 * 60 * 6,
    gcTime: 1000 * 60 * 60 * 12,
    retry: 1,
  })
}

export const useConnectBank = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ConnectBankRequestBody) => connectBank(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connected-banks'] })
    },
  })
}

export const useDisconnectBank = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bankId: string) => disconnectBank(bankId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connected-banks'] })
    },
  })
}

export const useSetDefaultConnectedBank = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bankId: string) => setDefaultConnectedBank(bankId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connected-banks'] })
    },
  })
}
