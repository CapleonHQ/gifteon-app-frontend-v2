'use client'

import { Doughnut } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

type GiftTypeDistributionCardProps = {
  data: ChartData<'doughnut'>
  options: ChartOptions<'doughnut'>
}

const GiftTypeDistributionCard = ({
  data,
  options,
}: GiftTypeDistributionCardProps) => {
  return (
    <div className='bg-white border lg:border-none border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] p-4'>
      <h2 className='text-lg font-medium text-blackish'>
        Gift Type Distribution
      </h2>
      <div className='mt-3 flex flex-col items-center'>
        <div className='h-[298px] w-full max-w-[260px]'>
          <Doughnut data={data} options={options} />
        </div>
        <div className='mt-4 flex items-center gap-4 text-xs text-grey-600'>
          <div className='flex items-center gap-2'>
            <span className='w-2.5 h-2.5 rounded-full bg-information-400' />
            Items
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-2.5 h-2.5 rounded-full bg-warning-400' />
            Cash
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-2.5 h-2.5 rounded-full bg-success-400' />
            Custom Gifts
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiftTypeDistributionCard
