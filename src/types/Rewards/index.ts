export interface RewardsBalance {
  totalCoins: number
  redeemableCoins: number
  currentRank: string
  badgeColor: string
  nextRank: {
    name: string
    pointsNeeded: number
  }
}

export interface RewardsHistoryItem {
  id: string
  kpiAction: string
  tier: string
  coinsEarned: number
  rankPointsEarned: number
  referenceType: string | null
  createdAt: string
}

export interface RedeemRequestBody {
  amount: number
  pin: string
}

export interface RedeemResult {
  amountRedeemed: number
  walletCredited: number
}

export interface ReferralItem {
  id: string
  tag: string
  fullName: string
  profilePicture: string | null
  rewarded: boolean
  date: string
}

export interface ReferralsData {
  referralCode: string
  totalReferrals: number
  referrals: ReferralItem[]
}

export interface RewardsPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
