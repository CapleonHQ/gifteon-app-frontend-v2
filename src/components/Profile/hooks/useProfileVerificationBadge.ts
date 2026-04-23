import { useMemo } from 'react'
import type { KycStatusData } from '@/types/Kyc'

export type VerificationTone = 'verified' | 'warning' | 'pending' | 'rejected'

export const useProfileVerificationBadge = (
  kycStatus: KycStatusData | undefined,
  profileKycEnabled: boolean | undefined
) => {
  return useMemo(() => {
    const kycLevel = kycStatus?.kycLevel ?? 0
    const overallKycStatus = (
      kycStatus?.overallStatus ||
      (profileKycEnabled ? 'approved' : 'not_started')
    ).toLowerCase()

    const label =
      kycLevel < 1
        ? 'Unverified'
        : kycLevel >= 3 && overallKycStatus === 'approved'
        ? 'Verified'
        : `KYC Level ${kycLevel}`

    const tone: VerificationTone =
      kycLevel < 1
        ? 'warning'
        : kycLevel >= 3 && overallKycStatus === 'approved'
        ? 'verified'
        : overallKycStatus === 'rejected'
        ? 'rejected'
        : 'pending'

    return { label, tone }
  }, [kycStatus, profileKycEnabled])
}
