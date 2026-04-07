'use client'

import type { GiftItem } from '@/types/Gifts/index'
import { giftStatusStyles } from './types'

type RecentGiftsTableProps = {
  items: GiftItem[]
  onAction: (item: GiftItem) => void
}

const RecentGiftsTable = ({ items, onAction }: RecentGiftsTableProps) => {
  return (
    <div className='mt-1 hidden lg:block'>
      <div className='overflow-auto'>
        <div className='min-w-[980px]'>
          <div className='grid grid-cols-[1.6fr_0.8fr_0.9fr_0.8fr_0.8fr_0.9fr] gap-3 px-4 py-2.5 text-sm text-grey-500 border-b border-grey-50 bg-grey-50/50'>
            <span>Gift</span>
            <span>Gift Type</span>
            <span>Date</span>
            <span>Worth</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          <div className='divide-y divide-grey-50'>
            {items.map((item) => (
              <div
                key={item.id}
                className='grid grid-cols-[1.6fr_0.8fr_0.9fr_0.8fr_0.8fr_0.9fr] gap-3 px-4 py-2.5 items-center text-base text-grey-700 hover:bg-grey-50 transition-colors duration-300 cursor-pointer'
              >
                <div className='min-w-0'>
                  <span className='text-grey-900 font-medium truncate'>
                    {item.name}
                  </span>
                </div>
                <span className='text-grey-600 capitalize'>{item.type}</span>
                <span className='text-grey-600'>{item.date}</span>
                <span className='text-grey-600'>{item.worth}</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    giftStatusStyles[item.status]
                  }`}
                >
                  {item.status}
                </span>
                {item.actionLabel ? (
                  <button
                    type='button'
                    onClick={() => onAction(item)}
                    className='w-fit px-3 py-1 rounded-[8px] bg-primary-400 text-white text-xs font-medium hover:bg-primary-500 transition-colors'
                  >
                    {item.actionLabel}
                  </button>
                ) : (
                  <span className='text-grey-400'>-</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentGiftsTable
