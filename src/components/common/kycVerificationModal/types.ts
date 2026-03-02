export type KycStep = 0 | 1

export type KycStepMeta = {
  title: string
  subtitle?: string
  progressCurrent?: number
}

export type KycRequiredAction = 'nin' | 'bvn' | 'utility' | 'none'

export type DocumentTypeOption = {
  label: string
  value: string
}

export type VerificationStepItem = {
  title: string
  description: string
}
