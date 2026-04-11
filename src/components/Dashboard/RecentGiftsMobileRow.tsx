'use client'

import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

import { giftStatusStyles } from './types'
import type { GiftItem } from '@/types/Gifts/index'
import CashIcon from '@/assets/icons/CashIcon'

type RecentGiftsMobileRowProps = {
  item: GiftItem
  isOpen: boolean
  onToggle: () => void
  onAction: (item: GiftItem) => void
}

const RecentGiftsMobileRow = ({
  item,
  isOpen,
  onToggle,
  onAction,
}: RecentGiftsMobileRowProps) => {
  const isCashGift = item.type.toLowerCase() === 'cash'
  const imageSrc =
    typeof item.image === 'string' && item.image.trim() !== ''
      ? item.image
      : null

  return (
    <div className='p-3'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex justify-between items-center flex-1 gap-2 min-w-0'>
          <div className='min-w-0 flex items-center gap-2'>
            {isCashGift ? (
              <div className='w-8 h-8 rounded-[6px] overflow-hidden bg-primary-50 text-primary-700 flex items-center justify-center shrink-0'>
                <span className='w-4 h-4'>
                  <CashIcon />
                </span>
              </div>
            ) : (
              <div className='w-8 h-8 rounded-[6px] overflow-hidden bg-grey-50'>
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={item.name}
                    width={32}
                    height={32}
                    className='w-full h-full object-cover'
                  />
                ) : null}
              </div>
            )}
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
              <span className='text-grey-900 font-medium capitalize'>
                {item.type}
              </span>
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
