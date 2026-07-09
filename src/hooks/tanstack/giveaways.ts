import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  closeGiveaway,
  createGiveaway,
  enterGiveaway,
  getGiveawayDetail,
  getGiveawayLeaderboard,
  getOwnerGiveaways,
  getPublicGiveaways,
  publishGiveaway,
  selectWinners,
  submitTaskProof,
  submitTrivia,
  updateGiveaway,
} from '@/api/services/giveaways'
import type {
  CreateGiveawayBody,
  GiveawayQueryParams,
  PinActionBody,
  SubmitTaskProofBody,
  SubmitTriviaBody,
  UpdateGiveawayBody,
} from '@/types/Giveaways'

export const useOwnerGiveaways = (params?: GiveawayQueryParams) => {
  return useQuery({
    queryKey: ['giveaways', 'owner', params],
    queryFn: () => getOwnerGiveaways(params),
  })
}

export const usePublicGiveaways = (params?: GiveawayQueryParams) => {
  return useQuery({
    queryKey: ['giveaways', 'public', params],
    queryFn: () => getPublicGiveaways(params),
  })
}

export const useGiveawayDetail = (id: string) => {
  return useQuery({
    queryKey: ['giveaways', 'detail', id],
    queryFn: () => getGiveawayDetail(id),
    enabled: id.length > 0,
  })
}

export const useGiveawayLeaderboard = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['giveaways', 'leaderboard', id],
    queryFn: () => getGiveawayLeaderboard(id),
    enabled: enabled && id.length > 0,
  })
}

const invalidateGiveaways = (
  queryClient: ReturnType<typeof useQueryClient>,
  id?: string
) => {
  queryClient.invalidateQueries({ queryKey: ['giveaways', 'owner'] })
  queryClient.invalidateQueries({ queryKey: ['giveaways', 'public'] })
  if (id) {
    queryClient.invalidateQueries({ queryKey: ['giveaways', 'detail', id] })
    queryClient.invalidateQueries({ queryKey: ['giveaways', 'leaderboard', id] })
  }
}

export const useCreateGiveaway = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateGiveawayBody) => createGiveaway(body),
    onSuccess: () => invalidateGiveaways(queryClient),
  })
}

export const useUpdateGiveaway = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateGiveawayBody) => updateGiveaway(id, body),
    onSuccess: () => invalidateGiveaways(queryClient, id),
  })
}

export const usePublishGiveaway = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => publishGiveaway(id),
    onSuccess: () => invalidateGiveaways(queryClient, id),
  })
}

export const useCloseGiveaway = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PinActionBody) => closeGiveaway(id, body),
    onSuccess: () => invalidateGiveaways(queryClient, id),
  })
}

export const useSelectWinners = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PinActionBody) => selectWinners(id, body),
    onSuccess: () => invalidateGiveaways(queryClient, id),
  })
}

export const useEnterGiveaway = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => enterGiveaway(id),
    onSuccess: () => invalidateGiveaways(queryClient, id),
  })
}

export const useSubmitTrivia = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SubmitTriviaBody) => submitTrivia(id, body),
    onSuccess: () => invalidateGiveaways(queryClient, id),
  })
}

export const useSubmitTaskProof = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SubmitTaskProofBody) => submitTaskProof(id, body),
    onSuccess: () => invalidateGiveaways(queryClient, id),
  })
}
