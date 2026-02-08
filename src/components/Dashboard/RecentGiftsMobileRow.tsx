'use client'

import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import type { RecentGiftItem } from './types'
import { giftStatusStyles } from './types'

type RecentGiftsMobileRowProps = {
  item: RecentGiftItem
  isOpen: boolean
  onToggle: () => void
  onAction: (item: RecentGiftItem) => void
}

const RecentGiftsMobileRow = ({
  item,
  isOpen,
  onToggle,
  onAction,
}: RecentGiftsMobileRowProps) => {
  return (
    <div className='p-3'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex justify-between items-center flex-1 gap-2 min-w-0'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-10 h-10 rounded-[8px] overflow-hidden bg-grey-50'>
              <Image
                src={item.image}
                alt={item.name}
                width={40}
                height={40}
                className='w-full h-full object-cover'
              />
            </div>
            <p className='text-sm font-medium text-grey-900 truncate'>
              {item.name}
            </p>
          </div>
          <div className='w-[90px] flex justify-end'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                giftStatusStyles[item.status]
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
            className={`w-5 h-5 text-grey-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className='mt-3 flex flex-col gap-3'>
          <div className='flex flex-col gap-2 text-grey-600 text-sm'>
            <div className='flex items-center justify-between'>
              <span>Gift Type:</span>
              <span className='text-grey-900 font-medium'>{item.type}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Date:</span>
              <span className='text-grey-900 font-medium'>{item.date}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Worth:</span>
              <span className='text-grey-900 font-medium'>{item.worth}</span>
            </div>
          </div>

          {item.actionLabel ? (
            <button
              type='button'
              onClick={() => onAction(item)}
              className='w-full py-3 rounded-[8px] bg-primary-400 text-white text-sm font-medium hover:bg-primary-500 transition-colors'
            >
              {item.actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default RecentGiftsMobileRow
