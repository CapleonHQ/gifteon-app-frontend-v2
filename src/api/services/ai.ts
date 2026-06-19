import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import type {
  AiCatalogue,
  AiCredits,
  ExchangeRateData,
  ExchangeRateQuery,
  GenerateTriviaBody,
  GenerateTriviaData,
  PurchasePackBody,
  PurchasePackResult,
} from '@/types/Ai'

export const generateTrivia = async (
  body: GenerateTriviaBody
): Promise<ApiResponse<GenerateTriviaData>> => {
  const resp: AxiosResponse<ApiResponse<GenerateTriviaData>> =
    await apiService.appPrivate.post('/ai/trivia/generate', body)
  return resp.data
}

export const getAiCredits = async (): Promise<ApiResponse<AiCredits>> => {
  const resp: AxiosResponse<ApiResponse<AiCredits>> =
    await apiService.appPrivate.get('/ai/credits')
  return resp.data
}

export const getAiCatalogue = async (): Promise<ApiResponse<AiCatalogue>> => {
  const resp: AxiosResponse<ApiResponse<AiCatalogue>> =
    await apiService.appPrivate.get('/ai/shop/catalogue')
  return resp.data
}

export const purchaseAiPack = async (
  body: PurchasePackBody
): Promise<ApiResponse<PurchasePackResult>> => {
  const resp: AxiosResponse<ApiResponse<PurchasePackResult>> =
    await apiService.appPrivate.post('/ai/shop/purchase', body)
  return resp.data
}

export const getExchangeRate = async (
  params: ExchangeRateQuery
): Promise<ApiResponse<ExchangeRateData>> => {
  const resp: AxiosResponse<ApiResponse<ExchangeRateData>> =
    await apiService.appPrivate.get('/misc/finance/exchange-rates', { params })
  return resp.data
}
