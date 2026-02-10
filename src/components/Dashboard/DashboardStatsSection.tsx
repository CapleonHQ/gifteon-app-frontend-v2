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
  useGiftTypeDistribution,
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
  const giftTypes = useGiftTypeDistribution()
  const visitShares = useVisitSharesChart({
    startDate: format(currentRangeMeta.from, 'yyyy-MM-dd'),
    endDate: format(currentRangeMeta.to, 'yyyy-MM-dd'),
    interval: currentRangeMeta.interval,
  })

  const formatMoney = (value: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value)
    } catch {
      return `${value} ${currency}`
    }
  }

  const summaryItems = useMemo(() => {
    if (!overview.data?.data) return emptySummaryCards
    const currency = overview.data.data.currency || 'USD'
    return [
      {
        id: 'claimable',
        title: 'Claimable balance',
        value: formatMoney(overview.data.data.claimableBalance, currency),
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
        value: String(overview.data.data.pages?.total ?? 0),
        meta: 'Updated today',
        icon: (
          <span className='w-4 h-4 text-[#34C759]'>
            <NotificationCircleIcon />
          </span>
        ),
      },
      {
        id: 'pending',
        title: 'Pending gifts',
        value: String(overview.data.data.pendingGiftsToClaim?.count ?? 0),
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
        value: String(overview.data.data.pageViews?.total ?? 0),
        meta: `${overview.data.data.pageViews?.trend ?? '0%'} from last period`,
        icon: (
          <span className='w-4 h-4 text-[#CB1A14]'>
            <ViewIcon />
          </span>
        ),
      },
    ]
  }, [overview])

  const visitPoints = useMemo(
    () => visitShares.data?.data?.data ?? [],
    [visitShares.data?.data?.data]
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
        {giftTypes.isLoading ? (
          <GiftTypeDistributionSkeleton />
        ) : (
          <GiftTypeDistributionCard
            distribution={giftTypes.data?.data?.distribution ?? []}
            total={giftTypes.data?.data?.total ?? 0}
          />
        )}
      </div>
    </>
  )
}

export default DashboardStatsSection
