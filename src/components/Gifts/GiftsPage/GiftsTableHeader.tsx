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
    <div className='px-4 py-2.5 border-b border-grey-50 bg-grey-50/50'>
      <div className='grid grid-cols-[24px_1.5fr_1fr_1fr_1fr_0.8fr_0.9fr_0.7fr_0.8fr_28px] text-sm gap-4 text-grey-600 items-center whitespace-nowrap'>
        <span>
          <Checkbox
            checked={isIndeterminate ? 'indeterminate' : allSelected}
            onCheckedChange={onToggleAll}
            className='size-5'
          />
        </span>
        <span>Page Title</span>
        <span>Category</span>
        <span>Visibility</span>
        <span>Created on</span>
        <span>Total Gifts</span>
        <span>Total Wishes</span>
        <span>Views</span>
        <span>Status</span>
        <span />
      </div>
    </div>
  )
}

export default GiftsTableHeader
