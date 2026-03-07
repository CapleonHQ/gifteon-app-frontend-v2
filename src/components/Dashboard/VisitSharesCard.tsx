'use client'

import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js'
import { format, isValid, parseISO } from 'date-fns'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import DashboardEmptyState from './DashboardEmptyState'
import EmptyFolderFile from '@/assets/icons/EmptyFolderFile'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

type VisitSharesCardProps = {
  range: 'week' | 'month' | 'bi-annual' | 'annual'
  onRangeChange: (value: 'week' | 'month' | 'bi-annual' | 'annual') => void
  rangeOptions: Array<{
    value: 'week' | 'month' | 'bi-annual' | 'annual'
    label: string
    rangeLabel: string
  }>
  points: Array<{ date: string; visits: number; shares: number }>
}

const formatPointLabel = (
  value: string,
  range: 'week' | 'month' | 'bi-annual' | 'annual'
) => {
  if (!value) return ''

  const normalizedValue =
    /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value
  const parsed = parseISO(normalizedValue)

  if (!isValid(parsed)) return value

  if (range === 'week') {
    return format(parsed, 'EEE')
  }

  if (range === 'month') {
    return format(parsed, 'MMM d')
  }

  return format(parsed, 'MMM yyyy')
}

const VisitSharesCard = ({
  range,
  onRangeChange,
  rangeOptions,
  points,
}: VisitSharesCardProps) => {
  const selectedRange = rangeOptions.find((item) => item.value === range)

  const lineChartData: ChartData<'line'> = useMemo(() => {
    const labels =
      points.map((point) => {
        return formatPointLabel(point.date, range)
      }) ?? []
    const visits = points.map((point) => point.visits ?? 0)
    const shares = points.map((point) => point.shares ?? 0)

    return {
      labels,
      datasets: [
        {
          label: 'Visit',
          data: visits,
          borderColor: '#089BC4',
          borderWidth: 1,
          backgroundColor: (context: {
            chart: {
              ctx: CanvasRenderingContext2D
              chartArea?: { top: number; bottom: number }
            }
          }) => {
            const { chart } = context
            const { ctx, chartArea } = chart
            if (!chartArea) return 'rgba(8, 155, 196, 0.2)'
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            )
            gradient.addColorStop(0, 'rgba(8, 155, 196, 0.5)')
            gradient.addColorStop(1, 'rgba(234, 250, 254, 0.1)')
            return gradient
          },
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: 'Shares',
          data: shares,
          borderColor: '#C19348',
          borderWidth: 1,
          backgroundColor: 'rgba(210, 164, 92, 0.12)',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    }
  }, [points, range])

  const isEmpty =
    lineChartData.datasets.length === 0 ||
    lineChartData.datasets.every((dataset) => dataset.data.length === 0)
  const resolvedChartData = useMemo(() => {
    if (!isEmpty) return lineChartData
    return {
      ...lineChartData,
      datasets: lineChartData.datasets.map((dataset) => ({
        ...dataset,
        data: [],
      })),
    }
  }, [lineChartData, isEmpty])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { left: 12 },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          align: 'center' as const,
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 10,
            boxHeight: 10,
            color: '#393635',
            font: { size: 14 },
          },
        },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#605C5A',
            font: {
              size: 14,
              // weight: 500
            },
          },
          border: { display: false },
        },

        y: {
          border: {
            dash: [5, 5],
            display: false,
          },

          grid: {
            display: !isEmpty,
            drawOnChartArea: true,
            drawTicks: false,
            color: '#D6EEF4',
            lineWidth: 1,
            borderDash: [6, 6],
            borderDashOffset: 0,
          },
          beginAtZero: true,
          min: isEmpty ? 0 : undefined,
          max: isEmpty ? 180 : undefined,
          ticks: {
            color: '#605C5A',
            font: {
              size: 14,
              //  weight: 500
            },
            stepSize: 30,
            padding: 8,
          },
        },
      },
    }),
    [isEmpty]
  )

  return (
    <div className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] p-4'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='sm:text-lg font-medium text-blackish'>
          Visit vs Shares
        </h2>
        <Select
          value={range}
          onValueChange={(value) => onRangeChange(value as typeof range)}
        >
          <SelectTrigger className='flex items-center gap-2 text-xs text-grey-500 bg-grey-50/20 border-[0.5px] border-grey-50 rounded-full px-3 py-2 h-auto shadow-none'>
            <span className='flex items-center gap-1 text-grey-500'>
              <span className='text-xs text-grey-500'>
                {selectedRange?.label ?? 'Last 7 days'}
                {selectedRange?.rangeLabel ? ':' : ''}
              </span>
              <span className='text-sm text-blackish font-medium leading-[18px]'>
                {selectedRange?.rangeLabel ?? ''}
              </span>
            </span>
          </SelectTrigger>
          <SelectContent className='rounded-[12px] border-grey-50'>
            {rangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}: {option.rangeLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='mt-3 h-[260px] relative overflow-x-auto'>
        <div className='min-w-[520px] h-[260px]'>
          <Line data={resolvedChartData} options={chartOptions} />
        </div>
        {isEmpty ? (
          <div className='absolute inset-0 flex items-center justify-center'>
            <DashboardEmptyState
              message='You have no visit or shares yet!'
              icon={<EmptyFolderFile />}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default VisitSharesCard
