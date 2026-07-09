import { AxiosResponse } from 'axios'
import apiService from '../'
import { getAccessToken } from '../token'
import { ApiResponse } from '@/types/Common'
import { idempotencyHeaders } from '@/lib/utils/idempotency'
import type {
  ApiListResponse,
  CreateGiveawayBody,
  Giveaway,
  GiveawayDetailData,
  GiveawayEntry,
  GiveawayLeaderboardData,
  GiveawayQueryParams,
  PinActionBody,
  SelectWinnersResult,
  SubmitTaskProofBody,
  SubmitTriviaBody,
  TriviaSubmitResult,
  UpdateGiveawayBody,
} from '@/types/Giveaways'

const optionalAuthConfig = () => {
  const token = getAccessToken()
  return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
}

export const getOwnerGiveaways = async (
  params?: GiveawayQueryParams
): Promise<ApiListResponse<Giveaway>> => {
  const resp: AxiosResponse<ApiListResponse<Giveaway>> =
    await apiService.appPrivate.get('/giveaways', { params })
  return resp.data
}

export const getPublicGiveaways = async (
  params?: GiveawayQueryParams
): Promise<ApiListResponse<Giveaway>> => {
  const resp: AxiosResponse<ApiListResponse<Giveaway>> =
    await apiService.appPublic.get('/giveaways/public', { params })
  return resp.data
}

export const getGiveawayDetail = async (
  id: string
): Promise<ApiResponse<GiveawayDetailData>> => {
  const resp: AxiosResponse<ApiResponse<GiveawayDetailData>> =
    await apiService.appPublic.get(`/giveaways/${id}`, optionalAuthConfig())
  return resp.data
}

export const getGiveawayLeaderboard = async (
  id: string
): Promise<ApiResponse<GiveawayLeaderboardData>> => {
  const resp: AxiosResponse<ApiResponse<GiveawayLeaderboardData>> =
    await apiService.appPublic.get(
      `/giveaways/${id}/leaderboard`,
      optionalAuthConfig()
    )
  return resp.data
}

export const createGiveaway = async (
  body: CreateGiveawayBody
): Promise<ApiResponse<Giveaway>> => {
  const resp: AxiosResponse<ApiResponse<Giveaway>> =
    await apiService.appPrivate.post('/giveaways', body, idempotencyHeaders())
  return resp.data
}

export const updateGiveaway = async (
  id: string,
  body: UpdateGiveawayBody
): Promise<ApiResponse<Giveaway>> => {
  const resp: AxiosResponse<ApiResponse<Giveaway>> =
    await apiService.appPrivate.patch(
      `/giveaways/${id}`,
      body,
      idempotencyHeaders()
    )
  return resp.data
}

export const publishGiveaway = async (
  id: string
): Promise<ApiResponse<Giveaway>> => {
  const resp: AxiosResponse<ApiResponse<Giveaway>> =
    await apiService.appPrivate.post(
      `/giveaways/${id}/publish`,
      undefined,
      idempotencyHeaders()
    )
  return resp.data
}

export const closeGiveaway = async (
  id: string,
  body: PinActionBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post(
      `/giveaways/${id}/close`,
      body,
      idempotencyHeaders()
    )
  return resp.data
}

export const selectWinners = async (
  id: string,
  body: PinActionBody
): Promise<ApiResponse<SelectWinnersResult>> => {
  const resp: AxiosResponse<ApiResponse<SelectWinnersResult>> =
    await apiService.appPrivate.post(
      `/giveaways/${id}/select-winners`,
      body,
      idempotencyHeaders()
    )
  return resp.data
}

export const enterGiveaway = async (
  id: string
): Promise<ApiResponse<GiveawayEntry>> => {
  const resp: AxiosResponse<ApiResponse<GiveawayEntry>> =
    await apiService.appPrivate.post(
      `/giveaways/${id}/enter`,
      undefined,
      idempotencyHeaders()
    )
  return resp.data
}

export const submitTrivia = async (
  id: string,
  body: SubmitTriviaBody
): Promise<ApiResponse<TriviaSubmitResult>> => {
  const resp: AxiosResponse<ApiResponse<TriviaSubmitResult>> =
    await apiService.appPrivate.post(
      `/giveaways/${id}/submit`,
      body,
      idempotencyHeaders()
    )
  return resp.data
}

export const submitTaskProof = async (
  id: string,
  body: SubmitTaskProofBody
): Promise<ApiResponse<Record<string, unknown>>> => {
  const resp: AxiosResponse<ApiResponse<Record<string, unknown>>> =
    await apiService.appPrivate.post(
      `/giveaways/${id}/submit-task`,
      body,
      idempotencyHeaders()
    )
  return resp.data
}
