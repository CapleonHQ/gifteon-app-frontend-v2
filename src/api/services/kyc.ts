import { AxiosResponse } from 'axios'
import apiService from '../'
import type {
  KycMutationResponse,
  KycStatusResponse,
  SubmitFaceVerificationRequestBody,
  SubmitKycDocumentRequestBody,
  SubmitUtilityBillRequestBody,
} from '@/types/Kyc'

export const getKycStatus = async (): Promise<KycStatusResponse> => {
  const resp: AxiosResponse<KycStatusResponse> =
    await apiService.appPrivate.get('/kyc/status')
  return resp.data
}

export const submitKycDocument = async (
  data: SubmitKycDocumentRequestBody
): Promise<KycMutationResponse> => {
  const resp: AxiosResponse<KycMutationResponse> = await apiService.appPrivate.post(
    '/kyc/submit/document',
    data
  )
  return resp.data
}

export const submitUtilityBill = async (
  data: SubmitUtilityBillRequestBody
): Promise<KycMutationResponse> => {
  const resp: AxiosResponse<KycMutationResponse> = await apiService.appPrivate.post(
    '/kyc/submit/utility-bill',
    data
  )
  return resp.data
}

export const submitFaceVerification = async (
  data: SubmitFaceVerificationRequestBody
): Promise<KycMutationResponse> => {
  const resp: AxiosResponse<KycMutationResponse> = await apiService.appPrivate.post(
    '/kyc/submit/face',
    data
  )
  return resp.data
}
