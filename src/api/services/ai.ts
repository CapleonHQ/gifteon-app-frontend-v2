import { AxiosResponse } from 'axios'
import apiService from '../'
import { ApiResponse } from '@/types/Common'
import type {
  AiCredits,
  GenerateTriviaBody,
  GenerateTriviaData,
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
