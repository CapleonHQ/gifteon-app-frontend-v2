'use client'

import type { GiftActivityItem } from '../GiftsPage/types'
import GiftActivityTableRow from './GiftActivityTableRow'
import GiftActivityMobileRow from './GiftActivityMobileRow'

type GiftActivitySectionProps = {
  items: GiftActivityItem[]
  openMobileId: string | null
  onToggleMobile: (id: string) => void
}

const GiftActivitySection = ({
  items,
  openMobileId,
  onToggleMobile,
}: GiftActivitySectionProps) => {
  const handleAction = (actionId: string, item: GiftActivityItem) => {
    console.log(`[GiftActivity] ${actionId} - ${item.id}`)
  }

  return (
    <div className='bg-white border lg:border-none border-grey-50 pb:1 lg:pb-3 rounded-[20px] shadow-[0px_10px_18px_-2px_#10192812]'>
      <div className='px-3 lg:px-4 pt-4 pb-2 lg:pt-3 lg:pb-3'>
        <h2 className='text-lg font-medium text-blackish'>Gift Activity</h2>
      </div>
      <div className='mt-1 hidden lg:block'>
        <div className='overflow-auto max-h-[calc(100vh-280px)] min-h-[260px]'>
          <div className='min-w-[980px]'>
            <div className='border-b border-grey-50 bg-grey-50/50 px-4 py-2.5 text-sm text-grey-600 grid grid-cols-[minmax(220px,2fr)_minmax(160px,1.3fr)_minmax(160px,1.4fr)_minmax(120px,1fr)_minmax(120px,1fr)_24px] gap-3 sticky top-0 z-10'>
              <span>Gift</span>
              <span>Type</span>
              <span>Sender</span>
              <span>Status</span>
              <span>Worth</span>
              <span />
            </div>
            <div className='mt-1 divide-y divide-grey-50'>
              {items.map((item) => (
                <GiftActivityTableRow
                  key={item.id}
                  item={item}
                  onAction={handleAction}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='mt-1 lg:hidden pb-4 space-y-1 divide-y divide-grey-50'>
        {items.map((item) => (
          <GiftActivityMobileRow
            key={item.id}
            item={item}
            isOpen={openMobileId === item.id}
            onToggle={() => onToggleMobile(item.id)}
            onAction={handleAction}
          />
        ))}
      </div>
    </div>
  )
}

export default GiftActivitySection
