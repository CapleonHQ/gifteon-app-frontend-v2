import { ReactNode } from 'react'

export interface StatsOverviewData {
  claimableBalance: number
  currency: string
  pages: {
    total: number
    categoriesBreakdown: Record<string, number>
  }
  pendingGiftsToClaim: {
    count: number
    totalAmount: number
    lastUpdated: string | null
  }
  pageViews: {
    total: number
    trend: string
    trendDirection: string
    lastUpdated: string | null
  }
}

export interface GiftTypeDistributionItem {
  type: string
  total: number
}

export interface GiftTypeDistributionData {
  distribution: GiftTypeDistributionItem[]
  total: number
}

export interface VisitSharePoint {
  date: string
  visits: number
  shares: number
}

export interface VisitSharesChartData {
  interval: string
  data: VisitSharePoint[]
}

export interface VisitSharesQueryParams {
  startDate: string
  endDate: string
  interval: 'daily' | 'weekly' | 'monthly'
}

export type SummaryCardItem = {
  id: string
  title: string
  value: string
  meta: string
  icon: ReactNode
  actionLabel?: string
}
