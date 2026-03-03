import type { ApiResponse } from '@/types/Common'

export type KycVerificationStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'not_started'

export type KycDocumentType = 'NIN' | 'BVN'

export interface KycStatusItem {
  submitted: boolean
  status: KycVerificationStatus
  verifiedAt: string | null
  rejectionReason: string | null
}

export interface KycStatusData {
  kycLevel: number
  overallStatus: string
  withdrawalLimit: number
  nin: KycStatusItem
  bvn: KycStatusItem
  utilityBill: KycStatusItem
  faceVerification: KycStatusItem
}

export interface SubmitKycDocumentRequestBody {
  type: KycDocumentType
  documentNumber: string
}

export interface SubmitUtilityBillRequestBody {
  utilityBillUrl: string
}

export interface SubmitFaceVerificationRequestBody {
  faceVerificationUrl: string
}

export type KycStatusResponse = ApiResponse<KycStatusData>
export type KycMutationResponse = ApiResponse<Record<string, never>>
