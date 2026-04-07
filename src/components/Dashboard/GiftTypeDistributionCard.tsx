'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import DashboardEmptyState from './DashboardEmptyState'
import EmptyFolderFile from '@/assets/icons/EmptyFolderFile'
import type { GiftTypeDistributionItem } from '@/types/Stats'

ChartJS.register(ArcElement, Tooltip, Legend)

type GiftTypeDistributionCardProps = {
  distribution: GiftTypeDistributionItem[]
  total: number
}

const GiftTypeDistributionCard = ({
  distribution,
  total,
}: GiftTypeDistributionCardProps) => {
  const isEmpty = total === 0 || distribution.length === 0
  const colors = ['#089BC4', '#C19348', '#5AB579', '#8B5CF6', '#F59E0B']
  const resolvedData = distribution.length
    ? distribution
    : [
        { type: 'Items', total: 0 },
        { type: 'Cash', total: 0 },
        { type: 'Custom Gifts', total: 0 },
      ]

  const data: ChartData<'doughnut'> = {
    labels: resolvedData.map((item) => item.type),
    datasets: [
      {
        data: resolvedData.map((item) => item.total),
        backgroundColor: resolvedData.map(
          (_, index) => colors[index % colors.length]
        ),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
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

  return (
    <div className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] p-4'>
      <h2 className='sm:text-lg font-medium text-blackish'>
        Gift Type Distribution
      </h2>
      <div className='mt-4 flex flex-col items-center'>
        {isEmpty ? (
          <div className='h-[260px] w-full flex items-center justify-center'>
            <DashboardEmptyState
              message='You have no gifts yet!'
              icon={<EmptyFolderFile />}
            />
          </div>
        ) : (
          <>
            <div className='h-[260px] w-full max-w-[260px]'>
              <Doughnut data={data} options={options} />
            </div>
            <div className='mt-4 flex items-center gap-4 text-xs text-grey-600'>
              {resolvedData.map((item, index) => (
                <div key={item.type} className='flex items-center gap-2'>
                  <span
                    className='w-2.5 h-2.5 rounded-full'
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  {item.type}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GiftTypeDistributionCard
