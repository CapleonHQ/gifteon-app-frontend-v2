'use client'

import Link from 'next/link'
import type { RecentGiftItem } from './types'
import RecentGiftsTable from './RecentGiftsTable'
import RecentGiftsMobileList from './RecentGiftsMobileList'
import DashboardEmptyState from './DashboardEmptyState'
import EmptyBox from '@/assets/icons/EmptyBox'

type RecentGiftsSectionProps = {
  items: RecentGiftItem[]
}

const RecentGiftsSection = ({ items }: RecentGiftsSectionProps) => {
  const isEmpty = items.length === 0

  return (
    <div className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_1.5px_4px_-1px_#10192812] overflow-hidden'>
      <div className='px-4 py-3 flex items-center justify-between'>
        <h2 className='text-lg font-medium text-blackish'>Recent Gifts</h2>
        <Link
          href='/gifts'
          className='text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors duration-300 underline'
        >
          See all Gift Pages
        </Link>
      </div>
      {isEmpty ? (
        <div className='px-4 py-10 lg:py-16'>
          <DashboardEmptyState
            message='You have no gifts yet!'
            icon={<EmptyBox />}
          />
        </div>
      ) : (
        <>
          <RecentGiftsTable items={items} />
          <RecentGiftsMobileList items={items} />
        </>
      )}
    </div>
  )
}

export default RecentGiftsSection
