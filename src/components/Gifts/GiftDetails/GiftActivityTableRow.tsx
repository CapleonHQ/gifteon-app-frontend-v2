'use client'

import type { GiftActivityItem } from '../GiftsPage/types'
import { activityStatusStyles } from '../GiftsPage/types'
import GiftActivityActionMenu from './GiftActivityActionMenu'

type GiftActivityTableRowProps = {
  item: GiftActivityItem
  onAction: (actionId: string, item: GiftActivityItem) => void
}

const GiftActivityTableRow = ({
  item,
  onAction,
}: GiftActivityTableRowProps) => {
  return (
    <div className='px-4 py-2.5 hover:bg-grey-50/50 transition-colors duration-300 cursor-pointer grid grid-cols-[minmax(220px,2fr)_minmax(160px,1.3fr)_minmax(160px,1.4fr)_minmax(120px,1fr)_minmax(120px,1fr)_24px] gap-3 text-grey-800 items-center'>
      <span className='text-grey-900 font-medium truncate'>{item.gift}</span>
      <span className='truncate'>{item.type}</span>
      <span className='truncate'>{item.sender}</span>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium w-fit whitespace-nowrap ${
          activityStatusStyles[item.status]
        }`}
      >
        {item.status}
      </span>
      <span className='whitespace-nowrap'>{item.worth}</span>
      <GiftActivityActionMenu item={item} onAction={onAction} />
    </div>
  )
}

export default GiftActivityTableRow
