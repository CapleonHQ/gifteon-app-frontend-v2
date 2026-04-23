'use client'

import type { SummaryCard } from '@/types/Gifts/giftDetails'
import SummaryCardItem from './SummaryCard'

type SummaryCardsGridProps = {
  cards: SummaryCard[]
  CardBgSvg: React.ComponentType
}

const SummaryCardsGrid = ({ cards, CardBgSvg }: SummaryCardsGridProps) => {
  return (
    <div className='grid sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-5'>
      {cards.map((card) => (
        <SummaryCardItem key={card.id} card={card} CardBgSvg={CardBgSvg} />
      ))}
    </div>
  )
}

export default SummaryCardsGrid
