'use client'

import { Checkbox } from '@/components/ui/checkbox'

type GiftsTableHeaderProps = {
  isIndeterminate: boolean
  allSelected: boolean
  onToggleAll: () => void
}

const GiftsTableHeader = ({
  isIndeterminate,
  allSelected,
  onToggleAll,
}: GiftsTableHeaderProps) => {
  return (
    <thead className='border-b border-grey-50 bg-grey-50/50 text-sm text-grey-600'>
      <tr>
        <th className='w-[56px] px-4 py-2.5 text-left font-normal'>
          <Checkbox
            checked={isIndeterminate ? 'indeterminate' : allSelected}
            onCheckedChange={onToggleAll}
            className='size-5'
          />
        </th>
        <th className='px-2 py-2.5 text-left font-normal'>
          <div className='truncate'>Page Title</div>
        </th>
        <th className='px-2 py-2.5 text-left font-normal'>
          <div className='truncate'>Category</div>
        </th>
        <th className='px-2 py-2.5 text-left font-normal'>Visibility</th>
        <th className='px-2 py-2.5 text-left font-normal'>Created on</th>
        <th className='px-2 py-2.5 text-left font-normal'>Total Gifts</th>
        <th className='px-2 py-2.5 text-left font-normal'>Total Wishes</th>
        <th className='px-2 py-2.5 text-left font-normal'>Views</th>
        <th className='px-2 py-2.5 text-left font-normal'>Status</th>
        <th className='w-[64px] px-6 py-2.5 text-left font-normal' />
      </tr>
    </thead>
  )
}

export default GiftsTableHeader
