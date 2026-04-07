import { ReactNode } from 'react'

export interface DashboardOverviewData {
  claimableBalance: number
  currency: string
  activePages: number
  visibilityBreakdown: {
    public: number
    private: number
    shareable: number
  }
  pendingContributions: number
  pageViews: number
}

export interface GiftTypeDistributionItem {
  type: string
  total: number
}

export interface DashboardChartData {
  visitTOsharesLineChart: VisitSharePoint[]
  giftDistribution: {
    cash: number
    store: number
    custom: number
  }
}

export interface DashboardRecentGift {
  id: string
  type: string
  giftName: string
  sender: string
  status: string
  amount: number | string
}

export interface StatsOverviewData {
  overview: DashboardOverviewData
  chart: DashboardChartData
  recentGifts: DashboardRecentGift[]
}

export interface VisitSharePoint {
  date: string
  visits: number | string
  shares: number | string
}

export interface VisitSharesChartData {
  chart: {
    visitTOsharesLineChart: VisitSharePoint[]
  }
}

export interface VisitSharesQueryParams {
  filter: 'week' | 'month' | 'bi-annual' | 'annual'
}

export type SummaryCardItem = {
  id: string
  title: string
  value: string
  meta: string
  icon: ReactNode
  actionLabel?: string
}
