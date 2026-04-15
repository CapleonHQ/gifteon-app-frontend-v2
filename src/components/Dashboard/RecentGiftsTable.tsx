'use client'

import Image from 'next/image'
import CashIcon from '@/assets/icons/CashIcon'
import type { GiftItem } from '@/types/Gifts/index'
import { giftStatusStyles } from './types'

type RecentGiftsTableProps = {
  items: GiftItem[]
  onAction: (item: GiftItem) => void
}

const RecentGiftsTable = ({ items, onAction }: RecentGiftsTableProps) => {
  const renderGiftAvatar = (item: GiftItem) => {
    const isCashGift = item.type.toLowerCase() === 'cash'
    const imageSrc =
      typeof item.image === 'string' && item.image.trim() !== ''
        ? item.image
        : null

    if (isCashGift) {
      return (
        <div className='w-10 h-10 rounded-[8px] overflow-hidden bg-primary-50 text-primary-700 flex items-center justify-center shrink-0'>
          <span className='w-4 h-4'>
            <CashIcon />
          </span>
        </div>
      )
    }

    return (
      <div className='w-10 h-10 rounded-[8px] overflow-hidden bg-grey-50 shrink-0'>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={item.name}
            width={40}
            height={40}
            className='w-full h-full object-cover'
          />
        ) : null}
      </div>
    )
  }

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
                <div className='flex items-center gap-3 min-w-0'>
                  {renderGiftAvatar(item)}
                  <div className='min-w-0'>
                    <p className='text-grey-900 font-medium truncate'>
                      {item.name}
                    </p>
                    {item.fromName ? (
                      <p className='text-xs text-grey-500 truncate'>
                        From {item.fromName}
                      </p>
                    ) : null}
                  </div>
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
