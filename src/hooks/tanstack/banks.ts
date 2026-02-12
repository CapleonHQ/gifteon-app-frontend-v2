import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  connectBank,
  disconnectBank,
  listConnectedBanks,
  setDefaultConnectedBank,
} from '@/api/services/banks'
import type { ConnectBankRequestBody } from '@/types/Banks'

export const useConnectedBanks = () => {
  return useQuery({
    queryKey: ['connected-banks'],
    queryFn: listConnectedBanks,
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
