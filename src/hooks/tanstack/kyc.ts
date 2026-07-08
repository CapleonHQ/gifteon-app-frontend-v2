import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getKycStatus,
  submitFaceVerification,
  submitKycDocument,
  submitUtilityBill,
} from '@/api/services/kyc'
import type {
  KycMutationResponse,
  KycStatusResponse,
  SubmitFaceVerificationRequestBody,
  SubmitKycDocumentRequestBody,
  SubmitUtilityBillRequestBody,
} from '@/types/Kyc'

const invalidateKycRelatedQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['kyc', 'status'] })
  queryClient.invalidateQueries({ queryKey: ['account', 'profile'] })
}

export const useKycStatus = (enabled = true) => {
  return useQuery<KycStatusResponse>({
    queryKey: ['kyc', 'status'],
    queryFn: getKycStatus,
    enabled,
  })
}

export const useSubmitKycDocument = () => {
  const queryClient = useQueryClient()
  return useMutation<KycMutationResponse, Error, SubmitKycDocumentRequestBody>({
    mutationFn: (data) => submitKycDocument(data),
    onSuccess: () => invalidateKycRelatedQueries(queryClient),
  })
}

export const useSubmitUtilityBill = () => {
  const queryClient = useQueryClient()
  return useMutation<KycMutationResponse, Error, SubmitUtilityBillRequestBody>({
    mutationFn: (data) => submitUtilityBill(data),
    onSuccess: () => invalidateKycRelatedQueries(queryClient),
  })
}

export const useSubmitFaceVerification = () => {
  const queryClient = useQueryClient()
  return useMutation<KycMutationResponse, Error, SubmitFaceVerificationRequestBody>({
    mutationFn: (data) => submitFaceVerification(data),
    onSuccess: () => invalidateKycRelatedQueries(queryClient),
  })
}
