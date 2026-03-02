export type KycStep = 0 | 1 | 2

export type KycStepMeta = {
  title: string
  subtitle?: string
  progressCurrent?: number
}

export type DocumentTypeOption = {
  label: string
  value: string
}

export type VerificationStepItem = {
  title: string
  description: string
}
