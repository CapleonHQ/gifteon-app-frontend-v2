import type {
  DocumentTypeOption,
  KycStep,
  KycStepMeta,
  VerificationStepItem,
} from './types'

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { label: 'NIN', value: 'nin' },
  { label: 'International Passport', value: 'passport' },
  { label: "Driver's License", value: 'drivers_license' },
  { label: "Voter's Card", value: 'voters_card' },
]

export const VERIFICATION_STEPS: VerificationStepItem[] = [
  {
    title: 'Upload your ID Document',
    description:
      "This could be your National ID, Driver's License, or International Passport",
  },
  {
    title: 'Verify your Identity',
    description: 'This is a quick selfie verification to match your ID',
  },
  {
    title: 'Review & Approval',
    description: "We'll review your information within 24 hours",
  },
]

export const STEP_META: Record<KycStep, KycStepMeta> = {
  0: {
    title: 'We need a little more info',
    subtitle:
      'To withdraw amounts above ₦100,000, we need a quick ID check. This will only take a minute.',
  },
  1: {
    title: 'Update KYC',
    subtitle: 'Please provide the correct details to update your profile',
    progressCurrent: 1,
  },
  2: {
    title: 'Face Verification',
    subtitle: 'Scan your face to verify your identity',
    progressCurrent: 2,
  },
}

export const SECONDARY_BTN_CLASS =
  'flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'

export const PRIMARY_BTN_CLASS =
  'flex-1 py-3 rounded-[12px] bg-linear-to-b from-17% from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors'
