'use client'

import type { ComponentType } from 'react'
import type { SummaryCard as SummaryCardType } from '@/types/Gifts/giftDetails'

type SummaryCardProps = {
  card: SummaryCardType
  CardBgSvg: ComponentType
}

const SummaryCard = ({ card, CardBgSvg }: SummaryCardProps) => {
  const Icon = card.icon

  return (
    <div
      className={`rounded-[12px] border ${card.borderColor} shadow-[0px_10px_18px_-2px_#10192812] ${card.accent} relative overflow-hidden`}
    >
      <div className='flex justify-between p-4'>
        <div className='flex flex-col gap-3 z-10'>
          <span className='text-sm text-grey-600'>{card.title}</span>
          <span className='text-[28px] font-semibold text-blackish'>
            {card.value}
          </span>
        </div>

        <span className={`w-4 h-4 ${card.iconColor} z-10`}>
          <Icon />
        </span>
      </div>
      <div
        className={`absolute w-1/2 h-[70%] bottom-0 right-0 ${card.svgColor}`}
      >
        <CardBgSvg />
      </div>
    </div>
  )
}

export default SummaryCard
