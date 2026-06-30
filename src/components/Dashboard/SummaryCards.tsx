'use client'

import SummaryCard from './SummaryCard'
import type { SummaryCardItem } from '@/types/Stats'

type SummaryCardsProps = {
  items: SummaryCardItem[]
}

const SummaryCards = ({ items }: SummaryCardsProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-3 lg:gap-5'>
      {items.map((item) => (
        <SummaryCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default SummaryCards
