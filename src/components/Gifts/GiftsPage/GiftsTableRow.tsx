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
  onShare: () => void
  onStatusAction: () => void
}

const GiftsTableRow = ({
  page,
  isSelected,
  onToggle,
  onView,
  onShare,
  onStatusAction,
}: GiftsTableRowProps) => {
  const isDeactivated = page.status === 'Deactivated'

  return (
    <tr
      className='cursor-pointer border-b border-grey-50 text-grey-800 transition-colors duration-300 hover:bg-grey-50'
      onClick={onView}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onView()
        }
      }}
      tabIndex={0}
      aria-label={`View ${page.title}`}
    >
      <td
        className='w-[56px] px-4 py-2.5 align-middle'
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox checked={isSelected} onCheckedChange={onToggle} className='size-5' />
      </td>
      <td className='px-2 py-2.5 align-middle'>
        <div className='flex min-w-0 items-center gap-2 whitespace-nowrap'>
          <div className='h-8 w-8 shrink-0 overflow-hidden rounded-[4px]'>
            <Image
              src={page.image}
              alt={page.title}
              width={32}
              height={32}
              className='h-full w-full object-cover'
            />
          </div>
          <p className='truncate font-medium text-grey-900'>{page.title}</p>
        </div>
      </td>
      <td className='px-2 py-2.5 align-middle'>
        <div className='min-w-0 truncate whitespace-nowrap'>{page.category}</div>
      </td>
      <td className='px-2 py-2.5 align-middle whitespace-nowrap'>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            visibilityStyles[page.visibility]
          }`}
        >
          {page.visibility}
        </span>
      </td>
      <td className='px-2 py-2.5 align-middle whitespace-nowrap'>{page.createdOn}</td>
      <td className='px-2 py-2.5 align-middle whitespace-nowrap'>{page.totalGifts?.toLocaleString()}</td>
      <td className='px-2 py-2.5 align-middle whitespace-nowrap'>{page.totalWishes?.toLocaleString()}</td>
      <td className='px-2 py-2.5 align-middle whitespace-nowrap'>{page.views?.toLocaleString()}</td>
      <td className='px-2 py-2.5 align-middle whitespace-nowrap'>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            statusStyles[page.status]
          }`}
        >
          {page.status}
        </span>
      </td>
      <td
        className='w-[64px] px-6 py-2.5 align-middle'
        onClick={(event) => event.stopPropagation()}
      >
        <GiftsTableRowActions
          onView={onView}
          onShare={onShare}
          onStatusAction={onStatusAction}
          statusActionLabel={isDeactivated ? 'Activate' : 'Deactivate'}
          isDestructive={!isDeactivated}
        />
      </td>
    </tr>
  )
}

export default GiftsTableRow
