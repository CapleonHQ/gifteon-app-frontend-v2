import { format, isValid, parseISO } from 'date-fns'
import type { ChartData, ChartOptions } from 'chart.js'
import GiftIcon from '@/assets/icons/GiftIcon'
import MessageIcon from '@/assets/icons/MessageIcon'
import EyeOnIcon from '@/assets/icons/EyeOnIcon'
import CashIcon from '@/assets/icons/CashIcon'
import type { GiftActivityItem, ActivityStatus } from '@/components/Gifts/GiftsPage/types'
import type { SummaryCard } from '@/types/Gifts/giftDetails'
import type { PageContribution } from '@/types/Contributions'
import type { PageDetails, PageDetailsGiftDistribution, PageDetailsVisitPoint } from '@/types/Pages'
import { formatCurrency } from '@/lib/utils/currency'

const ACTIVITY_STATUS_MAP: Record<string, ActivityStatus> = {
  success: 'Fulfilled',
  fulfilled: 'Fulfilled',
  unclaimed: 'Unclaimed',
  shipped: 'Shipped',
  claimed: 'Claimed',
  pending: 'Pending',
  used: 'Used',
  failed: 'Pending',
}

export const formatMoney = (value: number) => {
  return formatCurrency(value, { currency: 'NGN', maximumFractionDigits: 0 })
}

export const mapSummaryCards = (page?: PageDetails): SummaryCard[] => {
  return [
    {
      id: 'gifts',
      title: 'Total gifts received',
      value: String(page?.engagement.totalContributions ?? 0),
      icon: GiftIcon,
      borderColor: 'border-success-50',
      accent: 'bg-success-50/30',
      iconColor: 'text-success-400',
      svgColor: 'text-success-50',
    },
    {
      id: 'wishes',
      title: 'Wishes',
      value: String(page?.engagement.totalWishes ?? 0),
      icon: MessageIcon,
      borderColor: 'border-warning-50',
      accent: 'bg-warning-50/30',
      iconColor: 'text-warning-400',
      svgColor: 'text-warning-50',
    },
    {
      id: 'views',
      title: 'Page views',
      value: String(page?.engagement.totalViews ?? 0),
      icon: EyeOnIcon,
      borderColor: 'border-[#EDE7FC]',
      accent: 'bg-[#EDE7FC]/30',
      iconColor: 'text-[#4B14CB]',
      svgColor: 'text-[#EDE7FC]',
    },
    {
      id: 'value',
      title: 'Total value (Cash & Gifts)',
      value: formatMoney(page?.engagement.totalContributionsValue ?? 0),
      icon: CashIcon,
      borderColor: 'border-[#E8F1FB]',
      accent: 'bg-[#E8F1FB]/30',
      iconColor: 'text-information-400',
      svgColor: 'text-[#E8F1FB]',
    },
  ]
}

export const mapContributionItems = (
  contributions: PageContribution[]
): GiftActivityItem[] => {
  return contributions.map((item) => {
    const rawStatus = item.status.toLowerCase()
    if (!(rawStatus in ACTIVITY_STATUS_MAP)) {
      throw new Error(`Unsupported contribution status: ${item.status}`)
    }
    const status = ACTIVITY_STATUS_MAP[rawStatus]
    const worthValue =
      rawStatus === 'claimed'
        ? Number(item.claimedAmount ?? 0)
        : Number(item.amount)

    return {
      id: item.id,
      gift: item.giftName,
      type: item.type,
      sender: item.sender,
      status,
      worth: formatCurrency(worthValue, {
        currency: item.currency,
        maximumFractionDigits: 0,
      }),
    }
  })
}

export const mapVisitsChartData = (
  points: PageDetailsVisitPoint[]
): ChartData<'bar'> => ({
  labels: points.map((point) => {
    const parsed = parseISO(point.date)
    return isValid(parsed) ? format(parsed, 'MMM d') : point.date
  }),
  datasets: [
    {
      label: 'Visits',
      data: points.map((point) => point.count),
      backgroundColor: '#089BC4',
      borderRadius: 2,
      barThickness: 22,
    },
  ],
})

export const pageVisitsChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#7B7574', font: { size: 11 } },
      border: { display: false },
    },
    y: {
      grid: { color: '#F3F2F2' },
      ticks: { color: '#9F9A99', font: { size: 10 }, stepSize: 30 },
      border: { display: false },
    },
  },
}

export const mapGiftDistributionChartData = (
  distribution?: PageDetailsGiftDistribution
): ChartData<'doughnut'> => ({
  labels: ['Store Gifts', 'Cash', 'Custom Gifts'],
  datasets: [
    {
      data: [
        distribution?.store ?? 0,
        distribution?.cash ?? 0,
        distribution?.custom ?? 0,
      ],
      backgroundColor: ['#089BC4', '#C19348', '#5AB579'],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
})

export const giftDistributionChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => {
          const rawValue = context.raw
          const value =
            typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0)
          const contributionLabel =
            value === 1 ? 'contribution' : 'contributions'
          return `${value} ${contributionLabel}`
        },
      },
    },
  },
}
