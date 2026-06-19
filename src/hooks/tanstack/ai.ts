import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateTrivia, getAiCredits } from '@/api/services/ai'
import type { GenerateTriviaBody } from '@/types/Ai'

export const useAiCredits = (enabled = true) => {
  return useQuery({
    queryKey: ['ai', 'credits'],
    queryFn: getAiCredits,
    enabled,
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
