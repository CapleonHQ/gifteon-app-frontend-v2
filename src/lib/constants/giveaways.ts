import type {
  GiveawayPrizeType,
  GiveawayStatus,
  GiveawayTaskType,
  TaskVerificationMethod,
} from '@/types/Giveaways'

export const GIVEAWAY_PAGE_LIMIT = 12

export type GiveawayStatusFilter = 'all' | GiveawayStatus

export const GIVEAWAY_STATUS_FILTERS: Array<{
  value: GiveawayStatusFilter
  label: string
}> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
  { value: 'completed', label: 'Completed' },
]

export const GIVEAWAY_PRIZE_TYPES: Array<{
  value: GiveawayPrizeType
  label: string
}> = [
  { value: 'cash', label: 'Cash' },
  { value: 'gift', label: 'Gift' },
  { value: 'voucher', label: 'Voucher' },
]

export const GIVEAWAY_CURRENCIES: Array<{ value: string; enabled: boolean }> = [
  { value: 'NGN', enabled: true },
  { value: 'USD', enabled: false },
  { value: 'GBP', enabled: false },
  { value: 'EUR', enabled: false },
]

export const GIVEAWAY_TASK_TYPES: Array<{
  value: GiveawayTaskType
  label: string
}> = [
  { value: 'follow_social', label: 'Follow on social' },
  { value: 'upload_proof', label: 'Upload proof' },
  { value: 'visit_link', label: 'Visit a link' },
  { value: 'share', label: 'Share' },
]

export const GIVEAWAY_TASK_VERIFICATION_METHODS: Array<{
  value: TaskVerificationMethod
  label: string
}> = [
  { value: 'honor_system', label: 'Honor system' },
  { value: 'manual_review', label: 'Manual review' },
]
