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

ChartJS.register(ArcElement, Tooltip, Legend)

type GiftTypeDistributionCardProps = {
  isEmpty?: boolean
}

const GiftTypeDistributionCard = ({
  isEmpty = false,
}: GiftTypeDistributionCardProps) => {
  const data: ChartData<'doughnut'> = {
    labels: ['Items', 'Cash', 'Custom Gifts'],
    datasets: [
      {
        data: [180000, 164000, 210000],
        backgroundColor: ['#089BC4', '#C19348', '#5AB579'],
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
      tooltip: { enabled: true },
    },
  }

  return (
    <div className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] p-4'>
      <h2 className='text-lg font-medium text-blackish'>
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
              <div className='flex items-center gap-2'>
                <span className='w-2.5 h-2.5 rounded-full bg-[#089BC4]' />
                Items
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-2.5 h-2.5 rounded-full bg-[#C19348]' />
                Cash
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-2.5 h-2.5 rounded-full bg-[#5AB579]' />
                Custom Gifts
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GiftTypeDistributionCard
