import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  generateTrivia,
  getAiCatalogue,
  getAiCredits,
  getExchangeRate,
  purchaseAiPack,
} from '@/api/services/ai'
import type {
  ExchangeRateQuery,
  GenerateTriviaBody,
  PurchasePackBody,
} from '@/types/Ai'

export const useAiCredits = (enabled = true) => {
  return useQuery({
    queryKey: ['ai', 'credits'],
    queryFn: getAiCredits,
    enabled,
  })
}

export const useAiCatalogue = (enabled = true) => {
  return useQuery({
    queryKey: ['ai', 'catalogue'],
    queryFn: getAiCatalogue,
    enabled,
  })
}

export const useExchangeRate = (params: ExchangeRateQuery, enabled = true) => {
  return useQuery({
    queryKey: ['ai', 'fx', params],
    queryFn: () => getExchangeRate(params),
    enabled,
  })
}

export const usePurchaseAiPack = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PurchasePackBody) => purchaseAiPack(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'credits'] })
      queryClient.invalidateQueries({ queryKey: ['ai', 'catalogue'] })
    },
  })
}

export const useGenerateTrivia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: GenerateTriviaBody) => generateTrivia(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'credits'] })
    },
  })
}
