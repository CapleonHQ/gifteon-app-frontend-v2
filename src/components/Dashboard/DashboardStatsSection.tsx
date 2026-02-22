'use client'

import { useMemo, useState } from 'react'
import { format, subDays, subMonths } from 'date-fns'
import CashIcon from '@/assets/icons/CashIcon'
import GiftIcon from '@/assets/icons/GiftIcon'
import NotificationCircleIcon from '@/assets/icons/NotificationCircleIcon'
import ViewIcon from '@/assets/icons/ViewIcon'
import SummaryCards from './SummaryCards'
import VisitSharesCard from './VisitSharesCard'
import GiftTypeDistributionCard from './GiftTypeDistributionCard'
import SummaryCardsSkeleton from './Skeletons/SummaryCardsSkeleton'
import VisitSharesSkeleton from './Skeletons/VisitSharesSkeleton'
import GiftTypeDistributionSkeleton from './Skeletons/GiftTypeDistributionSkeleton'
import {
  useStatsOverview,
  useVisitSharesChart,
} from '@/hooks/tanstack/stats'
import { emptySummaryCards } from './types'

const DashboardStatsSection = () => {
  const [visitRange, setVisitRange] = useState('last-7-days')

  const getRangeMeta = (range: string) => {
    const today = new Date()
    if (range === 'last-30-days') {
      const from = subDays(today, 29)
      return { from, to: today, interval: 'weekly' as const }
    }
    if (range === 'last-6-months') {
      const from = subMonths(today, 6)
      return { from, to: today, interval: 'monthly' as const }
    }
    const from = subDays(today, 6)
    return { from, to: today, interval: 'daily' as const }
  }

  const rangeOptions = useMemo(() => {
    const last7 = getRangeMeta('last-7-days')
    const last30 = getRangeMeta('last-30-days')
    const last6m = getRangeMeta('last-6-months')

    const formatRangeLabel = (from: Date, to: Date) =>
      `${format(from, 'MMM d')} - ${format(to, 'MMM d')}`

    return [
      {
        value: 'last-7-days',
        label: 'Last 7 days',
        rangeLabel: formatRangeLabel(last7.from, last7.to),
      },
      {
        value: 'last-30-days',
        label: 'Last 30 days',
        rangeLabel: formatRangeLabel(last30.from, last30.to),
      },
      {
        value: 'last-6-months',
        label: 'Last 6 months',
        rangeLabel: formatRangeLabel(last6m.from, last6m.to),
      },
    ]
  }, [])

  const currentRangeMeta = useMemo(() => getRangeMeta(visitRange), [visitRange])

  const overview = useStatsOverview()
  const visitShares = useVisitSharesChart({
    startDate: format(currentRangeMeta.from, 'yyyy-MM-dd'),
    endDate: format(currentRangeMeta.to, 'yyyy-MM-dd'),
    interval: currentRangeMeta.interval,
  })
  const overviewData = overview.data?.data?.overview
  const chartData = overview.data?.data?.chart

  const formatMoney = (value: number, currency: string) => {
    const locale = currency === 'NGN' ? 'en-NG' : 'en-US'
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: currency === 'NGN' ? 'narrowSymbol' : 'symbol',
        maximumFractionDigits: 0,
      }).format(value)
    } catch {
      return currency === 'NGN' ? `₦${value}` : `${value} ${currency}`
    }
  }

  const summaryItems = useMemo(() => {
    if (!overviewData) return emptySummaryCards
    const currency = overviewData.currency || 'USD'
    const visibilityMeta = [
      `${overviewData.visibilityBreakdown?.public ?? 0} public`,
      `${overviewData.visibilityBreakdown?.private ?? 0} private`,
    ].join(', ')
    return [
      {
        id: 'claimable',
        title: 'Claimable balance',
        value: formatMoney(overviewData.claimableBalance, currency),
        meta: 'Updated today',
        icon: (
          <span className='w-4 h-4 text-[#FF8D28]'>
            <CashIcon />
          </span>
        ),
        actionLabel: 'Claim',
      },
      {
        id: 'active',
        title: 'Active pages',
        value: String(overviewData.activePages ?? 0),
        meta: visibilityMeta,
        icon: (
          <span className='w-4 h-4 text-[#34C759]'>
            <NotificationCircleIcon />
          </span>
        ),
      },
      {
        id: 'pending',
        title: 'Pending gifts',
        value: String(overviewData.pendingContributions ?? 0),
        meta: 'Updated today',
        icon: (
          <span className='w-4 h-4 text-[#00C3D0]'>
            <GiftIcon />
          </span>
        ),
      },
      {
        id: 'views',
        title: 'Page views',
        value: String(overviewData.pageViews ?? 0),
        meta: 'Updated today',
        icon: (
          <span className='w-4 h-4 text-[#CB1A14]'>
            <ViewIcon />
          </span>
        ),
      },
    ]
  }, [overviewData])

  const giftDistribution = useMemo(
    () => [
      { type: 'Cash', total: chartData?.giftDistribution?.cash ?? 0 },
      { type: 'Store', total: chartData?.giftDistribution?.store ?? 0 },
      { type: 'Custom', total: chartData?.giftDistribution?.custom ?? 0 },
    ],
    [chartData]
  )

  const giftDistributionTotal = useMemo(
    () => giftDistribution.reduce((sum, item) => sum + item.total, 0),
    [giftDistribution]
  )

  const visitPoints = useMemo(
    () => visitShares.data?.data?.chart?.visitTOsharesLineChart ?? [],
    [visitShares.data?.data?.chart?.visitTOsharesLineChart]
  )

  return (
    <>
      {overview.isLoading ? (
        <SummaryCardsSkeleton />
      ) : (
        <SummaryCards items={summaryItems} />
      )}

      <div className='grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,346px)] gap-4 mt-2 lg:mt-0'>
        {visitShares.isLoading ? (
          <VisitSharesSkeleton />
        ) : (
          <VisitSharesCard
            range={visitRange}
            onRangeChange={setVisitRange}
            rangeOptions={rangeOptions}
            points={visitPoints}
          />
        )}
        {overview.isLoading ? (
          <GiftTypeDistributionSkeleton />
        ) : (
          <GiftTypeDistributionCard
            distribution={giftDistribution}
            total={giftDistributionTotal}
          />
        )}
      </div>
    </>
  )
}

export default DashboardStatsSection
