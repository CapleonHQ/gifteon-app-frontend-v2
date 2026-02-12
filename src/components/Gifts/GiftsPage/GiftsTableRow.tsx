'use client'

import Image from 'next/image'
import { Checkbox } from '@/components/ui/checkbox'
import { type GiftPageItem, statusStyles, visibilityStyles } from './types'
import GiftsTableRowActions from './GiftsTableRowActions'

type GiftsTableRowProps = {
  page: GiftPageItem
  isSelected: boolean
  onToggle: () => void
  onView: () => void
  onDeactivate: () => void
}

const GiftsTableRow = ({
  page,
  isSelected,
  onToggle,
  onView,
  onDeactivate,
}: GiftsTableRowProps) => {
  return (
    <div className='grid grid-cols-[24px_1.5fr_1fr_1fr_1fr_0.8fr_0.9fr_0.7fr_0.8fr_28px] items-center gap-4 text-grey-800 px-4 py-2.5 hover:bg-grey-50 transition-colors duration-300 border-b border-grey-50 whitespace-nowrap'>
      <Checkbox checked={isSelected} onCheckedChange={onToggle} className='size-5' />
      <div className='flex items-center gap-2 min-w-0'>
        <div className='w-8 h-8 rounded-[4px] overflow-hidden'>
          <Image
            src={page.image}
            alt={page.title}
            width={32}
            height={32}
            className='w-full h-full object-cover'
          />
        </div>
        <p className='text-grey-900 font-medium truncate'>{page.title}</p>
      </div>
      <span>{page.category}</span>
      <div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            visibilityStyles[page.visibility]
          }`}
        >
          {page.visibility}
        </span>
      </div>
      <span>{page.createdOn}</span>
      <span>{page.totalGifts?.toLocaleString()}</span>
      <span>{page.totalWishes?.toLocaleString()}</span>
      <span>{page.views?.toLocaleString()}</span>
      <div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            statusStyles[page.status]
          }`}
        >
          {page.status}
        </span>
      </div>
      <GiftsTableRowActions onView={onView} onDeactivate={onDeactivate} />
    </div>
  )
}

export default GiftsTableRow
