import type { DocumentTypeOption } from './types'

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { label: 'NIN', value: 'nin' },
  { label: 'International Passport', value: 'passport' },
  { label: "Driver's License", value: 'drivers_license' },
  { label: "Voter's Card", value: 'voters_card' },
]

export const SECONDARY_BTN_CLASS =
  'flex-1 py-3 rounded-[12px] border border-grey-200 text-grey-700 font-medium bg-grey-50/70 hover:bg-grey-100/70 transition-colors'

export const PRIMARY_BTN_CLASS =
  'flex-1 py-3 rounded-[12px] bg-linear-to-b from-17% from-primary-400 to-primary-600 border border-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-700 transition-colors'
