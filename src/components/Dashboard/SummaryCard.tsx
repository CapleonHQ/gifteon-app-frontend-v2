'use client'

import type { SummaryCardItem } from '@/types/Stats'

type SummaryCardProps = {
  item: SummaryCardItem
}

const SummaryCard = ({ item }: SummaryCardProps) => {
  const Icon = item.icon

  return (
    <div className='bg-white border border-grey-50 rounded-[12px] shadow-[0px_10px_18px_-2px_#10192812] p-4 flex flex-col gap-3'>
      <div className='flex items-start justify-between gap-3'>
        <p className='text-sm text-grey-600'>{item.title}</p>
        {Icon}
      </div>
      <div className='flex justify-between items-end'>
        <div className='flex flex-col gap-1'>
          <p className='text-[28px] leading-8 font-semibold text-blackish'>
            {item.value}
          </p>
          <span className='text-xs text-grey-400'>{item.meta}</span>
        </div>

        {item.actionLabel ? (
          <button
            type='button'
            onClick={item.onAction}
            disabled={item.actionDisabled}
            className='px-5 py-1 rounded-[8px] bg-primary-400 text-white text-sm leading-[18px] font-medium hover:bg-primary-500 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary-400'
          >
            {item.actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default SummaryCard
