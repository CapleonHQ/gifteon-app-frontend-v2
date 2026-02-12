'use client'

import { ChevronDown } from 'lucide-react'
import type { GiftActivityItem } from '../GiftsPage/types'
import { activityStatusStyles } from '../GiftsPage/types'
import GiftActivityActionButtons from './GiftActivityActionButtons'

type GiftActivityMobileRowProps = {
  item: GiftActivityItem
  isOpen: boolean
  onToggle: () => void
  onAction: (actionId: string, item: GiftActivityItem) => void
}

const GiftActivityMobileRow = ({
  item,
  isOpen,
  onToggle,
  onAction,
}: GiftActivityMobileRowProps) => {
  return (
    <div className='p-3'>
      <div className='flex items-center justify-between gap-[35px]'>
        <div className='flex justify-between items-center flex-1 gap-2'>
          <span className='font-medium text-grey-900'>{item.gift}</span>
          <div className='w-[90px]'>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium item-start ${
                activityStatusStyles[item.status]
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>
        <button
          type='button'
          className='flex items-center'
          onClick={onToggle}
          aria-label='Toggle details'
        >
          <ChevronDown
            className={`w-6 h-6 text-grey-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
      {isOpen && (
        <div className='mt-3 flex flex-col gap-3'>
          <div className='flex flex-col gap-2 text-grey-600'>
            <div className='flex items-center justify-between'>
              <span>Type:</span>
              <span className='text-grey-900 font-medium'>{item.type}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Sender:</span>
              <span className='text-grey-900 font-medium'>{item.sender}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Worth:</span>
              <span className='text-grey-900 font-medium'>{item.worth}</span>
            </div>
          </div>
          <GiftActivityActionButtons item={item} onAction={onAction} />
        </div>
      )}
    </div>
  )
}

export default GiftActivityMobileRow
