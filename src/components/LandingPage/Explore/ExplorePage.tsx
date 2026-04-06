'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

type ExploreCategory =
  | 'all'
  | 'birthdays'
  | 'weddings'
  | 'anniversaries'
  | 'graduations'
  | 'perpetual-donation'

type ExploreCard = {
  id: string
  slug: string
  title: string
  description: string
  image: string
  category: Exclude<ExploreCategory, 'all'>
}

const PAGE_SIZE = 15

const CATEGORY_TABS: Array<{
  id: ExploreCategory
  label: string
  icon: string
}> = [
  { id: 'all', label: 'All Celebration Types', icon: '' },
  { id: 'birthdays', label: 'Birthdays', icon: '🎂' },
  { id: 'weddings', label: 'Weddings', icon: '💍' },
  { id: 'anniversaries', label: 'Anniversaries', icon: '🎉' },
  { id: 'graduations', label: 'Graduations', icon: '🎓' },
  { id: 'perpetual-donation', label: 'Perpetual / Donation', icon: '🔑' },
]

const CARD_SEED: Omit<ExploreCard, 'id' | 'slug'>[] = [
  {
    title: "It's my birthday!",
    description:
      'Happy Birthday to me! Today is all about joy, laughter, and a little bit of spoiling. Join me in making it unforgettable.',
    image: '/assets/images/birthday-celebration.jpg',
    category: 'birthdays',
  },
  {
    title: 'Forever Starts Here',
    description:
      'We are beginning our forever journey and would love your support as we build a beautiful home together.',
    image: '/assets/images/wedding-anniversary.jpg',
    category: 'weddings',
  },
  {
    title: 'Our 10th Anniversary',
    description:
      'A decade of love, lessons, and laughter. Celebrate this milestone with us and leave us a memory we can keep.',
    image: '/assets/images/wedding-anniversary.jpg',
    category: 'anniversaries',
  },
  {
    title: 'Lisa Krishna',
    description:
      'I am a digital artist and you can explore my page to purchase some of my paintings and support my next collection.',
    image: '/assets/images/graduation-celebration.jpg',
    category: 'graduations',
  },
  {
    title: 'Purity Church of God',
    description:
      "We are embarking on a vital mission to rejuvenate the Purity Church of God's community center, a cornerstone of hope.",
    image: '/assets/images/promotion-celebration.jpg',
    category: 'perpetual-donation',
  },
]

const buildExploreCards = (size = 80): ExploreCard[] => {
  return Array.from({ length: size }, (_, index) => {
    const seed = CARD_SEED[index % CARD_SEED.length]
    const id = String(index + 1)
    return {
      ...seed,
      id,
      slug: `sample-page-${id}`,
    }
  })
}

const ALL_CARDS = buildExploreCards()

const normalizeCategoryQuery = (value: string | null): ExploreCategory => {
  const normalized = (value || '').trim().toLowerCase()
  if (normalized === 'birthday' || normalized === 'birthdays') {
    return 'birthdays'
  }
  if (normalized === 'wedding' || normalized === 'weddings') {
    return 'weddings'
  }
  if (normalized === 'anniversary' || normalized === 'anniversaries') {
    return 'anniversaries'
  }
  if (normalized === 'graduation' || normalized === 'graduations') {
    return 'graduations'
  }
  if (
    normalized === 'perpetual-donation' ||
    normalized === 'donation' ||
    normalized === 'donations' ||
    normalized === 'perpetual'
  ) {
    return 'perpetual-donation'
  }
  return 'all'
}

const ExplorePage = () => {
  const searchParams = useSearchParams()
  const initialCategory = normalizeCategoryQuery(searchParams.get('category'))
  const [activeCategory, setActiveCategory] =
    useState<ExploreCategory>(initialCategory)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCards = useMemo(() => {
    if (activeCategory === 'all') return ALL_CARDS
    return ALL_CARDS.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  const totalItems = filteredCards.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)

  const visibleCards = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredCards.slice(start, start + PAGE_SIZE)
  }, [filteredCards, safePage])

  const handleCategoryChange = (category: ExploreCategory) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  return (
    <section className='px-4 py-10 md:px-8 lg:px-20 lg:py-15'>
      <div className='mx-auto w-full max-w-[1600px]'>
        <div className='mx-auto w-full'>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-[40px] font-bold leading-[52px] text-blackish md:text-[60px] md:leading-[68px]'>
              Moments Shared With the World
            </h1>
            <span className='text-[26px]' aria-hidden='true'>
              🌍
            </span>
          </div>

          <p className='mt-2 md:mt-3 max-w-[821px] text-sm leading-6 text-grey-700 md:text-xl md:leading-7 tracking-[2%]'>
            These are gift pages people chose to make public, each one holds a
            story, a feeling, a reason.
            <br />
            You can open any of them to read the message, leave kind words,
            contribute to the gift, or surprise the creator with something
            thoughtful.
          </p>

          <div className='mt-8 overflow-x-auto rounded-[40px] border border-primary-50 bg-grey-50/50 p-2'>
            <div className='flex min-w-max items-center gap-2'>
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.id
                return (
                  <button
                    key={tab.id}
                    type='button'
                    onClick={() => handleCategoryChange(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-[40px] px-4 lg:px-[18px] py-3 lg:py-3.5 text-sm lg:text-lg leading-[130%] lg:leading-[140%] tracking-[0.6%] font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-grey-700 hover:bg-grey-50'
                    }`}
                  >
                    {tab.icon ? (
                      <span aria-hidden='true'>{tab.icon}</span>
                    ) : null}
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className='mt-6 grid grid-cols-1 gap-x-7 gap-y-8 md:grid-cols-2 xl:grid-cols-3'>
            {visibleCards.map((card) => (
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
                    {card.description}
                  </p>
                  <Link
                    href={`/u/${card.slug}`}
                    className='inline-flex py-3.5 w-full items-center justify-center rounded-[12px] border border-primary-100 bg-primary-50/60 text-base leading-5 font-medium text-primary-500 transition-colors hover:bg-primary-50'
                  >
                    See Details
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className='mt-8 flex flex-col items-center justify-center gap-4 pb-4'>
            <p className='text-sm text-grey-700'>
              Showing {visibleCards.length} of {totalItems}
            </p>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage <= 1}
                className='inline-flex h-8 w-8 items-center justify-center rounded-[5px] bg-grey-50 text-primary-400 transition-colors enabled:hover:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-70'
                aria-label='Previous page'
              >
                <ChevronLeft className='h-6 w-6' />
              </button>
              <div className='flex gap-2 items-center'>
                <span className='inline-flex h-8 min-w-8 items-center justify-center rounded-[5px] border border-primary-100 bg-base-bg px-3 text-sm font-semibold text-primary-400'>
                  {safePage}
                </span>

                <span className='w-10 text-center text-sm text-grey-700'>
                  of {totalPages}
                </span>
              </div>

              <button
                type='button'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safePage >= totalPages}
                className='inline-flex h-8 w-8 items-center justify-center rounded-[5px] bg-grey-50 text-primary-400 transition-colors enabled:hover:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-70'
                aria-label='Next page'
              >
                <ChevronRight className='h-6 w-6' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExplorePage
