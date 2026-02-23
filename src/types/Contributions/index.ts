export type PageContribution = Record<string, unknown>

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
