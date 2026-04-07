import Image from 'next/image'
import Link from 'next/link'
import type { ExploreCard } from '@/types/Explore'

type ExploreCardsGridProps = {
  cards: ExploreCard[]
  onCardOpen: (card: ExploreCard) => void
}

const ExploreCardsGrid = ({ cards, onCardOpen }: ExploreCardsGridProps) => {
  return (
    <div className='mt-6 grid grid-cols-1 gap-x-7 gap-y-8 md:grid-cols-2 xl:grid-cols-3'>
      {cards.map((card) => (
        <article
          key={card.id}
          className='overflow-hidden rounded-[12px] border border-secondary-100 bg-white shadow-[0px_10px_18px_-2px_#10192812]'
        >
          <div className='relative h-[238px] w-full'>
            <Image
              src={card.image}
              alt={card.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
            />
          </div>
          <div className='space-y-4 p-4'>
            <h3 className='text-2xl font-semibold leading-8 text-blackish'>
              {card.title}
            </h3>
            <p className='line-clamp-2 text-base leading-6 text-grey-700'>
              {card.content}
            </p>
            <Link
              href={`/u/${card.slug}`}
              onClick={() => onCardOpen(card)}
              className='inline-flex py-3.5 w-full items-center justify-center rounded-[12px] border border-primary-100 bg-primary-50/60 text-base leading-5 font-medium text-primary-500 transition-colors hover:bg-primary-50'
            >
              See Details
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ExploreCardsGrid
