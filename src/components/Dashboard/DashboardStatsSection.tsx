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
import { formatCurrency } from '@/lib/utils/currency'

const DashboardStatsSection = () => {
  const [visitRange, setVisitRange] = useState<
    'week' | 'month' | 'bi-annual' | 'annual'
  >('week')

  const getRangeMeta = (
    range: 'week' | 'month' | 'bi-annual' | 'annual'
  ) => {
    const today = new Date()
    if (range === 'month') {
      const from = subDays(today, 29)
      return { from, to: today, interval: 'weekly' as const }
    }
    if (range === 'bi-annual') {
      const from = subMonths(today, 6)
      return { from, to: today, interval: 'monthly' as const }
    }
    if (range === 'annual') {
      const from = subMonths(today, 12)
      return { from, to: today, interval: 'monthly' as const }
    }
    const from = subDays(today, 6)
    return { from, to: today, interval: 'daily' as const }
  }

  const rangeOptions = useMemo(() => {
    const week = getRangeMeta('week')
    const month = getRangeMeta('month')
    const biAnnual = getRangeMeta('bi-annual')
    const annual = getRangeMeta('annual')

    const formatRangeLabel = (
      from: Date,
      to: Date,
      style: 'day' | 'month-year' = 'day'
    ) =>
      style === 'month-year'
        ? `${format(from, 'MMM yyyy')} - ${format(to, 'MMM yyyy')}`
        : `${format(from, 'MMM d')} - ${format(to, 'MMM d')}`

    return [
      {
        value: 'week',
        label: 'Last 7 days',
        rangeLabel: formatRangeLabel(week.from, week.to),
      },
      {
        value: 'month',
        label: 'Last 30 days',
        rangeLabel: formatRangeLabel(month.from, month.to),
      },
      {
        value: 'bi-annual',
        label: 'Last 6 months',
        rangeLabel: formatRangeLabel(biAnnual.from, biAnnual.to),
      },
      {
        value: 'annual',
        label: 'Last 12 months',
        rangeLabel: formatRangeLabel(annual.from, annual.to, 'month-year'),
      },
    ] satisfies Array<{
      value: 'week' | 'month' | 'bi-annual' | 'annual'
      label: string
      rangeLabel: string
    }>
  }, [])
  const overview = useStatsOverview()
  const visitShares = useVisitSharesChart({
    filter: visitRange,
  })
  const overviewData = overview.data?.data?.overview
  const chartData = overview.data?.data?.chart

  const summaryItems = useMemo(() => {
    if (!overviewData) return emptySummaryCards
    const currency = overviewData.currency
    const visibilityMeta = [
      `${overviewData.visibilityBreakdown.public} public`,
      `${overviewData.visibilityBreakdown.private} private`,
    ].join(', ')
    return [
      {
        id: 'claimable',
        title: 'Claimable balance',
        value: formatCurrency(overviewData.claimableBalance, {
          currency,
          maximumFractionDigits: 0,
        }),
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
        value: String(overviewData.activePages),
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
        value: String(overviewData.pendingContributions),
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
        value: String(overviewData.pageViews),
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
    () =>
      chartData
        ? [
            { type: 'Cash', total: chartData.giftDistribution.cash },
            { type: 'Store Gifts', total: chartData.giftDistribution.store },
            { type: 'Custom Gifts', total: chartData.giftDistribution.custom },
          ]
        : [],
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
