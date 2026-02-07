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
} from 'chart.js'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  range: string
  onRangeChange: (value: string) => void
  isEmpty?: boolean
}

const VisitSharesCard = ({
  range,
  onRangeChange,
  isEmpty = false,
}: VisitSharesCardProps) => {
  const data = useMemo(
    () => ({
      labels: ['May', 'June', 'July', 'August', 'September', 'October'],
      datasets: [
        {
          label: 'Visit',
          data: [70, 65, 68, 120, 160, 130],
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
          data: [88, 84, 82, 110, 130, 118],
          borderColor: '#C19348',
          borderWidth: 1,
          backgroundColor: 'rgba(210, 164, 92, 0.12)',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    }),
    []
  )

  const chartData = useMemo(() => {
    if (!isEmpty) return data
    return {
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        data: [],
      })),
    }
  }, [data, isEmpty])

  const options = useMemo(
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
        <h2 className='text-lg font-medium text-blackish'>Visit vs Shares</h2>
        <Select value={range} onValueChange={onRangeChange}>
          <SelectTrigger className='flex items-center gap-2 text-xs text-grey-500 bg-grey-50/20 border-[0.5px] border-grey-50 rounded-full px-3 py-2 h-auto shadow-none'>
            <span className='flex items-center gap-1 text-grey-500'>
              Last 7 days:
              <span className='text-sm text-blackish font-medium leading-[18px]'>
                <SelectValue placeholder='Oct 5 - Oct 11' />
              </span>
            </span>
          </SelectTrigger>
          <SelectContent className='rounded-[12px] border-grey-50'>
            <SelectItem value='last-7-days'>Oct 5 - Oct 11</SelectItem>
            <SelectItem value='last-month'>Sep 5 - Sep 11</SelectItem>
            <SelectItem value='last-6-months'>May - Oct</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='mt-3 h-[260px] relative overflow-x-auto'>
        <div className='min-w-[520px] h-[260px]'>
          <Line data={chartData} options={options} />
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
