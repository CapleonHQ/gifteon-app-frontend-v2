'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bar } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import DashboardEmptyState from '@/components/Dashboard/DashboardEmptyState'
import EmptyFolderFile from '@/assets/icons/EmptyFolderFile'

type PageVisitsCardProps = {
  visitRange: string
  onVisitRangeChange: (value: string) => void
  data: ChartData<'bar'>
  options: ChartOptions<'bar'>
}

const PageVisitsCard = ({
  visitRange,
  onVisitRangeChange,
  data,
  options,
}: PageVisitsCardProps) => {
  const visits =
    data.datasets.flatMap((dataset) =>
      dataset.data.map((value) =>
        typeof value === 'number' ? value : Number(value) || 0
      )
    ) ?? []
  const isEmpty = visits.length === 0 || visits.every((value) => value <= 0)

  return (
    <div className='bg-white border lg:border-none border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] p-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium text-blackish'>Page Visits</h2>

        <Select value={visitRange} onValueChange={onVisitRangeChange}>
          <SelectTrigger className='flex items-center gap-2 text-xs text-grey-500 bg-grey-50/20 border-[0.5px] border-grey-50 rounded-full px-3 py-2.5 h-auto shadow-none'>
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
            <SelectItem value='last-3-months'>Aug 5 - Aug 11</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isEmpty ? (
        <div className='mt-3 h-[298px] flex items-center justify-center'>
          <DashboardEmptyState
            message='No page visits yet!'
            icon={<EmptyFolderFile />}
          />
        </div>
      ) : (
        <div className='mt-3 h-[298px]'>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  )
}

export default PageVisitsCard
