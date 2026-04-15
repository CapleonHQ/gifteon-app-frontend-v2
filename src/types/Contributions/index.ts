export type PageContribution = {
  id: string
  type: string
  giftName: string
  imageUrl?: string
  sender: string
  amount: number | string
  claimedAmount?: number | string
  currency: string
  reference: string
  status: string
  createdAt: string
}

export type ContributionsListData = {
  contributions: PageContribution[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export type ContributionType = 'cash' | 'custom' | 'wishlist'
export type ContributionStatus =
  | 'pending'
  | 'success'
  | 'claimed'
  | 'failed'
  | 'refunded'
  | 'surplus'
export type ContributionSortBy = 'createdAt' | 'claimableAmount'
export type ContributionSortOrder = 'ASC' | 'DESC'

export type ContributionsQueryParams = {
  page?: number
  limit?: number
  type?: ContributionType | `${ContributionType},${ContributionType}` | string
  status?: ContributionStatus
  startDate?: string
  endDate?: string
  sortBy?: ContributionSortBy
  sortOrder?: ContributionSortOrder
}

export type PageContributionsQueryParams = {
  limit?: number
  offset?: number
}

export type PageContributionsApiData = {
  contributions: PageContribution[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}
