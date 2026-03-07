'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { WishItem } from '@/types/Gifts/giftDetails'

type WishRowProps = {
  wish: WishItem
}

const WishRow = ({ wish }: WishRowProps) => {
  return (
    <div className='flex gap-2 pb-3'>
      <Avatar className='w-10 h-10'>
        <AvatarFallback className='bg-grey-50 text-grey-700 text-sm font-medium'>
          {wish.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className='flex flex-1 flex-col gap-1'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex min-w-0 items-center gap-2'>
            <p className='truncate font-medium text-blackish'>{wish.name}</p>
            {wish.private ? (
              <span className='inline-flex shrink-0 items-center rounded-full border border-warning-100 bg-warning-50 px-2 py-0.5 text-[11px] font-medium text-warning-700'>
                Private
              </span>
            ) : null}
          </div>
          <span className='text-sm text-grey-400'>{wish.time}</span>
        </div>
        <p className='text-sm text-grey-500'>{wish.message}</p>
      </div>
    </div>
  )
}

export default WishRow
