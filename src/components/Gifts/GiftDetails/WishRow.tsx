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
          <p className='font-medium text-blackish'>{wish.name}</p>
          <span className='text-sm text-grey-400'>{wish.time}</span>
        </div>
        <p className='text-sm text-grey-500'>{wish.message}</p>
      </div>
    </div>
  )
}

export default WishRow
