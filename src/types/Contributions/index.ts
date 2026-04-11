export type PageContribution = {
  id: string
  type: string
  giftName: string
  imageUrl?: string
  sender: string
  amount: number | string
  currency: string
  reference: string
  status: string
  createdAt: string
}

export type ContributionsListData = {
  contributions: PageContribution[]
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
