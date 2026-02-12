'use client'

import { useState } from 'react'
import type { GiftItem } from '@/types/Gifts/index'
import RecentGiftsMobileRow from './RecentGiftsMobileRow'

type RecentGiftsMobileListProps = {
  items: GiftItem[]
  onAction: (item: GiftItem) => void
}

const RecentGiftsMobileList = ({
  items,
  onAction,
}: RecentGiftsMobileListProps) => {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className='lg:hidden divide-y divide-grey-50'>
      {items.map((item) => (
        <RecentGiftsMobileRow
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onAction={onAction}
          onToggle={() =>
            setOpenId((prev) => (prev === item.id ? null : item.id))
          }
        />
      ))}
    </div>
  )
}

export default RecentGiftsMobileList
