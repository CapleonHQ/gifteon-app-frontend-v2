import { Star, Gift, Users, Zap } from 'lucide-react'

export const REWARDS_HISTORY_LIMIT = 10

const ACTION_LABELS: Record<string, string> = {
  giveaway_created: 'Created a Giveaway',
  gift_page_created: 'Created a Gift Page',
  referral_signup: 'Friend Signed Up',
  wallet_topup: 'Wallet Top-up',
  profile_completed: 'Profile Completed',
  kyc_verified: 'Identity Verified',
}

const ACTION_ICONS: Record<string, typeof Star> = {
  giveaway_created: Zap,
  gift_page_created: Gift,
  referral_signup: Users,
}

export const humanizeRewardAction = (action: string): string => {
  if (ACTION_LABELS[action]) return ACTION_LABELS[action]
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export const getRewardActionIcon = (action: string) =>
  ACTION_ICONS[action] ?? Star
